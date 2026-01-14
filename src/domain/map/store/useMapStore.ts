
import { create } from "zustand";
import type { MapFindType, NearByHelperDto, NearByPostDto } from "../../../types/map.type"

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
  clearHelpers: () => void;

  setPosts: (posts: NearByPostDto[]) => void;
  clearPosts: () => void;

  clearMarkers: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  findType: "CURRENT",
  center: { lat: 33.450701, lng: 126.570667 },
  radiusKm: 3,

  helpers: [],
  posts: [],

  setFindType: (findType) => set({ findType }),
  setCenter: (center) => set({ center }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),

  setHelpers: (helpers) => set({ helpers }),
  clearHelpers: () => set({ helpers: [] }),

  setPosts: (posts) => set({ posts }),
  clearPosts: () => set({ posts: [] }),

  clearMarkers: () => set({ helpers: [], posts: [] }),
}));