'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { api } from '@/utils/api';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        
        // Verify token with backend
        await api.get('/auth/verify');
        setIsAuthenticated(true);
      } catch (error) {
        // If token is invalid, clear it
        Cookies.remove('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/token', formData);
    const { access_token } = response.data;
    Cookies.set('token', access_token);
    setIsAuthenticated(true);
  };

  const register = async (credentials: RegisterCredentials) => {
    await api.post('/auth/register', credentials);
    await login({
      username: credentials.username,
      password: credentials.password,
    });
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
