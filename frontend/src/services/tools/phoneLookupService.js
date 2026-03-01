/**
 * Phone Lookup Tool Service
 * Phone number intelligence and carrier lookup
 */

import { api } from '../api';
import { validatePhone } from '../../utils/validators';

const ENDPOINTS = {
  LOOKUP: '/tools/phone/lookup',
  CARRIER: '/tools/phone/carrier',
  VALIDATE: '/tools/phone/validate',
  REPUTATION: '/tools/phone/reputation',
};

const phoneLookupService = {
  /**
   * Comprehensive phone lookup
   * @param {string} phone - Phone number
   * @returns {Promise<Object>}
   */
  lookup: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.LOOKUP, { phone: phone.trim() });
  },

  /**
   * Get carrier information
   * @param {string} phone - Phone number
   * @returns {Promise<{carrier: string, type: string, country: string}>}
   */
  getCarrier: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.CARRIER, { phone: phone.trim() });
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone number
   * @returns {Promise<{valid: boolean, formatted: string, country: string}>}
   */
  validate: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.VALIDATE, { phone: phone.trim() });
  },

  /**
   * Check phone reputation
   * @param {string} phone - Phone number
   * @returns {Promise<{spam: boolean, fraud: boolean, score: number}>}
   */
  checkReputation: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.REPUTATION, { phone: phone.trim() });
  },
};

export default phoneLookupService;
