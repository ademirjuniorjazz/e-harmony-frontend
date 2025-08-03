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
import { apiService } from '../api';
import { useStore } from '../store';

// ... resto do código continua igual
