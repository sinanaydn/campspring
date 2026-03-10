import axiosInstance from './axiosInstance';
import { type BrandResponse, type CreateBrandRequest, type UpdateBrandRequest } from '../models/types';

const BrandService = {
    getAll: async (): Promise<BrandResponse[]> => {
        const response = await axiosInstance.get<BrandResponse[]>('/brands');
        return response.data;
    },

    getById: async (id: number): Promise<BrandResponse> => {
        const response = await axiosInstance.get<BrandResponse>(`/brands/${id}`);
        return response.data;
    },

    add: async (request: CreateBrandRequest): Promise<void> => {
        await axiosInstance.post('/brands', request);
    },

    update: async (request: UpdateBrandRequest): Promise<void> => {
        await axiosInstance.put('/brands', request);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/brands/${id}`);
    }
};

export default BrandService;
