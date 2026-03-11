import axiosInstance from './axiosInstance';
import { type CarResponse, type CreateCarRequest, type UpdateCarRequest, type PageResponse } from '../models/types';

const CarService = {
    getAll: async (): Promise<CarResponse[]> => {
        const response = await axiosInstance.get<PageResponse<CarResponse>>('/cars');
        return response.data.content;
    },

    add: async (request: CreateCarRequest): Promise<void> => {
        await axiosInstance.post('/cars', request);
    },

    update: async (request: UpdateCarRequest): Promise<void> => {
        await axiosInstance.put('/cars', request);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/cars/${id}`);
    },

    uploadImage: async (carId: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        await axiosInstance.post(`/cars/${carId}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export default CarService;
