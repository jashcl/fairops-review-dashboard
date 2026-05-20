import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({ label = 'Loading data...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, justifyContent: 'center', minHeight: 360, alignItems: 'center' }}>
    <CircularProgress />
    <Typography color="text.secondary" variant="body2">{label}</Typography>
  </Box>
);

export default LoadingState;
