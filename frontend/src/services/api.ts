
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

// Add interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });
        
        // Store the new access token
        localStorage.setItem('token', response.data.access);
        
        // Update the authorization header
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
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
