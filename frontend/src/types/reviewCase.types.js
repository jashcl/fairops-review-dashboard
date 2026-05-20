/**
 * @typedef {'Pending' | 'In Review' | 'Approved' | 'Rejected' | 'Escalated'} ReviewStatus
 * @typedef {'Low' | 'Medium' | 'High'} RiskLevel
 * @typedef {'Pending' | 'Completed' | 'Needs Attention'} EvidenceStatus
 *
 * @typedef {Object} ReviewerNote
 * @property {string} id
 * @property {string} author
 * @property {'General' | 'Risk' | 'Evidence' | 'Decision'} category
 * @property {string} message
 * @property {string} createdAt
 *
 * @typedef {Object} EvidenceItem
 * @property {string} id
 * @property {string} label
 * @property {EvidenceStatus} status
 * @property {boolean} required
 *
 * @typedef {Object} ReviewCase
 * @property {string} id
 * @property {string} applicantName
 * @property {string} email
 * @property {'Employment' | 'KYC' | 'Loan' | 'Insurance' | 'Vendor'} category
 * @property {string} department
 * @property {ReviewStatus} status
 * @property {RiskLevel} riskLevel
 * @property {number} riskScore
 * @property {string} assignedReviewer
 * @property {string} submittedAt
 * @property {string} lastUpdated
 * @property {EvidenceItem[]} evidence
 * @property {ReviewerNote[]} notes
 */
export {};
