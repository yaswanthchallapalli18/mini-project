import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');

      if (storedToken && storedUser && storedRole) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  // Clear errors helper
  const clearError = () => setError(null);

  // Unified login handler
  const login = async (emailOrUsername, password, loginRole) => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      let payload = {};

      if (loginRole === 'admin') {
        endpoint = '/auth/login/admin';
        payload = { username: emailOrUsername, password };
      } else if (loginRole === 'provider') {
        endpoint = '/auth/login/provider';
        payload = { email: emailOrUsername, password };
      } else {
        endpoint = '/auth/login/customer';
        payload = { email: emailOrUsername, password };
      }

      const res = await api.post(endpoint, payload);
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      localStorage.setItem('role', loginRole);

      setToken(receivedToken);
      setUser(receivedUser);
      setRole(loginRole);
      setLoading(false);
      return receivedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Register Customer (uses FormData for image upload)
  const registerCustomer = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register/customer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      localStorage.setItem('role', 'customer');

      setToken(receivedToken);
      setUser(receivedUser);
      setRole('customer');
      setLoading(false);
      return receivedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Register Service Provider (uses FormData for photos & doc upload)
  const registerProvider = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register/provider', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      localStorage.setItem('role', 'provider');

      setToken(receivedToken);
      setUser(receivedUser);
      setRole('provider');
      setLoading(false);
      return receivedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Provider registration failed.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Update Profile
  const updateProfile = async (profileData, isFile = false) => {
    setError(null);
    try {
      const endpoint = role === 'provider' ? '/providers/profile' : '/customers/profile';
      const headers = isFile ? { 'Content-Type': 'multipart/form-data' } : {};
      
      // Since customers profile routes aren't built yet, we fallback to updating the state locally if API is missing,
      // but we will build provider profile edit first.
      const res = await api.put(endpoint, profileData, { headers });
      const updatedUser = res.data.data;
      
      const newUserData = { ...user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return newUserData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Unified logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        registerCustomer,
        registerProvider,
        updateProfile,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
