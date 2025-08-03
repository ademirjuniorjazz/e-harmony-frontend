import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Components
import Layout from './components/common/Layout';
import HarmonyAnalyzer from './components/harmony/HarmonyAnalyzer';
import ExerciseCorrector from './components/exercises/ExerciseCorrector';
import ReharmonizationSystem from './components/reharmonization/ReharmonizationSystem';
import ImprovisationConsultant from './components/improvisation/ImprovisationConsultant';
import AIChat from './components/chat/AIChat';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create Material-UI Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f73378',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Loading Component
const LoadingSpinner = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Loading = () => (
  <LoadingSpinner>
    <CircularProgress size={60} />
    <span>Carregando...</span>
  </LoadingSpinner>
);

// Home Page Component
const HomePage = () => (
  <Box sx={{ p: 3 }}>
    <h1>Bem-vindo ao E-Harmony</h1>
    <p>Sistema completo de ensino de harmonia musical baseado na metodologia Ian Guest.</p>

    <Box sx={{ mt: 4 }}>
      <h2>Funcionalidades Disponíveis:</h2>
      <ul>
        <li><strong>Analisador de Harmonia:</strong> Análise automática de progressões de acordes</li>
        <li><strong>Corretor de Exercícios:</strong> Sistema de correção baseado na metodologia Ian Guest</li>
        <li><strong>Sistema de Rearmonização:</strong> Sugestões inteligentes de rearmonização</li>
        <li><strong>Consultor de Improvisação:</strong> Escalas e técnicas para improvisação</li>
        <li><strong>Chat com IA:</strong> Assistente inteligente para dúvidas 24/7 (Premium)</li>
      </ul>
    </Box>

    <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
      <h3>🎵 Sistema Completo de Harmonia</h3>
      <p>
        Desenvolvido com base nos 3 volumes da metodologia Ian Guest e princípios 
        da Berklee School of Music, oferecendo uma experiência de aprendizado 
        completa e progressiva.
      </p>
    </Box>
  </Box>
);

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/harmony" element={<HarmonyAnalyzer />} />
                <Route path="/exercises" element={<ExerciseCorrector />} />
                <Route path="/reharmonization" element={<ReharmonizationSystem />} />
                <Route path="/improvisation" element={<ImprovisationConsultant />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;