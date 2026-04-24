import api from "./api";

export const savingService = {
  // Get savings by status (default: ongoing = true)
  getSavingsByStatus: async (status = true) => {
    const response = await api.get(`/savings?status=${status}`);
    return response.data;
  },

  // Get saving by id
  getSavingById: async (id) => {
    const response = await api.get(`/savings/${id}`);
    return response.data;
  },

  // Create saving
  createSaving: async (savingData) => {
    const response = await api.post("/savings", savingData);
    return response.data;
  },

  // Update saving
  updateSaving: async (id, savingData) => {
    const response = await api.put(`/savings/${id}`, savingData);
    return response.data;
  },

  // Toggle status (complete/reopen)
  toggleStatus: async (id) => {
    const response = await api.patch(`/savings/${id}/toggle-status`);
    return response.data;
  },

  // Delete saving
  deleteSaving: async (id) => {
    const response = await api.delete(`/savings/${id}`);
    return response.data;
  },
};
