import axiosInstance from './axiosInstance';
import { type GetUserProfileResponse, type UpdateUserPasswordRequest } from '../models/types';

const UserService = {
    getProfile: async (): Promise<GetUserProfileResponse> => {
        const response = await axiosInstance.get<GetUserProfileResponse>('/users/me');
        return response.data;
    },

    updatePassword: async (request: UpdateUserPasswordRequest): Promise<void> => {
        await axiosInstance.put('/users/me/password', request);
    }
};

export default UserService;
