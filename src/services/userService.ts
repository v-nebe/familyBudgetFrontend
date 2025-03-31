import api from './apiService.ts'


export const userService = {
  getAllUsers: () => api.get('/user/getAll'),
  getUser: (id?: number, nickname?: string ) =>  {
    const params = new URLSearchParams();
    if (id) params.append("id", id.toString());
    if (nickname) params.append("nickname", nickname);

    return api.get(`/user/get/user?${params.toString()}`);
  },
  updateUser: (nickname: string | null, userData: userData) =>
    api.put(`/user/update/${nickname}`, userData),
  deleteUser: (id: number) => api.delete(`/user/delete/${id}`),
};


interface userData {
  nickname: string | undefined
  password: string | null
  role: string | undefined
}
