import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Chip } from '@mui/material';
import { MusicNote, AutoAwesome } from '@mui/icons-material';
import { useHarmonyStore } from '../store';

const ReharmonizationSystem = () => {
  const [progression, setProgression] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleReharmonize = () => {
    setSuggestions([
      'C - Am - F - G',
      'C - C7 - F - G',
      'C - A7 - Dm - G',
      'Cmaj7 - Am7 - Fmaj7 - G7'
    ]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MusicNote color="primary" />
        Sistema de Rearmonização
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Digite uma progressão para rearmonizar:
          </Typography>

          <TextField
            fullWidth
            value={progression}
            onChange={(e) => setProgression(e.target.value)}
            placeholder="Ex: C Am F G"
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={handleReharmonize} startIcon={<AutoAwesome />}>
            Gerar Rearmonizações
          </Button>

          {suggestions.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sugestões de Rearmonização:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip key={index} label={suggestion} variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReharmonizationSystem;
