/**
 * Mock Data for Development — ENHANCED
 * ------------------------------------------------------------------
 * NOTE: All records below are fully synthetic and clearly marked.
 * They include illustrative sensitive fields that are MASKED or labeled
 * to avoid exposing real personal data. Use only for development and
 * UI testing. Do NOT use for production or as real identities.
 * ------------------------------------------------------------------
 */

export const mockBreachData = {
  email: {
    breached: true,
    breaches: [
      {
        id: 'SYN-BR-2019-001',
        name: 'Collection #1 (SYNTHETIC)',
        date: '2019-01-07',
        records: 773000000,
        dataClasses: ['Email addresses', 'Passwords', 'Masked phone numbers'],
        sampleRecords: [
          { email: 'alice.synth@example.com', passwordHash: '***masked***' },
          { email: 'bob.synth@example.com', passwordHash: '***masked***' }
        ],
        note: 'Synthetic breach dataset for UI testing — no real users.'
      },
      {
        id: 'SYN-BR-2021-002',
        name: 'Professional Network Dump (SYNTHETIC)',
        date: '2021-06-22',
        records: 700000000,
        dataClasses: ['Email addresses', 'Full names', 'Phone numbers (masked)', 'Approx. geolocation'],
        sampleRecords: [
          { name: 'Jordan Trace (SYNTH)', email: 'j.trace@example.com', phone: '+1-555-0102' }
        ]
      }
    ],
    totalRecords: 2
  },
  password: {
    breached: true,
    occurrences: 142567,
    topPasswords: [ '123456', 'password', 'synth-demo-2024' ]
  }
};

export const mockDNSData = {
  domain: 'synth-example.test',
  records: {
    A: ['198.51.100.12'],
    AAAA: [],
    MX: [ { priority: 10, exchange: 'mail.synth-example.test' } ],
    NS: ['ns1.synth-example.test', 'ns2.synth-example.test'],
    TXT: [ 'v=spf1 include:_spf.synth-example.test ~all' ],
    CNAME: [ 'alias.synth-example.test' ]
  },
  resolverInfo: {
    queriedAt: '2025-12-28T12:00:00Z',
    resolver: '198.51.100.53',
    latencyMs: 82
  }
};

export const mockDomainData = {
  whois: {
    domain: 'synth-example.test',
    registrar: 'SYNTHETIC REGISTRAR LTD',
    createdDate: '2020-05-18T00:00:00Z',
    expiryDate: '2026-05-18T00:00:00Z',
    updatedDate: '2025-06-01T08:21:00Z',
    nameServers: ['ns1.synth-example.test', 'ns2.synth-example.test'],
    status: ['active'],
    registrant: {
      organization: 'SYN-Org (synthetic)',
      country: 'ZZ'
    }
  },
  subdomains: {
    subdomains: [ 'www.synth-example.test', 'api.synth-example.test', 'dev.synth-example.test' ]
  },
  ssl: {
    valid: true,
    issuer: "Test CA (SYNTHETIC)",
    validFrom: '2025-01-01',
    validTo: '2026-01-01',
    algorithm: 'RSA 4096 bit',
    protocol: 'TLSv1.3'
  }
};

export const mockEmailData = {
  headers: {
    from: 'no-reply@synth-example.test',
    to: 'jordan.trace@example.com',
    subject: 'SYNTHETIC – Investigation Report Ready',
    date: '2025-12-28T10:30:00Z',
    messageId: '<synth-20251228-0001@synth-example.test>',
    receivedPath: [
      { server: 'mx1.synth-mta.test', ip: '198.51.100.7', timestamp: '2025-12-28T10:30:00Z' },
      { server: 'relay1.synth-mta.test', ip: '198.51.100.25', timestamp: '2025-12-28T10:30:08Z' }
    ],
    dkim: { signed: true, valid: true },
    spf: { pass: true }
  },
  verification: {
    valid: true,
    deliverable: true,
    disposable: false,
    role: false,
    smtp: { valid: true, mailbox: true }
  },
  mime: {
    contentType: 'text/html',
    attachments: [ { name: 'report.pdf', size: 234567 } ]
  }
};

export const mockGeolocationData = {
  ip: {
    ip: '203.0.113.42',
    country: 'US',
    countryCode: 'US',
    region: 'California',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
    isp: 'Synthetic ISP Inc',
    org: 'SYN-Org Network',
    asn: 'AS64496'
  },
  device: {
    lastSeen: '2025-12-27T22:10:00Z',
    userAgent: 'Mozilla/5.0 (Synthetic; Demo)',
    fingerprint: 'synth-fp-0001',
    approximateLocationAccuracyKm: 5
  },
  phone: {
    country: 'US',
    countryCode: 'US',
    carrier: 'SYNTH-Carrier',
    type: 'mobile',
    timezone: 'America/Los_Angeles'
  }
};

export const mockHashData = {
  hash: 'e2fc714c4727ee9395f324cd2e7f331f',
  type: 'MD5 (synthetic)',
  malicious: false,
  detections: 0,
  vendors: [],
  fileInfo: { name: 'document-scan.pdf', size: 124567, type: 'PDF' },
  firstSeen: '2025-11-01T12:00:00Z',
  lastSeen: '2025-12-10T08:15:00Z'
};

export const mockIPData = {
  lookup: {
    ip: '198.51.100.12',
    hostname: 'host.synth-example.test',
    country: 'US',
    countryCode: 'US',
    region: 'California',
    city: 'San Jose',
    latitude: 37.3382,
    longitude: -121.8863,
    timezone: 'America/Los_Angeles',
    isp: 'Synthetic Hosting',
    org: 'SYN-Cloud',
    asn: 'AS64497'
  },
  reputation: { score: 45, blacklisted: true, threats: ['botnet', 'malicious-traffic'], category: 'suspicious' },
  ports: { openPorts: [ { port: 22, service: 'ssh', state: 'open' }, { port: 8080, service: 'http-alt', state: 'open' } ] }
};

export const mockPhoneData = {
  phone: '+1-555-0102',
  country: 'US',
  countryCode: 'US',
  carrier: 'SYNTH-Carrier',
  type: 'mobile',
  formatted: '+1 555-0102',
  valid: true,
  reputation: { spam: false, fraud: false, score: 72 },
  associatedProfiles: [ { platform: 'messaging-app', id: 'synth-msg-001' } ]
};

export const mockSocialData = {
  search: {
    profiles: [
      {
        platform: 'github',
        username: 'synthdev',
        url: 'https://github.com/synthdev',
        followers: 120,
        bio: 'Synthetic developer account for demonstrations',
        lastActive: '2025-12-20T11:00:00Z',
        connections: [ 'synth-analyst-1', 'synth-analyst-2' ]
      },
      {
        platform: 'linkedin',
        username: 'synth-jordan',
        url: 'https://linkedin.com/in/synth-jordan',
        followers: 340,
        bio: 'Senior Investigator (SYNTHETIC)'
      }
    ]
  },
  username: {
    platforms: [ { name: 'GitHub', available: false }, { name: 'Twitter', available: true }, { name: 'Instagram', available: true } ]
  }
};

export const mockURLData = {
  scan: { url: 'https://synth-example.test', safe: false, threats: [ 'phishing' ], score: 22, categories: [ 'Phishing', 'Hosting' ] },
  analyze: { url: 'https://malicious.synth-example.test/path', protocol: 'https', domain: 'synth-example.test', path: '/path', query: { q: 'synth' }, ssl: true, redirects: [ 'http://redirect.synth' ], finalUrl: 'https://synth-example.test/path' },
  reputation: { reputation: 'suspicious', blacklisted: true, age: 120, rank: 98765 }
};

export const mockDataMiningData = {
  extract: {
    emails: [ 'alice.synth@example.com', 'contact@synth-example.test' ],
    ips: [ '198.51.100.12', '203.0.113.42' ],
    urls: [ 'https://synth-example.test', 'https://malicious.synth-example.test' ],
    phones: [ '+1-555-0101', '+1-555-0102' ]
  },
  patterns: {
    patterns: [ { type: 'temporal', description: 'Login spikes on weekdays 09:00-10:30', confidence: 0.91 }, { type: 'geographic', description: 'Concurrent access from multiple continents', confidence: 0.78 } ],
    insights: { totalPatterns: 6, highConfidence: 4 }
  },
  piiSummary: {
    emailsFound: 24,
    phonesFound: 8,
    maskedIds: [ 'SYN-ID-XXXX-1234' ]
  }
};

export const mockThreatMapData = {
  cities: [ { id: 'sfo', name: 'San Francisco', country: 'USA', coords: [-122.4194, 37.7749], threat: 'medium', attacks: 412, type: 'Tech Hub' }, { id: 'ams', name: 'Amsterdam', country: 'NLD', coords: [4.9041, 52.3676], threat: 'low', attacks: 98, type: 'Hosting Hub' } ],
  attacks: [ { id: 's-A1', source: { id: 'botnet-1', name: 'Botnet Group A', coords: [116.4074, 39.9042] }, target: { id: 'sfo', name: 'San Francisco', coords: [-122.4194, 37.7749] }, type: 'DDoS', packets: 120000, timestamp: Date.now() } ],
  stats: { attacksPerSec: 12, activeThreats: 14, blockedIPs: 452, dataExfiltratedMB: 128.4, botnets: 3, compromised: 42 },
  threatLevel: { level: 32, defcon: 'NORMAL', status: 'MONITOR', trend: 'stable' }
};

// Mock response helpers
export const createMockResponse = (data, delay = 200) => new Promise((resolve) => setTimeout(() => resolve(data), delay));
export const createMockError = (message, delay = 200) => new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));

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
  threatMap: mockThreatMapData
};
