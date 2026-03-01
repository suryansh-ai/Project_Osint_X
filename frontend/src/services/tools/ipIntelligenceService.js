/**
 * IP Intelligence Tool Service
 * Comprehensive IP intelligence and threat analysis
 */

import { api } from '../api';
import { validateIP } from '../../utils/validators';

const ENDPOINTS = {
  LOOKUP: '/tools/ip/lookup',
  REPUTATION: '/tools/ip/reputation',
  WHOIS: '/tools/ip/whois',
  ASN: '/tools/ip/asn',
  THREAT_INTEL: '/tools/ip/threat-intel',
  PORTS: '/tools/ip/ports',
};

const ipIntelligenceService = {
  /**
   * Comprehensive IP lookup
   * @param {string} ip - IP address
   * @returns {Promise<Object>}
   */
  lookup: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.LOOKUP, { ip: ip.trim() });
  },

  /**
   * Check IP reputation
   * @param {string} ip - IP address
   * @returns {Promise<{score: number, blacklisted: boolean, threats: Array}>}
   */
  checkReputation: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.REPUTATION, { ip: ip.trim() });
  },

  /**
   * IP WHOIS lookup
   * @param {string} ip - IP address
   * @returns {Promise<Object>}
   */
  getWhois: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.WHOIS, { ip: ip.trim() });
  },

  /**
   * Get ASN information
   * @param {string} ip - IP address
   * @returns {Promise<{asn: number, org: string, network: string}>}
   */
  getASN: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.ASN, { ip: ip.trim() });
  },

  /**
   * Get threat intelligence
   * @param {string} ip - IP address
   * @returns {Promise<{threats: Array, lastSeen: string}>}
   */
  getThreatIntel: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.THREAT_INTEL, { ip: ip.trim() });
  },

  /**
   * Scan open ports
   * @param {string} ip - IP address
   * @returns {Promise<{openPorts: Array}>}
   */
  scanPorts: async (ip) => {
    const validation = validateIP(ip);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.PORTS, { ip: ip.trim() });
  },
};

export default ipIntelligenceService;
