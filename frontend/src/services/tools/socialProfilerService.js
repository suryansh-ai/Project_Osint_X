/**
 * Social Profiler Tool Service
 * OSINT on social media profiles and usernames
 */

import { api } from '../api';
import { validateUsername } from '../../utils/validators';

const ENDPOINTS = {
  SEARCH: '/tools/social/search',
  PROFILE: '/tools/social/profile',
  USERNAME: '/tools/social/username',
  ACTIVITY: '/tools/social/activity',
};

const socialProfilerService = {
  /**
   * Search across social platforms
   * @param {string} query - Search query (name, username, email)
   * @returns {Promise<{profiles: Array}>}
   */
  search: async (query) => {
    if (!query || !query.trim()) {
      throw new Error('Search query is required');
    }
    
    return api.post(ENDPOINTS.SEARCH, { query: query.trim() });
  },

  /**
   * Get profile details
   * @param {string} platform - Social platform
   * @param {string} identifier - Username or profile ID
   * @returns {Promise<Object>}
   */
  getProfile: async (platform, identifier) => {
    if (!platform || !identifier) {
      throw new Error('Platform and identifier are required');
    }
    
    return api.post(ENDPOINTS.PROFILE, { 
      platform: platform.toLowerCase(),
      identifier: identifier.trim() 
    });
  },

  /**
   * Check username availability across platforms
   * @param {string} username - Username to check
   * @returns {Promise<{platforms: Array<{name: string, available: boolean, url: string}>}>}
   */
  checkUsername: async (username) => {
    const validation = validateUsername(username);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return api.post(ENDPOINTS.USERNAME, { username: username.trim() });
  },

  /**
   * Get user activity timeline
   * @param {string} platform - Social platform
   * @param {string} username - Username
   * @returns {Promise<{posts: Array, activity: Object}>}
   */
  getActivity: async (platform, username) => {
    if (!platform || !username) {
      throw new Error('Platform and username are required');
    }
    
    return api.post(ENDPOINTS.ACTIVITY, { 
      platform: platform.toLowerCase(),
      username: username.trim() 
    });
  },
};

export default socialProfilerService;
