/**
 * URL Scanner Tool Service
 * Scan and analyze URLs for threats
 */

import { api } from '../api';
import { validateURL } from '../../utils/validators';

const ENDPOINTS = {
  SCAN: '/tools/url/scan',
  ANALYZE: '/tools/url/analyze',
  SCREENSHOT: '/tools/url/screenshot',
  REPUTATION: '/tools/url/reputation',
  WHOIS: '/tools/url/whois',
};

const urlScannerService = {
  /**
   * Scan URL for threats
   * @param {string} url - URL to scan
   * @returns {Promise<{safe: boolean, threats: Array, score: number}>}
   */
  scanURL: async (url) => {
    const validation = validateURL(url);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.SCAN, { url: url.trim() });
  },

  /**
   * Analyze URL structure and metadata
   * @param {string} url - URL to analyze
   * @returns {Promise<Object>}
   */
  analyzeURL: async (url) => {
    const validation = validateURL(url);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.ANALYZE, { url: url.trim() });
  },

  /**
   * Get URL screenshot
   * @param {string} url - URL to screenshot
   * @returns {Promise<{imageUrl: string}>}
   */
  getScreenshot: async (url) => {
    const validation = validateURL(url);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.SCREENSHOT, { url: url.trim() });
  },

  /**
   * Check URL reputation
   * @param {string} url - URL to check
   * @returns {Promise<{reputation: string, blacklisted: boolean}>}
   */
  checkReputation: async (url) => {
    const validation = validateURL(url);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.REPUTATION, { url: url.trim() });
  },

  /**
   * Get WHOIS for URL domain
   * @param {string} url - URL
   * @returns {Promise<Object>}
   */
  getWhois: async (url) => {
    const validation = validateURL(url);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.WHOIS, { url: url.trim() });
  },
};

export default urlScannerService;
