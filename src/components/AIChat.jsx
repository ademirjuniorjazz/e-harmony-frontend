import React, { useState, useEffect, useRef } from 'react';
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  VolumeUp as VolumeUpIcon,
  MusicNote as MusicNoteIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation } from '@tanstack/react-query';
import { harmonyService } from '../api';
import { useHarmonyStore } from '../store';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[200],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[400],
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.grey[500],
    },
  },
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: '18px',
  marginBottom: theme.spacing(1),
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser 
    ? theme.palette.primary.main 
    : theme.palette.background.paper,
  color: isUser 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  border: isUser 
    ? 'none' 
    : `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
}));

const PremiumOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  zIndex: 1000,
  borderRadius: theme.shape.borderRadius,
}));

const AIChat = () => {
const { user } = useHarmonyStore();
const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  // Check if user has premium access
  const isPremium = user?.subscription?.plan === 'premium';
  const dailyQuestionsUsed = user?.usage?.daily_questions || 0;
  const dailyQuestionLimit = 5; // Free tier limit

  // Load chat history
  const { data: chatHistoryData } = useQuery({
    queryKey: ['chatHistory', user?.id],
    apiService.getChatHistory → harmonyService.chatWithAI
    enabled: !!user?.id,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => apiService.sendChatMessage(messageData),
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        metadata: response.metadata,
        suggestions: response.suggestions,
      }]);
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      // Handle error
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (chatHistoryData) {
      setChatHistory(chatHistoryData.conversations || []);
    }
  }, [chatHistoryData]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Check premium access for unlimited questions
    if (!isPremium && dailyQuestionsUsed >= dailyQuestionLimit) {
      setUpgradeDialogOpen(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    const messageData = {
      message: inputMessage,
      chat_id: currentChatId,
      context: {
        user_level: user?.level || 'intermediate',
        previous_messages: messages.slice(-5), // Last 5 messages for context
      },
    };

    sendMessageMutation.mutate(messageData);
    setInputMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleLoadChat = (chat) => {
    setMessages(chat.messages || []);
    setCurrentChatId(chat.id);
    setMenuAnchorEl(null);
  };

  const handleRateMessage = (messageId, rating) => {
    // Implement message rating
    setSelectedMessageId(null);
  };

  const renderWelcomeMessage = () => (
    <Box p={3} textAlign="center">
      <Avatar
        sx={{ 
          width: 80, 
          height: 80, 
          margin: '0 auto 16px',
          bgcolor: 'primary.main' 
        }}
      >
        <SmartToyIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h5" gutterBottom>
        Assistente de Harmonia IA
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Olá! Sou seu assistente pessoal de harmonia musical. Posso ajudar com:
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <SchoolIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Teoria Musical
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explicações sobre acordes, escalas, progressões e análise harmônica
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <PsychologyIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Análise de Músicas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Análise harmônica de songs, identificação de padrões e técnicas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          Faça uma pergunta para começar nossa conversa!
        </Typography>
      </Box>
    </Box>
  );

  const renderMessage = (message) => (
    <Box 
      key={message.id}
      display="flex" 
      flexDirection="column"
      alignItems={message.isUser ? 'flex-end' : 'flex-start'}
      mb={1}
    >
      <Box display="flex" alignItems="flex-end" gap={1} width="100%">
        {!message.isUser && (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <SmartToyIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}

        <Box flex={1} display="flex" flexDirection="column">
          <MessageBubble isUser={message.isUser}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>

            {message.metadata && (
              <Box mt={1}>
                {message.metadata.musical_examples && (
                  <Paper sx={{ p: 1, mt: 1, bgcolor: 'rgba(255,255,255,0.1)' }}>
                    <Typography variant="caption" display="block">
                      Exemplo Musical:
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {message.metadata.musical_examples}
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </MessageBubble>

          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              mt: 0.5,
              px: 1
            }}
          >
            {formatDistanceToNow(message.timestamp, { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </Typography>

          {message.suggestions && message.suggestions.length > 0 && (
            <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
              {message.suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  size="small"
                  variant="outlined"
                  onClick={() => setInputMessage(suggestion)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
        </Box>

        {message.isUser && (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            <PersonIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}
      </Box>
    </Box>
  );

  const renderPremiumOverlay = () => (
    <PremiumOverlay>
      <LockIcon sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h5" gutterBottom textAlign="center">
        Limite de Perguntas Diárias Atingido
      </Typography>
      <Typography variant="body1" textAlign="center" mb={3}>
        Você já usou suas {dailyQuestionLimit} perguntas gratuitas hoje.
        <br />
        Upgrade para Premium e tenha acesso ilimitado!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<UpgradeIcon />}
        onClick={() => setUpgradeDialogOpen(true)}
        size="large"
      >
        Fazer Upgrade
      </Button>
    </PremiumOverlay>
  );

  const renderUpgradeDialog = () => (
    <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon color="primary" />
          Upgrade para Premium
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography paragraph>
          Com o plano Premium, você terá:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="✓ Perguntas ilimitadas 24/7" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Respostas mais detalhadas e personalizadas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Análises harmônicas avançadas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Exemplos musicais interativos" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Histórico completo de conversas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✓ Prioridade no suporte" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUpgradeDialogOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary">
          Assinar Premium - R$ 29,90/mês
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <StyledPaper>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              <QuestionAnswerIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
              Chat com IA - Assistente de Harmonia
            </Typography>
            <Typography variant="subtitle1">
              Tire suas dúvidas sobre teoria musical, harmonia e composição com nosso assistente inteligente.
            </Typography>
          </Box>

          {!isPremium && (
            <Box textAlign="center">
              <Typography variant="body2" gutterBottom>
                Perguntas hoje: {dailyQuestionsUsed}/{dailyQuestionLimit}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<UpgradeIcon />}
                onClick={() => setUpgradeDialogOpen(true)}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Premium
              </Button>
            </Box>
          )}
        </Box>
      </StyledPaper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                Conversas
              </Typography>
              <Button
                size="small"
                startIcon={<QuestionAnswerIcon />}
                onClick={handleNewChat}
              >
                Nova
              </Button>
            </Box>

            <List>
              {chatHistory.map((chat) => (
                <ListItem
                  key={chat.id}
                  button
                  onClick={() => handleLoadChat(chat)}
                  selected={chat.id === currentChatId}
                >
                  <ListItemText
                    primary={chat.title || 'Conversa sem título'}
                    secondary={formatDistanceToNow(new Date(chat.updated_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ height: '600px', position: 'relative' }}>
            {/* Premium Overlay for Free Users */}
            {!isPremium && dailyQuestionsUsed >= dailyQuestionLimit && renderPremiumOverlay()}

            <ChatContainer>
              <MessagesContainer>
                {messages.length === 0 ? (
                  renderWelcomeMessage()
                ) : (
                  messages.map(renderMessage)
                )}

                {isTyping && (
                  <Box display="flex" alignItems="center" gap={1} p={2}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <SmartToyIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Assistente está digitando...
                      </Typography>
                    </Box>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </MessagesContainer>

              <InputContainer>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Digite sua pergunta sobre harmonia musical..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={(!isPremium && dailyQuestionsUsed >= dailyQuestionLimit) || sendMessageMutation.isPending}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending || (!isPremium && dailyQuestionsUsed >= dailyQuestionLimit)}
                  size="large"
                >
                  <SendIcon />
                </IconButton>
              </InputContainer>
            </ChatContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Help Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Exemplos de Perguntas
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Teoria Musical Básica</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Como formar acordes de sétima?" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Quais são os graus do campo harmônico maior?" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Como identificar a tonalidade de uma música?" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Análise Harmônica</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Analise a progressão: Am - F - C - G" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Como rearmonizar esta sequência?" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Que escalas usar para improvisar?" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Paper>

      {renderUpgradeDialog()}
    </Box>
  );
};

export default AIChat;
