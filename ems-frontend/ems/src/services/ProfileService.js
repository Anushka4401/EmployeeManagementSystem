import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProfileService = {
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  },

  updateProfile: async (updatedUser) => {
    try {
      const response = await axios.put(`${API_URL}/user/update`, updatedUser, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  },
};

export default ProfileService;
