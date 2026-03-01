/**
 * UPI Info Tool Service
 * NPCI database lookup for UPI/VPA information
 */

import { api } from '../api';

const ENDPOINTS = {
  LOOKUP: '/tools/upi/lookup',
  VERIFY: '/tools/upi/verify',
  BANK: '/tools/upi/bank-details',
  TRANSACTIONS: '/tools/upi/transactions',
  RISK: '/tools/upi/risk-analysis',
  ACTIVITY: '/tools/upi/activity',
};

/**
 * Validate UPI ID/VPA format
 * @param {string} upiId - UPI ID
 * @returns {Object}
 */
const validateUPI = (upiId) => {
  if (!upiId || !upiId.trim()) {
    return { valid: false, error: 'UPI ID is required' };
  }
  
  // UPI ID pattern: username@bankhandle
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  const cleanedId = upiId.trim().toLowerCase();
  
  if (!pattern.test(cleanedId)) {
    return { valid: false, error: 'Invalid UPI ID format. Use format: username@bank' };
  }
  
  return { valid: true, formatted: cleanedId };
};

const upiInfoService = {
  /**
   * Comprehensive UPI lookup
   * @param {string} upiId - UPI ID/VPA
   * @returns {Promise<Object>}
   */
  lookup: async (upiId) => {
    const validation = validateUPI(upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.LOOKUP, { upiId: validation.formatted });
  },

  /**
   * Verify UPI ID exists
   * @param {string} upiId - UPI ID/VPA
   * @returns {Promise<{verified: boolean, name: string}>}
   */
  verify: async (upiId) => {
    const validation = validateUPI(upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.VERIFY, { upiId: validation.formatted });
  },

  /**
   * Get bank details for UPI
   * @param {string} upiId - UPI ID/VPA
   * @returns {Promise<Object>}
   */
  getBankDetails: async (upiId) => {
    const validation = validateUPI(upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.BANK, { upiId: validation.formatted });
  },

  /**
   * Get transaction history
   * @param {string} upiId - UPI ID/VPA
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  getTransactions: async (upiId, options = {}) => {
    const validation = validateUPI(upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.TRANSACTIONS, { 
      upiId: validation.formatted,
      ...options
    });
  },

  /**
   * Get risk analysis
   * @param {string} upiId - UPI ID/VPA
   * @returns {Promise<Object>}
   */
  getRiskAnalysis: async (upiId) => {
    const validation = validateUPI(upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.RISK, { upiId: validation.formatted });
  },

  /**
   * Get activity pattern
   * @param {string} upiId - UPI ID/VPA
   * @returns {Promise<Object>}
   */
  getActivity: async (upiId) => {
    const validation = validateUPI(upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.ACTIVITY, { upiId: validation.formatted });
  },

  /**
   * Validate UPI ID format
   * @param {string} upiId - UPI ID
   * @returns {Object}
   */
  validate: validateUPI,
};

export default upiInfoService;
