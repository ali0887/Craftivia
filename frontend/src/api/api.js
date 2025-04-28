import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: 'https://craftivia-fac38888b70d.herokuapp.com/api',
});

// Add authorization token if available in localStorage
const token = localStorage.getItem('token');
if (token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor for debugging
API.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
