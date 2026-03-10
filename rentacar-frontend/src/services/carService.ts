import axiosInstance from './axiosInstance';
import { type CarResponse, type CreateCarRequest, type UpdateCarRequest } from '../models/types';

const CarService = {
    getAll: async (): Promise<CarResponse[]> => {
        const response = await axiosInstance.get<CarResponse[]>('/cars');
        return response.data;
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
