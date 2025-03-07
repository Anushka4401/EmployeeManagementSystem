import axios from "axios";

const API_ADMIN_URL = "http://localhost:8080/admin";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminService = {
  // Get login history
  getLoginHistory: async (
    page = 0,
    size = 10,
    sortBy = "id",
    direction = "asc"
  ) => {
    try {
      const response = await axios.get(`${API_ADMIN_URL}/login-history`, {
        headers: getAuthHeaders(),
        params: { page, size, sortBy, direction }, // Passing pagination params
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching login history:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get all users
  getAllUsers: async (page = 0, size = 5) => {
    try {
      const response = await axios.get(`${API_ADMIN_URL}/get-all`, {
        headers: getAuthHeaders(),
        params: { page, size }, // Send page and size as query parameters
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching paginated users:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getUsersList: async () => {
    try {
      const response = await axios.get(`${API_ADMIN_URL}/user-list`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update user details
  updateUser: async (id, userData) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found. User might be logged out.");
        throw new Error("Unauthorized: No token found. Please log in again.");
      }

      const response = await axios.put(`${API_ADMIN_URL}/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensures correct content type
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  registerUserManually: async (userData) => {
    try {
      const response = await axios.post(
        `${API_ADMIN_URL}/manual-register`,
        userData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Approve user
  approveUser: async (id) => {
    try {
      const response = await axios.get(
        `${API_ADMIN_URL}/${id}/approve`,

        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error approving user:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Deactivate user
  deactivateUser: async (id) => {
    try {
      const response = await axios.get(
        `${API_ADMIN_URL}/${id}/deactivate`,

        { headers: getAuthHeaders() } // ✅ Fix: Move headers here
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error deactivating user:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Import users from an Excel file
  importUsers: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_ADMIN_URL}/import-users`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const message = response.data;
      console.log("Import Response:", message);
      alert(message);
      return message;
    } catch (error) {
      console.error(
        "Error importing users:",
        error.response?.data || error.message
      );

      // Handle API errors (server errors, validation errors, etc.)
      alert("Failed to import users. Please try again.");

      throw error;
    }
  },
};

export default AdminService;
