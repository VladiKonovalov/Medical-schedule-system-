import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, code) => api.post('/auth/verify-otp', { phone, code }),
};

// Medical Fields APIs
export const medicalFieldsAPI = {
  getAll: () => api.get('/medical-fields'),
};

// Doctors APIs
export const doctorsAPI = {
  getByField: (fieldId) => api.get(`/doctors?fieldId=${fieldId}`),
  getAll: () => api.get('/doctors'),
};

// Appointments APIs
export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  getUpcoming: () => api.get('/appointments/upcoming'),
  getPast: () => api.get('/appointments/past'),
  create: (data) => api.post('/appointments', data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  reschedule: (id, newDate) => api.put(`/appointments/${id}/reschedule`, { newDate }),
};

// Time Slots APIs
export const timeSlotsAPI = {
  getAvailable: (doctorId, date) => 
    api.get(`/time-slots?doctorId=${doctorId}&date=${date}`),
};

// Search API
export const searchAPI = {
  search: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
};

export default api;

