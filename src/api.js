import axios from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ============ SERVIÇOS DE HARMONIA ============

export const harmonyService = {
  // Analisar progressão harmônica
  analyzeProgression: async (chords) => {
    const response = await api.post('/analyze-progression', { chords });
    return response.data;
  },

  // Corrigir exercício
  correctExercise: async (exerciseData) => {
    const response = await api.post('/correct-exercise', exerciseData);
    return response.data;
  },

  // Sugestões de rearmonização
  reharmonize: async (progression, style = 'jazz') => {
    const response = await api.post('/reharmonize', { progression, style });
    return response.data;
  },

  // Consultor de improvisação
  getImprovisationGuide: async (chords) => {
    const response = await api.post('/improvisation-guide', { chords });
    return response.data;
  },

  // Chat IA
  chatWithAI: async (message, context = {}) => {
    const response = await api.post('/harmony-chat', { message, context });
    return response.data;
  },

  // Buscar conceitos
  getConcepts: async (volume = null) => {
    const params = volume ? { volume } : {};
    const response = await api.get('/concepts', { params });
    return response.data;
  },

  // Buscar exercícios
  getExercises: async (type = null, difficulty = null) => {
    const params = {};
    if (type) params.type = type;
    if (difficulty) params.difficulty = difficulty;
    const response = await api.get('/exercises', { params });
    return response.data;
  },

  // Demo completo
  getDemoData: async () => {
    const response = await api.get('/demo');
    return response.data;
  }
};

// ============ SERVIÇOS DE AUTENTICAÇÃO ============

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// ============ SERVIÇOS DE USUÁRIO ============

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/user/progress');
    return response.data;
  },

  saveExerciseResult: async (exerciseId, result) => {
    const response = await api.post('/user/exercise-results', {
      exerciseId,
      result
    });
    return response.data;
  }
};

// ============ SERVIÇOS DE PAGAMENTO ============

export const paymentService = {
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  subscribe: async (planId, paymentMethod) => {
    const response = await api.post('/subscribe', {
      planId,
      paymentMethod
    });
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get('/user/subscription');
    return response.data;
  }
};

export default api;