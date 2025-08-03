import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { Chat, Send } from '@mui/icons-material';
import { useHarmonyStore } from '../store';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Olá! Sou seu assistente de harmonia musical. Como posso ajudar?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMessage = { id: Date.now(), type: 'user', text: message };
    const botResponse = { id: Date.now() + 1, type: 'bot', text: 'Esta funcionalidade estará disponível em breve!' };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setMessage('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chat color="primary" />
        Chat IA - Assistente Musical
      </Typography>

      <Card sx={{ mb: 2, height: '400px', overflow: 'auto' }}>
        <CardContent>
          <List>
            {messages.map(msg => (
              <ListItem key={msg.id} sx={{ 
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: msg.type === 'user' ? 'primary.main' : 'grey.100',
                  color: msg.type === 'user' ? 'white' : 'black',
                  maxWidth: '70%'
                }}>
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua pergunta sobre harmonia..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} startIcon={<Send />}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default AIChat;
