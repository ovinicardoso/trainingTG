
import axios from 'axios';

// This would be replaced with the actual Django backend URL in production
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login/', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register/', userData),
  
  getProfile: () => 
    api.get('/auth/profile/'),
  
  updateProfile: (profileData: any) => 
    api.patch('/auth/profile/', profileData),
};

// Plan generation endpoints
export const planAPI = {
  generateWorkoutPlan: () => 
    api.post('/generate-plan/workout/'),
  
  generateDietPlan: () => 
    api.post('/generate-plan/diet/'),
};

export default api;
