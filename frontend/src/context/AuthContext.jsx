import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.user_id,
          name: payload.name || null,
          org_id: payload.org_id,
          role: payload.role,
        });
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token && user) {
      api.get('/organisations/me')
        .then((res) => setOrg(res.data))
        .catch(() => {});
    }
  }, [token, user]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token } = res.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    return res.data;
  };

  const adminRegister = async (name, email, password, orgName) => {
    const res = await api.post('/auth/admin/register', {
      name,
      email,
      password,
      org_name: orgName,
    });
    const { access_token, invite_code } = res.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    return { invite_code };
  };

  const register = async (name, email, password, inviteCode) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      invite_code: inviteCode,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setOrg(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, org, loading, login, adminRegister, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
