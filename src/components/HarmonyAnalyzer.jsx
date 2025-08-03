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
