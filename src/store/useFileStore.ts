import { create } from "zustand";
import type { FileUploadState } from "../types/file.type";

interface FileStore {
  uploadStates: FileUploadState[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  updateFileState: (index: number, updates: Partial<FileUploadState>) => void;
  clearFiles: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  uploadStates: [],

  addFile: (file: File) => {
    const preview = URL.createObjectURL(file);
    const newState: FileUploadState = {
      file,
      preview,
      isUploading: false,
      isUploaded: false,
    };

    set((state) => ({
      uploadStates: [...state.uploadStates, newState],
    }));
  },

  removeFile: (index: number) => {
    set((state) => {
      const fileState = state.uploadStates[index];
      if (fileState?.preview) {
        URL.revokeObjectURL(fileState.preview);
      }
      return {
        uploadStates: state.uploadStates.filter((_, i) => i !== index),
      };
    });
  },

  updateFileState: (index: number, updates: Partial<FileUploadState>) => {
    set((state) => ({
      uploadStates: state.uploadStates.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      ),
    }));
  },

  clearFiles: () => {
    set((state) => {
      state.uploadStates.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
      return { uploadStates: [] };
    });
  },
}));
