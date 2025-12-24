import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone, code) => {
    try {
      const response = await authAPI.verifyOTP(phone, code);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Invalid OTP. Please try again.';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const sendOTP = async (phone) => {
    try {
      const response = await authAPI.sendOTP(phone);
      return { 
        success: true, 
        otp: response.data.otp
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to send OTP. Please try again.';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, sendOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

