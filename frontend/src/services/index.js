import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const userService = {
  updateProfile: async (profileData) => {
    const response = await api.post('/users/profile', profileData);
    return response.data;
  },

  updateBasicProfile: async (basicData) => {
    const response = await api.put('/users/profile/basic', basicData);
    return response.data;
  },

  updateSkills: async (skills) => {
    const response = await api.put('/users/profile/skills', { skills });
    return response.data;
  },

  updateRequirements: async (lookingFor) => {
    const response = await api.put('/users/profile/requirements', { lookingFor });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users/all');
    return response.data;
  },
};

export const matchService = {
  findMatches: async () => {
    const response = await api.post('/match/find');
    return response.data;
  },

  getPotentialMatches: async () => {
    const response = await api.post('/match/find');
    return response.data;
  },

  connectWithUser: async (targetUserId) => {
    const response = await api.post('/match/connect', { targetUserId });
    return response.data;
  },

  passOnUser: async (targetUserId) => {
    const response = await api.post('/match/pass', { targetUserId });
    return response.data;
  },

  getMyMatches: async () => {
    const response = await api.get('/match/my');
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/match/requests');
    return response.data;
  },

  getSentRequests: async () => {
    const response = await api.get('/match/sent');
    return response.data;
  },
};

export const chatService = {
  getChatMessages: async (matchId) => {
    const response = await api.get(`/chat/${matchId}`);
    return response.data;
  },

  getMessages: async (matchId) => {
    const response = await api.get(`/chat/${matchId}`);
    return response.data;
  },

  sendMessage: async (matchId, text) => {
    const response = await api.post(`/chat/${matchId}`, { text });
    return response.data;
  },
};
