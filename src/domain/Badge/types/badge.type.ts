export type BadgeLevel = "LEVEL_1" | "LEVEL_2" | null;

// 뱃지 상태 아이템 (서버 응답)
export interface BadgeStatusItem {
  disabilityCategoryIds: number[];
  badge_code: BadgeLevel;
  count: number;
}

// 뱃지 API 응답 타입
export interface BadgeResponse {
  badge_status: BadgeStatusItem[];
}

import badge1 from "../../../assets/images/badge/badge1-level1.png";
import badge2 from "../../../assets/images/badge/badge2-level1.png";
import badge3 from "../../../assets/images/badge/badge3-level1.png";
import badge4 from "../../../assets/images/badge/badge4-level1.png";
import badge5 from "../../../assets/images/badge/badge5-level1.png";
import bage1Disabled from "../../../assets/images/badge/badge1-disable.png";
import bage2Disabled from "../../../assets/images/badge/badge2-disable.png";
import bage3Disabled from "../../../assets/images/badge/badge3-disable.png";
import bage4Disabled from "../../../assets/images/badge/badge4-disable.png";
import bage5Disabled from "../../../assets/images/badge/badge5-disable.png";
import badge1Level2 from "../../../assets/images/badge/badge1-level2.png";
import badge2Level2 from "../../../assets/images/badge/badge2-level2.png";
import badge3Level2 from "../../../assets/images/badge/badge3-level2.png";
import badge4Level2 from "../../../assets/images/badge/badge4-level2.png";
import badge5Level2 from "../../../assets/images/badge/badge5-level2.png";

export const BADGE_RESOURCE_MAP: Record<
  number,
  Record<NonNullable<BadgeLevel> | "DEFAULT", string>
> = {
  1: {
    LEVEL_1: badge1,
    LEVEL_2: badge1Level2,
    DEFAULT: bage1Disabled,
  },
  2: {
    LEVEL_1: badge2,
    LEVEL_2: badge2Level2,
    DEFAULT: bage2Disabled,
  },
  3: {
    LEVEL_1: badge3,
    LEVEL_2: badge3Level2,
    DEFAULT: bage3Disabled,
  },
  4: {
    LEVEL_1: badge4,
    LEVEL_2: badge4Level2,
    DEFAULT: bage4Disabled,
  },
  5: {
    LEVEL_1: badge5,
    LEVEL_2: badge5Level2,
    DEFAULT: bage5Disabled,
  },
};
