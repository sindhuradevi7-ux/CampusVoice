import crypto from 'crypto';

export const generateComplaintId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CV-${code}`;
};

export const generateIssueId = () => {
  const num = Math.floor(100 + Math.random() * 900);
  return `CV-ISSUE-${num}`;
};
