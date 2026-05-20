import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getReviewCaseById, updateReviewCaseStatus } from '../../services/reviewCaseService';
import { getRiskColor, getStatusColor, validateStatusUpdate } from '../../utils/reviewCaseUtils';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';

const ReviewCaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState('In Review');
  const [decisionNote, setDecisionNote] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const loadCase = async () => {
      try {
        setLoading(true);
        const data = await getReviewCaseById(id);
        if (!data) setError('This review case does not exist.');
        setCaseItem(data);
      } catch (err) {
        setError('Could not load this review case.');
      } finally {
        setLoading(false);
      }
    };
    loadCase();
  }, [id]);

  const completedEvidence = useMemo(() => {
    if (!caseItem) return 0;
    return caseItem.evidence.filter(item => item.status === 'Completed').length;
  }, [caseItem]);

  const evidencePercent = caseItem ? Math.round((completedEvidence / caseItem.evidence.length) * 100) : 0;

  const handleStatusUpdate = async () => {
    const validationMessage = validateStatusUpdate({ caseItem, nextStatus, decisionNote });
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    const updated = await updateReviewCaseStatus(caseItem.id, nextStatus, decisionNote.trim());
    setCaseItem(updated);
    setDecisionNote('');
    setValidationError('');
    setModalOpen(false);
  };

  if (loading) {
    return <LoadingState label="Loading case details..." />;
  }

  if (error || !caseItem) {
    return <ErrorState message={error || 'Case not found.'} />;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cases')} sx={{ mb: 2 }}>Back to review queue</Button>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>{caseItem.applicantName}</Typography>
          <Typography color="text.secondary">{caseItem.id} · {caseItem.category} · Assigned to {caseItem.assignedReviewer}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label={caseItem.status} color={getStatusColor(caseItem.status)} />
          <Chip label={`${caseItem.riskLevel} risk · ${caseItem.riskScore}/100`} color={getRiskColor(caseItem.riskLevel)} />
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2.5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Case Summary</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{caseItem.summary}</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Email</Typography><Typography sx={{ fontWeight: 700 }}>{caseItem.email}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Department</Typography><Typography sx={{ fontWeight: 700 }}>{caseItem.department}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Submitted</Typography><Typography sx={{ fontWeight: 700 }}>{caseItem.submittedAt}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Decision Due</Typography><Typography sx={{ fontWeight: 700 }}>{caseItem.decisionDue}</Typography></Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Evidence Checklist</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{evidencePercent}% complete</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={evidencePercent} sx={{ height: 8, borderRadius: 99, mb: 2 }} />
                <Stack spacing={1.25}>
                  {caseItem.evidence.map(item => (
                    <Box key={item.id} sx={{ p: 1.5, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>{item.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.required ? 'Required evidence' : 'Optional evidence'}</Typography>
                        </Box>
                        <Chip label={item.status} color={item.status === 'Completed' ? 'success' : item.status === 'Needs Attention' ? 'error' : 'warning'} size="small" />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Reviewer Notes</Typography>
                <Stack spacing={1.5}>
                  {caseItem.notes.length ? caseItem.notes.map(note => (
                    <Box key={note.id} sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(15,23,42,0.04)' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800 }}>{note.author}</Typography>
                        <Chip label={note.category} size="small" variant="outlined" />
                      </Stack>
                      <Typography>{note.message}</Typography>
                      <Typography variant="caption" color="text.secondary">{note.createdAt}</Typography>
                    </Box>
                  )) : <Typography color="text.secondary">No notes added yet.</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2.5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Decision Panel</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>Move this case through the review workflow with validation rules.</Typography>
                <Button fullWidth variant="contained" onClick={() => setModalOpen(true)}>Update Status</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Timeline</Typography>
                <Stack spacing={1.5}>
                  {caseItem.timeline.map(event => (
                    <Box key={event.id} sx={{ borderLeft: '3px solid #1E3C72', pl: 1.5 }}>
                      <Typography sx={{ fontWeight: 800 }}>{event.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{event.at}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update case status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {validationError && <Alert severity="warning">{validationError}</Alert>}
            <FormControl fullWidth>
              <InputLabel>Next status</InputLabel>
              <Select label="Next status" value={nextStatus} onChange={event => setNextStatus(event.target.value)}>
                {['Pending', 'In Review', 'Approved', 'Rejected', 'Escalated'].map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField multiline minRows={4} label="Reviewer note" value={decisionNote} onChange={event => setDecisionNote(event.target.value)} helperText="Required for approval, rejection, and escalation decisions." />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>Save decision</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewCaseDetails;
