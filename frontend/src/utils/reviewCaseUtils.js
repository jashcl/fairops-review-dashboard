export const getStatusColor = status => {
  const colors = {
    Pending: 'warning',
    'In Review': 'info',
    Approved: 'success',
    Rejected: 'error',
    Escalated: 'secondary',
  };
  return colors[status] || 'default';
};

export const getRiskColor = riskLevel => {
  const colors = {
    Low: 'success',
    Medium: 'warning',
    High: 'error',
  };
  return colors[riskLevel] || 'default';
};

export const buildDashboardMetrics = cases => {
  const total = cases.length;
  const pending = cases.filter(item => item.status === 'Pending').length;
  const inReview = cases.filter(item => item.status === 'In Review').length;
  const approved = cases.filter(item => item.status === 'Approved').length;
  const rejected = cases.filter(item => item.status === 'Rejected').length;
  const escalated = cases.filter(item => item.status === 'Escalated').length;
  const highRisk = cases.filter(item => item.riskLevel === 'High').length;
  const averageRisk = total ? Math.round(cases.reduce((sum, item) => sum + item.riskScore, 0) / total) : 0;

  return { total, pending, inReview, approved, rejected, escalated, highRisk, averageRisk };
};

export const filterReviewCases = (cases, { search, status, riskLevel, category, sortBy }) => {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = cases.filter(item => {
    const matchesSearch =
      !normalizedSearch ||
      item.id.toLowerCase().includes(normalizedSearch) ||
      item.applicantName.toLowerCase().includes(normalizedSearch) ||
      item.email.toLowerCase().includes(normalizedSearch) ||
      item.assignedReviewer.toLowerCase().includes(normalizedSearch);

    const matchesStatus = status === 'All' || item.status === status;
    const matchesRisk = riskLevel === 'All' || item.riskLevel === riskLevel;
    const matchesCategory = category === 'All' || item.category === category;

    return matchesSearch && matchesStatus && matchesRisk && matchesCategory;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'riskScore') return b.riskScore - a.riskScore;
    if (sortBy === 'submittedAt') return new Date(b.submittedAt) - new Date(a.submittedAt);
    if (sortBy === 'lastUpdated') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    return a.applicantName.localeCompare(b.applicantName);
  });
};


export const validateStatusUpdate = ({ caseItem, nextStatus, decisionNote }) => {
  const requiresNote = ['Rejected', 'Escalated', 'Approved'].includes(nextStatus);
  const requiredEvidence = caseItem.evidence.filter(item => item.required);
  const allRequiredCompleted = requiredEvidence.every(item => item.status === 'Completed');

  if (requiresNote && !decisionNote.trim()) {
    return `${nextStatus} decisions require a reviewer note.`;
  }

  if (nextStatus === 'Approved' && !allRequiredCompleted) {
    return 'Approval is blocked until all required evidence items are completed.';
  }

  return '';
};
