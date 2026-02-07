import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const faceAPI = {
  // Upload a face
  uploadFace: async (imageFile, metadata = {}) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    if (metadata.name) formData.append("name", metadata.name);
    if (metadata.notes) formData.append("notes", metadata.notes);
    if (metadata.tags && metadata.tags.length > 0) {
      metadata.tags.forEach((tag) => formData.append("tags", tag));
    }

    const response = await api.post("/faces/upload/", formData);
    return response.data;
  },

  // Search for matching faces
  searchFace: async (imageFile, options = {}) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    if (options.min_similarity !== undefined) {
      formData.append("min_similarity", options.min_similarity);
    }
    if (options.max_results !== undefined) {
      formData.append("max_results", options.max_results);
    }

    const response = await api.post("/faces/search/", formData);
    return response.data;
  },

  // List all faces
  listFaces: async () => {
    const response = await api.get("/faces/list/");
    return response.data;
  },

  // Delete a face
  deleteFace: async (faceId) => {
    const response = await api.delete(`/faces/delete/${faceId}/`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/faces/health/");
    return response.data;
  },
};

export default api;
