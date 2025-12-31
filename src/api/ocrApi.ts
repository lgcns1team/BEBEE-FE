import { instance } from './axiosInstance';
import type { OcrResult } from '../domain/auth/auth.types';

export const extractOcr = async (file: File, role: string): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    const response = await instance.post('/documents/ocr-extract', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30초
    });
    return response.data;
};
