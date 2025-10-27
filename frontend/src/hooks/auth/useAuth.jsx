import { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';

/**
    Custom hook to access the Authentication context.
    Provides an easy way to get authentication state and functions.
    Throws an error if used outside of an AuthProvider.
    @returns {object} The authentication context value (user, token, login, register, logout, etc.).
*/
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};