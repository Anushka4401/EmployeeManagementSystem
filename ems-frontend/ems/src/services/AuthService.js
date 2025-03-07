import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_AUTH_URL = "http://localhost:8080/auth";
const authAxios = axios.create();

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const decode = jwtDecode(AuthService.getAccessToken());

    const expiresAt = decode.exp;

    if (expiresAt < Date.now / 1000) {
      try {
        console.log("Access token expired. Refreshing...");
        const newTokens = await AuthService.refreshToken();
        error.config.headers.Authorization = `Bearer ${newTokens.access_token}`;
        return authAxios(error.config);
      } catch (refreshError) {
        console.error("Refresh token expired. Logging out...");
        AuthService.logout();
        window.location.href = "/login-user";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
const AuthService = {
  // Register User
  register: async (userData) => {
    console.log("Registering user");

    return await axios.post(`${API_AUTH_URL}/register-user`, userData);
  },

  // Login User
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_AUTH_URL}/login-user`,
        credentials
      );
      console.log(response);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);

      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Logout User
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  // Get Current Access Token
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  // Refresh Token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(`${API_AUTH_URL}/refresh-token`, {
        refresh_token: refreshToken,
      });

      // Update tokens
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);

      return response.data;
    } catch (error) {
      console.error(
        "Token refresh failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  uploadFile: async (file, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axios.post(
        `${API_AUTH_URL}/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
};

export default AuthService;
