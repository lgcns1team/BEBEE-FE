import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { postApi } from "../../../api/postApi";
import { createAgreement } from "../api/agreementApi";
import { chatApi } from "../../../api/chatApi";
import { getCurrentHoney } from "../../../api/walletApi";
import type { PostDetailResponse } from "../../../types/post.type";
import type {
  AgreementRequest,
  DayEngagementTime,
  TermEngagementTime,
} from "../agreement.types";
import type { ChatMessage } from "../chat.types";
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
    chatroomId: string
  ): Partial<AgreementRequest> => {
    // 기본 AgreementRequest 구조
    const baseRequest: Partial<AgreementRequest> = {
      postId: postId,
      helperId: helperId,
      type: post.engagementType,
      isVolunteer: false,
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

        const request = convertPostToAgreementRequest(
          detail,
          currentActiveRoom.postId,
          helperId,
          chatroomId
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

    // 잔액 확인 체크
    if (!isBalanceChecked) {
      alert("잔액 확인을 먼저 해주세요.");
      return;
    }

    if (!isBalanceSufficient) {
      alert("꿀이 부족합니다. 충전 후 다시 시도해주세요.");
      return;
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
      };

      const response = await createAgreement(finalRequest);
      console.log("매칭 확인서 생성 성공:", response);

      // 매칭 확인서 생성 성공 시 MATCH_CONFIRMATION 타입 메시지 생성 및 추가
      if (chatroomId) {
        // engagementTime에서 스케줄 정보 추출
        const isDayType = finalRequest.type === "DAY";
        const dayEngagement = isDayType
          ? (finalRequest.engagementTime as DayEngagementTime)
          : null;
        const termEngagement = !isDayType
          ? (finalRequest.engagementTime as TermEngagementTime)
          : null;

        // 스케줄 정보 변환
        const scheduleDays: string[] = [];
        const scheduleStartTimes: string[] = [];
        const scheduleEndTimes: string[] = [];

        if (isDayType && dayEngagement?.schedule) {
          scheduleDays.push(dayEngagement.schedule.dayOfWeek);
          scheduleStartTimes.push(dayEngagement.schedule.startTime);
          scheduleEndTimes.push(dayEngagement.schedule.endTime);
        } else if (termEngagement?.schedules) {
          termEngagement.schedules.forEach((schedule) => {
            scheduleDays.push(schedule.dayOfWeek);
            scheduleStartTimes.push(schedule.startTime);
            scheduleEndTimes.push(schedule.endTime);
          });
        }

        // MATCH_CONFIRMATION 타입 메시지 생성
        const matchConfirmationMessage: ChatMessage = {
          id: `match-${response.agreementId}-${Date.now()}`,
          senderId: activeRoom?.myId || String(disabledId),
          textContent: "매칭 확인서가 생성되었습니다.",
          type: "MATCH_CONFIRMATION",
          attachments: [],
          agreementId: String(response.agreementId),
          matchType: finalRequest.type,
          startDate: isDayType
            ? dayEngagement?.date
            : termEngagement?.startDate,
          endDate: isDayType ? undefined : termEngagement?.endDate,
          scheduleDays: scheduleDays.length > 0 ? scheduleDays : undefined,
          scheduleStartTimes:
            scheduleStartTimes.length > 0 ? scheduleStartTimes : undefined,
          scheduleEndTimes:
            scheduleEndTimes.length > 0 ? scheduleEndTimes : undefined,
          location: finalRequest.region,
          unitPoints: finalRequest.unitHoney,
          totalPoints: finalRequest.totalHoney,
          matchStatus: "MATCHED",
          createdAt: new Date().toISOString(),
          postId: String(finalRequest.postId),
          title:
            postDetail?.title || activeRoom?.otherNickname || "매칭 확인서",
          helperId: String(finalRequest.helperId),
          disabledId: String(disabledId),
        };

        // 매칭 확인서 메타데이터를 store에 저장
        const {
          setAgreementMetadata,
          fetchHistory,
          getHistoryMessages,
          addMessage: addMessageToStore,
        } = useChatStore.getState();

        // 메타데이터 저장 (서버 메시지와 병합 시 사용)
        setAgreementMetadata(String(response.agreementId), {
          agreementId: String(response.agreementId),
          postId: String(finalRequest.postId),
          title:
            postDetail?.title || activeRoom?.otherNickname || "매칭 확인서",
          helperId: String(finalRequest.helperId),
          disabledId: String(disabledId),
          chatroomId: chatroomId,
        });

        // 서버에서 최신 메시지 가져와서 중복 확인
        try {
          await fetchHistory(chatroomId, null);
          console.log(" 동기화 완료");

          // 서버 메시지 확인 후, 서버에 없는 경우에만 클라이언트 메시지 추가
          const serverMessages = getHistoryMessages(chatroomId);
          const serverHasMatchMessage = serverMessages.some(
            (msg) =>
              msg.type === "MATCH_CONFIRMATION" &&
              msg.agreementId === String(response.agreementId)
          );

          if (!serverHasMatchMessage) {
            console.log("📨 [MatchFormPage] STOMP로 매칭확인서 전송 시작:", {
              matchConfirmationMessage,
              agreementId: response.agreementId,
            });

            // STOMP로 매칭확인서 전송
            const receiverId = activeRoom?.otherId
              ? Number(activeRoom.otherId)
              : null;

            if (receiverId && chatroomId) {
              console.log("📨 [MatchFormPage] Socket 전송 호출:", {
                receiverId,
                chatroomId,
                matchConfirmationData: {
                  location: matchConfirmationMessage.location || "",
                  unitPoints: matchConfirmationMessage.unitPoints || 0,
                  totalPoints: matchConfirmationMessage.totalPoints || 0,
                  startDate: matchConfirmationMessage.startDate,
                  endDate: matchConfirmationMessage.endDate,
                  scheduleDays: matchConfirmationMessage.scheduleDays,
                  scheduleStartTimes:
                    matchConfirmationMessage.scheduleStartTimes,
                  scheduleEndTimes: matchConfirmationMessage.scheduleEndTimes,
                },
              });

              useSocketStore
                .getState()
                .sendMatchConfirmation(receiverId, chatroomId, {
                  location: matchConfirmationMessage.location || "",
                  unitPoints: matchConfirmationMessage.unitPoints || 0,
                  totalPoints: matchConfirmationMessage.totalPoints || 0,
                  startDate: matchConfirmationMessage.startDate,
                  endDate: matchConfirmationMessage.endDate,
                  scheduleDays: matchConfirmationMessage.scheduleDays,
                  scheduleStartTimes:
                    matchConfirmationMessage.scheduleStartTimes,
                  scheduleEndTimes: matchConfirmationMessage.scheduleEndTimes,
                });
            } else {
              console.warn(
                "⚠️ [MatchFormPage] receiverId 또는 chatroomId가 없어 STOMP 전송 실패",
                { receiverId, chatroomId, activeRoom }
              );
            }

            addMessageToStore(matchConfirmationMessage, chatroomId);
          } else {
            console.log(
              " 서버에 이미 매칭 확인서 메시지 존재, 클라이언트 메시지 추가 스킵"
            );
            // 서버 메시지가 있더라도 메타데이터는 이미 저장되었으므로 유지됨
          }
        } catch (error) {
          console.error(" 서버 메시지 동기화 실패:", error);
          // 실패해도 클라이언트 메시지 추가
          console.log(matchConfirmationMessage);
          addMessageToStore(matchConfirmationMessage, chatroomId);
        }

        // 채팅방 정보 업데이트
        try {
          const updatedRoom = await chatApi.openChatRoom(undefined, chatroomId);
          setActiveRoom(updatedRoom);
          console.log("채팅방 정보 업데이트 완료:", updatedRoom);
        } catch (error) {
          console.error(" 채팅방 정보 업데이트 실패:", error);
        }

        // 채팅방으로 이동
        navigate(`/chat/${chatroomId}`);
      } else {
        // activeRoom이 없으면 바로 이동
        navigate(`/chat/${chatroomId}`);
      }
    } catch (error) {
      console.error(" 매칭 확인서 생성 실패:", error);

      // Axios 에러인 경우 상세 정보 출력
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
          message?: string;
          config?: unknown;
        };
        console.error(" 에러 상세:", {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          request: axiosError.config,
        });

        // 서버에서 보낸 에러 메시지가 있으면 표시
        const errorData = axiosError.response?.data as
          | { message?: string }
          | undefined;
        const errorMessage =
          errorData?.message ||
          axiosError.message ||
          "매칭 확인서 생성에 실패했습니다.";
        alert(errorMessage);
      } else {
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
    <Layout>
      <div role="main" aria-label="매칭 확인서 작성">
        <Header title="매칭 확인서" onBack={() => navigate(-1)} showBack />
        {/* === 공통 필드 === */}
        <div role="form" aria-label="매칭 확인서 작성 폼">
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

          {/* === 하루도움 필드 === */}
          {agreementRequest.type === "DAY" && dayEngagement ? (
            <DayHelpForm
              dayEngagement={dayEngagement}
              setDayEngagement={setDayEngagement}
              agreementRequest={agreementRequest}
              updateField={updateField}
            />
          ) : agreementRequest.type === "TERM" && termEngagement ? (
            <LongHelpForm
              termEngagement={termEngagement}
              setTermEngagement={setTermEngagement}
              agreementRequest={agreementRequest}
              updateField={updateField}
            />
          ) : null}

          <HoneyInputWrapper>
            <InputContainer>
              <GeneralInput
                inputLabel="1회 제공 꿀"
                value={(agreementRequest.unitHoney || 0).toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  updateField("unitHoney", value);
                }}
                required
              />
            </InputContainer>
            <BalanceCheckButton
              onClick={handleCheckBalance}
              disabled={isCheckingBalance}
              $isSufficient={isBalanceSufficient}
            >
              {isCheckingBalance ? "확인 중..." : "잔액확인"}
            </BalanceCheckButton>
          </HoneyInputWrapper>
          {agreementRequest.type === "TERM" &&
          termEngagement &&
          agreementRequest.unitHoney &&
          agreementRequest.totalHoney ? (
            <TotlaHoney role="status" aria-live="polite">
              <span style={{ color: "#155DFC" }}> 총 제공 꿀: </span>
              <span>
                총{" "}
                <span style={{ color: "#155DFC" }}>
                  {agreementRequest.totalHoney.toLocaleString()} 꿀
                </span>
                이 도우미에게 제공될 예정이에요
              </span>
              <span className="sr-only">
                총 {agreementRequest.totalHoney.toLocaleString()}꿀이 도우미에게
                제공될 예정이에요
              </span>
            </TotlaHoney>
          ) : null}
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

          <BaseLongButton
            label={isSubmitting ? "생성 중..." : "확인"}
            onClick={handleConfirm}
            disabled={isSubmitting}
            aria-label={
              isSubmitting
                ? "매칭 확인서 생성 중"
                : "매칭 확인서 작성 완료 및 전송"
            }
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
    </Layout>
  );
};

export default MatchFormPage;

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
  margin-bottom: 220px; /* 검색 리스트가 표시될 공간 확보 (max-height: 200px + 여유 공간) */
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
  background-color: ${({ theme, $isSufficient }) =>
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
  height: 51.5px; /* GeneralInput과 동일한 높이 */
  font-weight: ${({ $isSufficient }) => ($isSufficient ? "600" : "400")};

  &:active:not(:disabled) {
    background: ${({ theme, $isSufficient }) =>
      $isSufficient ? "#ffb300" : theme.color.natural200};
    border-color: ${({ $isSufficient }) =>
      $isSufficient ? "#ffb300" : undefined};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
