import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Link, useNavigate } from 'react-router-dom';
import { getAllReviewCases } from '../services/reviewCaseService';
import { buildDashboardMetrics } from '../utils/reviewCaseUtils';
import LoadingState from './ui/LoadingState';

const Profile = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviewerContext = async () => {
      setLoading(true);
      const data = await getAllReviewCases();
      setCases(data);
      setLoading(false);
    };

    loadReviewerContext();
  }, []);

  const metrics = useMemo(() => buildDashboardMetrics(cases), [cases]);
  const username = localStorage.getItem('EMSusername') || 'demo-reviewer';
  const assignedCases = useMemo(() => cases.filter(item => item.assignedReviewer.toLowerCase().includes('nina') || item.assignedReviewer.toLowerCase().includes(username.toLowerCase())).length, [cases, username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('EMSusername');
    navigate('/login');
  };

  const handleExportSnapshot = () => {
    const rows = [
      ['Reviewer', username],
      ['Total Cases', metrics.total],
      ['Pending + In Review', metrics.pending + metrics.inReview],
      ['High Risk Cases', metrics.highRisk],
      ['Average Risk Score', metrics.averageRisk],
      ['Generated At', new Date().toISOString()],
    ];
    const csv = ['Field,Value', ...rows.map(row => `"${row[0]}","${row[1]}"`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fairops-reviewer-snapshot.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingState label="Loading reviewer profile..." />;

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 20px 55px rgba(15,23,42,0.12)' }}>
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Avatar sx={{ width: 116, height: 116, bgcolor: 'primary.main', fontSize: 42, fontWeight: 900 }}>
                  {username.slice(0, 1).toUpperCase()}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 900, textAlign: 'center' }}>{username}</Typography>
                <Chip icon={<VerifiedUserIcon />} label="Review operator" color="primary" variant="outlined" />
                <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                  Demo profile showing reviewer workload and decision-flow metrics.
                </Typography>
                <Divider flexItem sx={{ my: 1 }} />
                <Button fullWidth variant="contained" startIcon={<LogoutIcon />} color="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 20px 55px rgba(15,23,42,0.12)' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Reviewer workspace</Typography>
                  <Typography color="text.secondary">Operational snapshot derived from the active review case dataset.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportSnapshot}>
                  Export snapshot
                </Button>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Grid container spacing={2}>
                {[
                  { label: 'Assigned context', value: assignedCases || metrics.total, icon: <AssignmentTurnedInIcon color="primary" /> },
                  { label: 'Open decisions', value: metrics.pending + metrics.inReview, icon: <FactCheckIcon color="primary" /> },
                  { label: 'High-risk cases', value: metrics.highRisk, icon: <WarningAmberIcon color="error" /> },
                ].map(item => (
                  <Grid item xs={12} sm={4} key={item.label}>
                    <Paper sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.icon}
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>{item.value}</Typography>
                      </Stack>
                      <Typography color="text.secondary">{item.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Quick links</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Chip label="Open review queue" variant="outlined" component={Link} to="/cases" clickable />
                  <Chip label="View dashboard" variant="outlined" component={Link} to="/dashboard" clickable />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
