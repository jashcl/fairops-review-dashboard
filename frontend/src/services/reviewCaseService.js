import { mockReviewCases } from '../data/mockReviewCases';

const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

let reviewCases = [...mockReviewCases];

export const getAllReviewCases = async () => {
  await wait();
  return [...reviewCases];
};

export const getReviewCaseById = async id => {
  await wait();
  return reviewCases.find(item => item.id === id);
};

export const updateReviewCaseStatus = async (id, status, note) => {
  await wait();
  reviewCases = reviewCases.map(item => {
    if (item.id !== id) return item;

    const newNote = note
      ? {
          id: `N-${Date.now()}`,
          author: localStorage.getItem('EMSusername') || 'Demo Reviewer',
          category: status === 'Rejected' || status === 'Approved' ? 'Decision' : 'General',
          message: note,
          createdAt: new Date().toLocaleString(),
        }
      : null;

    return {
      ...item,
      status,
      lastUpdated: new Date().toISOString().slice(0, 10),
      notes: newNote ? [newNote, ...item.notes] : item.notes,
      timeline: [
        { id: `T-${Date.now()}`, title: `Status changed to ${status}`, at: new Date().toLocaleString() },
        ...item.timeline,
      ],
    };
  });

  return reviewCases.find(item => item.id === id);
};
