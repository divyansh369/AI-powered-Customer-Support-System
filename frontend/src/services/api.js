import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const chatAPI = {
  sendMessage: async (message, conversationId = null) => {
    const response = await axios.post(`${API_BASE}/chat/messages`, {
      message,
      conversationId
    });
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await axios.get(`${API_BASE}/conversations/${conversationId}`);
    return response.data;
  },

  getConversations: async () => {
    const response = await axios.get(`${API_BASE}/conversations`);
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await axios.delete(`${API_BASE}/conversations/${conversationId}`);
    return response.data;
  }
};