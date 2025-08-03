import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useHarmonyStore } from '../store';

const ImprovisationConsultant = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Consultor de Improvisação</Typography>
      <Card>
        <CardContent>
          <Typography>Em desenvolvimento...</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImprovisationConsultant;
