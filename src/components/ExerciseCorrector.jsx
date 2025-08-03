import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { School, CheckCircle } from '@mui/icons-material';
import { useHarmonyStore } from '../store';

const ExerciseCorrector = () => {
  const [selectedVolume, setSelectedVolume] = useState('volume1');
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    setShowResult(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <School color="primary" />
        Corretor de Exercícios
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Volume Ian Guest</InputLabel>
            <Select value={selectedVolume} onChange={(e) => setSelectedVolume(e.target.value)} label="Volume Ian Guest">
              <MenuItem value="volume1">Volume 1 - Harmonia Básica</MenuItem>
              <MenuItem value="volume2">Volume 2 - Harmonia Modal</MenuItem>
              <MenuItem value="volume3">Volume 3 - Harmonia Avançada</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" gutterBottom>
            Exercício: Análise da Progressão Cmaj7 - Am7 - Dm7 - G7
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Analise a função harmônica de cada acorde na tonalidade de C maior:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Ex: Cmaj7 (I7M), Am7 (VIm7), Dm7 (IIm7), G7 (V7)"
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={handleSubmit} startIcon={<CheckCircle />}>
            Corrigir Exercício
          </Button>

          {showResult && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Resposta correta!</strong> Cmaj7 (I7M) - Am7 (VIm7) - Dm7 (IIm7) - G7 (V7)
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExerciseCorrector;
