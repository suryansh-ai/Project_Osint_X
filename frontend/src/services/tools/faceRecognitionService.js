/**
 * Face Recognition Tool Service
 * Facial recognition and biometric analysis
 */

import { api } from '../api';

const ENDPOINTS = {
  ANALYZE: '/tools/face/analyze',
  MATCH: '/tools/face/match',
  ATTRIBUTES: '/tools/face/attributes',
  SOCIAL: '/tools/face/social-search',
  BIOMETRIC: '/tools/face/biometric',
  RISK: '/tools/face/risk-assessment',
};

const faceRecognitionService = {
  /**
   * Analyze face in image
   * @param {File|Blob|string} image - Image file or base64 string
   * @returns {Promise<Object>}
   */
  analyze: async (image) => {
    if (!image) {
      throw new Error('Image is required');
    }

    const formData = new FormData();
    if (image instanceof File || image instanceof Blob) {
      formData.append('image', image);
    } else {
      formData.append('imageBase64', image);
    }
    
    return api.post(ENDPOINTS.ANALYZE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Find matching faces in database
   * @param {File|Blob|string} image - Image file or base64 string
   * @param {Object} options - Search options
   * @returns {Promise<Object>}
   */
  findMatches: async (image, options = {}) => {
    if (!image) {
      throw new Error('Image is required');
    }

    const formData = new FormData();
    if (image instanceof File || image instanceof Blob) {
      formData.append('image', image);
    } else {
      formData.append('imageBase64', image);
    }
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });
    
    return api.post(ENDPOINTS.MATCH, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Get facial attributes
   * @param {File|Blob|string} image - Image file or base64 string
   * @returns {Promise<Object>}
   */
  getAttributes: async (image) => {
    if (!image) {
      throw new Error('Image is required');
    }

    const formData = new FormData();
    if (image instanceof File || image instanceof Blob) {
      formData.append('image', image);
    } else {
      formData.append('imageBase64', image);
    }
    
    return api.post(ENDPOINTS.ATTRIBUTES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Search social media profiles
   * @param {File|Blob|string} image - Image file or base64 string
   * @returns {Promise<Object>}
   */
  searchSocial: async (image) => {
    if (!image) {
      throw new Error('Image is required');
    }

    const formData = new FormData();
    if (image instanceof File || image instanceof Blob) {
      formData.append('image', image);
    } else {
      formData.append('imageBase64', image);
    }
    
    return api.post(ENDPOINTS.SOCIAL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Get biometric data
   * @param {File|Blob|string} image - Image file or base64 string
   * @returns {Promise<Object>}
   */
  getBiometricData: async (image) => {
    if (!image) {
      throw new Error('Image is required');
    }

    const formData = new FormData();
    if (image instanceof File || image instanceof Blob) {
      formData.append('image', image);
    } else {
      formData.append('imageBase64', image);
    }
    
    return api.post(ENDPOINTS.BIOMETRIC, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Get risk assessment
   * @param {File|Blob|string} image - Image file or base64 string
   * @returns {Promise<Object>}
   */
  getRiskAssessment: async (image) => {
    if (!image) {
      throw new Error('Image is required');
    }

    const formData = new FormData();
    if (image instanceof File || image instanceof Blob) {
      formData.append('image', image);
    } else {
      formData.append('imageBase64', image);
    }
    
    return api.post(ENDPOINTS.RISK, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default faceRecognitionService;
