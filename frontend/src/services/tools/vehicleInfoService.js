/**
 * Vehicle Info Tool Service
 * RTO database lookup for vehicle registration information
 */

import { api } from '../api';

const ENDPOINTS = {
  LOOKUP: '/tools/vehicle/lookup',
  REGISTRATION: '/tools/vehicle/registration',
  OWNER: '/tools/vehicle/owner',
  FITNESS: '/tools/vehicle/fitness',
  TAX: '/tools/vehicle/tax',
  HISTORY: '/tools/vehicle/history',
  CHALLAN: '/tools/vehicle/challan',
};

/**
 * Validate Indian vehicle registration number
 * @param {string} regNo - Registration number
 * @returns {Object}
 */
const validateVehicleNumber = (regNo) => {
  if (!regNo || !regNo.trim()) {
    return { valid: false, error: 'Vehicle registration number is required' };
  }
  
  // Indian vehicle registration pattern: XX00XX0000 or XX00X0000
  const pattern = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}$/i;
  const cleanedNumber = regNo.replace(/[\s-]/g, '').toUpperCase();
  
  if (!pattern.test(cleanedNumber)) {
    return { valid: false, error: 'Invalid vehicle registration number format' };
  }
  
  return { valid: true, formatted: cleanedNumber };
};

const vehicleInfoService = {
  /**
   * Comprehensive vehicle lookup
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  lookup: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.LOOKUP, { registrationNumber: validation.formatted });
  },

  /**
   * Get registration details
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  getRegistration: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.REGISTRATION, { registrationNumber: validation.formatted });
  },

  /**
   * Get owner information
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  getOwner: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.OWNER, { registrationNumber: validation.formatted });
  },

  /**
   * Get fitness certificate details
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  getFitness: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.FITNESS, { registrationNumber: validation.formatted });
  },

  /**
   * Get tax payment status
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  getTaxStatus: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.TAX, { registrationNumber: validation.formatted });
  },

  /**
   * Get vehicle history
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  getHistory: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.HISTORY, { registrationNumber: validation.formatted });
  },

  /**
   * Get challan/violation records
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>}
   */
  getChallanHistory: async (regNo) => {
    const validation = validateVehicleNumber(regNo);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.CHALLAN, { registrationNumber: validation.formatted });
  },

  /**
   * Validate vehicle number format
   * @param {string} regNo - Vehicle registration number
   * @returns {Object}
   */
  validate: validateVehicleNumber,
};

export default vehicleInfoService;
