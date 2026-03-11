import axiosInstance from './axiosInstance';
import { type RentalResponse, type CreateRentalRequest, type PageResponse } from '../models/types';

const RentalService = {
    getAll: async (): Promise<RentalResponse[]> => {
        const response = await axiosInstance.get<PageResponse<RentalResponse>>('/rentals');
        return response.data.content;
    },

    getMyRentals: async (): Promise<RentalResponse[]> => {
        const response = await axiosInstance.get<PageResponse<RentalResponse>>('/rentals/me');
        return response.data.content;
    },

    add: async (request: CreateRentalRequest): Promise<void> => {
        await axiosInstance.post('/rentals', request);
    }
};

export default RentalService;
