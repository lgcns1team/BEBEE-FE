import { instance } from './axiosInstance';
import type { OcrResult } from '../domain/auth/auth.types';

export const extractOcr = async (file: File, role: string): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    const response = await instance.post('/api/documents/ocr-extract', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 90000, // 90초 (CPU 처리 시 지연 고려)
    });
    return response.data;
};
