import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '../api';
import { useStore } from '../store';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const ExerciseCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeedbackBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

const CorrectFeedback = styled(FeedbackBox)(({ theme }) => ({
  backgroundColor: '#e8f5e8',
  border: '2px solid #4caf50',
}));

const ErrorFeedback = styled(FeedbackBox)(({ theme }) => ({
  backgroundColor: '#ffeaea',
  border: '2px solid #f44336',
}));

const HintBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff3e0',
  border: '2px solid #ff9800',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

const ExerciseCorrector = () => {
  const { user } = useStore();
  const [selectedVolume, setSelectedVolume] = useState('volume1');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Fetch available exercises
  const { data: exerciseData, isLoading: exercisesLoading } = useQuery({
    queryKey: ['exercises', selectedVolume],
    queryFn: () => apiService.getExercises(selectedVolume),
    enabled: !!selectedVolume,
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (answerData) => apiService.correctExercise(answerData),
    onSuccess: (data) => {
      setScore(data.score);
      setTotalAttempts(prev => prev + 1);
    },
  });

  // Generate new exercise mutation
  const generateExerciseMutation = useMutation({
    mutationFn: (exerciseParams) => apiService.generateExercise(exerciseParams),
    onSuccess: (data) => {
      setCurrentExercise(data);
      setUserAnswer('');
      setShowHints(false);
    },
  });

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim() || !currentExercise) return;

    const answerData = {
      exercise_id: currentExercise.id,
      user_answer: userAnswer,
      exercise_type: currentExercise.type,
      volume: selectedVolume,
      chapter: selectedChapter,
    };

    submitAnswerMutation.mutate(answerData);
  };

  const handleGenerateExercise = () => {
    if (!selectedChapter) return;

    const exerciseParams = {
      volume: selectedVolume,
      chapter: selectedChapter,
      exercise_type: selectedExercise,
      difficulty: user?.level || 'beginner',
    };

    generateExerciseMutation.mutate(exerciseParams);
  };

  const renderExerciseContent = () => {
    if (!currentExercise) return null;

    return (
      <ExerciseCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h3">
              {currentExercise.title}
            </Typography>
            <Chip 
              label={currentExercise.difficulty} 
              color="primary" 
              size="small" 
              sx={{ ml: 'auto' }}
            />
          </Box>

          <Typography variant="body1" paragraph>
            {currentExercise.description}
          </Typography>

          {currentExercise.musical_example && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Exemplo Musical:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5', fontFamily: 'monospace' }}>
                {currentExercise.musical_example}
              </Paper>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Sua resposta"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Digite sua análise harmônica, progressão de acordes, ou resposta conforme solicitado..."
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={2} mb={2}>
            <Button
              variant="contained"
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || submitAnswerMutation.isPending}
              startIcon={<CheckCircleIcon />}
            >
              {submitAnswerMutation.isPending ? 'Corrigindo...' : 'Enviar Resposta'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setShowHints(!showHints)}
              startIcon={<LightbulbIcon />}
            >
              {showHints ? 'Ocultar Dicas' : 'Mostrar Dicas'}
            </Button>
          </Box>

          {showHints && currentExercise.hints && (
            <HintBox>
              <Typography variant="subtitle2" gutterBottom>
                <LightbulbIcon sx={{ fontSize: 16, mr: 1 }} />
                Dicas:
              </Typography>
              <List dense>
                {currentExercise.hints.map((hint, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={hint} />
                  </ListItem>
                ))}
              </List>
            </HintBox>
          )}
        </CardContent>
      </ExerciseCard>
    );
  };

  const renderCorrection = () => {
    if (!submitAnswerMutation.data) return null;

    const correction = submitAnswerMutation.data;

    return (
      <Box mt={3}>
        {correction.is_correct ? (
          <CorrectFeedback>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" color="success.main">
                Resposta Correta! 🎉
              </Typography>
            </Box>
            <Typography variant="body1">
              {correction.feedback}
            </Typography>
            {correction.score && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                Pontuação: {correction.score}/100
              </Typography>
            )}
          </CorrectFeedback>
        ) : (
          <ErrorFeedback>
            <Box display="flex" alignItems="center" mb={2}>
              <ErrorIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="error.main">
                Resposta Incorreta
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {correction.feedback}
            </Typography>

            {correction.correct_answer && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Resposta Correta:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#f0f8f0' }}>
                  <Typography variant="body2">
                    {correction.correct_answer}
                  </Typography>
                </Paper>
              </Box>
            )}

            {correction.explanation && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Explicação:
                </Typography>
                <Typography variant="body2">
                  {correction.explanation}
                </Typography>
              </Box>
            )}

            {correction.score && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                Pontuação: {correction.score}/100
              </Typography>
            )}
          </ErrorFeedback>
        )}

        {correction.next_steps && (
          <Box mt={<span class="cursor">█</span>
