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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Switch,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MusicNote as MusicNoteIcon,
  Piano as PianoIcon,
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  VolumeUp as VolumeUpIcon,
  Shuffle as ShuffleIcon,
  Loop as LoopIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { useStore } from '../../store/useStore';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
  color: 'white',
}));

const ScaleCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  border: '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  },
  '&.selected': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.action.selected,
  },
}));

const ChordProgressionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  fontFamily: 'monospace',
  fontSize: '16px',
  textAlign: 'center',
  border: '2px solid #ddd',
  marginBottom: theme.spacing(2),
}));

const NoteBox = styled(Box)(({ theme, isActive, isChordTone }) => ({
  display: 'inline-block',
  padding: theme.spacing(1),
  margin: theme.spacing(0.25),
  minWidth: '40px',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  border: '2px solid',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isActive 
    ? theme.palette.primary.main 
    : isChordTone 
      ? theme.palette.secondary.light
      : theme.palette.grey[200],
  color: isActive 
    ? 'white' 
    : isChordTone 
      ? 'white'
      : theme.palette.text.primary,
  borderColor: isActive 
    ? theme.palette.primary.dark 
    : isChordTone 
      ? theme.palette.secondary.main
      : theme.palette.grey[400],
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[2],
  },
}));

const ImprovisationConsultant = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const [chordProgression, setChordProgression] = useState('');
  const [selectedKey, setSelectedKey] = useState('C');
  const [tempo, setTempo] = useState(120);
  const [playbackMode, setPlaybackMode] = useState('chord');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [selectedScales, setSelectedScales] = useState([]);
  const [scaleOptions, setScaleOptions] = useState([]);
  const [practiceMode, setPracticeMode] = useState('guided');
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [showScaleNotes, setShowScaleNotes] = useState(true);
  const [highlightChordTones, setHighlightChordTones] = useState(true);

  // Fetch scale suggestions for chord progression
  const scaleAnalysisMutation = useMutation({
    mutationFn: (analysisData) => apiService.getImprovisationSuggestions(analysisData),
    onSuccess: (data) => {
      setScaleOptions(data.scales);
      setSelectedScales(data.recommended_scales || []);
    },
  });

  // Generate practice patterns
  const practicePatternMutation = useMutation({
    mutationFn: (patternData) => apiService.generatePracticePatterns(patternData),
  });

  const handleAnalyzeProgression = () => {
    if (!chordProgression.trim()) return;

    const analysisData = {
      progression: chordProgression,
      key: selectedKey,
      tempo: tempo,
      difficulty: difficultyLevel,
      user_level: user?.level || 'intermediate',
    };

    scaleAnalysisMutation.mutate(analysisData);
  };

  const handleScaleSelect = (scale) => {
    setSelectedScales(prev => {
      if (prev.find(s => s.name === scale.name)) {
        return prev.filter(s => s.name !== scale.name);
      }
      return [...prev, scale];
    });
  };

  const isScaleSelected = (scale) => {
    return selectedScales.some(s => s.name === scale.name);
  };

  const renderScaleOptions = () => {
    if (scaleOptions.length === 0) {
      return (
        <Alert severity="info">
          Digite uma progressão de acordes e clique em "Analisar" para ver sugestões de escalas.
        </Alert>
      );
    }

    return (
      <Grid container spacing={2}>
        {scaleOptions.map((scale, index) => (
          <Grid item xs={12} md={6} key={index}>
            <ScaleCard 
              className={isScaleSelected(scale) ? 'selected' : ''}
              onClick={() => handleScaleSelect(scale)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="h6">
                    {scale.name}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip 
                      label={`Adequação: ${scale.suitability}%`} 
                      color="primary" 
                      size="small" 
                    />
                    <Chip 
                      label={scale.difficulty} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  {scale.description}
                </Typography>

                {showScaleNotes && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Notas da Escala:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {scale.notes.map((note, noteIndex) => {
                        const isChordTone = scale.chord_tones?.includes(note);
                        return (
                          <NoteBox 
                            key={noteIndex}
                            isChordTone={highlightChordTones && isChordTone}
                          >
                            {note}
                          </NoteBox>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Aplicação:</strong> {scale.application_context}
                  </Typography>
                </Box>
              </CardContent>
            </ScaleCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderInputTab = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Progressão de Acordes"
            value={chordProgression}
            onChange={(e) => setChordProgression(e.target.value)}
            placeholder="Ex: C | Am | F | G | C | Am | Dm | G"
            helperText="Digite a progressão usando símbolos de acordes separados por barras ou espaços"
            sx={{ mb: 3 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tonalidade</InputLabel>
            <Select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              label="Tonalidade"
            >
              {['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'].map(key => (
                <MenuItem key={key} value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Tempo (BPM)"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            inputProps={{ min: 60, max: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Nível de Dificuldade</InputLabel>
            <Select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              label="Nível de Dificuldade"
            >
              <MenuItem value={1}>Iniciante</MenuItem>
              <MenuItem value={2}>Básico</MenuItem>
              <MenuItem value={3}>Intermediário</MenuItem>
              <MenuItem value={4}>Avançado</MenuItem>
              <MenuItem value={5}>Profissional</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<AssessmentIcon />}
            onClick={handleAnalyzeProgression}
            disabled={!chordProgression.trim() || scaleAnalysisMutation.isPending}
            sx={{ mt: 2 }}
          >
            {scaleAnalysisMutation.isPending ? 'Analisando...' : 'Analisar Progressão'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderScalesTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Escalas Sugeridas para Improvisação
        </Typography>
        <Box display="flex" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={showScaleNotes}
                onChange={(e) => setShowScaleNotes(e.target.checked)}
              />
            }
            label="Mostrar Notas"
          />
          <FormControlLabel
            control={
              <Switch
                checked={highlightChordTones}
                onChange={(e) => setHighlightChordTones(e.target.checked)}
              />
            }
            label="Destacar Notas dos Acordes"
          />
        </Box>
      </Box>

      {chordProgression && (
        <ChordProgressionBox>
          <Typography variant="subtitle1" gutterBottom>
            Progressão Atual:
          </Typography>
          <Typography variant="h6">
            {chordProgression}
          </Typography>
        </ChordProgressionBox>
      )}

      {renderScaleOptions()}
    </Box>
  );

  const renderPracticeTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sessão de Prática
      </Typography>

      {selectedScales.length === 0 ? (
        <Alert severity="warning">
          Selecione pelo menos uma escala na aba "Escalas" para iniciar a prática.
        </Alert>
      ) : (
        <Box>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Modo de Prática</FormLabel>
                <RadioGroup
                  value={practiceMode}
                  onChange={(e) => setPracticeMode(e.target.value)}
                >
                  <FormControlLabel value="guided" control={<Radio />} label="Guiada (com sugestões)" />
                  <FormControlLabel value="free" control={<Radio />} label="Livre (sem sugestões)" />
                  <FormControlLabel value="patterns" control={<Radio />} label="Padrões específicos" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Modo de Reprodução</FormLabel>
                <RadioGroup
                  value={playbackMode}
                  onChange={(e) => setPlaybackMode(e.target.value)}
                >
                  <FormControlLabel value="chord" control={<Radio />} label="Apenas acordes" />
                  <FormControlLabel value="backing" control={<Radio />} label="Base completa" />
                  <FormControlLabel value="metronome" control={<Radio />} label="Apenas metrônomo" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Box display="flex" gap={2} mb={3}>
            <Button
              variant={isPlaying ? "outlined" : "contained"}
              startIcon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
              onClick={() => setIsPlaying(!isPlaying)}
              size="large"
            >
              {isPlaying ? 'Parar' : 'Iniciar Prática'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShuffleIcon />}
              onClick={() => {/* Shuffle chord order */}}
            >
              Embaralhar
            </Button>
            <Button
              variant="outlined"
              startIcon={<LoopIcon />}
              onClick={() => {/* Toggle loop mode */}}
            >
              Loop
            </Button>
          </Box>

          {isPlaying && (
            <Box mb={3}>
              <Typography variant="body2" gutterBottom>
                Progresso da Sessão
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={((currentChordIndex + 1) / chordProgression.split(/[\s|]+/).length) * 100} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Acorde {currentChordIndex + 1} de {chordProgression.split(/[\s|]+/).length}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            {selectedScales.map((scale, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {scale.name}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                      {scale.notes.map((note, noteIndex) => (
                        <NoteBox key={noteIndex}>
                          {note}
                        </NoteBox>
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {scale.practice_tips}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );

  const renderLearningTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Guia de Improvisação
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" startIcon={<SchoolIcon />}>
            Princípios Básicos da Improvisação
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon><MusicNoteIcon /></ListItemIcon>
              <ListItemText 
                primary="Conhecimento de Escalas"
                secondary="Domine as escalas adequadas para cada tipo de acorde e progressão harmônica"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><TimelineIcon /></ListItemIcon>
              <ListItemText 
                primary="Fraseado Musical"
                secondary="Desenvolva frases musicais coerentes com início, desenvolvimento e conclusão"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><SpeedIcon /></ListItemIcon>
              <ListItemText 
                primary="Timing e Ritmo"
                secondary="Mantenha o tempo e explore diferentes subdivisões rítmicas"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Escalas por Função Harmônica
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body2" paragraph>
              <strong>Função Tônica (I, vi):</strong> Escala maior, pentatônica maior, modos jônico e eólio
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Função Subdominante (ii, IV):</strong> Modo dórico, escala menor natural, pentatônica menor
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Função Dominante (V, V7):</strong> Modo mixolídio, escala blues, pentatônica menor
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Acordes Diminutos:</strong> Escala diminuta, cromática
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Técnicas de Improvisação Avançadas
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText primary="• Uso de notas de aproximação cromática" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Superimposição de tríades e tétrades" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Aplicação de escalas simétricas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Uso de intervalos amplos e saltos melódicos" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Técnicas de desenvolvimento motívico" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <Box>
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          <PianoIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Consultor de Improvisação
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Sistema inteligente para análise harmônica e sugestões de escalas para improvisação musical.
        </Typography>
      </StyledPaper>

      <Paper sx={{ p: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, value) => setActiveTab(value)}
          variant="fullWidth"
        >
          <Tab label="Configuração" />
          <Tab label="Escalas" />
          <Tab label="Prática" />
          <Tab label="Aprendizado" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderInputTab()}
          {activeTab === 1 && renderScalesTab()}
          {activeTab === 2 && renderPracticeTab()}
          {activeTab === 3 && renderLearningTab()}
        </Box>
      </Paper>
    </Box>
  );
};

export default ImprovisationConsultant;