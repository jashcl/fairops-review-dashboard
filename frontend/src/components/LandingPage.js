import React from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import RuleIcon from '@mui/icons-material/Rule';
import StorageIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const LandingPage = () => {
  return (
    <Box sx={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)', minHeight: 'calc(100vh - 80px)', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.05, mb: 2 }}>
              FairOps review workflow dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              A product-style frontend for managing review cases, risk signals, evidence checks, reviewer notes, and decision status.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" size="large" component={Link} to="/dashboard">Open Dashboard</Button>
              <Button variant="outlined" size="large" component={Link} to="/cases">View Review Cases</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ boxShadow: '0 30px 70px rgba(15,23,42,0.14)' }}>
              <CardContent>
                <Stack spacing={2.25}>
                  {[
                    ['Clean component structure', 'Shared UI, feature components, service layer, and utilities are separated for easier reasoning.', <AccountTreeIcon />],
                    ['Decision workflow logic', 'Approval, rejection, and escalation flows include validation and reviewer notes.', <RuleIcon />],
                    ['API-ready frontend', 'Mock data is wrapped behind services so REST or GraphQL can replace it later.', <StorageIcon />],
                  ].map(([title, body, icon]) => (
                    <Box key={title} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(30,60,114,0.06)' }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
                          <Typography variant="body2" color="text.secondary">{body}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
