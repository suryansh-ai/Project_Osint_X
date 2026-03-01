/**
 * Feature Flags System
 * Enable/disable features without redeployment
 */

const defaultFlags = {
  // Tools
  'tool.breach-database': true,
  'tool.data-mining': true,
  'tool.dns-records': true,
  'tool.domain-analysis': true,
  'tool.email-intel': true,
  'tool.geolocation': true,
  'tool.hash-analyzer': true,
  'tool.ip-intelligence': true,
  'tool.phone-lookup': true,
  'tool.social-profiler': true,
  'tool.url-scanner': true,
  
  // Features
  'feature.threat-map': true,
  'feature.batch-operations': true,
  'feature.export': true,
  'feature.history': true,
  'feature.bookmarks': true,
  'feature.analytics': false,
  'feature.pwa': false,
  
  // UI Features
  'ui.dark-mode': true,
  'ui.keyboard-shortcuts': true,
  'ui.advanced-filters': true,
  
  // Experimental
  'experimental.ai-assistant': false,
  'experimental.real-time-collaboration': false,
};

// Feature flags storage key
const STORAGE_KEY = 'osintx_featureFlags';

// Load flags from localStorage
let flags = { ...defaultFlags };

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      flags = { ...defaultFlags, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('[FeatureFlags] Failed to load:', error);
  }
}

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  // Check environment override
  const envKey = `VITE_FEATURE_${featureName.toUpperCase().replace(/[.-]/g, '_')}`;
  const envValue = import.meta.env[envKey];
  
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === true;
  }

  // Check role-based access
  const role = getUserRole();
  const roleOverrides = getRoleOverrides(role);
  
  if (roleOverrides[featureName] !== undefined) {
    return roleOverrides[featureName];
  }

  // Default flag value
  return flags[featureName] ?? false;
};

/**
 * Enable feature
 */
export const enableFeature = (featureName) => {
  flags[featureName] = true;
  saveFlags();
};

/**
 * Disable feature
 */
export const disableFeature = (featureName) => {
  flags[featureName] = false;
  saveFlags();
};

/**
 * Toggle feature
 */
export const toggleFeature = (featureName) => {
  flags[featureName] = !flags[featureName];
  saveFlags();
  return flags[featureName];
};

/**
 * Set feature flag value
 */
export const setFeatureFlag = (featureName, value) => {
  flags[featureName] = Boolean(value);
  saveFlags();
};

/**
 * Get all feature flags
 */
export const getAllFlags = () => ({ ...flags });

/**
 * Reset to default flags
 */
export const resetFlags = () => {
  flags = { ...defaultFlags };
  saveFlags();
};

/**
 * Import flags from JSON
 */
export const importFlags = (flagsObject) => {
  flags = { ...defaultFlags, ...flagsObject };
  saveFlags();
};

/**
 * Save flags to localStorage
 */
const saveFlags = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch (error) {
    console.error('[FeatureFlags] Failed to save:', error);
  }
};

/**
 * Get user role
 */
const getUserRole = () => {
  try {
    return localStorage.getItem('userRole') || 'user';
  } catch {
    return 'user';
  }
};

/**
 * Role-based feature overrides
 */
const getRoleOverrides = (role) => {
  const overrides = {
    student: {
      'tool.data-mining': false,
      'tool.social-profiler': false,
      'feature.batch-operations': false,
      'feature.advanced-filters': false,
    },
    user: {},
  };

  return overrides[role] || {};
};

/**
 * Feature flag hook for React components
 */
export const useFeatureFlag = (featureName) => {
  if (typeof window === 'undefined') return false;
  
  const [enabled, setEnabled] = React.useState(isFeatureEnabled(featureName));

  React.useEffect(() => {
    const handleStorageChange = () => {
      setEnabled(isFeatureEnabled(featureName));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [featureName]);

  return enabled;
};

/**
 * Conditional rendering based on feature flag
 */
export const FeatureFlag = ({ name, children, fallback = null }) => {
  const enabled = isFeatureEnabled(name);
  return enabled ? children : fallback;
};

/**
 * Get enabled tools for current user
 */
export const getEnabledTools = () => {
  return Object.keys(flags)
    .filter(key => key.startsWith('tool.') && flags[key])
    .map(key => key.replace('tool.', ''));
};

/**
 * Check if tool is enabled
 */
export const isToolEnabled = (toolName) => {
  return isFeatureEnabled(`tool.${toolName}`);
};

// Expose to window for debugging in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__featureFlags = {
    isEnabled: isFeatureEnabled,
    enable: enableFeature,
    disable: disableFeature,
    toggle: toggleFeature,
    getAll: getAllFlags,
    reset: resetFlags,
  };
}

export default {
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  toggleFeature,
  setFeatureFlag,
  getAllFlags,
  resetFlags,
  importFlags,
  isToolEnabled,
  getEnabledTools,
};
