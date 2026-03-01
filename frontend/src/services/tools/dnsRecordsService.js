/**
 * DNS Records Tool Service
 * Lookup DNS records for domains
 */

import { api } from '../api';
import { validateDomain } from '../../utils/validators';

const ENDPOINTS = {
  LOOKUP: '/tools/dns/lookup',
  REVERSE: '/tools/dns/reverse',
  HISTORY: '/tools/dns/history',
};

const dnsRecordsService = {
  /**
   * Lookup DNS records
   * @param {string} domain - Domain name
   * @param {string[]} recordTypes - Record types (A, AAAA, MX, TXT, etc.)
   * @returns {Promise<Object>}
   */
  lookup: async (domain, recordTypes = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME']) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.LOOKUP, { 
      domain: domain.trim().toLowerCase(),
      recordTypes 
    });
  },

  /**
   * Reverse DNS lookup
   * @param {string} ip - IP address
   * @returns {Promise<{hostname: string, ptr: string}>}
   */
  reverseLookup: async (ip) => {
    return api.post(ENDPOINTS.REVERSE, { ip: ip.trim() });
  },

  /**
   * Get DNS history
   * @param {string} domain - Domain name
   * @returns {Promise<Array>}
   */
  getHistory: async (domain) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.get(`${ENDPOINTS.HISTORY}?domain=${domain.trim().toLowerCase()}`);
  },
};

export default dnsRecordsService;
