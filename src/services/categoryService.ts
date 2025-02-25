import api from './apiService.ts'


export const categoryService = {
  getAllCategories: () => api.get('/category/getAll'),
  addCategory: (categoryData: categoryData) => api.post(`/category/create`, categoryData)
}


interface categoryData {
  categoryname: string
}