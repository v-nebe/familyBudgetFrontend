import api from './apiService.ts'


export const categoryService = {
  getAllCategories: () => api.get('/category/getAll'),
  addCategory: (categoryData: categoryData) => api.post(`/category/create`, categoryData),
  deleteCategory: (categoryId: number) => api.delete(`/category/delete/${categoryId}`),
  updateCategory: (categoryDataForUpdate: categoryDataForUpdate) => api.put(`/category/update`, categoryDataForUpdate),
}

interface categoryDataForUpdate {
  idcategory: number,
  categoryname: string,
  type: string,
}


interface categoryData {
  categoryname: string,
  type: string,
}