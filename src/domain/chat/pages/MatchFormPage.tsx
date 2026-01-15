import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAgreementStore } from "../store/useAgreementStore";
import { postApi } from "../../../api/postApi";
import { chatApi } from "../../../api/chatApi";
import { getCurrentHoney } from "../../../api/walletApi";
import type { PostDetailResponse } from "../../../types/post.type";
import type {
  AgreementRequest,
  DayEngagementTime,
  TermEngagementTime,
} from "../types/match.types";
import {
  DAY_OF_WEEK_MAP,
  convertDayNameToDayOfWeek,
  getDayOfWeekFromDate,
  formatDateToISO,
  formatTimeToISO,
  calculateTotalOccurrences,
} from "../../../types/common.types";

import DayHelpForm from "../components/matchConfirm/DayHelpForm";
import LongHelpForm from "../components/matchConfirm/LongHelpForm";
import InsufficientHoneyModal from "../components/matchConfirm/InsufficientHoneyModal";
import BaseLongButton from "../../../components/BaseLongButton";
import LocationInput from "../../../components/LocationInput";
import GeneralInput from "../../../components/GeneralInput";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import HelpTagDropDown from "../../../components/HelpTagDropDown";

const typeLabelMap = {
  DAY: "하루도움",
  TERM: "지속도움",
} as const;

const MatchFormPage = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();

  // PostDetailResponse를 AgreementRequest로 변환
  const convertPostToAgreementRequest = (
    post: PostDetailResponse,
    postId: string,
    helperId: string,
    chatroomId: string,
    isVolunteer?: boolean
  ): Partial<AgreementRequest> => {
    // 기본 AgreementRequest 구조
    const baseRequest: Partial<AgreementRequest> = {
      postId: postId,
      helperId: helperId,
      type: post.engagementType,
      isVolunteer: isVolunteer ?? false,
      helpCategoryIds: post.helpCategoryIds || [],
      unitHoney: post.unitHoney,
      totalHoney: post.totalHoney,
      region: post.postAddress || "",
      chatroomId: chatroomId,
    };

    // engagementTime은 별도로 관리
    return baseRequest;
  };
  const navigate = useNavigate();
  const { activeRoom, setActiveRoom } = useChatStore();
  const { postAgreement } = useAgreementStore();

  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [agreementRequest, setAgreementRequest] =
    useState<Partial<AgreementRequest> | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false);
  const [currentHoney, setCurrentHoney] = useState<number | null>(null);
  const [isBalanceChecked, setIsBalanceChecked] = useState(false);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false);

  // Date 객체 사용
  const [dayEngagement, setDayEngagement] = useState<{
    date: Date | null;
    startTime: Date | null;
    endTime: Date | null;
  } | null>(null);
  const [termEngagement, setTermEngagement] = useState<{
    periodStart: Date | null;
    periodEnd: Date | null;
    weeks: {
      day: string;
      start: Date | null;
      end: Date | null;
    }[];
  } | null>(null);

  // 채팅방 정보 및 게시글 정보 로드
  useEffect(() => {
    const fetchData = async () => {
      if (!chatroomId) {
        console.error("chatroomId가 없습니다.");
        navigate(-1);
        return;
      }

      setIsLoading(true);
      try {
        // 1. activeRoom이 없거나 chatroomId가 다르면 채팅방 정보 가져오기
        let currentActiveRoom = activeRoom;
        if (!activeRoom || activeRoom.chatroomId !== chatroomId) {
          console.log("채팅방 정보를 가져오는 중...", chatroomId);
          const roomData = await chatApi.openChatRoom(undefined, chatroomId);
          setActiveRoom(roomData);
          currentActiveRoom = roomData;
        }

        // 2. postId가 없으면 에러
        if (!currentActiveRoom?.postId) {
          console.error("postId가 없습니다.");
          alert("게시글 정보를 찾을 수 없습니다.");
          navigate(-1);
          return;
        }

        // 3. 게시글 상세 정보 가져오기
        console.log("게시글 정보를 가져오는 중...", currentActiveRoom.postId);
        const detail = await postApi.getPostDetail(currentActiveRoom.postId);
        setPostDetail(detail);

        const otherId = currentActiveRoom.otherId;
        const helperId = otherId;

        // activeRoom에서 isVolunteer 값을 가져와서 사용
        const isVolunteer = currentActiveRoom.isVolunteer ?? false;
        console.log("📋 [MatchFormPage] activeRoom에서 isVolunteer 가져옴:", {
          isVolunteer,
          activeRoom: currentActiveRoom,
        });

        const request = convertPostToAgreementRequest(
          detail,
          currentActiveRoom.postId,
          helperId,
          chatroomId,
          isVolunteer
        );
        // region을 postDetail.postAddress로 초기화 (LocationInput 초기값 설정)
        if (detail.postAddress) {
          request.region = detail.postAddress;
        }
        setAgreementRequest(request);
        setSelectedTags(detail.helpCategoryIds || []);

        // engagementTime 초기화
        console.log(" engagementTime 초기화:", {
          engagementType: detail.engagementType,
          hasDate: !!detail.date,
          hasStartDate: !!detail.startDate,
          hasEndDate: !!detail.endDate,
          schedulesCount: detail.schedules?.length,
        });

        if (detail.engagementType === "DAY" && detail.date) {
          const schedule = detail.schedules[0];
          const dayEngagementData = {
            date: new Date(detail.date),
            startTime: schedule
              ? new Date(`${detail.date}T${schedule.startTime}`)
              : null,
            endTime: schedule
              ? new Date(`${detail.date}T${schedule.endTime}`)
              : null,
          };
          console.log(
            "[fetchData] DAY 타입 dayEngagement 초기화:",
            dayEngagementData
          );
          setDayEngagement(dayEngagementData);
        } else if (detail.startDate && detail.endDate) {
          const weeks = detail.schedules.map((schedule) => ({
            day: DAY_OF_WEEK_MAP[schedule.dayOfWeek] || "월",
            start: schedule.startTime
              ? new Date(`2000-01-01T${schedule.startTime}`)
              : null,
            end: schedule.endTime
              ? new Date(`2000-01-01T${schedule.endTime}`)
              : null,
          }));
          const termEngagementData = {
            periodStart: new Date(detail.startDate),
            periodEnd: new Date(detail.endDate),
            weeks: weeks,
          };
          console.log(
            "[fetchData] TERM 타입 termEngagement 초기화:",
            termEngagementData
          );
          setTermEngagement(termEngagementData);
        } else {
          console.warn("engagementTime 초기화 실패 - 조건 불일치");
        }
      } catch (error) {
        console.error("정보를 불러오는데 실패했습니다:", error);
        alert("정보를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId, navigate]);

  const updateField = <K extends keyof AgreementRequest>(
    key: K,
    value: AgreementRequest[K]
  ) => {
    setAgreementRequest((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  // 공통 유틸리티 함수 사용
  const formatDate = formatDateToISO;
  const formatTime = formatTimeToISO;

  // TERM 타입일 때 총 도움 횟수 계산 (usePostWrite 패턴과 동일)
  const totalCount = useMemo(() => {
    if (
      agreementRequest?.type === "TERM" &&
      termEngagement?.periodStart &&
      termEngagement?.periodEnd &&
      termEngagement?.weeks?.length
    ) {
      // termEngagement.weeks를 schedules 형식으로 변환
      const schedules = termEngagement.weeks.map((week) => ({
        dayOfWeek: convertDayNameToDayOfWeek(week.day) as
          | "MONDAY"
          | "TUESDAY"
          | "WEDNESDAY"
          | "THURSDAY"
          | "FRIDAY"
          | "SATURDAY"
          | "SUNDAY",
      }));

      return calculateTotalOccurrences(
        formatDateToISO(termEngagement.periodStart),
        formatDateToISO(termEngagement.periodEnd),
        schedules
      );
    }
    return 1; // DAY 타입은 기본 1회
  }, [
    agreementRequest?.type,
    termEngagement?.periodStart,
    termEngagement?.periodEnd,
    termEngagement?.weeks,
  ]);

  // TERM 타입일 때 totalHoney 자동 계산 (usePostWrite 패턴과 동일)
  useEffect(() => {
    if (
      agreementRequest?.type === "TERM" &&
      agreementRequest?.unitHoney &&
      totalCount > 0
    ) {
      const calculatedTotal = totalCount * agreementRequest.unitHoney;
      if (agreementRequest.totalHoney !== calculatedTotal) {
        updateField("totalHoney", calculatedTotal);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, agreementRequest?.unitHoney, agreementRequest?.type]);

  // unitHoney나 totalHoney가 변경되면 잔액 확인 상태 초기화
  useEffect(() => {
    setIsBalanceChecked(false);
    setIsBalanceSufficient(false);
  }, [agreementRequest?.unitHoney, agreementRequest?.totalHoney]);

  // 잔액 확인 핸들러
  const handleCheckBalance = async () => {
    if (!agreementRequest) {
      alert("매칭 정보를 먼저 입력해주세요.");
      return;
    }

    // 나눔인 경우 잔액 확인 불필요
    if (agreementRequest.isVolunteer) {
      alert("나눔은 꿀 차감이 없습니다.");
      return;
    }

    // totalHoney 계산 (DAY 타입은 unitHoney, TERM 타입은 totalHoney 사용)
    const requiredHoney =
      agreementRequest.type === "DAY"
        ? agreementRequest.unitHoney || 0
        : agreementRequest.totalHoney || 0;

    if (requiredHoney <= 0) {
      alert("꿀 정보를 먼저 입력해주세요.");
      return;
    }

    setIsCheckingBalance(true);
    try {
      const response = await getCurrentHoney();
      const honey = response.currentHoney;
      setCurrentHoney(honey);

      if (honey < requiredHoney) {
        setIsBalanceChecked(true);
        setIsBalanceSufficient(false);
        setIsInsufficientModalOpen(true);
      } else {
        setIsBalanceChecked(true);
        setIsBalanceSufficient(true);
        alert(
          `잔액이 충분합니다. (보유: ${honey}꿀, 필요: ${requiredHoney}꿀)`
        );
      }
    } catch (error) {
      console.error("잔액 조회 실패:", error);
      alert("잔액 조회에 실패했습니다.");
      setIsBalanceChecked(false);
      setIsBalanceSufficient(false);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const handleConfirm = async () => {
    console.log("현재 상태:", {
      agreementRequest,
      postDetail: !!postDetail,
      activeRoom: !!activeRoom,

      dayEngagement,
      termEngagement,
      agreementRequestType: agreementRequest?.type,
    });

    // agreementRequest와 postDetail만 필수, activeRoom은 optional
    if (!agreementRequest || !postDetail) {
      console.error("필수 정보 누락:", {
        agreementRequest: !!agreementRequest,
        postDetail: !!postDetail,
        activeRoom: !!activeRoom,
      });
      alert("필수 정보가 누락되었습니다.");
      return;
    }

    // 나눔이 아닌 경우에만 잔액 확인 체크
    if (!agreementRequest.isVolunteer) {
      if (!isBalanceChecked) {
        alert("잔액 확인을 먼저 해주세요.");
        return;
      }

      if (!isBalanceSufficient) {
        alert("꿀이 부족합니다. 충전 후 다시 시도해주세요.");
        return;
      }
    }

    if (isSubmitting) {
      console.warn(" 제출 중입니다.");
      return;
    }

    setIsSubmitting(true);
    console.log("제출 시작");

    try {
      // engagementTime 변환
      let engagementTime: DayEngagementTime | TermEngagementTime;

      console.log("engagementTime 변환 시작:", {
        type: agreementRequest.type,
        hasDayEngagement: !!dayEngagement,
        hasTermEngagement: !!termEngagement,
      });

      if (agreementRequest.type === "DAY" && dayEngagement) {
        console.log(" DAY 타입 처리 시작:", dayEngagement);
        // DAY 타입
        if (
          !dayEngagement.date ||
          !dayEngagement.startTime ||
          !dayEngagement.endTime
        ) {
          alert("날짜와 시간을 모두 입력해주세요.");
          setIsSubmitting(false);
          return;
        }

        // 날짜에서 요일 계산
        const dayOfWeek = getDayOfWeekFromDate(dayEngagement.date);

        engagementTime = {
          date: formatDate(dayEngagement.date),
          schedule: {
            dayOfWeek: dayOfWeek,
            startTime: formatTime(dayEngagement.startTime),
            endTime: formatTime(dayEngagement.endTime),
          },
        };
        console.log("DAY 타입 engagementTime 생성 완료:", engagementTime);
      } else if (agreementRequest.type === "TERM" && termEngagement) {
        // TERM 타입
        if (
          !termEngagement.periodStart ||
          !termEngagement.periodEnd ||
          !termEngagement.weeks ||
          termEngagement.weeks.length === 0
        ) {
          alert("기간과 스케줄을 모두 입력해주세요.");
          setIsSubmitting(false);
          return;
        }

        engagementTime = {
          startDate: formatDate(termEngagement.periodStart),
          endDate: formatDate(termEngagement.periodEnd),
          schedules: termEngagement.weeks.map((week) => ({
            dayOfWeek: convertDayNameToDayOfWeek(week.day) as
              | "MONDAY"
              | "TUESDAY"
              | "WEDNESDAY"
              | "THURSDAY"
              | "FRIDAY"
              | "SATURDAY"
              | "SUNDAY",
            startTime: formatTime(week.start),
            endTime: formatTime(week.end),
          })),
        };
        console.log("TERM 타입 engagementTime 생성 완료:", engagementTime);
      } else {
        console.error("engagementTime 정보 없음:", {
          type: agreementRequest.type,
          hasDayEngagement: !!dayEngagement,
          hasTermEngagement: !!termEngagement,
        });
        alert("engagementTime 정보가 없습니다.");
        setIsSubmitting(false);
        return;
      }
      // helperId와 postId 결정
      // activeRoom이 있으면 그것을 우선 사용, 없으면 agreementRequest의 값 사용
      let helperId: string;
      let disabledId: string; // 메타데이터/메시지 생성용
      let postId: string;

      if (activeRoom) {
        //이거 나중에 바꿔야 됨
        const myId = activeRoom.myId;
        const otherId = activeRoom.otherId;
        helperId = agreementRequest.helperId ?? otherId;
        disabledId = myId;
        postId = agreementRequest.postId;
      } else {
        // activeRoom이 없으면 agreementRequest의 값 사용
        if (!agreementRequest.helperId || !agreementRequest.postId) {
          console.error(" 필수 필드 누락:", {
            helperId: agreementRequest.helperId,
            postId: agreementRequest.postId,
          });
          alert("필수 정보가 누락되었습니다. (helperId, postId)");
          setIsSubmitting(false);
          return;
        }
        helperId = agreementRequest.helperId;
        // activeRoom이 없으면 disabledId를 직접 설정할 수 없으므로 에러
        console.error("activeRoom이 없어 disabledId를 결정할 수 없습니다.");
        alert("채팅방 정보가 없습니다.");
        setIsSubmitting(false);
        return;
      }

      console.log(" helperId/disabledId 결정:", {
        helperId,
        disabledId,
        postId,
        note: activeRoom ? "activeRoom 기반" : "agreementRequest 기반",
      });

      // AgreementRequest 완성 (서버 API 스펙에 맞춤)
      // agreementRequest의 모든 필드를 포함하고, 누락된 필드만 보완
      const finalRequest: AgreementRequest = {
        // agreementRequest에서 가져온 값들 (이미 사용자가 수정한 값 포함)
        ...agreementRequest,
        // 필수 필드 보완 (agreementRequest에 없거나 덮어써야 하는 경우)
        postId: postId,
        helperId: helperId,
        type: agreementRequest.type || postDetail.engagementType,
        isVolunteer: agreementRequest.isVolunteer ?? false,
        // 사용자가 수정한 값 우선, 없으면 기본값 사용
        helpCategoryIds:
          selectedTags.length > 0
            ? selectedTags
            : agreementRequest.helpCategoryIds ?? postDetail.helpCategoryIds,
        unitHoney: agreementRequest.unitHoney ?? postDetail.unitHoney,
        totalHoney:
          agreementRequest.totalHoney ??
          (agreementRequest.type === "DAY"
            ? agreementRequest.unitHoney ?? postDetail.unitHoney
            : (agreementRequest.unitHoney ?? postDetail.unitHoney) *
              totalCount),
        region: agreementRequest.region || postDetail.postAddress || "",
        // engagementTime은 항상 새로 생성 (dayEngagement/termEngagement에서 변환)
        engagementTime: engagementTime,
        chatroomId: chatroomId,
        createdAt: new Date().toISOString(),
      };

      // useAgreementStore의 postAgreement를 사용하여 agreementRequest를 저장
      const response = await postAgreement(finalRequest);
      console.log("매칭 확인서 생성 성공:", response);

      // 서버에서 매칭확인서를 소켓으로 발행하므로 프론트에서는 받기만 하면 됨
      // POST API 호출 성공 후 채팅방 정보만 업데이트하고 이동
      if (chatroomId) {
        // 채팅방 정보 업데이트 (matchStatus가 PROCEEDING으로 변경될 수 있음)
        try {
          const updatedRoom = await chatApi.openChatRoom(undefined, chatroomId);
          setActiveRoom(updatedRoom);
          console.log("채팅방 정보 업데이트 완료:", updatedRoom);
        } catch (error) {
          console.error("채팅방 정보 업데이트 실패:", error);
          // 업데이트 실패해도 채팅방으로 이동은 진행
        }

        // 채팅방으로 이동
        // 서버에서 소켓으로 매칭확인서 메시지가 발행되므로 채팅방에서 자동으로 수신됨
        navigate(`/chat/${chatroomId}`);
      } else {
        console.error(" chatroomId가 없습니다.");
        alert("채팅방 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("[매칭확인서 생성] 오류:", error);

      // Axios 에러인 경우 서버 응답 상세 정보 출력
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            statusText?: string;
            data?: unknown;
          };
          message?: string;
          config?: unknown;
        };

        console.error(" [매칭확인서 생성] 서버 응답 오류:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });

        // 서버에서 보낸 에러 데이터 상세 출력
        const errorData = axiosError.response?.data as
          | { message?: string; code?: string; [key: string]: unknown }
          | undefined;

        console.error(" [매칭확인서 생성] 서버 에러 메시지:", errorData);

        // 서버에서 보낸 에러 메시지가 있으면 표시
        const errorMessage =
          errorData?.message ||
          axiosError.message ||
          `매칭 확인서 생성에 실패했습니다. (${
            axiosError.response?.status || "알 수 없는 오류"
          })`;
        alert(errorMessage);
      } else {
        console.error("[매칭확인서 생성] 알 수 없는 오류 타입:", error);
        alert("매칭 확인서 생성에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !agreementRequest) {
    return (
      <Layout>
        <Header title="매칭 확인서" onBack={() => navigate(-1)} showBack />
        <div
          style={{ padding: "20px", textAlign: "center" }}
          role="status"
          aria-live="polite"
        >
          게시글 정보를 불러오는 중...
          <span className="sr-only">게시글 정보를 불러오는 중입니다</span>
        </div>
      </Layout>
    );
  }

  return (
    <MatchLayout>
      <div role="main" aria-label="매칭 확인서 작성">
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          매칭 확인서 작성 페이지입니다.
        </span>
        <Header title="매칭 확인서" onBack={() => navigate(-1)} showBack />
        {/* === 공통 필드 === */}
        <div role="form" aria-label="매칭 확인서 작성 폼">
          {/* 기본 정보 그룹 */}
          <div role="group" aria-label="기본 정보">
            <GeneralInput
              value={
                agreementRequest.type ? typeLabelMap[agreementRequest.type] : ""
              }
              disabled
              aria-label={`도움 유형: ${
                agreementRequest.type
                  ? typeLabelMap[agreementRequest.type]
                  : "없음"
              }`}
            />

            <GeneralInput
              inputLabel="제목"
              value={postDetail?.title || ""}
              disabled
              required
              aria-label={`게시글 제목: ${postDetail?.title || "없음"}`}
            />
            <HelpTagDropDown
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </div>

          {/* === 하루도움 필드 === */}
          {agreementRequest.type === "DAY" && dayEngagement ? (
            <div role="group" aria-label="하루도움 일정 정보">
              <DayHelpForm
                dayEngagement={dayEngagement}
                setDayEngagement={setDayEngagement}
                agreementRequest={agreementRequest}
                updateField={updateField}
              />
            </div>
          ) : agreementRequest.type === "TERM" && termEngagement ? (
            <div role="group" aria-label="지속도움 일정 정보">
              <LongHelpForm
                termEngagement={termEngagement}
                setTermEngagement={setTermEngagement}
                agreementRequest={agreementRequest}
                updateField={updateField}
              />
            </div>
          ) : null}

          {/* 꿀 정보 그룹 */}
          <div role="group" aria-label="꿀 제공 정보">
            <HoneyInputWrapper>
              <InputContainer>
                <GeneralInput
                  inputLabel="1회 제공 꿀"
                  value={
                    agreementRequest.isVolunteer
                      ? "나눔"
                      : (agreementRequest.unitHoney || 0).toString()
                  }
                  onChange={(e) => {
                    if (agreementRequest.isVolunteer) return;
                    const value = parseInt(e.target.value) || 0;
                    updateField("unitHoney", value);
                  }}
                  disabled={agreementRequest.isVolunteer ?? false}
                  required
                />
              </InputContainer>
              <BalanceCheckButton
                onClick={handleCheckBalance}
                disabled={
                  isCheckingBalance || (agreementRequest.isVolunteer ?? false)
                }
                $isSufficient={isBalanceSufficient}
                aria-label={
                  isCheckingBalance
                    ? "잔액 확인 중"
                    : agreementRequest.isVolunteer
                    ? "나눔은 잔액 확인이 필요 없습니다"
                    : `잔액 확인하기, ${
                        isBalanceChecked && isBalanceSufficient
                          ? "잔액이 충분합니다"
                          : ""
                      }`
                }
                tabIndex={0}
              >
                <span aria-hidden="true">
                  {isCheckingBalance ? "확인 중..." : "잔액확인"}
                </span>
                <span className="sr-only">
                  {isCheckingBalance
                    ? "잔액을 확인하는 중입니다"
                    : agreementRequest.isVolunteer
                    ? "나눔은 꿀이 차감되지 않으므로 잔액 확인이 필요 없습니다"
                    : `보유한 꿀 잔액을 확인합니다. ${
                        isBalanceChecked && isBalanceSufficient
                          ? "잔액이 충분합니다."
                          : ""
                      } Enter 키 또는 Space 키를 누르면 실행됩니다.`}
                </span>
              </BalanceCheckButton>
            </HoneyInputWrapper>
            {agreementRequest.type === "TERM" &&
            termEngagement &&
            agreementRequest.unitHoney &&
            agreementRequest.totalHoney &&
            !agreementRequest.isVolunteer ? (
              <TotlaHoney role="status" aria-live="polite" aria-atomic="true">
                <span aria-hidden="true">
                  <span style={{ color: "#155DFC" }}>총 제공 꿀: </span>총{" "}
                  <span style={{ color: "#155DFC" }}>
                    {agreementRequest.totalHoney.toLocaleString()} 꿀
                  </span>
                  이 도우미에게 제공될 예정이에요
                </span>
                <span className="sr-only">
                  총 {agreementRequest.totalHoney.toLocaleString()}꿀이
                  도우미에게 제공될 예정이에요
                </span>
              </TotlaHoney>
            ) : null}
          </div>

          {/* 만남 장소 그룹 */}
          <div role="group" aria-label="만남 장소 정보">
            <LocationInputWrapper>
              <LocationInput
                inputLabel="만남 장소"
                infoText="행정동 단위까지만 공개되니 안심하세요."
                value={agreementRequest.region || postDetail?.postAddress || ""}
                onSelect={(loc) => {
                  updateField("region", loc.address);
                }}
                required
              />
            </LocationInputWrapper>
          </div>

          {/* 제출 버튼 */}
          <BaseLongButton
            label={isSubmitting ? "생성 중..." : "확인"}
            onClick={handleConfirm}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {isInsufficientModalOpen && currentHoney !== null && (
        <InsufficientHoneyModal
          isOpen={isInsufficientModalOpen}
          currentHoney={currentHoney}
          requiredHoney={
            agreementRequest?.type === "DAY"
              ? agreementRequest.unitHoney || 0
              : agreementRequest?.totalHoney || 0
          }
          onClose={() => setIsInsufficientModalOpen(false)}
        />
      )}
    </MatchLayout>
  );
};

export default MatchFormPage;
const MatchLayout = styled.div`
  width: 100%;
  max-width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  max-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const TotlaHoney = styled.div`
  width: 100%;
  border: 0.5px solid ${({ theme }) => theme.color.blue500};
  background-color: ${({ theme }) => theme.color.blue50};
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin-top: 12px;
`;

const LocationInputWrapper = styled.div`
  position: relative;
  margin-bottom: 220px;
  z-index: 1;
`;

const HoneyInputWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: flex-end;
`;

const InputContainer = styled.div`
  flex: 1;
  min-width: 0; /* flex item이 overflow 방지 */
`;

const BalanceCheckButton = styled.button<{ $isSufficient?: boolean }>`
  padding: 1rem;
  background: ${({ theme, $isSufficient }) =>
    $isSufficient ? theme.color.subColor2 : theme.color.natural100};
  border: 1px solid
    ${({ theme, $isSufficient }) =>
      $isSufficient ? theme.color.subColor2 : theme.color.natural200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme, $isSufficient }) =>
    $isSufficient ? theme.color.main : theme.color.text};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, border-color 0.2s;
  height: 51.5px;
  font-weight: ${({ $isSufficient }) => ($isSufficient ? "600" : "400")};

  &:active:not(:disabled) {
    background: ${({ theme, $isSufficient }) =>
      $isSufficient ? theme.color.subColor2 : theme.color.natural200};
    border-color: ${({ theme, $isSufficient }) =>
      $isSufficient ? theme.color.subColor2 : theme.color.natural200};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
