/**
 * Input Validation Utilities
 * Validates and sanitizes user inputs for OSINT tools
 */

// ==================== REGEX PATTERNS ====================

const PATTERNS = {
  // Email validation (RFC 5322 simplified)
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // IPv4
  IPV4: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
  
  // IPv6
  IPV6: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  
  // Domain name (RFC 1035)
  DOMAIN: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
  
  // URL (http/https)
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  // Phone number (international format with optional +)
  PHONE: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,6}$/,
  
  // MD5 hash
  MD5: /^[a-f0-9]{32}$/i,
  
  // SHA1 hash
  SHA1: /^[a-f0-9]{40}$/i,
  
  // SHA256 hash
  SHA256: /^[a-f0-9]{64}$/i,
  
  // SHA512 hash
  SHA512: /^[a-f0-9]{128}$/i,
  
  // Username (alphanumeric, underscore, hyphen, 3-30 chars)
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  
  // CVE ID
  CVE: /^CVE-\d{4}-\d{4,}$/i,
  
  // MAC Address
  MAC: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Sanitize input by trimming and removing dangerous characters
 * @param {string} input - Raw input
 * @returns {string}
 */
export const sanitize = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateEmail = (email) => {
  const clean = sanitize(email);
  
  if (!clean) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (clean.length > 320) {
    return { valid: false, error: 'Email is too long (max 320 characters)' };
  }
  
  if (!PATTERNS.EMAIL.test(clean)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

/**
 * Validate IP address (v4 or v6)
 * @param {string} ip - IP address to validate
 * @returns {{valid: boolean, version?: 4|6, error?: string}}
 */
export const validateIP = (ip) => {
  const clean = sanitize(ip);
  
  if (!clean) {
    return { valid: false, error: 'IP address is required' };
  }
  
  if (PATTERNS.IPV4.test(clean)) {
    return { valid: true, version: 4 };
  }
  
  if (PATTERNS.IPV6.test(clean)) {
    return { valid: true, version: 6 };
  }
  
  return { valid: false, error: 'Invalid IP address format' };
};

/**
 * Validate domain name
 * @param {string} domain - Domain to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateDomain = (domain) => {
  const clean = sanitize(domain).toLowerCase();
  
  if (!clean) {
    return { valid: false, error: 'Domain is required' };
  }
  
  if (clean.length > 253) {
    return { valid: false, error: 'Domain is too long (max 253 characters)' };
  }
  
  if (!PATTERNS.DOMAIN.test(clean)) {
    return { valid: false, error: 'Invalid domain format' };
  }
  
  return { valid: true };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateURL = (url) => {
  const clean = sanitize(url);
  
  if (!clean) {
    return { valid: false, error: 'URL is required' };
  }
  
  if (clean.length > 2048) {
    return { valid: false, error: 'URL is too long (max 2048 characters)' };
  }
  
  if (!PATTERNS.URL.test(clean)) {
    return { valid: false, error: 'Invalid URL format (must start with http:// or https://)' };
  }
  
  return { valid: true };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validatePhone = (phone) => {
  const clean = sanitize(phone).replace(/\s/g, '');
  
  if (!clean) {
    return { valid: false, error: 'Phone number is required' };
  }
  
  if (clean.length < 7 || clean.length > 20) {
    return { valid: false, error: 'Phone number must be 7-20 digits' };
  }
  
  if (!PATTERNS.PHONE.test(clean)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  
  return { valid: true };
};

/**
 * Validate hash and detect type
 * @param {string} hash - Hash to validate
 * @returns {{valid: boolean, type?: 'MD5'|'SHA1'|'SHA256'|'SHA512', error?: string}}
 */
export const validateHash = (hash) => {
  const clean = sanitize(hash).toLowerCase();
  
  if (!clean) {
    return { valid: false, error: 'Hash is required' };
  }
  
  if (PATTERNS.MD5.test(clean)) {
    return { valid: true, type: 'MD5' };
  }
  
  if (PATTERNS.SHA1.test(clean)) {
    return { valid: true, type: 'SHA1' };
  }
  
  if (PATTERNS.SHA256.test(clean)) {
    return { valid: true, type: 'SHA256' };
  }
  
  if (PATTERNS.SHA512.test(clean)) {
    return { valid: true, type: 'SHA512' };
  }
  
  return { valid: false, error: 'Invalid hash format (expected MD5, SHA1, SHA256, or SHA512)' };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateUsername = (username) => {
  const clean = sanitize(username);
  
  if (!clean) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (!PATTERNS.USERNAME.test(clean)) {
    return { valid: false, error: 'Username must be 3-30 characters (letters, numbers, _, -)' };
  }
  
  return { valid: true };
};

/**
 * Validate CVE ID
 * @param {string} cve - CVE ID to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateCVE = (cve) => {
  const clean = sanitize(cve).toUpperCase();
  
  if (!clean) {
    return { valid: false, error: 'CVE ID is required' };
  }
  
  if (!PATTERNS.CVE.test(clean)) {
    return { valid: false, error: 'Invalid CVE format (expected CVE-YYYY-NNNN)' };
  }
  
  return { valid: true };
};

/**
 * Validate MAC address
 * @param {string} mac - MAC address to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateMAC = (mac) => {
  const clean = sanitize(mac);
  
  if (!clean) {
    return { valid: false, error: 'MAC address is required' };
  }
  
  if (!PATTERNS.MAC.test(clean)) {
    return { valid: false, error: 'Invalid MAC address format' };
  }
  
  return { valid: true };
};

/**
 * Validate file size
 * @param {number} bytes - File size in bytes
 * @param {number} maxMB - Maximum size in MB
 * @returns {{valid: boolean, error?: string}}
 */
export const validateFileSize = (bytes, maxMB = 10) => {
  const maxBytes = maxMB * 1024 * 1024;
  
  if (bytes > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxMB}MB limit` };
  }
  
  return { valid: true };
};

/**
 * Validate file type
 * @param {string} filename - File name
 * @param {string[]} allowedExtensions - Allowed extensions (e.g., ['jpg', 'png'])
 * @returns {{valid: boolean, error?: string}}
 */
export const validateFileType = (filename, allowedExtensions = []) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (!ext) {
    return { valid: false, error: 'File has no extension' };
  }
  
  if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
    return { valid: false, error: `File type .${ext} not allowed. Allowed: ${allowedExtensions.join(', ')}` };
  }
  
  return { valid: true };
};

/**
 * Validate date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {{valid: boolean, error?: string}}
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }
  
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }
  
  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  
  return { valid: true };
};

/**
 * Validate batch input (multiple items separated by newlines/commas)
 * @param {string} input - Batch input
 * @param {Function} validator - Validator function for each item
 * @param {number} maxItems - Maximum number of items
 * @returns {{valid: boolean, items?: string[], errors?: string[], error?: string}}
 */
export const validateBatch = (input, validator, maxItems = 100) => {
  const items = input
    .split(/[\n,]/)
    .map(item => sanitize(item))
    .filter(item => item.length > 0);
  
  if (items.length === 0) {
    return { valid: false, error: 'No items provided' };
  }
  
  if (items.length > maxItems) {
    return { valid: false, error: `Too many items (max ${maxItems})` };
  }
  
  const errors = [];
  const validItems = [];
  
  items.forEach((item, index) => {
    const result = validator(item);
    if (result.valid) {
      validItems.push(item);
    } else {
      errors.push(`Item ${index + 1}: ${result.error}`);
    }
  });
  
  if (validItems.length === 0) {
    return { valid: false, error: 'No valid items found', errors };
  }
  
  return { valid: true, items: validItems, errors: errors.length > 0 ? errors : undefined };
};

// ==================== UTILITY VALIDATORS ====================

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, error?: string}}
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (isEmpty(value)) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {{valid: boolean, error?: string}}
 */
export const validateLength = (value, min = 0, max = Infinity) => {
  const length = value?.length || 0;
  
  if (length < min) {
    return { valid: false, error: `Must be at least ${min} characters` };
  }
  
  if (length > max) {
    return { valid: false, error: `Must be no more than ${max} characters` };
  }
  
  return { valid: true };
};

/**
 * Validate numeric range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {{valid: boolean, error?: string}}
 */
export const validateRange = (value, min = -Infinity, max = Infinity) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Must be a valid number' };
  }
  
  if (value < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }
  
  if (value > max) {
    return { valid: false, error: `Must be no more than ${max}` };
  }
  
  return { valid: true };
};

// Export patterns for custom validation
export { PATTERNS };

// Export all validators as default
export default {
  sanitize,
  validateEmail,
  validateIP,
  validateDomain,
  validateURL,
  validatePhone,
  validateHash,
  validateUsername,
  validateCVE,
  validateMAC,
  validateFileSize,
  validateFileType,
  validateDateRange,
  validateBatch,
  isEmpty,
  validateRequired,
  validateLength,
  validateRange,
  PATTERNS,
};
