import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute: React.FC = () => {
    // Kullanıcı sisteme giriş yapmış mı? (Local Storage'da token'ı var mı?)
    const isAuth = authService.isAuthenticated();

    // Eğer giriş yaptıysa (Token var ise) gitmek istediği sayfayı (Outlet) göster.
    // Eğer giriş yapmadıysa (Token yok ise) onu doğrudan Login sayfasına geri şutla!
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
