import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  PlayArrow,
  Stop,
  Analytics,
  MusicNote
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { harmonyService } from '../api';
import { useHarmonyStore } from '../store';
import toast from 'react-hot-toast';

const AnalyzerContainer = styled(Box)`
  padding: 0;
`;

const InputCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

const ResultCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-left: 4px solid #667eea;
`;

const ChordButton = styled(Button)`
  margin: 4px;
  border-radius: 20px;
  text-transform: none;
  font-family: 'JetBrains Mono', monospace;
`;

const HarmonyAnalyzer = () => {
  const [chordInput, setChordInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { 
    currentProgression, 
    analysisResult, 
    setProgression, 
    setAnalysisResult 
  } = useHarmonyStore();

  const commonProgressions = [
    ['C', 'Am', 'F', 'G'],
    ['Dm7', 'G7', 'CM7', 'A7'],
    ['CM7', 'A7', 'Dm7', 'G7'],
    ['Bm7b5', 'E7', 'Am7', 'D7'],
    ['Em7', 'A7', 'Dm7', 'G7']
  ];

  const handleInputChange = (event) => {
    setChordInput(event.target.value);
  };

  const parseChords = (input) => {
    return input
      .split(/[,\s|]+/)
      .map(chord => chord.trim())
      .filter(chord => chord.length > 0);
  };

  const handleAnalyze = async () => {
    if (!chordInput.trim()) {
      toast.error('Digite uma progressão de acordes');
      return;
    }

    const chords = parseChords(chordInput);
    if (chords.length < 2) {
      toast.error('Digite pelo menos 2 acordes');
      return;
    }

    setIsAnalyzing(true);
    setProgression(chords);

    try {
      const result = await harmonyService.analyzeProgression(chords);
      setAnalysisResult(result);
      toast.success('Análise harmônica concluída!');
    } catch (error) {
      toast.error('Erro na análise: ' + (error.response?.data?.detail || error.message));
      console.error('Erro na análise:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickProgression = (progression) => {
    setChordInput(progression.join(' '));
    setProgression(progression);
  };

  const handleClear = () => {
    setChordInput('');
    setProgression([]);
    setAnalysisResult(null);
  };

  return (
    <AnalyzerContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          🎹 Analisador Harmônico
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Analise progressões de acordes usando a metodologia Ian Guest e princípios da Berklee
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <InputCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Digite sua progressão
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Ex: CM7 Am7 Dm7 G7"
              value={chordInput}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
              helperText="Separe os acordes por espaços ou vírgulas"
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Analytics />}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                sx={{ borderRadius: 3 }}
              >
                {isAnalyzing ? 'Analisando...' : 'Analisar'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{ borderRadius: 3 }}
              >
                Limpar
              </Button>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Progressões Comuns:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonProgressions.map((progression, index) => (
                <ChordButton
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickProgression(progression)}
                >
                  {progression.join(' - ')}
                </ChordButton>
              ))}
            </Box>
          </CardContent>
        </InputCard>
      </motion.div>

      {currentProgression.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ResultCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                🎼 Progressão Atual
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {currentProgression.map((chord, index) => (
                  <Chip
                    key={index}
                    label={chord}
                    variant="filled"
                    color="primary"
                    sx={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}
                  />
                ))}
              </Box>
            </CardContent>
          </ResultCard>
        </motion.div>
      )}

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ResultCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                📊 Análise Harmônica
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tonalidade e Escala
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Tonalidade Principal:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {analysisResult.key || 'Não identificada'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Modo:
                      </Typography>
                      <Typography variant="h6">
                        {analysisResult.mode || 'Maior'}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Funções Harmônicas
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {analysisResult.functions && analysisResult.functions.map((func, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {currentProgression[index]} → {func.roman}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {func.function}
                      </Typography>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Sugestões de Melhoria
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
                    analysisResult.suggestions.map((suggestion, index) => (
                      <Alert key={index} severity="info" sx={{ mb: 1 }}>
                        {suggestion}
                      </Alert>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sua progressão está bem estruturada harmonicamente!
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </ResultCard>
        </motion.div>
      )}
    </AnalyzerContainer>
  );
};

export default HarmonyAnalyzer;
