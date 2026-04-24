import api from "./api";

export const itemService = {
  // Create item
  createItem: async (itemData) => {
    const response = await api.post("/items", itemData);
    return response.data;
  },

  // Get item by id
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  // Get items by category
  getItemsByCategoryId: async (categoryId) => {
    const response = await api.get(`/items/category/${categoryId}`);
    return response.data;
  },

  // Get sum by type and range
  getSumByTypeAndRange: async (type, month, year) => {
    const response = await api.get(
      `/items/sum-by-type?type=${type}&month=${month}&year=${year}`,
    );
    return response.data;
  },

  // Get sum by type and year (API mới cho YEAR mode)
  getSumByTypeAndYear: async (type, year) => {
    const response = await api.get(
      `/items/sum-by-type-year?type=${type}&year=${year}`,
    );
    return response.data;
  },

  // Get sum by category and range
  getSumByCategoryAndRange: async (categoryId, month, year) => {
    const response = await api.get(
      `/items/sum-by-category?categoryID=${categoryId}&month=${month}&year=${year}`,
    );
    return response.data;
  },

  // Get items by category and range
  getItemsByCategoryAndRange: async (categoryId, month, year) => {
    const response = await api.get(
      `/items/by-category-range?categoryID=${categoryId}&month=${month}&year=${year}`,
    );
    return response.data;
  },

  // Get items by type and range (by date range)
  getItemsByTypeAndRange: async (type, month, year) => {
    const response = await api.get(
      `/items/by-date-range?type=${type}&month=${month}&year=${year}`,
    );
    return response.data;
  },

  // Get date range description
  getDateRange: async (mode, month, year) => {
    const response = await api.get(
      `/items/date-range?mode=${mode}&month=${month}&year=${year}`,
    );
    return response.data;
  },
};
