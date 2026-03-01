/**
 * WhatsApp Trace Tool Service
 * WhatsApp call IP trace and network analysis
 */

import { api } from '../api';
import { validatePhone } from '../../utils/validators';

const ENDPOINTS = {
  TRACE: '/tools/whatsapp/trace',
  IP_DETAILS: '/tools/whatsapp/ip-details',
  NETWORK: '/tools/whatsapp/network',
  DEVICE: '/tools/whatsapp/device',
  HISTORY: '/tools/whatsapp/history',
};

const whatsappTraceService = {
  /**
   * Trace WhatsApp call IP
   * @param {string} phone - Phone number
   * @returns {Promise<Object>}
   */
  trace: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.TRACE, { phone: phone.trim() });
  },

  /**
   * Get IP details from WhatsApp trace
   * @param {string} ip - IP address
   * @returns {Promise<Object>}
   */
  getIPDetails: async (ip) => {
    if (!ip || !ip.trim()) {
      throw new Error('IP address is required');
    }
    
    return api.post(ENDPOINTS.IP_DETAILS, { ip: ip.trim() });
  },

  /**
   * Get network information
   * @param {string} phone - Phone number
   * @returns {Promise<Object>}
   */
  getNetworkInfo: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.NETWORK, { phone: phone.trim() });
  },

  /**
   * Get device information
   * @param {string} phone - Phone number
   * @returns {Promise<Object>}
   */
  getDeviceInfo: async (phone) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.DEVICE, { phone: phone.trim() });
  },

  /**
   * Get call history
   * @param {string} phone - Phone number
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  getHistory: async (phone, options = {}) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.HISTORY, { 
      phone: phone.trim(),
      ...options
    });
  },
};

export default whatsappTraceService;
