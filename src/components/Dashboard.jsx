import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Piano,
  Assignment,
  TrendingUp,
  Chat,
  PlayArrow,
  Refresh,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore, useHarmonyStore, useUIStore } from '../../context/store';
import { harmonyService } from '../../services/api';

const DashboardContainer = styled(Box)`
  padding: 0;
`;

const WelcomeCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const StatsCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  }
`;

const QuickActionCard = styled(Card)`
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }
`;

const ProgressCard = styled(Card)`
  border-radius: 16px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
`;

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { setActiveSection } = useUIStore();
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = {
    exercisesCompleted: 23,
    totalExercises: 45,
    averageScore: 87,
    streakDays: 7
  };

  const quickActions = [
    {
      id: 'analyzer',
      title: 'Analisador Harmônico',
      description: 'Analise progressões de acordes',
      icon: Piano,
      color: '#667eea'
    },
    {
      id: 'exercises',
      title: 'Exercícios',
      description: 'Pratique teoria musical',
      icon: Assignment,
      color: '#48bb78'
    },
    {
      id: 'reharmonization',
      title: 'Rearmonização',
      description: 'Descubra novas possibilidades',
      icon: Refresh,
      color: '#ed8936'
    },
    {
      id: 'chat',
      title: 'Plantão IA',
      description: 'Tire suas dúvidas 24/7',
      icon: Chat,
      color: '#9f7aea',
      premium: true
    }
  ];

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        const data = await harmonyService.getDemoData();
        setDemoData(data);
      } catch (error) {
        console.error('Erro ao carregar dados demo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  const handleQuickAction = (actionId) => {
    setActiveSection(actionId);
  };

  const isPremium = user?.subscription === 'premium';

  return (
    <DashboardContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeCard>
          <CardContent sx={{ p: 4 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {isAuthenticated ? `Bem-vindo, ${user?.name}!` : 'Bem-vindo ao E-harmony!'}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Sua jornada musical com a metodologia Ian Guest
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="🎹 Harmonia Funcional" 
                    variant="outlined" 
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  />
                  <Chip 
                    label="🎵 Berklee Method" 
                    variant="outlined" 
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  />
                  <Chip 
                    label="🚀 IA Especializada" 
                    variant="outlined" 
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: '2rem',
                      margin: '0 auto'
                    }}
                  >
                    🎼
                  </Avatar>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </WelcomeCard>
      </motion.div>

      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Exercícios Completos
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight={600}>
                    {stats.exercisesCompleted}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    de {stats.totalExercises} total
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Média de Pontuação
                  </Typography>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    {stats.averageScore}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.averageScore} 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Sequência Atual
                  </Typography>
                  <Typography variant="h4" color="warning.main" fontWeight={600}>
                    {stats.streakDays}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    dias consecutivos
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ProgressCard>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Status
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {isPremium ? '⭐ Premium' : '🆓 Freemium'}
                  </Typography>
                  {!isPremium && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ mt: 1 }}
                      onClick={() => setActiveSection('upgrade')}
                    >
                      Upgrade
                    </Button>
                  )}
                </CardContent>
              </ProgressCard>
            </Grid>
          </Grid>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Ações Rápidas
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            const isLocked = action.premium && !isPremium;

            return (
              <Grid item xs={12} sm={6} md={3} key={action.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <QuickActionCard
                    onClick={() => !isLocked && handleQuickAction(action.id)}
                    sx={{ opacity: isLocked ? 0.6 : 1 }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: action.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          position: 'relative'
                        }}
                      >
                        <IconComponent sx={{ color: 'white', fontSize: 28 }} />
                        {action.premium && (
                          <Star 
                            sx={{ 
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              color: '#ffc107',
                              fontSize: 16,
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              padding: '2px'
                            }} 
                          />
                        )}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {action.description}
                      </Typography>
                      {isLocked && (
                        <Chip 
                          label="🔒 Premium" 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </QuickActionCard>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    </DashboardContainer>
  );
};

export default Dashboard;