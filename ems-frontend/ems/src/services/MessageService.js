import axios from "axios";

const API_URL = "http://localhost:8080";
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const MessageService = {
  sendMessage: async (senderId, receiverId, message) => {
    try {
      const response = await axios.post(
        `${API_URL}/message/send`,
        {
          senderId,
          receiverId,
          message,
        },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  getMessagesByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/message/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  getAdmins: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found");
        return []; // Return empty array instead of null
      }

      const response = await axios.get(`${API_URL}/user/admins`, {
        headers: getAuthHeaders(),
      });

      return response.data || []; // Ensure data is always an array
    } catch (error) {
      console.error(
        "Error fetching admins:",
        error.response?.data?.message || error.message
      );
      throw error; // Let the component handle errors
    }
  },
};

export default MessageService;
