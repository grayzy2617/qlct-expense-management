import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];
let refreshTokenTimeout = null;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Decode JWT token to get expiration time
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Refresh token function
const refreshToken = async () => {
  const oldToken = localStorage.getItem("token");

  if (!oldToken) {
    return;
  }

  try {
    isRefreshing = true;
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { token: oldToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data?.data?.token) {
      const newToken = response.data.data.token;
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      console.log("✅ Token refreshed successfully");

      // Schedule next refresh
      scheduleTokenRefresh(newToken);
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  } finally {
    isRefreshing = false;
  }
};

// Schedule token refresh 5 minutes before expiration
const scheduleTokenRefresh = (token) => {
  // Clear existing timeout
  if (refreshTokenTimeout) {
    clearTimeout(refreshTokenTimeout);
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    console.warn("⚠️ Cannot decode token or no expiration time");
    return;
  }

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const expirationTime = decoded.exp; // Token expiration time in seconds
  const timeUntilExpiry = expirationTime - currentTime; // Time left in seconds

  // Refresh 5 minutes (300 seconds) before expiration
  const refreshTime = timeUntilExpiry - 300;

  if (refreshTime <= 0) {
    // Token expires in less than 5 minutes, refresh immediately
    console.log("⚡ Token expires soon, refreshing immediately");
    refreshToken();
  } else {
    // Schedule refresh
    const refreshTimeMs = refreshTime * 1000;
    console.log(
      `⏰ Token refresh scheduled in ${Math.floor(refreshTime / 60)} minutes`,
    );

    refreshTokenTimeout = setTimeout(() => {
      console.log("🔄 Auto-refreshing token...");
      refreshToken();
    }, refreshTimeMs);
  }
};

// Export function to initialize token refresh on app start
export const initializeTokenRefresh = () => {
  const token = localStorage.getItem("token");
  if (token) {
    scheduleTokenRefresh(token);
  }
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Initialize token refresh on first load
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    scheduleTokenRefresh(token);
  }
}

// Response interceptor to handle errors and refresh token as fallback
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet (fallback mechanism)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;

      const oldToken = localStorage.getItem("token");

      if (!oldToken) {
        // No token to refresh, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        console.log("🔄 Token expired, refreshing...");
        await refreshToken();
        processQueue(null, localStorage.getItem("token"));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
