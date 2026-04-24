import api from "./api";

export const categoryService = {
  // Create category
  createCategory: async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Get category by id
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get categories by type (INCOME or EXPENSE)
  getCategoriesByType: async (type) => {
    const response = await api.get(`/categories/by-type?type=${type}`);
    return response.data;
  },

  // Get categories by type and range
  getCategoriesByTypeAndRange: async (type, month, year) => {
    const response = await api.get(
      `/categories/by-type-and-range?type=${type}&month=${month}&year=${year}`,
    );
    return response.data;
  },

  // Get categories by type and year (API mới cho YEAR mode)
  getCategoriesByTypeAndYear: async (type, year) => {
    const response = await api.get(
      `/categories/by-type-and-year?type=${type}&year=${year}`,
    );
    return response.data;
  },
};
