import type { Agreement } from "../match.types";

export const agreementMockData: Agreement[] = [
  {
    agreementId: 1,
    postId: 1,
    helperId: 1,
    disabledId: 1,

    help: {
      agreementId: 1,
      postId: 1,
      type: "하루 도움",
      totalHoney: 120,
      region: "서울시 강남구 역삼동",
      engagementDate: new Date("2025-11-30"),
      time: {
        startTime: new Date("2025-11-30T11:00:00"),
        endTime: new Date("2025-11-30T15:00:00"),
      },
      engagementStatus: "COMPLETED",
    },
  },
  {
    agreementId: 2,
    postId: 2,
    helperId: 101,
    disabledId: 201,
    help: {
      agreementId: 2,
      postId: 2,
      type: "지속 도움",
      totalHoney: 300,
      region: "서울시 마포구 서교동",
      engagementStatus: "DISCOMPLETED",
      startDate: new Date("2025-03-11"),
      endDate: new Date("2025-11-11"),

      dayOfWeek: [
        {
          dayOfWeek: "MON",
          startTime: "11:00",
          endTime: "15:00",
        },
        {
          dayOfWeek: "WED",
          startTime: "13:00",
          endTime: "15:00",
        },
      ],
    },
  },
];
