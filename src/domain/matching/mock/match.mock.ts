import type { Engagement } from "../../../types/match.type";

export const engagementMockData: Engagement[] = [
  /* ======================
     하루 도움 (DAY)
  ====================== */
  {
    myRole: "DISABLED",
    agreementId: "1",
    postId: "1",
    title: "병원 동행 도우미 구해요",
    thumbnailImageUrl: undefined,

    helper: {
      memberId: "101",
      nickname: "친절한도우미",
      profileImageUrl: "",
      gender: "MALE",
      ageGroup: 30,
    },

    disabled: {
      memberId: "201",
      nickname: "김장애",
      profileImageUrl: "",
      gender: "FEMALE",
      ageGroup: 60,
    },

    confirmationDate: "2025-11-20",
    type: "DAY",

    helpCategories: [
      {
        helpCategoryId: 1,
        helpCategoryName: "외출동행",
      },
    ],

    isVolunteer: false,
    unitHoney: 120,
    totalHoney: 120,

    region: "서울시 강남구 역삼동",

    engagementTime: {
      date: "2025-11-30",
      schedule: {
        dayOfWeek: "SATURDAY",
        startTime: "11:00:00",
        endTime: "15:00:00",
      },
    },

    isDayComplete: true,
    isTermComplete: false,

    chatRoomId: "303",
  },

  /* ======================
     지속 도움 (TERM)
  ====================== */
  {
    myRole: "HELPER",
    agreementId: "2",
    postId: "2",
    title: "정기 가사 도움 요청",
    thumbnailImageUrl: undefined,

    helper: {
      memberId: "101",
      nickname: "베테랑도우미",
      profileImageUrl: "",
      gender: "FEMALE",
      ageGroup: 40,
    },

    disabled: {
      memberId: "201",
      nickname: "박장애",
      profileImageUrl: "",
      gender: "MALE",
      ageGroup: 70,
    },

    confirmationDate: "2025-03-01",
    type: "TERM",

    helpCategories: [
      {
        helpCategoryId: 7,
        helpCategoryName: "가사지원",
      },
    ],

    isVolunteer: false,
    unitHoney: 100,
    totalHoney: 300,

    region: "서울시 마포구 서교동",

    engagementTime: {
      startDate: "2025-03-11",
      endDate: "2025-11-11",
      schedules: [
        {
          dayOfWeek: "MONDAY",
          startTime: "11:00:00",
          endTime: "15:00:00",
        },
        {
          dayOfWeek: "WEDNESDAY",
          startTime: "13:00:00",
          endTime: "15:00:00",
        },
      ],
    },

    isDayComplete: false,
    isTermComplete: false,

    chatRoomId: "305",
  },
];
