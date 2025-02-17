import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBasicAuth = (username: string, password: string) => {
  const authHeader = "Basic " + btoa(`${username}:${password}`);
  api.defaults.headers.common["Authorization"] = authHeader;
};


export const userService = {
  getAllUsers: () => api.get("/user/getAll"),
  getUserById: (id: number) => api.get(`/user/get/${id}`),
  updateUser: (userData:userData) => api.put(`/user/update`, userData),
  deleteUser: (id: number) => api.delete(`/user/delete/${id}`),
};


interface userData {
  iduser: number
  nickname: string
  password: string
  role: string
}

export default api;