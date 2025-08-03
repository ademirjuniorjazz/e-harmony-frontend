import { create } from 'zustand';
import { authService, userService } from './api';

// ============ AUTH STORE ============
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Ações de autenticação
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erro ao fazer login',
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(userData);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erro ao registrar',
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: () => {
    const isAuth = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    set({ isAuthenticated: isAuth, user });
  },

  clearError: () => set({ error: null })
}));

// ============ HARMONY STORE ============
export const useHarmonyStore = create((set, get) => ({
  currentProgression: [],
  analysisResult: null,
  exerciseResult: null,
  reharmonizationSuggestions: [],
  improvisationGuide: null,
  chatMessages: [],
  isAnalyzing: false,

  // Ações de harmonia
  setProgression: (chords) => {
    set({ currentProgression: chords });
  },

  setAnalysisResult: (result) => {
    set({ analysisResult: result });
  },

  setExerciseResult: (result) => {
    set({ exerciseResult: result });
  },

  setReharmonization: (suggestions) => {
    set({ reharmonizationSuggestions: suggestions });
  },

  setImprovisationGuide: (guide) => {
    set({ improvisationGuide: guide });
  },

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, message]
    }));
  },

  clearChatMessages: () => {
    set({ chatMessages: [] });
  },

  setAnalyzing: (isAnalyzing) => {
    set({ isAnalyzing });
  }
}));

// ============ UI STORE ============
export const useUIStore = create((set) => ({
  theme: 'light',
  sidebar: {
    isOpen: true,
    activeSection: 'dashboard'
  },
  modals: {
    login: false,
    register: false,
    upgrade: false
  },
  notifications: [],

  // Ações de UI
  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light'
    }));
  },

  toggleSidebar: () => {
    set((state) => ({
      sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen }
    }));
  },

  setActiveSection: (section) => {
    set((state) => ({
      sidebar: { ...state.sidebar, activeSection: section }
    }));
  },

  openModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true }
    }));
  },

  closeModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false }
    }));
  },

  closeAllModals: () => {
    set((state) => ({
      modals: Object.keys(state.modals).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
    }));
  },

  addNotification: (notification) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }));

    // Auto remove após 5 segundos
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 5000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
}));

// ============ EXERCISE STORE ============
export const useExerciseStore = create((set, get) => ({
  currentExercise: null,
  exercises: [],
  userProgress: {},
  stats: {
    totalExercises: 0,
    completedExercises: 0,
    averageScore: 0
  },

  // Ações de exercícios
  setCurrentExercise: (exercise) => {
    set({ currentExercise: exercise });
  },

  setExercises: (exercises) => {
    set({ exercises });
  },

  updateProgress: (exerciseId, result) => {
    set((state) => ({
      userProgress: {
        ...state.userProgress,
        [exerciseId]: result
      }
    }));
  },

  updateStats: (stats) => {
    set({ stats });
  }
}));
