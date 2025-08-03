import React from 'react';
import styled from 'styled-components';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Piano,
  Assignment,
  Refresh,
  Chat,
  LibraryBooks,
  TrendingUp,
  Star,
  School
} from '@mui/icons-material';
import { useUIStore, useAuthStore } from '../../context/store';

const DRAWER_WIDTH = 280;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${DRAWER_WIDTH}px;
    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    border-right: 1px solid #e2e8f0;
    margin-top: 64px;
    height: calc(100% - 64px);
  }
`;

const SidebarHeader = styled(Box)`
  padding: 24px 20px 16px;
  background: white;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StyledListItem = styled(ListItem)`
  margin: 4px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .MuiListItemIcon-root {
      color: white;
    }
  }

  &:hover:not(.active) {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
  { id: 'analyzer', label: 'Analisador', icon: Piano },
  { id: 'exercises', label: 'Exercícios', icon: Assignment },
  { id: 'reharmonization', label: 'Rearmonização', icon: Refresh },
  { id: 'improvisation', label: 'Improvisação', icon: TrendingUp },
  { id: 'chat', label: 'Plantão IA', icon: Chat, premium: true },
  { id: 'knowledge', label: 'Base Conhecimento', icon: LibraryBooks },
  { id: 'progress', label: 'Meu Progresso', icon: School }
];

const Sidebar = () => {
  const { sidebar, setActiveSection } = useUIStore();
  const { user, isAuthenticated } = useAuthStore();

  const isPremium = user?.subscription === 'premium';

  const handleItemClick = (itemId, isPremiumFeature) => {
    if (isPremiumFeature && !isPremium) {
      // Abrir modal de upgrade
      return;
    }
    setActiveSection(itemId);
  };

  return (
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={sidebar.isOpen}
    >
      {isAuthenticated && (
        <SidebarHeader>
          <Typography variant="h6" fontWeight={600} color="primary">
            Olá, {user?.name || 'Músico'}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isPremium ? (
              <Chip 
                label="PREMIUM" 
                size="small" 
                color="warning"
                icon={<Star />}
              />
            ) : (
              <Chip 
                label="FREEMIUM" 
                size="small" 
                variant="outlined"
              />
            )}
          </Typography>
        </SidebarHeader>
      )}

      <List>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = sidebar.activeSection === item.id;
          const isLocked = item.premium && !isPremium;

          return (
            <StyledListItem
              key={item.id}
              button
              className={isActive ? 'active' : ''}
              onClick={() => handleItemClick(item.id, item.premium)}
              disabled={isLocked && !isAuthenticated}
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                secondary={isLocked ? '🔒 Premium' : null}
              />
              {item.premium && (
                <Star sx={{ color: '#ffc107', fontSize: 16 }} />
              )}
            </StyledListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          E-harmony v1.0
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Baseado na metodologia Ian Guest
        </Typography>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;