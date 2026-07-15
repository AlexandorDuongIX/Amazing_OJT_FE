import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:57867/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for request
axiosClient.interceptors.request.use(
  (config) => {
    // You can attach token here if needed
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

// Interceptors for response
axiosClient.interceptors.response.use(
  (response) => {
    // Return data directly if needed, or just return response
    return response.data;
  },
  (error) => {
    // Handle global errors here (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // e.g., redirect to login or clear localStorage
      console.error('Unauthorized, please login again.');
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
