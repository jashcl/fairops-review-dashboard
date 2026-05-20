import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getAllReviewCases } from '../../services/reviewCaseService';
import { buildDashboardMetrics, getRiskColor, getStatusColor } from '../../utils/reviewCaseUtils';
import LoadingState from '../ui/LoadingState';

const MetricCard = ({ title, value, helper, icon }) => (
  <Card sx={{ height: '100%', border: '1px solid rgba(15, 23, 42, 0.08)', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{helper}</Typography>
        </Box>
        <Box sx={{ p: 1.25, borderRadius: 3, bgcolor: 'rgba(30, 60, 114, 0.08)', color: 'primary.main' }}>{icon}</Box>
      </Stack>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const data = await getAllReviewCases();
        setCases(data);
      } catch (err) {
        setError('Unable to load review dashboard right now.');
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const metrics = useMemo(() => buildDashboardMetrics(cases), [cases]);
  const statusBreakdown = useMemo(() => ['Pending', 'In Review', 'Approved', 'Rejected', 'Escalated'].map(status => ({
    status,
    count: cases.filter(item => item.status === status).length,
  })), [cases]);
  const highRiskCases = useMemo(() => cases.filter(item => item.riskLevel === 'High').slice(0, 3), [cases]);
  const recentCases = useMemo(() => [...cases].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, 4), [cases]);

  if (loading) {
    return <LoadingState label="Loading dashboard metrics..." />;
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Chip label="Frontend-first workflow product" color="primary" variant="outlined" sx={{ mb: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 900 }}>FairOps Dashboard</Typography>
          <Typography color="text.secondary">Review cases, inspect risk signals, and move decisions through a structured workflow.</Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/cases')}>Open Review Queue</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><MetricCard title="Total Cases" value={metrics.total} helper="All active review records" icon={<AssignmentTurnedInIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><MetricCard title="Pending + In Review" value={metrics.pending + metrics.inReview} helper="Needs reviewer attention" icon={<FactCheckIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><MetricCard title="High Risk" value={metrics.highRisk} helper="Requires careful evidence review" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><MetricCard title="Avg Risk Score" value={metrics.averageRisk} helper="Derived from case data" icon={<TimelineIcon />} /></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Review Pipeline</Typography>
              <Stack spacing={2}>
                {statusBreakdown.map(item => {
                  const percent = metrics.total ? Math.round((item.count / metrics.total) * 100) : 0;
                  return (
                    <Box key={item.status}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                        <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.count} cases</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 99 }} />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>High-Risk Watchlist</Typography>
              <Stack spacing={1.5}>
                {highRiskCases.map(item => (
                  <Box key={item.id} sx={{ p: 1.5, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, cursor: 'pointer' }} onClick={() => navigate(`/cases/${item.id}`)}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{item.applicantName}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.id} · {item.category}</Typography>
                      </Box>
                      <Chip label={`${item.riskScore}/100`} color={getRiskColor(item.riskLevel)} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Recently Updated Cases</Typography>
                <Button onClick={() => navigate('/cases')}>View all</Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1.5}>
                {recentCases.map(item => (
                  <Grid item xs={12} md={6} key={item.id}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.03)' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>{item.applicantName}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.summary}</Typography>
                        </Box>
                        <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
