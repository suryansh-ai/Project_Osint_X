import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext(null);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};

// Role-specific configurations - ALL INVESTIGATORS, different depth/limits
const roleConfigs = {
  student: {
    theme: 'student',
    colorPrimary: '#06b6d4',
    colorSecondary: '#0891b2',
    colorAccent: '#22d3ee',
    bgGradient: 'from-slate-950 via-cyan-950/30 to-slate-950',
    dashboardPath: '/dashboard/student',
    displayName: 'Restricted Field Interface',
    displaySubtitle: 'Limited Depth • Fast Credit Burn • System Warnings',
    icon: '🎓',
    animationStyle: 'fast', // fast, light, sharp
    outputDepth: 'restricted',
    correlationLayers: 1,
    creditMultiplier: 1.5, // Higher cost
    features: {
      allTools: true,
      limitedDepth: true,
      frequentWarnings: true,
      compactPanels: true
    }
  },
  user: {
    theme: 'user',
    colorPrimary: '#f59e0b',
    colorSecondary: '#d97706',
    colorAccent: '#fbbf24',
    bgGradient: 'from-stone-950 via-amber-950/20 to-stone-950',
    dashboardPath: '/dashboard/user',
    displayName: 'Open Investigation Workspace',
    displaySubtitle: 'Standard Depth • Flexible Layout • Full Correlation',
    icon: '👤',
    animationStyle: 'balanced', // balanced, fluid
    outputDepth: 'standard',
    correlationLayers: 3,
    creditMultiplier: 1.0,
    features: {
      allTools: true,
      freeformWorkspace: true,
      caseManagement: true,
      evidenceLocker: true,
      reportGeneration: true,
      dragAndDrop: true
    }
  }
};

// All tools available to all roles
const allTools = [
  'start-investigation', 'case-management', 'request-information',
  'osint-library', 'dork-generator', 'bulk-ip-tracer',
  'location-tracker', 'coord-lookup', 'malware-scan',
  'comm-sandbox', 'ipdr-enrichment', 'audio-analysis',
  'device-permissions', 'evidence-locker', 'report-generator',
  'team-directory', 'audit-logs', 'police-directory'
];

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();

  const roleData = useMemo(() => {
    const role = user?.role || 'student';
    const config = roleConfigs[role] || roleConfigs.student;

    return {
      currentRole: role,
      roleConfig: config,
      config: config, // Alias for backward compatibility
      tools: allTools, // Export tools list
      // All roles can access all tools
      canAccessTool: () => true,
      getAllTools: () => allTools,
      hasFeature: (feature) => config.features[feature] || false,
      getOutputDepth: () => config.outputDepth,
      getCorrelationLayers: () => config.correlationLayers,
      getCreditMultiplier: () => config.creditMultiplier,
      getAnimationStyle: () => config.animationStyle,
      getThemeClasses: () => ({
        bg: `bg-gradient-to-br ${config.bgGradient}`,
        text: `text-${config.theme}-primary`,
        border: `border-${config.theme}-primary/30`,
        glow: `glow-${config.theme}`,
        glass: `glass-${config.theme}`,
        grid: config.theme === 'student' ? 'investigation-grid' : 
              'investigation-grid-user'
      }),
      isStudent: role === 'student',
      isUser: role === 'user'
    };
  }, [user?.role]);

  return (
    <RoleContext.Provider value={roleData}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
