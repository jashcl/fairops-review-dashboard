import { buildDashboardMetrics, filterReviewCases, validateStatusUpdate } from '../reviewCaseUtils';

const cases = [
  { id: 'FR-1', applicantName: 'Nikhil Desai', email: 'nikhil@example.com', assignedReviewer: 'Nina', status: 'Pending', riskLevel: 'High', riskScore: 84, category: 'Employment', submittedAt: '2026-05-01', lastUpdated: '2026-05-03' },
  { id: 'FR-2', applicantName: 'Mira Shah', email: 'mira@example.com', assignedReviewer: 'Arjun', status: 'Approved', riskLevel: 'Low', riskScore: 22, category: 'KYC', submittedAt: '2026-05-02', lastUpdated: '2026-05-04' },
  { id: 'FR-3', applicantName: 'Aditya Rao', email: 'aditya@example.com', assignedReviewer: 'Nina', status: 'In Review', riskLevel: 'High', riskScore: 91, category: 'Vendor', submittedAt: '2026-05-03', lastUpdated: '2026-05-05' },
];

describe('reviewCaseUtils', () => {
  it('builds dashboard metrics from case data', () => {
    expect(buildDashboardMetrics(cases)).toEqual({
      total: 3,
      pending: 1,
      inReview: 1,
      approved: 1,
      rejected: 0,
      escalated: 0,
      highRisk: 2,
      averageRisk: 66,
    });
  });

  it('filters by search/status/risk/category and sorts by risk score', () => {
    const result = filterReviewCases(cases, {
      search: 'shah',
      status: 'All',
      riskLevel: 'High',
      category: 'All',
      sortBy: 'riskScore',
    });

    expect(result.map(item => item.id)).toEqual(['FR-3']);
  });

  it('requires a note for rejection, escalation, and approval', () => {
    const caseItem = { evidence: [{ required: true, status: 'Completed' }] };
    expect(validateStatusUpdate({ caseItem, nextStatus: 'Rejected', decisionNote: '' })).toBe('Rejected decisions require a reviewer note.');
    expect(validateStatusUpdate({ caseItem, nextStatus: 'Escalated', decisionNote: 'Needs senior review' })).toBe('');
  });

  it('blocks approval when required evidence is incomplete', () => {
    const caseItem = { evidence: [{ required: true, status: 'Pending' }] };
    expect(validateStatusUpdate({ caseItem, nextStatus: 'Approved', decisionNote: 'Looks good' })).toBe('Approval is blocked until all required evidence items are completed.');
  });
});
