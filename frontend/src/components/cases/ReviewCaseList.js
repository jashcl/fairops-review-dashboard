import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllReviewCases } from '../../services/reviewCaseService';
import LoadingState from '../ui/LoadingState';
import EmptyState from '../ui/EmptyState';
import { filterReviewCases, getRiskColor, getStatusColor } from '../../utils/reviewCaseUtils';

const ReviewCaseList = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'All', riskLevel: 'All', category: 'All', sortBy: 'riskScore' });

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const data = await getAllReviewCases();
        setCases(data);
      } catch (err) {
        setError('Could not load review cases.');
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(cases.map(item => item.category))], [cases]);
  const visibleCases = useMemo(() => filterReviewCases(cases, filters), [cases, filters]);

  const handleFilterChange = event => {
    const { name, value } = event.target;
    setFilters(current => ({ ...current, [name]: value }));
  };

  if (loading) {
    return <LoadingState label="Loading review cases..." />;
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>Review Cases</Typography>
          <Typography color="text.secondary">Search, filter, sort, and open case records for detailed decision review.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => setFilters({ search: '', status: 'All', riskLevel: 'All', category: 'All', sortBy: 'riskScore' })}>Reset filters</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="search"
                label="Search cases"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" label="Status" value={filters.status} onChange={handleFilterChange}>{['All', 'Pending', 'In Review', 'Approved', 'Rejected', 'Escalated'].map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth><InputLabel>Risk</InputLabel><Select name="riskLevel" label="Risk" value={filters.riskLevel} onChange={handleFilterChange}>{['All', 'Low', 'Medium', 'High'].map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth><InputLabel>Category</InputLabel><Select name="category" label="Category" value={filters.category} onChange={handleFilterChange}>{categories.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth><InputLabel>Sort by</InputLabel><Select name="sortBy" label="Sort by" value={filters.sortBy} onChange={handleFilterChange}>{[
                ['riskScore', 'Risk score'], ['submittedAt', 'Submitted date'], ['lastUpdated', 'Last updated'], ['name', 'Name']
              ].map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</Select></FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleCases.map(item => (
                <TableRow key={item.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/cases/${item.id}`)}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800 }}>{item.applicantName}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.id} · {item.email}</Typography>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell><Chip label={item.status} color={getStatusColor(item.status)} size="small" /></TableCell>
                  <TableCell><Chip label={`${item.riskLevel} · ${item.riskScore}`} color={getRiskColor(item.riskLevel)} size="small" /></TableCell>
                  <TableCell>{item.assignedReviewer}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell align="right"><Button size="small" onClick={(event) => { event.stopPropagation(); navigate(`/cases/${item.id}`); }}>Open</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!visibleCases.length && (
          <EmptyState
            title="No cases match these filters"
            description="Try clearing one filter or search term."
            actionLabel="Reset filters"
            onAction={() => setFilters({ search: '', status: 'All', riskLevel: 'All', category: 'All', sortBy: 'riskScore' })}
          />
        )}
      </Card>
    </Box>
  );
};

export default ReviewCaseList;
