import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const EvidenceContext = createContext(null);

export const useEvidence = () => {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useEvidence must be used within EvidenceProvider');
  }
  return context;
};

// Storage key for persistence
const STORAGE_KEY = 'osintx_evidence';

// Initial demo evidence
const initialEvidence = [
  {
    id: 'EVD-001',
    type: 'ip',
    title: 'Source IP Address',
    data: '192.168.45.128',
    case: 'CASE-2024101',
    collected: new Date().toISOString(),
    correlations: 8,
    notes: 'Primary attack origin identified through network logs',
    tags: ['network', 'primary'],
    source: 'IP Intelligence Tool',
    verified: true
  },
  {
    id: 'EVD-002',
    type: 'domain',
    title: 'Malicious Domain',
    data: 'suspicious-phish.com',
    case: 'CASE-2024102',
    collected: new Date().toISOString(),
    correlations: 12,
    notes: 'Phishing campaign landing page',
    tags: ['phishing', 'malicious'],
    source: 'Domain Analysis Tool',
    verified: true
  },
  {
    id: 'EVD-003',
    type: 'email',
    title: 'Sender Email',
    data: 'admin@fake-corp.net',
    case: 'CASE-2024102',
    collected: new Date().toISOString(),
    correlations: 5,
    notes: 'Spoofed sender address used in campaign',
    tags: ['spoofed', 'phishing'],
    source: 'Email Forensics Tool',
    verified: true
  },
  {
    id: 'EVD-004',
    type: 'image',
    title: 'Screenshot Evidence',
    data: 'phishing_page_capture.png',
    case: 'CASE-2024102',
    collected: new Date().toISOString(),
    correlations: 3,
    notes: 'Visual capture of phishing page layout',
    tags: ['screenshot', 'visual'],
    source: 'Manual Capture',
    verified: false
  },
  {
    id: 'EVD-005',
    type: 'hash',
    title: 'Malware Hash',
    data: 'a3f2c8d9e7b1f4a2c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7',
    case: 'CASE-2024101',
    collected: new Date().toISOString(),
    correlations: 15,
    notes: 'SHA-256 hash of dropper executable',
    tags: ['malware', 'sha256'],
    source: 'Hash Analyzer Tool',
    verified: true
  },
  {
    id: 'EVD-006',
    type: 'user',
    title: 'Social Profile',
    data: '@threat_actor_x',
    case: 'CASE-2024103',
    collected: new Date().toISOString(),
    correlations: 7,
    notes: 'Potential threat actor social media presence',
    tags: ['social', 'threat-actor'],
    source: 'Social Profiler Tool',
    verified: false
  },
  {
    id: 'EVD-007',
    type: 'document',
    title: 'Leaked Document',
    data: 'internal_memo.pdf',
    case: 'CASE-2024103',
    collected: new Date().toISOString(),
    correlations: 4,
    notes: 'Company document found on dark web forum',
    tags: ['leak', 'confidential'],
    source: 'Dark Web Monitor',
    verified: true
  },
  {
    id: 'EVD-008',
    type: 'location',
    title: 'Geo Location',
    data: 'Eastern Europe Region (52.2297° N, 21.0122° E)',
    case: 'CASE-2024101',
    collected: new Date().toISOString(),
    correlations: 6,
    notes: 'Traced IP geolocation data',
    tags: ['geolocation', 'trace'],
    source: 'Geolocation Tool',
    verified: true
  }
];

export const EvidenceProvider = ({ children }) => {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load evidence from storage on mount
  useEffect(() => {
    const loadEvidence = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setEvidence(JSON.parse(stored));
        } catch {
          setEvidence(initialEvidence);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvidence));
        }
      } else {
        setEvidence(initialEvidence);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvidence));
      }
      setIsLoading(false);
    };
    loadEvidence();
  }, []);

  // Persist evidence to storage
  const persistEvidence = useCallback((newEvidence) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvidence));
  }, []);

  // Generate unique evidence ID
  const generateEvidenceId = useCallback(() => {
    const count = evidence.length + 1;
    return `EVD-${count.toString().padStart(3, '0')}`;
  }, [evidence]);

  // Create new evidence
  const createEvidence = useCallback((evidenceData) => {
    const newEvidence = {
      id: generateEvidenceId(),
      type: evidenceData.type || 'document',
      title: evidenceData.title,
      data: evidenceData.data,
      case: evidenceData.case || null,
      collected: new Date().toISOString(),
      correlations: 0,
      notes: evidenceData.notes || '',
      tags: evidenceData.tags || [],
      source: evidenceData.source || 'Manual Entry',
      verified: false,
      collectedBy: user?.name || 'Anonymous'
    };

    const updatedEvidence = [newEvidence, ...evidence];
    setEvidence(updatedEvidence);
    persistEvidence(updatedEvidence);
    
    return { success: true, evidence: newEvidence };
  }, [evidence, generateEvidenceId, persistEvidence, user]);

  // Update evidence
  const updateEvidence = useCallback((evidenceId, updates) => {
    const updatedList = evidence.map(e => {
      if (e.id === evidenceId) {
        return { ...e, ...updates };
      }
      return e;
    });

    setEvidence(updatedList);
    persistEvidence(updatedList);
    
    if (selectedEvidence?.id === evidenceId) {
      setSelectedEvidence(updatedList.find(e => e.id === evidenceId));
    }

    return { success: true };
  }, [evidence, persistEvidence, selectedEvidence]);

  // Delete evidence
  const deleteEvidence = useCallback((evidenceId) => {
    const updatedList = evidence.filter(e => e.id !== evidenceId);
    setEvidence(updatedList);
    persistEvidence(updatedList);
    
    if (selectedEvidence?.id === evidenceId) {
      setSelectedEvidence(null);
    }

    return { success: true };
  }, [evidence, persistEvidence, selectedEvidence]);

  // Add correlation between evidence items
  const addCorrelation = useCallback((evidenceId1, evidenceId2) => {
    const updatedList = evidence.map(e => {
      if (e.id === evidenceId1 || e.id === evidenceId2) {
        return { ...e, correlations: e.correlations + 1 };
      }
      return e;
    });

    setEvidence(updatedList);
    persistEvidence(updatedList);

    return { success: true };
  }, [evidence, persistEvidence]);

  // Verify evidence
  const verifyEvidence = useCallback((evidenceId) => {
    return updateEvidence(evidenceId, { verified: true });
  }, [updateEvidence]);

  // Link evidence to case
  const linkToCase = useCallback((evidenceId, caseId) => {
    return updateEvidence(evidenceId, { case: caseId });
  }, [updateEvidence]);

  // Unlink evidence from case
  const unlinkFromCase = useCallback((evidenceId) => {
    return updateEvidence(evidenceId, { case: null });
  }, [updateEvidence]);

  // Add tag to evidence
  const addTag = useCallback((evidenceId, tag) => {
    const item = evidence.find(e => e.id === evidenceId);
    if (!item) return { success: false, error: 'Evidence not found' };
    
    if (item.tags.includes(tag)) {
      return { success: false, error: 'Tag already exists' };
    }

    return updateEvidence(evidenceId, { tags: [...item.tags, tag] });
  }, [evidence, updateEvidence]);

  // Remove tag from evidence
  const removeTag = useCallback((evidenceId, tag) => {
    const item = evidence.find(e => e.id === evidenceId);
    if (!item) return { success: false, error: 'Evidence not found' };

    return updateEvidence(evidenceId, { tags: item.tags.filter(t => t !== tag) });
  }, [evidence, updateEvidence]);

  // Get evidence by ID
  const getEvidenceById = useCallback((evidenceId) => {
    return evidence.find(e => e.id === evidenceId);
  }, [evidence]);

  // Get evidence by case
  const getEvidenceByCase = useCallback((caseId) => {
    return evidence.filter(e => e.case === caseId);
  }, [evidence]);

  // Get evidence by type
  const getEvidenceByType = useCallback((type) => {
    if (type === 'all') return evidence;
    return evidence.filter(e => e.type === type);
  }, [evidence]);

  // Search evidence
  const searchEvidence = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return evidence.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) ||
      e.data.toLowerCase().includes(lowerQuery) ||
      e.notes.toLowerCase().includes(lowerQuery) ||
      e.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }, [evidence]);

  // Get evidence statistics
  const getStatistics = useCallback(() => {
    const types = [...new Set(evidence.map(e => e.type))];
    const typeBreakdown = types.reduce((acc, type) => {
      acc[type] = evidence.filter(e => e.type === type).length;
      return acc;
    }, {});

    return {
      total: evidence.length,
      verified: evidence.filter(e => e.verified).length,
      unverified: evidence.filter(e => !e.verified).length,
      linked: evidence.filter(e => e.case).length,
      unlinked: evidence.filter(e => !e.case).length,
      totalCorrelations: evidence.reduce((sum, e) => sum + e.correlations, 0),
      types: typeBreakdown,
      uniqueCases: [...new Set(evidence.filter(e => e.case).map(e => e.case))].length
    };
  }, [evidence]);

  // Get all unique tags
  const getAllTags = useCallback(() => {
    const allTags = evidence.flatMap(e => e.tags);
    return [...new Set(allTags)];
  }, [evidence]);

  const value = {
    evidence,
    selectedEvidence,
    setSelectedEvidence,
    isLoading,
    createEvidence,
    updateEvidence,
    deleteEvidence,
    addCorrelation,
    verifyEvidence,
    linkToCase,
    unlinkFromCase,
    addTag,
    removeTag,
    getEvidenceById,
    getEvidenceByCase,
    getEvidenceByType,
    searchEvidence,
    getStatistics,
    getAllTags
  };

  return (
    <EvidenceContext.Provider value={value}>
      {children}
    </EvidenceContext.Provider>
  );
};

export default EvidenceContext;
