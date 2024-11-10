import axios from 'axios';
import userStore from '../zustand';

const baseURL = import.meta.env.VITE_API_URL;
const addressURL = import.meta.env.VITE_ADDRESS_API_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain',
  },
});

const addressApi = axios.create({
  baseURL: addressURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { user } = userStore.getState();
    const token = user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('Token not available!');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
export { addressApi };
