import { create } from "zustand";
import type { UserRole, Gender } from "../domain/auth/auth.types";

interface SignUpFormData {
    // Step 1: 역할 선택
    role: UserRole | null;

    // Step 2: 계정 설정
    email: string;
    password: string;

    // Step 3: 기본 개인정보
    name: string;
    nickname: string;
    birthDate: string;
    gender: Gender;
    phoneNumber: string;
    addressRoad: string;
    latitude: number;
    longitude: number;
    districtCode: string;

    // Step 4: 역할별 정보
    // 도우미: 도움 유형
    helpTypes: string[];
    // 장애인: 장애 정보
    disabilityType: string;
    disabilityDescription: string;

    // Step 5: 문서
    uploadedFile: File | null;
}

interface SignUpFormActions {
    setRole: (role: UserRole) => void;
    setAccountInfo: (email: string, password: string) => void;
    setPersonalInfo: (data: {
        name: string;
        nickname: string;
        birthDate: string;
        gender: Gender;
        phoneNumber: string;
        addressRoad: string;
        latitude: number;
        longitude: number;
        districtCode: string;
    }) => void;
    setHelpTypes: (helpTypes: string[]) => void;
    setDisabilityInfo: (type: string, description: string) => void;
    setUploadedFile: (file: File | null) => void;
    reset: () => void;
}

const initialState: SignUpFormData = {
    role: null,
    email: "",
    password: "",
    name: "",
    nickname: "",
    birthDate: "",
    gender: "NONE",
    phoneNumber: "",
    addressRoad: "",
    latitude: 0,
    longitude: 0,
    districtCode: "",
    helpTypes: [],
    disabilityType: "",
    disabilityDescription: "",
    uploadedFile: null,
};

export const useAuthSignUpForm = create<SignUpFormData & SignUpFormActions>(
    (set) => ({
        ...initialState,

        setRole: (role) => set({ role }),

        setAccountInfo: (email, password) => set({ email, password }),

        setPersonalInfo: (data) => set(data),

        setHelpTypes: (helpTypes) => set({ helpTypes }),

        setDisabilityInfo: (type, description) =>
            set({ disabilityType: type, disabilityDescription: description }),

        setUploadedFile: (file) => set({ uploadedFile: file }),

        reset: () => set(initialState),
    })
);
