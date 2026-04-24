import api, { initializeTokenRefresh } from "./api";

export const authService = {
  // Login
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data.data.authenticated) {
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      // Schedule token refresh after login
      initializeTokenRefresh();

      return response.data;
    }
    throw new Error("Authentication failed");
  },

  // Register
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.post("/auth/logout", { token });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Introspect token
  introspect: async (token) => {
    const response = await api.post("/auth/introspect", { token });
    return response.data;
  },

  // Refresh token
  refreshToken: async (token) => {
    const response = await api.post("/auth/refresh", { token });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
