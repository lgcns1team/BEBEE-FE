import { create } from "zustand";

export type MatchType = "하루도움" | "지속도움";

export interface MatchInfo {
  id: number;
  date: string;
  type: MatchType;

  // 하루도움
  time?: string;

  // 지속도움
  schedule?: string[];
  honey: string;
  place: string;
  detailPlace: string;
}

interface MatchInfoState {
  infos: MatchInfo[];
  getInfoById: (id: number) => MatchInfo | undefined;
  setInfos: (infos: MatchInfo[]) => void;
}

export const useMatchInfoStore = create<MatchInfoState>((set, get) => ({
  infos: [
    {
      id: 1,
      date: "2025.03.10",
      type: "하루도움",
      time: "11시 ~ 15시",
      honey: "200꿀",
      place: "뚝섬 한강공원 ",
      detailPlace: "서울시 성동구 성수동",
    },
    {
      id: 3,
      date: "2025.03.10",
      type: "지속도움",
      schedule: ["월요일: 11시 ~ 15시", "화요일: 13시 ~ 15시"],
      honey: "200꿀/회 (총 2500꿀)",
      place: "뚝섬 한강공원 ",
      detailPlace: "서울시 성동구 성수동",
    },
  ],

  setInfos: (infos) => set({ infos }),

  getInfoById: (id) => {
    return get().infos.find((info) => info.id === id);
  },
}));
