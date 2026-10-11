import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { user, login, logout: logoutStore } = useAuthStore();

  const login_user = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      login(data.token, data.user);
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [login, navigate]);

  const logout = useCallback(() => {
    logoutStore();
    navigate('/login');
  }, [logoutStore, navigate]);

  return {
    user,
    login: login_user,
    logout,
    isAuthenticated: !!user,
  };
}
