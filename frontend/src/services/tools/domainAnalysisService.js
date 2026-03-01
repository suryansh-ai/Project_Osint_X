/**
 * Domain Analysis Tool Service
 * Comprehensive domain intelligence and WHOIS data
 */

import { api } from '../api';
import { validateDomain } from '../../utils/validators';

const ENDPOINTS = {
  WHOIS: '/tools/domain/whois',
  SUBDOMAINS: '/tools/domain/subdomains',
  SSL: '/tools/domain/ssl',
  REPUTATION: '/tools/domain/reputation',
  TECH_STACK: '/tools/domain/tech-stack',
};

const domainAnalysisService = {
  /**
   * Get WHOIS information
   * @param {string} domain - Domain name
   * @returns {Promise<Object>}
   */
  getWhois: async (domain) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.WHOIS, { domain: domain.trim().toLowerCase() });
  },

  /**
   * Enumerate subdomains
   * @param {string} domain - Domain name
   * @returns {Promise<{subdomains: string[]}>}
   */
  getSubdomains: async (domain) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.SUBDOMAINS, { domain: domain.trim().toLowerCase() });
  },

  /**
   * Check SSL certificate
   * @param {string} domain - Domain name
   * @returns {Promise<Object>}
   */
  checkSSL: async (domain) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.SSL, { domain: domain.trim().toLowerCase() });
  },

  /**
   * Check domain reputation
   * @param {string} domain - Domain name
   * @returns {Promise<{score: number, threats: Array}>}
   */
  checkReputation: async (domain) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.REPUTATION, { domain: domain.trim().toLowerCase() });
  },

  /**
   * Detect technology stack
   * @param {string} domain - Domain name
   * @returns {Promise<{technologies: Array}>}
   */
  getTechStack: async (domain) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.TECH_STACK, { domain: domain.trim().toLowerCase() });
  },
};

export default domainAnalysisService;
