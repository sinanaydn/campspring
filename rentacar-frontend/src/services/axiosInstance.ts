import axios from 'axios';
import { BASE_URL } from './config';

// Temel (Base) Axios örneğimizi yaratıyoruz
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Istek Öncesi Araya Girici (Request Interceptor)
// Uygulamadan backend'e her atılan istek (Request) çıkmadan HEMEN ÖNCE bu fonksiyon çalışır.
axiosInstance.interceptors.request.use(
    (config) => {
        // Tarayıcının hafızasından (LocalStorage) Token'i kap
        const token = localStorage.getItem('token');

        // Eğer token varsa, kimlik kartımızı Spring Boot'a (Authorization headarına) "Bearer ..." olarak tak!
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
