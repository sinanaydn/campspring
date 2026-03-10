import axiosInstance from './axiosInstance';
import { type RentalResponse, type CreateRentalRequest } from '../models/types';

const RentalService = {
    getAll: async (): Promise<RentalResponse[]> => {
        const response = await axiosInstance.get<RentalResponse[]>('/rentals');
        return response.data;
    },

    getMyRentals: async (): Promise<RentalResponse[]> => {
        const response = await axiosInstance.get<RentalResponse[]>('/rentals/me');
        return response.data;
    },

    add: async (request: CreateRentalRequest): Promise<void> => {
        await axiosInstance.post('/rentals', request);
    }
};

export default RentalService;
