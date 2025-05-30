import api from './apiService.ts'

export const authService = {
  login: (authData: authData) => api.post('/user/login', authData),
  register: async (nickname: string, password: string) => {
    return api.post('/user/create', { nickname, password });
  },
};

interface authData {
  nickname: string
  password: string
}
