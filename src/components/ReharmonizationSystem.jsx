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
  Slider,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MusicNote as MusicNoteIcon,
  AutoFixHigh as AutoFixHighIcon,
  Palette as PaletteIcon,
  Psychology as PsychologyIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation } from '@tanstack/react-query';
import { harmonyService } from '../api';
import { useHarmonyStore } from '../store';
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const ReharmonizationCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const ChordBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  fontFamily: 'monospace',
  fontSize: '14px',
  display: 'inline-block',
  minWidth: '60px',
  textAlign: 'center',
  border: '1px solid #ddd',
}));

const OriginalChord = styled(ChordBox)(({ theme }) => ({
  backgroundColor: '#e3f2fd',
  borderColor: '#2196f3',
}));

const ReharmonizedChord = styled(ChordBox)(({ theme }) => ({
  backgroundColor: '#f3e5f5',
  borderColor: '#9c27b0',
}));

const TechniqueChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.25),
  fontSize: '12px',
}));

const ReharmonizationSystem = () => {
const { user } = useHarmonyStore();
  const [activeTab, setActiveTab] = useState(0);
  const [originalProgression, setOriginalProgression] = useState('');
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedStyle, setSelectedStyle] = useState('jazz');
  const [complexityLevel, setComplexityLevel] = useState(3);
  const [useModalInterchange, setUseModalInterchange] = useState(true);
  const [useTritoneSubstitution, setUseTritoneSubstitution] = useState(true);
  const [useChromatic, setUseChromatic] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [reharmonizations, setReharmonizations] = useState([]);
  const [selectedReharmonization, setSelectedReharmonization] = useState(null);

  // Fetch reharmonization suggestions
  const reharmonizeMutation = useMutation({
    apiService.getReharmonization → harmonyService.reharmonize
    onSuccess: (data) => {
      setReharmonizations(data.suggestions);
      setCurrentStep(1);
    },
  });

  // Save reharmonization
  const saveReharmonizationMutation = useMutation({
    mutationFn: (saveData) => apiService.saveReharmonization(saveData),
  });

  const handleReharmonize = () => {
    if (!originalProgression.trim()) return;

    const reharmonizeData = {
      progression: originalProgression,
      key: selectedKey,
      style: selectedStyle,
      complexity: complexityLevel,
      techniques: {
        modal_interchange: useModalInterchange,
        tritone_substitution: useTritoneSubstitution,
        chromatic_approach: useChromatic,
      },
      user_level: user?.level || 'intermediate',
    };

    reharmonizeMutation.mutate(reharmonizeData);
  };

  const handleSaveReharmonization = (reharmonization) => {
    const saveData = {
      original_progression: originalProgression,
      reharmonized_progression: reharmonization.progression,
      techniques_used: reharmonization.techniques,
      key: selectedKey,
      style: selectedStyle,
      title: `Reharmonização em ${selectedKey} - ${selectedStyle}`,
    };

    saveReharmonizationMutation.mutate(saveData);
  };

  const renderProgressionComparison = (reharmonization) => {
    const originalChords = originalProgression.split(/[\s,|]+/).filter(chord => chord.trim());
    const reharmonizedChords = reharmonization.progression.split(/[\s,|]+/).filter(chord => chord.trim());

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Progressão Original:
        </Typography>
        <Box display="flex" flexWrap="wrap" mb={2}>
          {originalChords.map((chord, index) => (
            <OriginalChord key={`orig-${index}`}>
              {chord}
            </OriginalChord>
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Progressão Rearmonizada:
        </Typography>
        <Box display="flex" flexWrap="wrap" mb={2}>
          {reharmonizedChords.map((chord, index) => (
            <ReharmonizedChord key={`rehar-${index}`}>
              {chord}
            </ReharmonizedChord>
          ))}
        </Box>
      </Box>
    );
  };

  const renderTechniquesUsed = (techniques) => {
    return (
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Técnicas Utilizadas:
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {techniques.map((technique, index) => (
            <TechniqueChip
              key={index}
              label={technique}
              color="secondary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderReharmonizationCard = (reharmonization, index) => {
    return (
      <ReharmonizationCard key={index}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
            <Typography variant="h6">
              Opção {index + 1}
            </Typography>
            <Box display="flex" gap={1}>
              <Chip 
                label={`Complexidade: ${reharmonization.complexity}/5`} 
                color="primary" 
                size="small" 
              />
              <Chip 
                label={`Adequação: ${reharmonization.suitability}%`} 
                color="success" 
                size="small" 
              />
            </Box>
          </Box>

          {renderProgressionComparison(reharmonization)}

          <Typography variant="body2" paragraph sx={{ mt: 2 }}>
            <strong>Análise:</strong> {reharmonization.analysis}
          </Typography>

          {reharmonization.voice_leading_notes && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Condução de Vozes:</strong> {reharmonization.voice_leading_notes}
              </Typography>
            </Alert>
          )}

          {renderTechniquesUsed(reharmonization.techniques)}

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => setSelectedReharmonization(reharmonization)}
            >
              Ouvir
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => handleSaveReharmonization(reharmonization)}
              disabled={saveReharmonizationMutation.isPending}
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              startIcon={<PsychologyIcon />}
              onClick={() => {/* Detailed analysis */}}
            >
              Análise Detalhada
            </Button>
          </Box>
        </CardContent>
      </ReharmonizationCard>
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
            label="Progressão Original"
            value={originalProgression}
            onChange={(e) => setOriginalProgression(e.target.value)}
            placeholder="Ex: C Am F G | C Am Dm G | Em Am F G | C"
            helperText="Digite a progressão usando símbolos de acordes separados por espaços ou barras"
            sx={{ mb: 3 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Estilo Musical</InputLabel>
            <Select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              label="Estilo Musical"
            >
              <MenuItem value="jazz">Jazz</MenuItem>
              <MenuItem value="bossa_nova">Bossa Nova</MenuItem>
              <MenuItem value="latin">Latin</MenuItem>
              <MenuItem value="pop">Pop</MenuItem>
              <MenuItem value="rock">Rock</MenuItem>
              <MenuItem value="gospel">Gospel</MenuItem>
              <MenuItem value="classical">Clássico</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>
            Nível de Complexidade: {complexityLevel}
          </Typography>
          <Slider
            value={complexityLevel}
            onChange={(e, value) => setComplexityLevel(value)}
            min={1}
            max={5}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={useModalInterchange}
                onChange={(e) => setUseModalInterchange(e.target.checked)}
              />
            }
            label="Empréstimo Modal"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={useTritoneSubstitution}
                onChange={(e) => setUseTritoneSubstitution(e.target.checked)}
              />
            }
            label="Substituição Tritonal"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={useChromatic}
                onChange={(e) => setUseChromatic(e.target.checked)}
              />
            }
            label="Abordagens Cromáticas"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<AutoFixHighIcon />}
            onClick={handleReharmonize}
            disabled={!originalProgression.trim() || reharmonizeMutation.isPending}
            sx={{ mt: 2 }}
          >
            {reharmonizeMutation.isPending ? 'Gerando Rearmonizações...' : 'Gerar Rearmonizações'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderResultsTab = () => (
    <Box>
      {reharmonizations.length === 0 ? (
        <Alert severity="info">
          Configure os parâmetros e clique em "Gerar Rearmonizações" para ver as sugestões.
        </Alert>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {reharmonizations.length} Opções de Rearmonização Geradas
          </Typography>
          {reharmonizations.map((reharmonization, index) => 
            renderReharmonizationCard(reharmonization, index)
          )}
        </Box>
      )}
    </Box>
  );

  const renderAnalysisTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Análise Harmônica Detalhada
      </Typography>

      {selectedReharmonization ? (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Progressão Selecionada
            </Typography>
            {renderProgressionComparison(selectedReharmonization)}

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Análise Funcional
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedReharmonization.functional_analysis}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Movimento de Baixo
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedReharmonization.bass_movement}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Tensões e Extensões
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedReharmonization.tensions_analysis}
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Alert severity="info">
          Selecione uma rearmonização na aba "Resultados" para ver a análise detalhada.
        </Alert>
      )}
    </Box>
  );

  const renderLearningTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Aprendizado e Referências
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Técnicas de Rearmonização</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon><TrendingUpIcon /></ListItemIcon>
              <ListItemText 
                primary="Substituição Tritonal"
                secondary="Substitui acordes dominantes por outros dominantes a um trítono de distância (ex: G7 → Db7)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><PaletteIcon /></ListItemIcon>
              <ListItemText 
                primary="Empréstimo Modal"
                secondary="Utiliza acordes de modos paralelos para enriquecer a harmonia"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><TimelineIcon /></ListItemIcon>
              <ListItemText 
                primary="Abordagens Cromáticas"
                secondary="Acordes que se aproximam cromaticamente do alvo principal"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Metodologia Ian Guest</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            As técnicas de rearmonização seguem os princípios estabelecidos por Ian Guest:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Manutenção da estrutura funcional original" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Condução de vozes suave e lógica" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Uso progressivo de complexidade harmônica" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Respeito ao contexto estilístico" />
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
          <AutoFixHighIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Sistema de Rearmonização
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Ferramenta avançada para criação de rearmonizações baseadas na metodologia Ian Guest e princípios do jazz contemporâneo.
        </Typography>
      </StyledPaper>

      <Paper sx={{ p: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, value) => setActiveTab(value)}
          variant="fullWidth"
        >
          <Tab label="Configuração" />
          <Tab label="Resultados" />
          <Tab label="Análise" />
          <Tab label="Aprendizado" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderInputTab()}
          {activeTab === 1 && renderResultsTab()}
          {activeTab === 2 && renderAnalysisTab()}
          {activeTab === 3 && renderLearningTab()}
        </Box>
      </Paper>

      {/* Stepper for Process Flow */}
      {currentStep > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Stepper activeStep={currentStep} orientation="horizontal">
            <Step>
              <StepLabel>Configuração</StepLabel>
            </Step>
            <Step>
              <StepLabel>Geração</StepLabel>
            </Step>
            <Step>
              <StepLabel>Análise</StepLabel>
            </Step>
            <Step>
              <StepLabel>Aplicação</StepLabel>
            </Step>
          </Stepper>
        </Paper>
      )}
    </Box>
  );
};

export default ReharmonizationSystem;
