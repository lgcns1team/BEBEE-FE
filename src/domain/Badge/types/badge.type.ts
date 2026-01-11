export type BadgeLevel = "LEVEL_1" | "LEVEL_2" | null;
import badge1 from "../../../assets/images/badge/badge1.png";
import badge2 from "../../../assets/images/badge/badge2.png";
import badge3 from "../../../assets/images/badge/badge3.png";
import badge4 from "../../../assets/images/badge/badge4.png";
import badge5 from "../../../assets/images/badge/badge5.png";
import bage1Disabled from "../../../assets/images/badge/badge1-disable.png";
import bage2Disabled from "../../../assets/images/badge/badge2-disable.png";
import bage3Disabled from "../../../assets/images/badge/badge3-disable.png";
import bage4Disabled from "../../../assets/images/badge/badge4-disable.png";
import bage5Disabled from "../../../assets/images/badge/badge5-disable.png";

export interface BadgeStatusItem {
  disabilityCategoryIds: number[];
  count: number;
  badge_code: BadgeLevel;
}

export interface BadgeStatusResponse {
  badge_status: BadgeStatusItem[];
}

export const BADGE_RESOURCE_MAP: Record<
  number,
  Record<NonNullable<BadgeLevel> | "DEFAULT", string>
> = {
  1: {
    LEVEL_1: badge1,
    LEVEL_2: "/img/badge/phys_2.png",
    DEFAULT: bage1Disabled,
  },
  2: {
    LEVEL_1: badge2,
    LEVEL_2: "/img/badge/vis_2.png",
    DEFAULT: bage2Disabled,
  },
  3: {
    LEVEL_1: badge3,
    LEVEL_2: "/img/badge/hear_2.png",
    DEFAULT: bage3Disabled,
  },
  4: {
    LEVEL_1: badge4,
    LEVEL_2: "/img/badge/dev_2.png",
    DEFAULT: bage4Disabled,
  },
  5: {
    LEVEL_1: badge5,
    LEVEL_2: "/img/badge/int_2.png",
    DEFAULT: bage5Disabled,
  },
};
