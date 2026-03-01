/**
 * Mock Data for Development
 * Test data for all tools when API is unavailable
 */

export const mockBreachData = {
  email: {
    breached: true,
    breaches: [
      {
        name: 'Collection #1',
        date: '2019-01-07',
        records: 773000000,
        dataClasses: ['Email addresses', 'Passwords'],
      },
      {
        name: 'LinkedIn',
        date: '2021-06-22',
        records: 700000000,
        dataClasses: ['Email addresses', 'Full names', 'Phone numbers', 'Geolocation'],
      },
    ],
    totalRecords: 3,
  },
  password: {
    breached: true,
    occurrences: 142567,
  },
};

export const mockDNSData = {
  domain: 'example.com',
  records: {
    A: ['93.184.216.34'],
    AAAA: ['2606:2800:220:1:248:1893:25c8:1946'],
    MX: [
      { priority: 10, exchange: 'mail.example.com' },
      { priority: 20, exchange: 'mail2.example.com' },
    ],
    NS: ['ns1.example.com', 'ns2.example.com'],
    TXT: ['v=spf1 include:_spf.example.com ~all', 'google-site-verification=abc123'],
    CNAME: [],
  },
};

export const mockDomainData = {
  whois: {
    domain: 'example.com',
    registrar: 'RESERVED-Internet Assigned Numbers Authority',
    createdDate: '1995-08-14T04:00:00Z',
    expiryDate: '2024-08-13T04:00:00Z',
    updatedDate: '2023-08-14T07:01:34Z',
    nameServers: ['A.IANA-SERVERS.NET', 'B.IANA-SERVERS.NET'],
    status: ['clientDeleteProhibited', 'clientTransferProhibited', 'clientUpdateProhibited'],
    registrant: {
      organization: 'Internet Assigned Numbers Authority',
      country: 'US',
    },
  },
  subdomains: {
    subdomains: [
      'www.example.com',
      'mail.example.com',
      'ftp.example.com',
      'api.example.com',
      'blog.example.com',
    ],
  },
  ssl: {
    valid: true,
    issuer: "Let's Encrypt",
    validFrom: '2024-01-01',
    validTo: '2024-04-01',
    algorithm: 'RSA 2048 bit',
    protocol: 'TLSv1.3',
  },
};

export const mockEmailData = {
  headers: {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    date: '2024-01-07T10:30:00Z',
    messageId: '<abc123@example.com>',
    receivedPath: [
      { server: 'mail.example.com', ip: '192.0.2.1', timestamp: '2024-01-07T10:30:00Z' },
      { server: 'relay.example.com', ip: '192.0.2.2', timestamp: '2024-01-07T10:30:05Z' },
    ],
  },
  verification: {
    valid: true,
    deliverable: true,
    disposable: false,
    role: false,
    smtp: {
      valid: true,
      mailbox: true,
    },
  },
};

export const mockGeolocationData = {
  ip: {
    ip: '8.8.8.8',
    country: 'United States',
    countryCode: 'US',
    region: 'California',
    city: 'Mountain View',
    latitude: 37.386,
    longitude: -122.0838,
    timezone: 'America/Los_Angeles',
    isp: 'Google LLC',
    org: 'Google Public DNS',
    asn: 'AS15169',
  },
  phone: {
    country: 'United States',
    countryCode: 'US',
    carrier: 'Verizon Wireless',
    type: 'mobile',
    timezone: 'America/New_York',
  },
};

export const mockHashData = {
  hash: '44d88612fea8a8f36de82e1278abb02f',
  type: 'MD5',
  malicious: true,
  detections: 58,
  vendors: [
    { name: 'Kaspersky', result: 'Trojan.Win32.Generic', detected: true },
    { name: 'Microsoft', result: 'Trojan:Win32/Wacatac', detected: true },
    { name: 'Avast', result: 'Win32:Malware-gen', detected: true },
  ],
  fileInfo: {
    name: 'malware.exe',
    size: 524288,
    type: 'PE32 executable',
  },
  firstSeen: '2023-12-15T14:22:00Z',
  lastSeen: '2024-01-07T08:15:00Z',
};

export const mockIPData = {
  lookup: {
    ip: '1.1.1.1',
    hostname: 'one.one.one.one',
    country: 'Australia',
    countryCode: 'AU',
    region: 'Queensland',
    city: 'Brisbane',
    latitude: -27.4679,
    longitude: 153.0281,
    timezone: 'Australia/Brisbane',
    isp: 'Cloudflare Inc',
    org: 'APNIC Research and Development',
    asn: 'AS13335',
  },
  reputation: {
    score: 95,
    blacklisted: false,
    threats: [],
    category: 'CDN/Proxy',
  },
  ports: {
    openPorts: [
      { port: 80, service: 'HTTP', state: 'open' },
      { port: 443, service: 'HTTPS', state: 'open' },
    ],
  },
};

export const mockPhoneData = {
  phone: '+1 (650) 253-0000',
  country: 'United States',
  countryCode: 'US',
  carrier: 'Google Voice',
  type: 'voip',
  formatted: '+1 650-253-0000',
  valid: true,
  reputation: {
    spam: false,
    fraud: false,
    score: 85,
  },
};

export const mockSocialData = {
  search: {
    profiles: [
      {
        platform: 'github',
        username: 'johndoe',
        url: 'https://github.com/johndoe',
        followers: 1234,
        bio: 'Software developer',
      },
      {
        platform: 'twitter',
        username: 'johndoe',
        url: 'https://twitter.com/johndoe',
        followers: 5678,
        bio: 'Tech enthusiast',
      },
    ],
  },
  username: {
    platforms: [
      { name: 'GitHub', available: false, url: 'https://github.com/johndoe' },
      { name: 'Twitter', available: false, url: 'https://twitter.com/johndoe' },
      { name: 'Instagram', available: true, url: null },
      { name: 'LinkedIn', available: false, url: 'https://linkedin.com/in/johndoe' },
    ],
  },
};

export const mockURLData = {
  scan: {
    url: 'https://example.com',
    safe: true,
    threats: [],
    score: 92,
    categories: ['Technology', 'Example'],
  },
  analyze: {
    url: 'https://example.com/path?query=value',
    protocol: 'https',
    domain: 'example.com',
    path: '/path',
    query: { query: 'value' },
    ssl: true,
    redirects: [],
    finalUrl: 'https://example.com/path?query=value',
  },
  reputation: {
    reputation: 'good',
    blacklisted: false,
    age: 10512, // days
    rank: 42,
  },
};

export const mockDataMiningData = {
  extract: {
    emails: ['contact@example.com', 'info@example.com'],
    ips: ['192.168.1.1', '10.0.0.1'],
    urls: ['https://example.com', 'http://test.com'],
    phones: ['+1-555-0123', '555-0124'],
  },
  patterns: {
    patterns: [
      { type: 'temporal', description: 'Activity spikes every Monday 9AM', confidence: 0.89 },
      { type: 'behavioral', description: 'Repeated access from same IP range', confidence: 0.95 },
    ],
    insights: {
      totalPatterns: 12,
      highConfidence: 8,
    },
  },
};

export const mockThreatMapData = {
  cities: [
    {
      id: 'nyc',
      name: 'New York',
      country: 'USA',
      coords: [-74.006, 40.7128],
      threat: 'high',
      attacks: 2847,
      type: 'Financial Hub',
    },
    {
      id: 'lon',
      name: 'London',
      country: 'UK',
      coords: [-0.1276, 51.5074],
      threat: 'high',
      attacks: 3892,
      type: 'Financial Hub',
    },
  ],
  attacks: [
    {
      id: '1',
      source: { id: 'bei', name: 'Beijing', coords: [116.4074, 39.9042] },
      target: { id: 'nyc', name: 'New York', coords: [-74.006, 40.7128] },
      type: 'APT',
      packets: 45000,
      timestamp: Date.now(),
    },
  ],
  stats: {
    attacksPerSec: 147,
    activeThreats: 234,
    blockedIPs: 45892,
    dataExfiltrated: 2.7,
    botnets: 23,
    compromised: 156892,
  },
  threatLevel: {
    level: 72,
    defcon: 'DEFCON3',
    status: 'ELEVATED',
    trend: 'increasing',
  },
};

// Mock service responses simulator
export const createMockResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock error simulator
export const createMockError = (message, delay = 500) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

export default {
  breach: mockBreachData,
  dns: mockDNSData,
  domain: mockDomainData,
  email: mockEmailData,
  geolocation: mockGeolocationData,
  hash: mockHashData,
  ip: mockIPData,
  phone: mockPhoneData,
  social: mockSocialData,
  url: mockURLData,
  dataMining: mockDataMiningData,
  threatMap: mockThreatMapData,
};
