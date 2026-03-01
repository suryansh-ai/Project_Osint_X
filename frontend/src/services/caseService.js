// Case Service - API calls for case management
import api, { ApiError } from './api';

const ENDPOINT = '/cases';

export const caseService = {
  // Get all cases
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${ENDPOINT}${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get a single case by ID
  getById: async (id) => {
    return api.get(`${ENDPOINT}/${id}`);
  },

  // Create a new case
  create: async (caseData) => {
    return api.post(ENDPOINT, caseData);
  },

  // Update an existing case
  update: async (id, updates) => {
    return api.put(`${ENDPOINT}/${id}`, updates);
  },

  // Delete a case
  delete: async (id) => {
    return api.delete(`${ENDPOINT}/${id}`);
  },

  // Add evidence to a case
  addEvidence: async (caseId, evidenceId) => {
    return api.post(`${ENDPOINT}/${caseId}/evidence`, { evidenceId });
  },

  // Remove evidence from a case
  removeEvidence: async (caseId, evidenceId) => {
    return api.delete(`${ENDPOINT}/${caseId}/evidence/${evidenceId}`);
  },

  // Update case status
  updateStatus: async (id, status) => {
    return caseService.update(id, { status });
  },

  // Get case statistics
  getStatistics: async () => {
    return api.get(`${ENDPOINT}/statistics`);
  },

  // Search cases
  search: async (query) => {
    return caseService.getAll({ search: query });
  },

  // Export cases
  export: async (format = 'json') => {
    return api.get(`${ENDPOINT}/export?format=${format}`);
  }
};

export default caseService;
