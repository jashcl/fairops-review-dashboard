import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, Stack, Alert, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('demo-reviewer');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/dashboard';

  const handleSubmit = e => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter any demo username and password to continue.');
      return;
    }
    localStorage.setItem('token', 'fairops-demo-token');
    localStorage.setItem('EMSusername', username.trim());
    navigate(redirectPath);
  };

  return (
    <Box sx={{ minHeight: '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 880, overflow: 'hidden', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' }, boxShadow: '0 25px 70px rgba(15,23,42,0.16)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1E3C72 100%)', color: 'white', p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>FairOps Demo Login</Typography>
          <Typography>Use the demo session to inspect dashboard architecture, review queues, decision flows, and case-level UI states.</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>This is intentionally mocked for frontend evaluation so the app can be reviewed without a live backend dependency.</Typography>
        </Box>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Sign in</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Any non-empty credentials will start a local demo session.</Typography>
          {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} />
              <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <Button type="submit" variant="contained" size="large">Continue to dashboard</Button>
              <Divider />
              <Typography variant="body2" color="text.secondary">For a production version, this form can be wired to JWT authentication or a GraphQL login mutation.</Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
