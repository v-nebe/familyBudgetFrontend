import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(config => {

  const requestUrl = config.url || '';

  if (requestUrl.includes('/auth')) {
    return config; // Не добавляем заголовок
  }
  // Добавляем Basic Auth для всех остальных запросов
  const token = btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`); // Можно хранить токен в localStorage
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
}, error => Promise.reject(error));


export default api;