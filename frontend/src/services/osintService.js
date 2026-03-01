// OSINT Tools Service - API calls for OSINT investigation tools
import api, { ApiError } from './api';

const ENDPOINT = '/osint';

export const osintService = {
  // Email lookup
  emailLookup: async (email) => {
    return api.post(`${ENDPOINT}/email`, { email });
  },

  // Phone lookup
  phoneLookup: async (phone) => {
    return api.post(`${ENDPOINT}/phone`, { phone });
  },

  // Domain lookup
  domainLookup: async (domain) => {
    return api.post(`${ENDPOINT}/domain`, { domain });
  },

  // IP lookup
  ipLookup: async (ip) => {
    return api.post(`${ENDPOINT}/ip`, { ip });
  },

  // Username lookup
  usernameLookup: async (username) => {
    return api.post(`${ENDPOINT}/username`, { username });
  },

  // Image analysis
  imageAnalysis: async (imageUrl) => {
    return api.post(`${ENDPOINT}/image`, { url: imageUrl });
  },

  // Social media lookup
  socialLookup: async (query, platform = null) => {
    return api.post(`${ENDPOINT}/social`, { query, platform });
  },

  // Threat intelligence lookup
  threatIntel: async (indicator) => {
    return api.post(`${ENDPOINT}/threat`, { indicator });
  },

  // Get search history
  getHistory: async (limit = 50) => {
    return api.get(`${ENDPOINT}/history?limit=${limit}`);
  },

  // Clear history
  clearHistory: async () => {
    return api.delete(`${ENDPOINT}/history`);
  },

  // Get a specific result
  getResult: async (id) => {
    return api.get(`${ENDPOINT}/results/${id}`);
  },

  // Export results
  exportResults: async (ids = null, format = 'json') => {
    const params = new URLSearchParams({ format });
    if (ids) {
      params.append('ids', ids.join(','));
    }
    return api.get(`${ENDPOINT}/export?${params.toString()}`);
  }
};

export default osintService;
