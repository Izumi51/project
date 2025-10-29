import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/auth/useAuth';

const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // If not logged redirect to /login
        return <Navigate to="/login" replace />;
    }

    // If logged allow the children route render 
    return <Outlet />;
};

export default ProtectedRoutes;