import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';

const ProtectedAdminRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('adminToken');

    if (!token) return <Navigate to="/admin-login" replace />;

    try {
        const decoded: { role: string } = jwtDecode(token);
        if (decoded.role !== 'Admin') {
            return <Navigate to="/admin-login" replace />;
        }
        return children;
    } catch {
        return <Navigate to="/admin-login" replace />;
    }
};

export default ProtectedAdminRoute;
