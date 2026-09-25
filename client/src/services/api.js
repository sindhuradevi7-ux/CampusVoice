import axios from 'axios';

const resolveBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const isRenderBackend = host.includes('campusvoice-v8n2.onrender.com');

    // Automatically route to Render production backend when on Vercel or custom domain
    if (!isLocal && !isRenderBackend) {
      return 'https://campusvoice-v8n2.onrender.com/api';
    }
  }

  return '/api';
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});



// Attach Authorization Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusvoice_token');
    if (token && token !== 'null' && token !== 'undefined' && token !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid/expired token only when not on auth pages
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('campusvoice_token');
        localStorage.removeItem('campusvoice_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Complaint Services (Student)
export const complaintAPI = {
  submitComplaint: (data) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/my'),
  getComplaintByPublicId: (publicComplaintId) => api.get(`/complaints/${publicComplaintId}`),
  trackPublicly: (publicComplaintId) => api.get(`/complaints/track/${publicComplaintId}`),
};

// Issue Explorer & Support Services
export const issueAPI = {
  getAllIssues: (params) => api.get('/issues', { params }),
  getIssueById: (id) => api.get(`/issues/${id}`),
  supportIssue: (id) => api.post(`/issues/${id}/support`),
  getMySupportedIssues: () => api.get('/issues/supported/my'),
};

// Admin Services
export const adminAPI = {
  getIssues: (params) => api.get('/admin/issues', { params }),
  getIssueDetails: (id) => api.get(`/admin/issues/${id}`),
  updateStatus: (id, data) => api.patch(`/admin/issues/${id}/status`, data),
  updateDepartment: (id, data) => api.patch(`/admin/issues/${id}/department`, data),
  getAnalytics: () => api.get('/admin/analytics'),
};

// Message Services (2-way Anonymous Thread)
export const messageAPI = {
  getMessages: (complaintId) => api.get(`/complaints/${complaintId}/messages`),
  sendMessage: (complaintId, data) => api.post(`/complaints/${complaintId}/messages`, data),
};

// AI Classification & Duplicate Check
export const aiAPI = {
  analyzeComplaint: (data) => api.post('/ai/analyze-complaint', data),
  checkRelatedIssues: (data) => api.post('/ai/check-related-issue', data),
};

export default api;
