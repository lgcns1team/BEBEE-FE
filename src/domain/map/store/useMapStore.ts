import { create } from "zustand";

import type {
  MapFindType,
  NearByHelperDto,
  NearByPostDto,
} from "../../../types/map.type.ts";

/** 지도 중심 좌표 타입 */
interface MapCenter {
  lat: number;
  lng: number;
}

interface MapStore {
  findType: MapFindType;
  center: MapCenter;
  radiusKm: number;
  helpers: NearByHelperDto[];
  posts: NearByPostDto[];

  setFindType: (type: MapFindType) => void;
  setCenter: (center: MapCenter) => void;
  setRadiusKm: (km: number) => void;

  setHelpers: (helpers: NearByHelperDto[]) => void;
  setPosts: (posts: NearByPostDto[]) => void;

  /** 역할 전환 시 데이터 초기화 */
  clearMarkers: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  findType: "CURRENT",

  center: {
    lat: 33.450701,
    lng: 126.570667,
  },

  radiusKm: 1,

  helpers: [],
  posts: [],

  setFindType: (type) => set({ findType: type }),

  setCenter: (center) => set({ center }),

  setRadiusKm: (km) => set({ radiusKm: km }),

  setHelpers: (helpers) => set({ helpers }),

  setPosts: (posts) => set({ posts }),

  clearMarkers: () =>
    set({
      helpers: [],
      posts: [],
    }),
}));
