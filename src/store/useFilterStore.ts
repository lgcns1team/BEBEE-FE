// src/store/useFilterStore.ts
import { create } from "zustand";

interface FilterState {
  // 지역
  regions: string[];
  addRegion: (region: string) => void;
  removeRegion: (region: string) => void;

  // 도움 유형
  selectedHelpTypes: string[];
  toggleHelpType: (label: string) => void;

  // 성별
  gender: "남자" | "여자";
  setGender: (g: "남자" | "여자") => void;

  // 장애 유형
  disability: string;
  setDisability: (d: string) => void;

  // 요일
  days: string[];
  toggleDay: (day: string) => void;

  // 꿀 범위
  honeyRange: number[];
  setHoneyRange: (range: number[]) => void;

  // 전체 초기화
  resetAll: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  regions: ["서울 은평구 전체"],
  addRegion: (region) =>
    set((state) => ({ regions: [...state.regions, region] })),
  removeRegion: (region) =>
    set((state) => ({
      regions: state.regions.filter((r) => r !== region),
    })),

  selectedHelpTypes: ["이동지원"],
  toggleHelpType: (label) =>
    set((state) => ({
      selectedHelpTypes: state.selectedHelpTypes.includes(label)
        ? state.selectedHelpTypes.filter((t) => t !== label)
        : [...state.selectedHelpTypes, label],
    })),

  gender: "여자",
  setGender: (g) => set({ gender: g }),

  disability: "시각장애",
  setDisability: (d) => set({ disability: d }),

  days: ["수", "금", "토"],
  toggleDay: (day) =>
    set((state) => ({
      days: state.days.includes(day)
        ? state.days.filter((x) => x !== day)
        : [...state.days, day],
    })),

  honeyRange: [200, 500],
  setHoneyRange: (range) => set({ honeyRange: range }),

  resetAll: () =>
    set({
      regions: ["서울 은평구 전체"],
      selectedHelpTypes: ["이동지원"],
      gender: "여자",
      disability: "시각장애",
      days: ["수", "금", "토"],
      honeyRange: [200, 500],
    }),
}));
