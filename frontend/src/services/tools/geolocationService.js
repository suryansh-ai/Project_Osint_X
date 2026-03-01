/**
 * Geolocation Tool Service
 * IP and phone geolocation lookup
 */

import { api } from '../api';
import { validateIP, validatePhone } from '../../utils/validators';

const ENDPOINTS = {
  IP_LOOKUP: '/tools/geolocation/ip',
  PHONE_LOOKUP: '/tools/geolocation/phone',
  BATCH_IP: '/tools/geolocation/batch-ip',
};

const geolocationService = {
  /**
   * Lookup IP geolocation
   * @param {string} ip - IP address
   * @returns {Promise<Object>}
   */
  lookupIP: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.IP_LOOKUP, { ip: ip.trim() });
  },

  /**
   * Lookup phone geolocation
   * @param {string} phone - Phone number
   * @returns {Promise<Object>}
   */
  lookupPhone: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.PHONE_LOOKUP, { phone: phone.trim() });
  },

  /**
   * Batch IP lookup
   * @param {string[]} ips - Array of IP addresses
   * @returns {Promise<Array>}
   */
  batchLookupIP: async (ips) => {
    if (!ips || ips.length === 0) {
      throw new Error('At least one IP address is required');
    }
    
    return api.post(ENDPOINTS.BATCH_IP, { ips });
  },
};

export default geolocationService;
