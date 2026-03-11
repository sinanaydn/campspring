import axiosInstance from './axiosInstance';
import { type CarModelResponse, type CreateCarModelRequest, type UpdateCarModelRequest, type PageResponse } from '../models/types';

const CarModelService = {
    getAll: async (): Promise<CarModelResponse[]> => {
        const response = await axiosInstance.get<PageResponse<CarModelResponse>>('/carmodels');
        return response.data.content;
    },

    add: async (request: CreateCarModelRequest): Promise<void> => {
        await axiosInstance.post('/carmodels', request);
    },

    update: async (request: UpdateCarModelRequest): Promise<void> => {
        await axiosInstance.put('/carmodels', request);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/carmodels?id=${id}`);
    }
};

export default CarModelService;
