import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Review Cases', path: '/cases' },
  { label: 'Profile', path: '/profile' },
];

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useMediaQuery('(max-width:1000px)');
  const isActive = path => currentPath === path;

  useEffect(() => {
    const checkLoginStatus = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('EMSusername');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ width: 260, backgroundColor: '#0f172a', height: '100%', color: 'white' }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>FairOps</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>Review workflow dashboard</Typography>
      </Box>
      <List>
        {navItems.map(item => (
          <ListItem button component={Link} to={item.path} selected={isActive(item.path)} onClick={() => setDrawerOpen(false)} key={item.path}>
            <ListItemText primary={item.label} sx={{ color: isActive(item.path) ? '#f59e0b' : 'white' }} />
          </ListItem>
        ))}
        <ListItem button component={Link} to="/login" onClick={isLoggedIn ? handleLogout : () => setDrawerOpen(false)}>
          <ListItemText primary={isLoggedIn ? 'Logout' : 'Login'} sx={{ color: isLoggedIn ? '#f87171' : 'white' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1E3C72 100%)', padding: '0.35rem 0', boxShadow: '0 10px 30px rgba(15,23,42,0.22)' }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontSize: '1.45rem', fontWeight: 900 }}>
            FairOps
          </Typography>
          <Chip label="Review Workflow" size="small" sx={{ mr: 2, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} variant="outlined" />

          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {navItems.map(item => (
                <Button key={item.path} component={Link} to={item.path} sx={{ color: isActive(item.path) ? '#f59e0b' : 'white', fontWeight: 800 }}>
                  {item.label}
                </Button>
              ))}
              {isLoggedIn ? (
                <Button onClick={handleLogout} sx={{ color: '#f87171', fontWeight: 800 }}>Logout</Button>
              ) : (
                <Button component={Link} to="/login" sx={{ color: isActive('/login') ? '#f59e0b' : 'white', fontWeight: 800 }}>Login</Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>{drawerContent}</Drawer>
    </>
  );
};

export default Navbar;
