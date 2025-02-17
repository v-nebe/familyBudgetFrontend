import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: (authData: authData) => api.post('/auth/login', authData),
  register: async (nickname: string, password: string) => {
    return api.post('/user/create', { nickname, password });
  },
};


interface authData {
  nickname: string
  password: string
}

export default api;