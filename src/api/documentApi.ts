import { instance } from './axiosInstance';

export const uploadDocument = async (memberId: string, file: File, documentId: string) => {
    const formData = new FormData();
    formData.append('memberId', memberId);
    formData.append('documentId', documentId);
    formData.append('file', file);

    const response = await instance.post('/api/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
