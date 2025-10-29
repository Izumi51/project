import { useState } from 'react';
import AuthContext from './AuthContext';
import api from '../../api/axios';

const AuthProvider = ({ children }) => {
    // A inicialização do estado a partir do localStorage já acontece aqui
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userName, setUserName] = useState(localStorage.getItem('userName'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // O useEffect foi removido pois era redundante.
    // O useState na inicialização já cuida disso.

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, name, userId } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', name);
            localStorage.setItem('userId', userId);
            setToken(token);
            setUserName(name);
            setUserId(userId);
            setIsAuthenticated(true);

            // Não retornamos mais { success: true }
            // A ausência de erro já indica sucesso.

        } catch (loginError) {
            // Limpa o estado e o localStorage em caso de falha
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            setToken(null);
            setUserName(null);
            setUserId(null);
            setIsAuthenticated(false);

            // **MUDANÇA APLICADA AQUI**
            // Lança o erro para a UI capturar (via try...catch)
            const errorMessage = loginError.response?.data?.message ||
                loginError.response?.status === 401 ? 'Email ou senha inválidos' :
                'Erro ao fazer login. Tente novamente.';
            throw new Error(errorMessage);
        }
    };

    const register = async (email, password, name) => {
        try {
            const response = await api.post('/auth/register', { email, password, name });
            const { token, name: userName, userId } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userId', userId);
            setToken(token);
            setUserName(userName);
            setUserId(userId);
            setIsAuthenticated(true);

        } catch (error) {
            // Seu tratamento de erro original (que já estava ótimo)
            const errorMessage = error.response?.data?.message ||
                error.response?.status === 400 ? 'Email já está em uso' :
                'Erro ao registrar. Tente novamente.';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        setToken(null);
        setUserName(null);
        setUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, userName, userId, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;