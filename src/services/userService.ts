import api from './apiService.ts'


export const userService = {
  getAllUsers: () => api.get("/user/getAll"),
  getUserById: (id: number) => api.get(`/user/get/${id}`),
  updateUser: (userData:userData) => api.put(`/user/update`, userData),
  deleteUser: (id: number) => api.delete(`/user/delete/${id}`),
};


interface userData {
  iduser: number | undefined
  nickname: string | undefined
  password: string
  role: string | undefined
}
