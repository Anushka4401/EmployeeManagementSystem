import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DocumentServices = {
  uploadFile: async (file, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axios.post(
        `${API_BASE_URL}/admin/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      return response.data; // Returns the uploaded file URL or success message
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  },

  downloadFile: async (fileName) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/download/${fileName}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
          responseType: "blob", // Important for handling file downloads
        }
      );

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set file name for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true; // Indicate success
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },

  getDocuments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/documents`, {
        headers: {
          ...getAuthHeaders(),
        },
      });

      return response.data; // Returns an array of documents
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },
};

export default DocumentServices;
