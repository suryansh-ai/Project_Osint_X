/**
 * Data Mining Tool Service
 * Advanced data extraction and pattern matching
 */

import { api } from '../api';

const ENDPOINTS = {
  EXTRACT: '/tools/data-mining/extract',
  PATTERN: '/tools/data-mining/pattern',
  CORRELATE: '/tools/data-mining/correlate',
  TIMELINE: '/tools/data-mining/timeline',
};

const dataMiningService = {
  /**
   * Extract structured data from text
   * @param {string} text - Text to analyze
   * @param {string[]} patterns - Patterns to extract (email, ip, url, phone, etc.)
   * @returns {Promise<Object>}
   */
  extractData: async (text, patterns = ['email', 'ip', 'url', 'phone']) => {
    if (!text || !text.trim()) {
      throw new Error('Text is required');
    }
    
    return api.post(ENDPOINTS.EXTRACT, { text, patterns });
  },

  /**
   * Find patterns in dataset
   * @param {Array} dataset - Data to analyze
   * @param {Object} options - Pattern matching options
   * @returns {Promise<{patterns: Array, insights: Object}>}
   */
  findPatterns: async (dataset, options = {}) => {
    if (!dataset || dataset.length === 0) {
      throw new Error('Dataset is required');
    }
    
    return api.post(ENDPOINTS.PATTERN, { dataset, options });
  },

  /**
   * Correlate data points
   * @param {Array} dataPoints - Data points to correlate
   * @returns {Promise<{correlations: Array, graph: Object}>}
   */
  correlateData: async (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) {
      throw new Error('Data points are required');
    }
    
    return api.post(ENDPOINTS.CORRELATE, { dataPoints });
  },

  /**
   * Generate timeline from events
   * @param {Array} events - Events with timestamps
   * @returns {Promise<{timeline: Array, summary: Object}>}
   */
  generateTimeline: async (events) => {
    if (!events || events.length === 0) {
      throw new Error('Events are required');
    }
    
    return api.post(ENDPOINTS.TIMELINE, { events });
  },
};

export default dataMiningService;
