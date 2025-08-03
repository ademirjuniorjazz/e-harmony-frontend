import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import { useHarmonyStore } from '../store';

const ImprovisationConsultant = () => {
  const { currentProgression } = useHarmonyStore();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        🎼 Consultor de Improvisação
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Em desenvolvimento...
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Esta funcionalidade estará disponível em breve para ajudar com improvisação musical.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImprovisationConsultant;
