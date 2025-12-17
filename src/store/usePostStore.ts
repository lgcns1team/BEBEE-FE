import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  PostRequest,
  PostType,
  LocationData,
  DailySchedule,
} from "../types/post"; // 경로에 맞게 수정

interface PostState {
  // --- State (Form Data) ---
  formData: PostRequest;

  // --- Actions ---
  // 기본 필드 업데이트
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setPostType: (type: PostType) => void;
  setHoney: (unit: number, total: number) => void;
  setVolunteer: (isVolunteer: boolean) => void;

  // 위치 정보 업데이트
  setLocation: (location: LocationData) => void;

  // 이미지 관리
  addImages: (newImages: Array<{ file?: File; url: string }>) => void;
  removeImage: (index: number) => void;

  // 시간/일정 관련 (타입에 따른 분기 처리)
  setDaySchedule: (date: string, time: string) => void; // DAY 타입용
  setTermDate: (start: string, end: string) => void; // TERM 타입용 기간
  setWeeklySchedule: (schedules: DailySchedule[]) => void; // TERM 타입용 요일별 시간

  // 초기화
  resetForm: () => void;
}

// 초기값 설정
const initialLocation: LocationData = {
  region: "",
  legaldongCode: "",
  latitude: 0,
  longitude: 0,
};

const initialState: PostRequest = {
  title: "",
  type: "DAY", // 기본값
  unitHoney: 0,
  totalHoney: 0,
  location: initialLocation,
  content: "",
  isVolunteer: false,
  images: [],
  // Optional field initialize
  engagementDate: "",
  engagementTime: "",
  startDate: "",
  endDate: "",
  schedules: [],
};

export const usePostStore = create<PostState>()(
  devtools((set) => ({
    formData: initialState,

    // 1. 기본 텍스트 정보
    setTitle: (title) =>
      set(
        (state) => ({ formData: { ...state.formData, title } }),
        false,
        "setTitle"
      ),

    setContent: (content) =>
      set(
        (state) => ({ formData: { ...state.formData, content } }),
        false,
        "setContent"
      ),

    // 2. 게시글 타입 변경 (타입 변경 시 관련 없는 시간 데이터 초기화 로직 포함 가능)
    setPostType: (type) =>
      set(
        (state) => ({ formData: { ...state.formData, type } }),
        false,
        "setPostType"
      ),

    setHoney: (unitHoney, totalHoney) =>
      set(
        (state) => ({ formData: { ...state.formData, unitHoney, totalHoney } }),
        false,
        "setHoney"
      ),

    setVolunteer: (isVolunteer) =>
      set(
        (state) => ({ formData: { ...state.formData, isVolunteer } }),
        false,
        "setVolunteer"
      ),

    // 3. 위치 정보
    setLocation: (location) =>
      set(
        (state) => ({ formData: { ...state.formData, location } }),
        false,
        "setLocation"
      ),

    // 4. 이미지 관리 (Sequence 자동 할당)
    addImages: (newImages) =>
      set(
        (state) => {
          const currentLength = state.formData.images.length;
          const imagesToAdd = newImages.map((img, idx) => ({
            ...img,
            sequence: currentLength + idx + 1,
          }));
          return {
            formData: {
              ...state.formData,
              images: [...state.formData.images, ...imagesToAdd],
            },
          };
        },
        false,
        "addImages"
      ),

    removeImage: (index) =>
      set(
        (state) => {
          const filtered = state.formData.images.filter((_, i) => i !== index);
          // 삭제 후 sequence 재정렬
          const reordered = filtered.map((img, i) => ({
            ...img,
            sequence: i + 1,
          }));
          return { formData: { ...state.formData, images: reordered } };
        },
        false,
        "removeImage"
      ),

    // 5. 스케줄링 - DAY 타입 (단건)
    setDaySchedule: (date, time) =>
      set(
        (state) => ({
          formData: {
            ...state.formData,
            engagementDate: date,
            engagementTime: time,
            // TERM 관련 데이터 초기화 (선택사항)
            startDate: "",
            endDate: "",
            schedules: [],
          },
        }),
        false,
        "setDaySchedule"
      ),

    // 6. 스케줄링 - TERM 타입 (기간 설정)
    setTermDate: (start, end) =>
      set(
        (state) => ({
          formData: {
            ...state.formData,
            startDate: start,
            endDate: end,
            // DAY 관련 데이터 초기화
            engagementDate: "",
            engagementTime: "",
          },
        }),
        false,
        "setTermDate"
      ),

    // 7. 스케줄링 - TERM 타입 (요일별 시간표)
    setWeeklySchedule: (schedules) =>
      set(
        (state) => ({
          formData: { ...state.formData, schedules },
        }),
        false,
        "setWeeklySchedule"
      ),

    // 8. 폼 초기화
    resetForm: () => set({ formData: initialState }, false, "resetForm"),
  }))
);
