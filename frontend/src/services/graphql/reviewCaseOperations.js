// GraphQL-ready operations for a future typed API migration.
// The current UI talks to reviewCaseService.js, so these operations can replace
// the mock/REST layer later without rewriting page components.

export const REVIEW_CASES_QUERY = `
  query ReviewCases($filters: ReviewCaseFiltersInput) {
    reviewCases(filters: $filters) {
      id
      applicantName
      email
      category
      department
      status
      riskLevel
      riskScore
      assignedReviewer
      submittedAt
      lastUpdated
    }
  }
`;

export const REVIEW_CASE_BY_ID_QUERY = `
  query ReviewCaseById($id: ID!) {
    reviewCase(id: $id) {
      id
      applicantName
      email
      category
      department
      status
      riskLevel
      riskScore
      assignedReviewer
      submittedAt
      lastUpdated
      summary
      decisionDue
      evidence { id label status required }
      notes { id author category message createdAt }
      timeline { id title at }
    }
  }
`;

export const UPDATE_REVIEW_STATUS_MUTATION = `
  mutation UpdateReviewStatus($id: ID!, $status: ReviewStatus!, $note: String) {
    updateReviewStatus(id: $id, status: $status, note: $note) {
      id
      status
      lastUpdated
      notes { id author category message createdAt }
      timeline { id title at }
    }
  }
`;
