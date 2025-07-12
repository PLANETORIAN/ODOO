import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Questions API functions
export const questionsAPI = {
  getAll: (params = {}) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (questionData) => api.post('/questions', questionData),
  update: (id, questionData) => api.put(`/questions/${id}`, questionData),
  delete: (id) => api.delete(`/questions/${id}`),
  getTrending: () => api.get('/questions/trending'),
  getUnanswered: () => api.get('/questions/unanswered'),
};

// Answers API functions
export const answersAPI = {
  getByQuestion: (questionId) => api.get(`/answers/question/${questionId}`),
  create: (questionId, answerData) => api.post(`/answers/${questionId}`, answerData),
  update: (id, answerData) => api.put(`/answers/${id}`, answerData),
  delete: (id) => api.delete(`/answers/${id}`),
  accept: (id) => api.put(`/answers/${id}/accept`),
  getUserAnswers: (userId) => api.get(`/answers/user/${userId}`),
};

// Votes API functions
export const votesAPI = {
  voteQuestion: (id, voteType) => api.post(`/votes/question/${id}`, { voteType }),
  voteAnswer: (id, voteType) => api.post(`/votes/answer/${id}`, { voteType }),
};

export default api; 