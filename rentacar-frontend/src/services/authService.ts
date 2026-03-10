import axiosInstance from './axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { type LoginRequest, type RegisterCustomerRequest, type AuthResponse } from '../models/types';

// Spring Boot /api/auth denetleyicisine (Controller) giden köprü kütüphanemiz
const AuthService = {
    // 1. Kullanıcı Girişi (Login)
    login: async (request: LoginRequest): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', request);

        // Eğer giriş başarılıysa Spring Security'den gelen Şifreli Tokeni al ve Tarayıcıya kaydet
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // 2. Müşteri Kaydı (Register)
    register: async (request: RegisterCustomerRequest): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>('/auth/register', request);

        // Kayıt olur olmaz (veya sonrası) dönen ilk jwt tokeni de otomatik kaydedebiliriz
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // 3. Çıkış Yapma (Logout - Token Silici)
    logout: () => {
        localStorage.removeItem('token');
    },

    // 4. İçeride kimlik avı (Token var mı?)
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    // 5. Tokeni Mıknatısla Açıp (Decode) İçinden "Role" Kutusunu Almak
    getUserRole: (): string | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            return decoded.role || null;
        } catch (error) {
            console.error("Token kırılamadı:", error);
            return null;
        }
    }
};

export default AuthService;
