import api from "./api";

export const monthRangeService = {
  // Update custom months
  updateCustomMonths: async (monthsData) => {
    const response = await api.put("/months/update", monthsData);
    return response.data;
  },

  // Get start day
  getStartDay: async () => {
    const response = await api.get("/months/start-day");
    return response.data;
  },
};
