import type {
  DisabledProfile,
  HelperProfile,
} from "../../store/useProfileStore";

import { postMockData } from "../../mock/post/post.mock";
import BeeImage from "../../assets/images/bee-santa.png";

/* ---------------- 장애인 프로필 ---------------- */

export const disabledProfileMockData: DisabledProfile[] = [
  {
    memberId: 1,
    name: "박위",
    profileImageUrl: BeeImage,
    gender: "남성",
    age: "비공개",
    addressRoad: "서울시 강남구 역삼동",
    helpType: ["이동지원", "의료동행"],
    introduction:
      "안녕하세요 도움 받으면서 친구도 될 수 있었으면 좋겠네요! 잘 부탁드립니다",
    disabilityType: "지체장애",
    description:
      "하반신 마비 후 얼마 지나지 않아 휠체어 사용이 아직 익숙하지 않습니다. 이동하거나 옷을 입는 등 생활 전반에서 불편함이 있어, 같은 남성분이면서 휠체어 보조 경험이 있는 분이면 좋을 것 같아요.",
    helpRequestPost: postMockData,
    receivedReviews: [
      "시간 약속을 잘 지켜요 +2",
      "응답이 빨라요 +10",
      "친절하고 매너를 잘 지켜요 +1",
      "장애인에 대한 이해도가 높아요 +5",
    ],
  },
  {
    memberId: 2,
    name: "김길동",
    profileImageUrl: BeeImage,
    gender: "남성",
    age: "비공개",
    addressRoad: "서울시 강남구 역삼동",
    helpType: ["이동지원", "의료동행"],
    introduction:
      "안녕하세요 도움 받으면서 친구도 될 수 있었으면 좋겠네요! 잘 부탁드립니다",
    disabilityType: "지체장애",
    description:
      "하반신 마비 후 얼마 지나지 않아 휠체어 사용이 아직 익숙하지 않습니다. 이동하거나 옷을 입는 등 생활 전반에서 불편함이 있어, 같은 남성분이면서 휠체어 보조 경험이 있는 분이면 좋을 것 같아요.",
    helpRequestPost: postMockData,
    receivedReviews: [
      "시간 약속을 잘 지켜요 +2",
      "응답이 빨라요 +10",
      "친절하고 매너를 잘 지켜요 +1",
      "장애인에 대한 이해도가 높아요 +5",
    ],
  },
];

/* ---------------- 도우미 프로필 ---------------- */

export const helperProfileMockData: HelperProfile[] = [
  {
    memberId: 1,
    name: "홍길동",
    nickname: "친절한 꿀벌",
    profileImageUrl: BeeImage,
    gender: "남성",
    age: "비공개",
    addressRoad: "서울시 강남구 역삼동",
    helpType: ["이동지원", "방문목욕"],
    introduction: "장애인 분들에게 도움이 되고 싶어요!",
    receivedReviews: [
      "시간 약속을 잘 지켜요 +2",
      "응답이 빨라요 +10",
      "친절하고 매너를 잘 지켜요 +1",
      "장애인에 대한 이해도가 높아요 +5",
    ],
  },
  {
    memberId: 2,
    name: "박명수",
    nickname: "든든한 꿀벌",
    gender: "남성",
    age: "비공개",
    addressRoad: "서울시 마포구",
    helpType: ["이동지원"],
    introduction: "책임감 있게 돕겠습니다.",
  },
  {
    memberId: 3,
    name: "유재석",
    nickname: "믿음직한 꿀벌",
    gender: "남성",
    age: "비공개",
    addressRoad: "서울시 강서구",
    helpType: ["의료동행", "생활지원"],
    introduction: "항상 밝고 성실하게 활동합니다.",
  },
];
