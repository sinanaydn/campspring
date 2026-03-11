// Global Type Definitions

export interface User {
    id: number;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
}

// ---- DTOs (Requests) ----

export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface RegisterCustomerRequest {
    firstName?: string;
    lastName?: string;
    nationalIdentity?: string;
    email?: string;
    password?: string;
}

export interface GetUserProfileResponse {
    id: number;
    email: string;
    role: string;
}

export interface UpdateUserPasswordRequest {
    currentPassword?: string;
    newPassword?: string;
}

// ---- BRANDS ----
export interface BrandResponse {
    id: number;
    name: string;
}

export interface CreateBrandRequest {
    name: string;
}

export interface UpdateBrandRequest {
    id: number;
    name: string;
}

// ---- CAR MODELS ----
export interface CarModelResponse {
    id: number;
    name: string;
    brandName: string;
}

export interface CreateCarModelRequest {
    name: string;
    brandId: number;
}

export interface UpdateCarModelRequest {
    id: number;
    name: string;
    brandId: number;
}

// ---- CARS ----
export interface CarResponse {
    id: number;
    modelYear: number;
    plate: string;
    dailyPrice: number;
    state: number;
    modelName: string;
    imageUrl: string | null;
    fuelType: string;
    transmissionType: string;
}

export interface CreateCarRequest {
    modelYear: number;
    plate: string;
    dailyPrice: number;
    state: number;
    modelId: number;
    fuelType: string;
    transmissionType: string;
}

export interface UpdateCarRequest {
    id: number;
    modelYear: number;
    plate: string;
    dailyPrice: number;
    state: number;
    modelId: number;
    fuelType: string;
    transmissionType: string;
}

// ---- RENTALS (KİRALAMALAR) ----
export interface RentalResponse {
    id: number;
    carModelName: string;
    carPlate: string;
    userEmail: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
}

export interface CreateRentalRequest {
    carId: number;
    startDate: string;
    endDate: string;
}

// ---- COMMON PAGES ----
export interface PageResponse<T> {
    content: T[];
    totalPages?: number;
    totalElements?: number;
    size?: number;
    number?: number;
}

