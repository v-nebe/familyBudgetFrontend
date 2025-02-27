import api from './apiService.ts'


export const userService = {
  getUserByNickname: (nickname: string | null) =>
    api.get(`user/nickname/${nickname}`),
  getUserById: (id: number) => api.get(`/user/get/${id}`),
  updateUser: (nickname: string | null, userData: userData) =>
    api.put(`/user/update/${nickname}`, userData),
  deleteUser: (id: number) => api.delete(`/user/delete/${id}`),
};


interface userData {
  nickname: string | undefined
  password: string
  role: string | undefined
}
