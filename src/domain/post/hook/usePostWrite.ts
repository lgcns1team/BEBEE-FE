import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import {
  type PostCreateReqDTO,
  type Schedule,
  SERVER_MAPPING,
} from "../../../types/post.type";
import { postApi } from "../../../api/postApi";
import { calculateTotalOccurrences } from "../../../types/common.types";

export const usePostWrite = (
  formData: Partial<PostCreateReqDTO>,
  updateField: (updates: Partial<PostCreateReqDTO>) => void
) => {
  const navigate = useNavigate();

  /* ---------------- 1. 유틸리티 함수 (utils) ---------------- */
  const utils = {
    formatDate: (date: Date) => format(date, "yyyy-MM-dd"),
    formatTime: (date: Date) => format(date, "HH:mm:ss"),
    getDayOfWeekEn: (date: Date) => {
      const dayKr = format(date, "eeee", { locale: ko }).replace(
        "요일",
        ""
      ) as keyof typeof SERVER_MAPPING.DAYS;
      return SERVER_MAPPING.DAYS[dayKr];
    },
    getDateObj: (dateStr?: string) => (dateStr ? new Date(dateStr) : null),
    getTimeObj: (timeStr?: string) =>
      timeStr ? parse(timeStr, "HH:mm:ss", new Date()) : null,
  };

  /* ---------------- 2. TERM 전용 계산 로직 ---------------- */
  // 총 도움 횟수 계산
  const totalCount = useMemo(() => {
    if (
      formData.postType === "TERM" &&
      formData.startDate &&
      formData.endDate &&
      formData.schedules?.length
    ) {
      return calculateTotalOccurrences(
        formData.startDate,
        formData.endDate,
        formData.schedules
      );
    }
    return 1; // DAY 타입은 기본 1회
  }, [
    formData.startDate,
    formData.endDate,
    formData.schedules,
    formData.postType,
  ]);

  // 총액(totalHoney) 자동 업데이트
  useEffect(() => {
    if (formData.unitHoney) {
      const calculatedTotal =
        formData.postType === "TERM"
          ? totalCount * formData.unitHoney
          : formData.unitHoney;

      if (formData.totalHoney !== calculatedTotal) {
        updateField({ totalHoney: calculatedTotal });
      }
    }
  }, [totalCount, formData.unitHoney, formData.postType]);

  /* ---------------- 3. [DAY] 핸들러 ---------------- */
  const handleDayDateChange = (date: Date | null) => {
    if (!date) return;
    updateField({
      date: utils.formatDate(date),
      schedules: [
        {
          ...(formData.schedules?.[0] || {
            startTime: "09:00:00",
            endTime: "10:00:00",
          }),
          dayOfWeek: utils.getDayOfWeekEn(date),
        },
      ],
    });
  };

  const handleDayTimeChange = (
    type: "startTime" | "endTime",
    time: Date | null
  ) => {
    if (!time) return;
    const current = formData.schedules?.[0] || {
      dayOfWeek: formData.date
        ? utils.getDayOfWeekEn(new Date(formData.date))
        : "MONDAY",
      startTime: "09:00:00",
      endTime: "10:00:00",
    };
    updateField({
      schedules: [{ ...current, [type]: utils.formatTime(time) }],
    });
  };

  /* ---------------- 4. [TERM] 핸들러 ---------------- */
  const handleTermRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    updateField({
      startDate: start ? utils.formatDate(start) : undefined,
      endDate: end ? utils.formatDate(end) : undefined,
    });
  };

  const addSchedule = () => {
    const newSchedule: Schedule = {
      dayOfWeek: "MONDAY",
      startTime: "10:00:00",
      endTime: "12:00:00",
    };
    updateField({ schedules: [...(formData.schedules || []), newSchedule] });
  };

  const removeSchedule = (index: number) => {
    updateField({
      schedules: (formData.schedules || []).filter((_, i) => i !== index),
    });
  };

  const updateSchedule = (index: number, updates: Partial<Schedule>) => {
    const currentSchedules = [...(formData.schedules || [])];
    currentSchedules[index] = { ...currentSchedules[index], ...updates };
    updateField({ schedules: currentSchedules });
  };

  /* ---------------- 5. 제출 및 검증 ---------------- */
  const handleSubmit = async () => {
    const {
      title,
      content,
      postType,
      unitHoney,
      region,
      helpCategoryIds,
      schedules,
    } = formData;

    // 필수 항목 검증 (순차적으로 체크하여 명확한 메시지 제공)
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      alert("상세 내용을 입력해주세요.");
      return;
    }
    if (!unitHoney || unitHoney === 0) {
      alert("제공할 꿀을 입력해주세요.");
      return;
    }
    if (!region) {
      alert("만남 장소를 선택해주세요.");
      return;
    }
    if (!helpCategoryIds?.length) {
      alert("도움 유형을 최소 하나 선택해주세요.");
      return;
    }
    if (!schedules?.length) {
      alert("도움 시간을 입력해주세요.");
      return;
    }

    if (postType === "DAY" && !formData.date) {
      alert("도움 날짜를 선택해주세요.");
      return;
    }
    if (postType === "TERM" && (!formData.startDate || !formData.endDate)) {
      alert("도움 기간을 선택해주세요.");
      return;
    }

    try {
      await postApi.createPost(formData as PostCreateReqDTO);
      alert("게시글 작성이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      alert("작성에 실패했습니다.");
    }
  };

  /* ---------------- 6. 최종 반환 (Return) ---------------- */
  return {
    utils,
    totalCount,
    displayValues: {
      date: formData.date ? utils.getDateObj(formData.date) : null,
      startTime: formData.schedules?.[0]?.startTime
        ? utils.getTimeObj(formData.schedules[0].startTime)
        : null,
      endTime: formData.schedules?.[0]?.endTime
        ? utils.getTimeObj(formData.schedules[0].endTime)
        : null,
    },
    handleDayDateChange,
    handleDayTimeChange,
    handleTermRangeChange,
    addSchedule,
    removeSchedule,
    updateSchedule,
    handleSubmit,
  };
};
