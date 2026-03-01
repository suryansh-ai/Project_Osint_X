import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCases } from '../../../context/CaseContext';
import { useActivity } from '../../../context/ActivityContext';
import { useCredits } from '../../../context/CreditContext';
import { exportToJSON, exportToCSV, formatForExport } from '../../../utils/export';
import {
  ArrowLeft,
  Target,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  FileText,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Search,
  Filter,
  Link as LinkIcon,
  Image,
  File,
  MessageSquare,
  Send,
  Calendar,
  Tag,
  MapPin,
  Globe,
  Shield,
  Eye,
  Copy,
  Share2,
  Bookmark,
  ChevronRight,
  Hash,
  Database,
  Network,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  MoreVertical,
  Settings,
  RefreshCw,
  Save,
  ExternalLink,
  Paperclip,
  FolderOpen,
  Brain,
  GitBranch,
  FileSpreadsheet,
  Wrench,
  Layout
} from 'lucide-react';

// Import case management components
import {
  InvestigationGraph,
  ReportGenerator,
  EvidenceManager,
  AdvancedTimeline,
  CollaborationPanel,
  AIInsightsPanel,
  WatchlistIntegration,
  CaseTemplates,
  ToolIntegration
} from '../../../components/case';

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { 
    cases, 
    updateCase, 
    deleteCase, 
    addEvidence, 
    addNote, 
    addTimelineEvent,
    addTeamMember,
    removeTeamMember,
    updateTeamMemberRole
  } = useCases();
  const { logActivity, addNotification } = useActivity();
  const { credits, consumeCredits } = useCredits();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newEvidence, setNewEvidence] = useState({ title: '', type: 'document', description: '', source: '' });
  const [editedCase, setEditedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const fileInputRef = useRef(null);

  // Find the case
  const caseData = cases.find(c => c.id === caseId);

  useEffect(() => {
    if (caseData) {
      setEditedCase({ ...caseData });
      logActivity('Viewed case details', { caseId: caseData.id, type: 'view' });
    }
  }, [caseId, caseData]);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Case Not Found</h2>
          <p className="text-gray-400 mb-6">The case you're looking for doesn't exist or has been deleted.</p>
          <Link 
            to="/dashboard/user/cases"
            className="px-6 py-3 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
          >
            Back to Cases
          </Link>
        </div>
      </div>
    );
  }

  const priorityColors = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-green-400 bg-green-500/10 border-green-500/30'
  };

  const statusColors = {
    active: 'text-green-400 bg-green-500/20 border-green-500/30',
    paused: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    completed: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30'
  };

  const statusIcons = {
    active: Play,
    paused: Pause,
    completed: CheckCircle
  };

  const evidenceTypeIcons = {
    document: FileText,
    image: Image,
    link: LinkIcon,
    data: Database,
    network: Network
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  // Handlers
  const handleStatusChange = (newStatus) => {
    updateCase(caseId, { status: newStatus });
    addTimelineEvent(caseId, `Status changed to ${newStatus}`, 'status');
    logActivity(`Changed case status to ${newStatus}`, { caseId, type: 'case' });
    addNotification(`Case status updated to ${newStatus}`, 'info');
  };

  const handleSaveChanges = () => {
    updateCase(caseId, editedCase);
    addTimelineEvent(caseId, 'Case details updated', 'edit');
    logActivity('Updated case details', { caseId, type: 'case' });
    addNotification('Case updated successfully', 'success');
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(caseId, newNote);
    addTimelineEvent(caseId, 'New note added', 'note');
    logActivity('Added note to case', { caseId, type: 'note' });
    setNewNote('');
    setShowAddNote(false);
    addNotification('Note added successfully', 'success');
  };

  const handleAddEvidence = () => {
    if (!newEvidence.title.trim()) return;
    addEvidence(caseId, {
      ...newEvidence,
      id: `EVD-${Date.now()}`,
      addedAt: new Date().toISOString(),
      addedBy: 'Current User'
    });
    addTimelineEvent(caseId, `Evidence added: ${newEvidence.title}`, 'evidence');
    logActivity('Added evidence to case', { caseId, evidence: newEvidence.title, type: 'evidence' });
    setNewEvidence({ title: '', type: 'document', description: '', source: '' });
    setShowAddEvidence(false);
    addNotification('Evidence added successfully', 'success');
  };

  const handleDeleteCase = () => {
    deleteCase(caseId);
    logActivity('Deleted case', { caseId, type: 'case' });
    addNotification('Case deleted successfully', 'warning');
    navigate('/dashboard/user/cases');
  };

  const handleExportCase = (format) => {
    const exportData = {
      ...caseData,
      exportedAt: new Date().toISOString()
    };
    
    if (format === 'json') {
      exportToJSON(exportData, `case_${caseId}_${Date.now()}.json`);
    } else {
      const flatData = {
        ID: caseData.id,
        Title: caseData.title,
        Description: caseData.description,
        Status: caseData.status,
        Priority: caseData.priority,
        Progress: caseData.progress,
        DataPoints: caseData.dataPoints,
        Correlations: caseData.correlations,
        CreditsSpent: caseData.creditsSpent,
        Created: caseData.created,
        LastActivity: caseData.lastActivity
      };
      exportToCSV([flatData], `case_${caseId}_${Date.now()}.csv`);
    }
    addNotification(`Case exported as ${format.toUpperCase()}`, 'success');
  };

  const handleRunAnalysis = () => {
    if (credits < 10) {
      addNotification('Insufficient credits for analysis', 'error');
      return;
    }
    consumeCredits(10);
    updateCase(caseId, {
      dataPoints: caseData.dataPoints + Math.floor(Math.random() * 20) + 5,
      correlations: caseData.correlations + Math.floor(Math.random() * 5) + 1,
      creditsSpent: caseData.creditsSpent + 10,
      progress: Math.min(caseData.progress + Math.floor(Math.random() * 10) + 3, 100)
    });
    addTimelineEvent(caseId, 'Automated analysis completed', 'analysis');
    logActivity('Ran automated analysis', { caseId, type: 'analysis' });
    addNotification('Analysis complete! New data points discovered.', 'success');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'evidence', label: 'Evidence', icon: FileText, count: caseData.evidence?.length || 0 },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: caseData.timeline?.length || 0 },
    { id: 'notes', label: 'Notes', icon: MessageSquare, count: caseData.notes?.length || 0 },
    { id: 'graph', label: 'Investigation Graph', icon: GitBranch },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'collab', label: 'Team', icon: Users, count: caseData.team?.length || 0 },
    { id: 'ai', label: 'AI Insights', icon: Brain },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const StatusIcon = statusIcons[caseData.status];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1), transparent 50%), radial-gradient(circle at 80% 50%, rgba(234, 88, 12, 0.1), transparent 50%)'
      }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

      {/* Header */}
      <header className="z-40 border-b border-amber-900/30 bg-gray-950/95 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Link 
                to="/dashboard/user/cases"
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-amber-400 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-amber-500 hidden sm:inline">{caseData.id}</span>
                  <span className={`text-xs font-mono px-1.5 sm:px-2 py-0.5 rounded border ${statusColors[caseData.status]} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{caseData.status.toUpperCase()}</span>
                  </span>
                  <span className={`text-xs font-mono px-1.5 sm:px-2 py-0.5 rounded border ${priorityColors[caseData.priority]}`}>
                    {caseData.priority.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-base sm:text-xl font-bold text-white truncate">{caseData.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 sm:gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-bold text-sm sm:text-base">{credits}</span>
                <span className="text-xs text-amber-400/70 hidden sm:inline">credits</span>
              </div>
              
              <div className="hidden sm:flex items-center gap-2">
                {/* Status buttons */}
                {caseData.status !== 'active' && (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    title="Set Active"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                {caseData.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange('paused')}
                    className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                    title="Pause"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                )}
                {caseData.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                    title="Mark Complete"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                
                <div className="w-px h-6 bg-gray-800" />
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                  title="Edit Case"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleExportCase('json')}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  title="Delete Case"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex sm:hidden items-center gap-1">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                  title="Edit Case"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400"
                  title="Delete Case"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Investigation Progress</span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-amber-400">{caseData.progress}%</span>
              <button
                onClick={handleRunAnalysis}
                disabled={credits < 10}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Run Analysis (10c)
              </button>
            </div>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${caseData.progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-800 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Description */}
                  <div className="rounded-xl p-4 sm:p-6 bg-gray-900/50 border border-amber-500/20">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-400" />
                      Description
                    </h3>
                    {isEditing ? (
                      <textarea
                        value={editedCase?.description || ''}
                        onChange={(e) => setEditedCase({ ...editedCase, description: e.target.value })}
                        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 resize-none h-32 outline-none focus:border-amber-500/50"
                      />
                    ) : (
                      <p className="text-gray-300">{caseData.description}</p>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400" />
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {caseData.timeline?.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === 'system' ? 'bg-blue-400' :
                            item.type === 'action' ? 'bg-green-400' :
                            item.type === 'evidence' ? 'bg-purple-400' :
                            item.type === 'note' ? 'bg-cyan-400' : 'bg-amber-400'
                          }`} />
                          <span className="text-sm text-gray-300 flex-1">{item.event}</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(item.time)}</span>
                        </div>
                      ))}
                      {(!caseData.timeline || caseData.timeline.length === 0) && (
                        <p className="text-gray-500 text-center py-4">No activity recorded yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Case Details */}
                  <div className="rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-amber-400" />
                      Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Case ID</p>
                        <p className="text-sm text-gray-300 font-mono">{caseData.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-gray-300">{caseData.created}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Activity</p>
                        <p className="text-sm text-gray-300">{formatTimeAgo(caseData.lastActivity)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Priority</p>
                        {isEditing ? (
                          <select
                            value={editedCase?.priority || 'medium'}
                            onChange={(e) => setEditedCase({ ...editedCase, priority: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 outline-none"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        ) : (
                          <span className={`text-xs font-mono px-2 py-1 rounded border ${priorityColors[caseData.priority]}`}>
                            {caseData.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      Team Members
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseData.team?.map((member, i) => (
                        <div key={typeof member === 'object' ? member.id : i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                              <span className="text-sm text-white font-bold">
                                {typeof member === 'object' ? member.avatar : member}
                              </span>
                            </div>
                            {typeof member === 'object' && member.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-gray-800" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm text-gray-300">
                              {typeof member === 'object' ? member.name : `Member ${i + 1}`}
                            </span>
                            {typeof member === 'object' && (
                              <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('collab')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAddEvidence(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Evidence
                      </button>
                      <button
                        onClick={() => setShowAddNote(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Add Note
                      </button>
                      <button
                        onClick={() => handleExportCase('json')}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export Case
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold"
                      >
                        <Save className="w-4 h-4 inline mr-2" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Evidence Tab - Enhanced */}
            {activeTab === 'evidence' && (
              <EvidenceManager
                evidence={caseData.evidence || []}
                onAddEvidence={(evidence) => {
                  addEvidence(caseId, {
                    ...evidence,
                    id: `EVD-${Date.now()}`,
                    addedAt: new Date().toISOString(),
                    addedBy: 'Current User'
                  });
                  addTimelineEvent(caseId, `Evidence added: ${evidence.title}`, 'evidence');
                  addNotification('Evidence added successfully', 'success');
                }}
                onDeleteEvidence={(evidenceId) => {
                  const updated = (caseData.evidence || []).filter(e => e.id !== evidenceId);
                  updateCase(caseId, { evidence: updated });
                  addTimelineEvent(caseId, 'Evidence deleted', 'evidence');
                }}
                onLinkEvidence={(sourceId, targetId) => {
                  const evidence = caseData.evidence || [];
                  const updated = evidence.map(e => {
                    if (e.id === sourceId) {
                      const links = e.linkedTo || [];
                      return { ...e, linkedTo: [...links, targetId] };
                    }
                    return e;
                  });
                  updateCase(caseId, { evidence: updated });
                }}
                onUpdateChainOfCustody={(evidenceId, entry) => {
                  const evidence = caseData.evidence || [];
                  const updated = evidence.map(e => {
                    if (e.id === evidenceId) {
                      const chain = e.chainOfCustody || [];
                      return { ...e, chainOfCustody: [...chain, entry] };
                    }
                    return e;
                  });
                  updateCase(caseId, { evidence: updated });
                }}
              />
            )}

            {/* Timeline Tab - Enhanced */}
            {activeTab === 'timeline' && (
              <AdvancedTimeline
                timeline={caseData.timeline || []}
                onAddEvent={(event) => {
                  addTimelineEvent(caseId, event.event, event.type);
                  addNotification('Timeline event added', 'success');
                }}
                onEditEvent={(eventId, updates) => {
                  const timeline = caseData.timeline || [];
                  const updated = timeline.map(e => e.id === eventId ? { ...e, ...updates } : e);
                  updateCase(caseId, { timeline: updated });
                }}
                onDeleteEvent={(eventId) => {
                  const timeline = caseData.timeline || [];
                  updateCase(caseId, { timeline: timeline.filter(e => e.id !== eventId) });
                }}
                onMarkMilestone={(eventId) => {
                  const timeline = caseData.timeline || [];
                  const updated = timeline.map(e => 
                    e.id === eventId ? { ...e, isMilestone: !e.isMilestone } : e
                  );
                  updateCase(caseId, { timeline: updated });
                }}
              />
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>

                <div className="space-y-4">
                  {(caseData.notes || []).map((note, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl p-4 bg-gray-900/50 border border-amber-500/20"
                    >
                      <p className="text-gray-300 mb-3">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTimeAgo(note.createdAt)}</span>
                        <span>{note.author}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {(!caseData.notes || caseData.notes.length === 0) && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No notes added yet</p>
                    <button
                      onClick={() => setShowAddNote(true)}
                      className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    >
                      Add First Note
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notes tab kept for backward compatibility */}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Progress Over Time */}
                <div className="rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                  <h3 className="text-lg font-bold text-white mb-4">Investigation Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Data Collection</span>
                        <span className="text-sm text-amber-400">{Math.min(caseData.dataPoints / 5, 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(caseData.dataPoints / 5, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Correlation Analysis</span>
                        <span className="text-sm text-blue-400">{Math.min(caseData.correlations * 2, 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(caseData.correlations * 2, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Evidence Gathered</span>
                        <span className="text-sm text-purple-400">{Math.min((caseData.evidence?.length || 0) * 10, 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((caseData.evidence?.length || 0) * 10, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                  <h3 className="text-lg font-bold text-white mb-4">Resource Usage</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                      <p className="text-3xl font-bold text-amber-400 mb-1">{caseData.creditsSpent}</p>
                      <p className="text-xs text-gray-500">Credits Used</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                      <p className="text-3xl font-bold text-blue-400 mb-1">{caseData.dataPoints}</p>
                      <p className="text-xs text-gray-500">Data Points</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                      <p className="text-3xl font-bold text-purple-400 mb-1">{caseData.timeline?.length || 0}</p>
                      <p className="text-xs text-gray-500">Actions Taken</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                      <p className="text-3xl font-bold text-green-400 mb-1">{caseData.team?.length || 0}</p>
                      <p className="text-xs text-gray-500">Team Size</p>
                    </div>
                  </div>
                </div>

                {/* Efficiency Score */}
                <div className="lg:col-span-2 rounded-xl p-6 bg-gray-900/50 border border-amber-500/20">
                  <h3 className="text-lg font-bold text-white mb-4">Efficiency Analysis</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400 mb-1">
                        {caseData.creditsSpent > 0 ? (caseData.dataPoints / caseData.creditsSpent * 10).toFixed(1) : '0.0'}
                      </p>
                      <p className="text-xs text-gray-500">Data per 10 Credits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400 mb-1">
                        {caseData.dataPoints > 0 ? (caseData.correlations / caseData.dataPoints * 100).toFixed(1) : '0.0'}%
                      </p>
                      <p className="text-xs text-gray-500">Correlation Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400 mb-1">
                        {((caseData.progress / 100) * (caseData.correlations + caseData.dataPoints)).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">Weighted Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400 mb-1">
                        {caseData.progress}%
                      </p>
                      <p className="text-xs text-gray-500">Completion</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Investigation Graph Tab */}
            {activeTab === 'graph' && (
              <InvestigationGraph
                caseId={caseId}
                nodes={caseData.graphNodes || []}
                edges={caseData.graphEdges || []}
                onSave={(nodes, edges) => {
                  updateCase(caseId, { graphNodes: nodes, graphEdges: edges });
                  addTimelineEvent(caseId, 'Investigation graph updated', 'edit');
                  addNotification('Investigation graph saved', 'success');
                }}
              />
            )}

            {/* Tool Integration Tab */}
            {activeTab === 'tools' && (
              <ToolIntegration
                caseId={caseId}
                savedResults={caseData.toolResults || []}
                onSaveResult={(result) => {
                  const results = caseData.toolResults || [];
                  updateCase(caseId, { toolResults: [...results, result] });
                  addEvidence(caseId, {
                    id: `EVD-${Date.now()}`,
                    title: `Tool Result: ${result.query}`,
                    type: 'data',
                    description: result.summary,
                    source: result.tool,
                    addedAt: new Date().toISOString()
                  });
                  addTimelineEvent(caseId, `Tool result saved: ${result.tool}`, 'evidence');
                  addNotification('Tool result saved to case', 'success');
                }}
                onQuickInvestigate={(query) => {
                  logActivity('Quick investigate from case', { caseId, query, type: 'investigation' });
                }}
              />
            )}

            {/* Collaboration Tab */}
            {activeTab === 'collab' && (
              <CollaborationPanel
                caseId={caseId}
                caseTitle={caseData.title}
                teamMembers={caseData.team || []}
                currentUser={{ name: 'Current User', role: 'admin' }}
                onAddMember={(member) => {
                  const result = addTeamMember(caseId, member);
                  if (result.success) {
                    addNotification(`${member.name || member.email} added to case`, 'success');
                  } else {
                    addNotification(result.error || 'Failed to add member', 'error');
                  }
                }}
                onRemoveMember={(memberId) => {
                  const result = removeTeamMember(caseId, memberId);
                  if (result.success) {
                    addNotification('Team member removed', 'success');
                  }
                }}
                onUpdateRole={(memberId, newRole) => {
                  const result = updateTeamMemberRole(caseId, memberId, newRole);
                  if (result.success) {
                    addNotification('Role updated', 'success');
                  }
                }}
                onSendMessage={(message) => {
                  logActivity('Sent case message', { caseId, type: 'collaboration' });
                }}
              />
            )}

            {/* AI Insights Tab */}
            {activeTab === 'ai' && (
              <AIInsightsPanel
                caseData={caseData}
                evidence={caseData.evidence || []}
                timeline={caseData.timeline || []}
                onApplySuggestion={(suggestion) => {
                  addTimelineEvent(caseId, `Applied AI suggestion: ${suggestion.text}`, 'ai');
                  logActivity('Applied AI suggestion', { caseId, suggestion: suggestion.text, type: 'ai' });
                }}
                onRunAnalysis={() => {
                  if (credits < 5) {
                    addNotification('Insufficient credits for AI analysis', 'error');
                    return;
                  }
                  consumeCredits(5);
                  addTimelineEvent(caseId, 'AI analysis completed', 'analysis');
                  addNotification('AI analysis complete', 'success');
                }}
              />
            )}

            {/* Watchlist Tab */}
            {activeTab === 'watchlist' && (
              <WatchlistIntegration
                caseId={caseId}
                linkedWatchlistItems={caseData.watchlistItems || []}
                onLinkItem={(item) => {
                  const items = caseData.watchlistItems || [];
                  updateCase(caseId, { watchlistItems: [...items, { ...item, linked: true }] });
                  addTimelineEvent(caseId, `Linked watchlist item: ${item.value}`, 'watchlist');
                }}
                onUnlinkItem={(item) => {
                  const items = caseData.watchlistItems || [];
                  updateCase(caseId, { watchlistItems: items.filter(i => i.id !== item.id) });
                }}
                onCreateAlert={(alert) => {
                  const alerts = caseData.watchlistAlerts || [];
                  updateCase(caseId, { watchlistAlerts: [...alerts, alert] });
                  addNotification('Watchlist alert created', 'success');
                }}
              />
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <ReportGenerator
                caseData={caseData}
                onGenerate={(report) => {
                  addTimelineEvent(caseId, `Generated ${report.template} report`, 'report');
                  logActivity('Generated case report', { caseId, template: report.template, type: 'report' });
                  addNotification(`${report.template} report generated`, 'success');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Add Evidence Modal */}
      <AnimatePresence>
        {showAddEvidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddEvidence(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gray-900 rounded-2xl border border-amber-500/30 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Add Evidence
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Title *</label>
                  <input
                    type="text"
                    value={newEvidence.title}
                    onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                    placeholder="Evidence title..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500/50 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <select
                    value={newEvidence.type}
                    onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none"
                  >
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="link">Link</option>
                    <option value="data">Data</option>
                    <option value="network">Network</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description</label>
                  <textarea
                    value={newEvidence.description}
                    onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                    placeholder="Describe this evidence..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500/50 outline-none text-white resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Source</label>
                  <input
                    type="text"
                    value={newEvidence.source}
                    onChange={(e) => setNewEvidence({ ...newEvidence, source: e.target.value })}
                    placeholder="Where was this collected from?"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500/50 outline-none text-white"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-800 flex gap-3">
                <button
                  onClick={() => setShowAddEvidence(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvidence}
                  disabled={!newEvidence.title.trim()}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold disabled:opacity-50"
                >
                  Add Evidence
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddNote(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gray-900 rounded-2xl border border-amber-500/30 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  Add Note
                </h2>
              </div>
              <div className="p-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your note..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500/50 outline-none text-white resize-none"
                  autoFocus
                />
              </div>
              <div className="p-6 border-t border-gray-800 flex gap-3">
                <button
                  onClick={() => setShowAddNote(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold disabled:opacity-50"
                >
                  Add Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-gray-900 rounded-2xl border border-red-500/30 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Delete Case?</h2>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete "{caseData.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCase}
                    className="flex-1 py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseDetailPage;
