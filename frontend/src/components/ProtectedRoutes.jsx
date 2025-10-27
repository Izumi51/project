import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/auth/useAuth';

const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth(); // Pega o estado do seu AuthContext

    if (!isAuthenticated) {
        // Se não estiver logado, redireciona para /login
        return <Navigate to="/login" replace />;
    }

    // Se estiver logado, permite a renderização da rota filha (ex: Profile)
    return <Outlet />;
};

export default ProtectedRoutes;