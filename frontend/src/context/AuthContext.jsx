import { createContext, useContext, useState, useEffect,useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  } catch (err) {
    const message = err.response?.data?.message || 'Login failed. Please try again.';
    throw new Error(message);
  }
};

const register = async (name, email, password) => {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  } catch (err) {
    const message = err.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(message);
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}