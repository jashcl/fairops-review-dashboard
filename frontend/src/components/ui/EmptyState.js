import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <Box sx={{ p: 5, textAlign: 'center' }}>
    <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
    {description && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>}
    {actionLabel && onAction && <Button sx={{ mt: 2 }} variant="outlined" onClick={onAction}>{actionLabel}</Button>}
  </Box>
);

export default EmptyState;
