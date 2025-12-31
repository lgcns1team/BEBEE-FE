import { instance } from './axiosInstance';

export const uploadDocument = async (memberId: string, file: File) => {
    const formData = new FormData();
    formData.append('memberId', memberId);
    formData.append('file', file);

    const response = await instance.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
