import React from 'react';
import styled from 'styled-components';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Avatar,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  ExitToApp,
  Settings,
  MusicNote
} from '@mui/icons-material';
import { useAuthStore, useUIStore } from '../store';
const StyledAppBar = styled(AppBar)\`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
\`;

const Logo = styled.div\`
  display: flex;
  align-items: center;
  gap: 8px;

  .logo-icon {
    background: white;
    border-radius: 50%;
    padding: 4px;
    color: #667eea;
  }
\`;

const UserMenu = styled(Menu)\`
  .MuiPaper-root {
    margin-top: 8px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  }
\`;

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar, openModal, notifications } = useUIStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Logo>
          <MusicNote className="logo-icon" />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            E-harmony
          </Typography>
        </Logo>

        <div style={{ flexGrow: 1 }} />

        {isAuthenticated ? (
          <>
            <IconButton color="inherit">
              <Badge badgeContent={notifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>

            <UserMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={handleUserMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Perfil
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <Settings sx={{ mr: 1 }} />
                Configurações
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </UserMenu>
          </>
        ) : (
          <div>
            <Button 
              color="inherit" 
              onClick={() => openModal('login')}
              sx={{ mr: 1 }}
            >
              Entrar
            </Button>
            <Button 
              variant="outlined"
              color="inherit"
              onClick={() => openModal('register')}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Registrar
            </Button>
          </div>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
