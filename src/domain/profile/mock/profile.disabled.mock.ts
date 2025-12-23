import type { Profile } from "../../../store/useDisabledProfileStore";
import { postMockData } from "../../post/mock/post.mock";
import ProfileImage from "../../../assets/images/bee-santa.png";
export const profileDisabledMockData: Profile = {
  name: "박위",
  nickname: "@활발한 꽃잎",
  image: ProfileImage,
  sweetness: 40.5,
  gender: "남성",
  age: "비공개",
  address: "서울시 강남구 역삼동",
  mainHelps: ["이동지원", "의료동행"],
  intro:
    "안녕하세요 도움 받으면서 친구도 될 수 있었으면 좋겠네요! 잘 부탁드립니다",
  difficultyTag: "지체장애",
  difficultyDesc:
    "하반신 마비 후 얼마 지나지 않아 휠체어 사용이 아직 익숙하지 않습니다. 이동하거나 옷을 입는 등 생활 전반에서 불편함이 있어, 같은 남성분이면서 휠체어 보조 경험이 있는 분이면 좋을 것 같아요.",
  helpPosts: [...postMockData],
};
