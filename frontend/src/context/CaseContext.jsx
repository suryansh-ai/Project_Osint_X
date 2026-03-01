import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CaseContext = createContext(null);

export const useCases = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within CaseProvider');
  }
  return context;
};

// Storage key for persistence
const STORAGE_KEY = 'osintx_cases';

// Sample team members for demo data
const sampleTeamMembers = {
  AM: { id: 'tm-1', name: 'Alex Mitchell', email: 'alex.mitchell@cyber.com', role: 'admin', avatar: 'AM', online: true },
  SK: { id: 'tm-2', name: 'Sarah Kim', email: 'sarah.kim@cyber.com', role: 'analyst', avatar: 'SK', online: true },
  MR: { id: 'tm-3', name: 'Mike Rodriguez', email: 'mike.r@cyber.com', role: 'investigator', avatar: 'MR', online: false },
  JW: { id: 'tm-4', name: 'Jennifer Wang', email: 'j.wang@cyber.com', role: 'viewer', avatar: 'JW', online: true },
  TC: { id: 'tm-5', name: 'Tom Chen', email: 'tom.chen@cyber.com', role: 'analyst', avatar: 'TC', online: false },
};

// Helper to convert initials to full team member objects
const initialsToTeamMember = (initials) => {
  if (typeof initials === 'object' && initials.id) return initials; // Already a team member object
  return sampleTeamMembers[initials] || {
    id: `tm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: initials,
    email: `${initials.toLowerCase()}@team.com`,
    role: 'viewer',
    avatar: initials,
    online: false
  };
};

// Initial demo cases with proper team member objects
const initialCases = [
  {
    id: 'CASE-2024101',
    title: 'Corporate Network Analysis',
    description: 'Deep investigation into suspicious network traffic patterns detected in client infrastructure.',
    status: 'active',
    priority: 'high',
    created: '2024-01-15',
    lastActivity: new Date().toISOString(),
    progress: 65,
    dataPoints: 234,
    correlations: 45,
    creditsSpent: 280,
    team: [sampleTeamMembers.AM, sampleTeamMembers.SK],
    evidence: [],
    notes: [],
    timeline: [
      { time: new Date().toISOString(), event: 'Case created', type: 'system' },
      { time: new Date().toISOString(), event: 'Initial network scan completed', type: 'action' },
    ]
  },
  {
    id: 'CASE-2024102',
    title: 'Phishing Campaign Trace',
    description: 'Tracking origin and distribution network of targeted phishing emails.',
    status: 'active',
    priority: 'high',
    created: '2024-01-14',
    lastActivity: new Date().toISOString(),
    progress: 42,
    dataPoints: 156,
    correlations: 28,
    creditsSpent: 185,
    team: [sampleTeamMembers.MR],
    evidence: [],
    notes: [],
    timeline: [
      { time: new Date().toISOString(), event: 'Case created', type: 'system' },
    ]
  },
  {
    id: 'CASE-2024103',
    title: 'Dark Web Monitoring',
    description: 'Ongoing surveillance of dark web forums for leaked credentials.',
    status: 'paused',
    priority: 'medium',
    created: '2024-01-10',
    lastActivity: new Date().toISOString(),
    progress: 30,
    dataPoints: 89,
    correlations: 12,
    creditsSpent: 95,
    team: [sampleTeamMembers.AM, sampleTeamMembers.SK, sampleTeamMembers.MR],
    evidence: [],
    notes: [],
    timeline: []
  },
  {
    id: 'CASE-2024104',
    title: 'Social Engineering Report',
    description: 'Analysis of social engineering attack vectors and personnel vulnerabilities.',
    status: 'completed',
    priority: 'low',
    created: '2024-01-08',
    lastActivity: new Date().toISOString(),
    progress: 100,
    dataPoints: 312,
    correlations: 67,
    creditsSpent: 420,
    team: [sampleTeamMembers.SK],
    evidence: [],
    notes: [],
    timeline: []
  },
  {
    id: 'CASE-2024105',
    title: 'Insider Threat Assessment',
    description: 'Comprehensive analysis of potential insider threats and data exfiltration risks.',
    status: 'active',
    priority: 'medium',
    created: '2024-01-12',
    lastActivity: new Date().toISOString(),
    progress: 55,
    dataPoints: 178,
    correlations: 34,
    creditsSpent: 210,
    team: [sampleTeamMembers.AM, sampleTeamMembers.MR],
    evidence: [],
    notes: [],
    timeline: []
  }
];

// Migrate old team format (array of initials) to new format (array of objects)
const migrateCases = (cases) => {
  return cases.map(caseItem => {
    if (Array.isArray(caseItem.team) && caseItem.team.length > 0) {
      // Check if team needs migration (contains strings instead of objects)
      if (typeof caseItem.team[0] === 'string') {
        return {
          ...caseItem,
          team: caseItem.team.map(initialsToTeamMember)
        };
      }
    }
    return caseItem;
  });
};

export const CaseProvider = ({ children }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cases from storage on mount
  useEffect(() => {
    const loadCases = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedCases = JSON.parse(stored);
          // Migrate old team format to new format
          const migratedCases = migrateCases(parsedCases);
          setCases(migratedCases);
          // Save migrated data back to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedCases));
        } catch {
          setCases(initialCases);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
        }
      } else {
        setCases(initialCases);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
      }
      setIsLoading(false);
    };
    loadCases();
  }, []);

  // Persist cases to storage
  const persistCases = useCallback((newCases) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCases));
  }, []);

  // Generate unique case ID
  const generateCaseId = useCallback(() => {
    const timestamp = Date.now().toString().slice(-6);
    return `CASE-${new Date().getFullYear()}${timestamp}`;
  }, []);

  // Create new case
  const createCase = useCallback((caseData) => {
    // Create team member for creator
    const creatorInitials = user?.name?.slice(0, 2).toUpperCase() || 'ME';
    const creatorMember = {
      id: `tm-${Date.now()}`,
      name: user?.name || 'Current User',
      email: user?.email || 'user@cyber.com',
      role: 'admin',
      avatar: creatorInitials,
      online: true
    };

    const newCase = {
      id: generateCaseId(),
      title: caseData.title,
      description: caseData.description || '',
      status: 'active',
      priority: caseData.priority || 'medium',
      created: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
      progress: 0,
      dataPoints: 0,
      correlations: 0,
      creditsSpent: 0,
      team: [creatorMember],
      evidence: [],
      notes: [],
      timeline: [
        { time: new Date().toISOString(), event: 'Case created', type: 'system' }
      ]
    };

    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    persistCases(updatedCases);
    
    return { success: true, case: newCase };
  }, [cases, generateCaseId, persistCases, user]);

  // Update case
  const updateCase = useCallback((caseId, updates) => {
    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        const updated = {
          ...c,
          ...updates,
          lastActivity: new Date().toISOString()
        };
        // Add timeline entry for significant updates
        if (updates.status && updates.status !== c.status) {
          updated.timeline = [
            ...c.timeline,
            { time: new Date().toISOString(), event: `Status changed to ${updates.status}`, type: 'system' }
          ];
        }
        return updated;
      }
      return c;
    });

    setCases(updatedCases);
    persistCases(updatedCases);
    
    if (selectedCase?.id === caseId) {
      setSelectedCase(updatedCases.find(c => c.id === caseId));
    }

    return { success: true };
  }, [cases, persistCases, selectedCase]);

  // Delete case
  const deleteCase = useCallback((caseId) => {
    const updatedCases = cases.filter(c => c.id !== caseId);
    setCases(updatedCases);
    persistCases(updatedCases);
    
    if (selectedCase?.id === caseId) {
      setSelectedCase(null);
    }

    return { success: true };
  }, [cases, persistCases, selectedCase]);

  // Add evidence to case
  const addEvidenceToCase = useCallback((caseId, evidenceId) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    if (caseToUpdate.evidence.includes(evidenceId)) {
      return { success: false, error: 'Evidence already linked' };
    }

    const updates = {
      evidence: [...caseToUpdate.evidence, evidenceId],
      dataPoints: caseToUpdate.dataPoints + 1,
      timeline: [
        ...caseToUpdate.timeline,
        { time: new Date().toISOString(), event: `Evidence ${evidenceId} linked`, type: 'action' }
      ]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase]);

  // Add note to case
  const addNoteToCase = useCallback((caseId, noteText) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    const note = {
      id: `note-${Date.now()}`,
      text: noteText,
      author: user?.name || 'Anonymous',
      timestamp: new Date().toISOString()
    };

    const updates = {
      notes: [...caseToUpdate.notes, note],
      timeline: [
        ...caseToUpdate.timeline,
        { time: new Date().toISOString(), event: 'Note added', type: 'note' }
      ]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase, user]);

  // Add note (alias for component compatibility)
  const addNote = useCallback((caseId, noteText) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    const note = {
      id: `note-${Date.now()}`,
      content: noteText,
      author: user?.name || 'Current User',
      createdAt: new Date().toISOString()
    };

    const updates = {
      notes: [...(caseToUpdate.notes || []), note]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase, user]);

  // Add evidence to case (full evidence object)
  const addEvidence = useCallback((caseId, evidenceData) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    const updates = {
      evidence: [...(caseToUpdate.evidence || []), evidenceData],
      dataPoints: caseToUpdate.dataPoints + 1
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase]);

  // Add timeline event
  const addTimelineEvent = useCallback((caseId, event, type = 'action') => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    const timelineEntry = {
      time: new Date().toISOString(),
      event,
      type
    };

    const updates = {
      timeline: [...(caseToUpdate.timeline || []), timelineEntry]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase]);

  // Update case progress
  const updateProgress = useCallback((caseId, progress) => {
    return updateCase(caseId, { progress: Math.min(100, Math.max(0, progress)) });
  }, [updateCase]);

  // Spend credits on case
  const spendCreditsOnCase = useCallback((caseId, amount) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    return updateCase(caseId, {
      creditsSpent: caseToUpdate.creditsSpent + amount
    });
  }, [cases, updateCase]);

  // Add team member to case
  const addTeamMember = useCallback((caseId, memberData) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    // Create proper team member object
    const newMember = {
      id: memberData.id || `tm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: memberData.name || memberData.email?.split('@')[0] || 'New Member',
      email: memberData.email || '',
      role: memberData.role || 'viewer',
      avatar: memberData.avatar || (memberData.name || 'NM').slice(0, 2).toUpperCase(),
      online: memberData.online ?? false
    };

    // Check if member already exists
    const team = caseToUpdate.team || [];
    if (team.some(m => m.email === newMember.email || m.id === newMember.id)) {
      return { success: false, error: 'Member already in team' };
    }

    const updates = {
      team: [...team, newMember],
      timeline: [
        ...(caseToUpdate.timeline || []),
        { time: new Date().toISOString(), event: `${newMember.name} added to team`, type: 'team' }
      ]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase]);

  // Remove team member from case
  const removeTeamMember = useCallback((caseId, memberId) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    const team = caseToUpdate.team || [];
    const memberToRemove = team.find(m => m.id === memberId);
    
    if (!memberToRemove) {
      return { success: false, error: 'Member not found' };
    }

    const updates = {
      team: team.filter(m => m.id !== memberId),
      timeline: [
        ...(caseToUpdate.timeline || []),
        { time: new Date().toISOString(), event: `${memberToRemove.name} removed from team`, type: 'team' }
      ]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase]);

  // Update team member role
  const updateTeamMemberRole = useCallback((caseId, memberId, newRole) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) return { success: false, error: 'Case not found' };

    const team = caseToUpdate.team || [];
    const memberToUpdate = team.find(m => m.id === memberId);
    
    if (!memberToUpdate) {
      return { success: false, error: 'Member not found' };
    }

    const updates = {
      team: team.map(m => m.id === memberId ? { ...m, role: newRole } : m),
      timeline: [
        ...(caseToUpdate.timeline || []),
        { time: new Date().toISOString(), event: `${memberToUpdate.name}'s role changed to ${newRole}`, type: 'team' }
      ]
    };

    return updateCase(caseId, updates);
  }, [cases, updateCase]);

  // Get case by ID
  const getCaseById = useCallback((caseId) => {
    return cases.find(c => c.id === caseId);
  }, [cases]);

  // Get cases by status
  const getCasesByStatus = useCallback((status) => {
    if (status === 'all') return cases;
    return cases.filter(c => c.status === status);
  }, [cases]);

  // Get case statistics
  const getStatistics = useCallback(() => {
    return {
      total: cases.length,
      active: cases.filter(c => c.status === 'active').length,
      paused: cases.filter(c => c.status === 'paused').length,
      completed: cases.filter(c => c.status === 'completed').length,
      totalDataPoints: cases.reduce((sum, c) => sum + c.dataPoints, 0),
      totalCorrelations: cases.reduce((sum, c) => sum + c.correlations, 0),
      totalCreditsSpent: cases.reduce((sum, c) => sum + c.creditsSpent, 0)
    };
  }, [cases]);

  const value = {
    cases,
    selectedCase,
    setSelectedCase,
    isLoading,
    createCase,
    updateCase,
    deleteCase,
    addEvidenceToCase,
    addEvidence,
    addNoteToCase,
    addNote,
    addTimelineEvent,
    updateProgress,
    spendCreditsOnCase,
    addTeamMember,
    removeTeamMember,
    updateTeamMemberRole,
    getCaseById,
    getCasesByStatus,
    getStatistics
  };

  return (
    <CaseContext.Provider value={value}>
      {children}
    </CaseContext.Provider>
  );
};

export default CaseContext;
