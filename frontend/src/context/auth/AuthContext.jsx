import { createContext } from 'react';

const AuthContext = createContext({
    token: null,
    userName: null,
    userId: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    register: () => {},
});

export default AuthContext;