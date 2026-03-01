/**
 * Hash Analyzer Tool Service
 * Analyze file hashes for malware detection
 */

import { api } from '../api';
import { validateHash } from '../../utils/validators';

const ENDPOINTS = {
  ANALYZE: '/tools/hash/analyze',
  SEARCH: '/tools/hash/search',
  BATCH: '/tools/hash/batch',
  SUBMIT: '/tools/hash/submit',
};

const hashAnalyzerService = {
  /**
   * Analyze file hash
   * @param {string} hash - File hash (MD5, SHA1, SHA256, SHA512)
   * @returns {Promise<Object>}
   */
  analyzeHash: async (hash) => {
    const validation = validateHash(hash);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.ANALYZE, { 
      hash: hash.trim().toLowerCase(),
      type: validation.type 
    });
  },

  /**
   * Search hash in threat databases
   * @param {string} hash - File hash
   * @returns {Promise<{malicious: boolean, detections: number, vendors: Array}>}
   */
  searchHash: async (hash) => {
    const validation = validateHash(hash);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.SEARCH, { 
      hash: hash.trim().toLowerCase() 
    });
  },

  /**
   * Batch hash analysis
   * @param {string[]} hashes - Array of hashes
   * @returns {Promise<Array>}
   */
  batchAnalyze: async (hashes) => {
    if (!hashes || hashes.length === 0) {
      throw new Error('At least one hash is required');
    }
    
    return api.post(ENDPOINTS.BATCH, { hashes });
  },

  /**
   * Submit suspicious hash
   * @param {string} hash - File hash
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<{submitted: boolean, analysisId: string}>}
   */
  submitHash: async (hash, metadata = {}) => {
    const validation = validateHash(hash);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.SUBMIT, { 
      hash: hash.trim().toLowerCase(),
      metadata 
    });
  },
};

export default hashAnalyzerService;
