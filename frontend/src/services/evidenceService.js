// Evidence Service - API calls for evidence management
import api, { ApiError } from './api';

const ENDPOINT = '/evidence';

export const evidenceService = {
  // Get all evidence
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${ENDPOINT}${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get a single evidence by ID
  getById: async (id) => {
    return api.get(`${ENDPOINT}/${id}`);
  },

  // Create new evidence
  create: async (evidenceData) => {
    return api.post(ENDPOINT, evidenceData);
  },

  // Update existing evidence
  update: async (id, updates) => {
    return api.put(`${ENDPOINT}/${id}`, updates);
  },

  // Delete evidence
  delete: async (id) => {
    return api.delete(`${ENDPOINT}/${id}`);
  },

  // Verify evidence
  verify: async (id, verificationData = {}) => {
    return api.post(`${ENDPOINT}/${id}/verify`, verificationData);
  },

  // Unverify evidence
  unverify: async (id) => {
    return api.post(`${ENDPOINT}/${id}/unverify`);
  },

  // Add tag to evidence
  addTag: async (id, tag) => {
    return api.post(`${ENDPOINT}/${id}/tags`, { tag });
  },

  // Remove tag from evidence
  removeTag: async (id, tag) => {
    return api.delete(`${ENDPOINT}/${id}/tags/${encodeURIComponent(tag)}`);
  },

  // Add correlation
  addCorrelation: async (id, correlatedId, correlationType = 'related') => {
    return api.post(`${ENDPOINT}/${id}/correlations`, { correlatedId, correlationType });
  },

  // Remove correlation
  removeCorrelation: async (id, correlatedId) => {
    return api.delete(`${ENDPOINT}/${id}/correlations/${correlatedId}`);
  },

  // Get evidence by case
  getByCase: async (caseId) => {
    return evidenceService.getAll({ caseId });
  },

  // Get evidence statistics
  getStatistics: async () => {
    return api.get(`${ENDPOINT}/statistics`);
  },

  // Search evidence
  search: async (query) => {
    return evidenceService.getAll({ search: query });
  },

  // Export evidence
  export: async (format = 'json', ids = null) => {
    const params = new URLSearchParams({ format });
    if (ids) {
      params.append('ids', ids.join(','));
    }
    return api.get(`${ENDPOINT}/export?${params.toString()}`);
  },

  // Bulk operations
  bulkDelete: async (ids) => {
    return api.post(`${ENDPOINT}/bulk-delete`, { ids });
  },

  bulkVerify: async (ids) => {
    return api.post(`${ENDPOINT}/bulk-verify`, { ids });
  }
};

export default evidenceService;
