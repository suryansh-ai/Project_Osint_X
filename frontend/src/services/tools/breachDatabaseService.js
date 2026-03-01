/**
 * Breach Database Tool Service
 * Check if emails/passwords have been compromised in data breaches
 */

import { api } from './api';
import { validateEmail, validateHash } from '../utils/validators';

const ENDPOINTS = {
  CHECK_EMAIL: '/tools/breach-database/email',
  CHECK_PASSWORD: '/tools/breach-database/password',
  CHECK_DOMAIN: '/tools/breach-database/domain',
  BREACH_LIST: '/tools/breach-database/breaches',
  STATISTICS: '/tools/breach-database/stats',
};

const breachDatabaseService = {
  /**
   * Check if email has been breached
   * @param {string} email - Email address
   * @returns {Promise<{breached: boolean, breaches: Array, totalRecords: number}>}
   */
  checkEmail: async (email) => {
    const validation = validateEmail(email);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.CHECK_EMAIL, { email: email.trim() });
  },

  /**
   * Check if password hash has been breached
   * @param {string} password - Password or hash
   * @param {boolean} isHash - Whether input is already a hash
   * @returns {Promise<{breached: boolean, occurrences: number}>}
   */
  checkPassword: async (password, isHash = false) => {
    if (!password) {
      throw new Error('Password is required');
    }
    
    return api.post(ENDPOINTS.CHECK_PASSWORD, { 
      password: password.trim(),
      isHash 
    });
  },

  /**
   * Check domain for breaches
   * @param {string} domain - Domain name
   * @returns {Promise<{breaches: Array, totalAccounts: number}>}
   */
  checkDomain: async (domain) => {
    return api.post(ENDPOINTS.CHECK_DOMAIN, { domain: domain.trim() });
  },

  /**
   * Get list of known breaches
   * @returns {Promise<Array>}
   */
  getBreaches: async () => {
    return api.get(ENDPOINTS.BREACH_LIST);
  },

  /**
   * Get breach statistics
   * @returns {Promise<{totalBreaches: number, totalRecords: number}>}
   */
  getStatistics: async () => {
    return api.get(ENDPOINTS.STATISTICS);
  },
};

export default breachDatabaseService;
