/**
 * Save to Case Modal
 * Allows saving tool results to an existing or new case
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderPlus, X, Folder, Plus, Check, Search, 
  AlertTriangle, Clock, ChevronRight, FileText,
  CheckCircle, Zap
} from 'lucide-react';
import { useCases } from '../../context/CaseContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../common/Toast';

const SaveToCaseModal = ({ isOpen, onClose, data, toolName = 'Tool', query = '' }) => {
  const { isDark } = useTheme();
  const { cases, createCase, addEvidenceToCase, updateCase } = useCases();
  const toast = useToast();
  
  const [selectedCase, setSelectedCase] = useState(null);
  const [createNew, setCreateNew] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDescription, setNewCaseDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notes, setNotes] = useState('');

  // Filter active cases
  const activeCases = cases.filter(c => c.status !== 'completed');
  const filteredCases = activeCases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priorityColors = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  const handleSaveToCase = async () => {
    if (!selectedCase && !createNew) {
      toast.error('Please select a case or create a new one');
      return;
    }

    setIsSaving(true);

    try {
      let targetCaseId = selectedCase?.id;

      // Create new case if needed
      if (createNew) {
        if (!newCaseTitle.trim()) {
          toast.error('Please enter a case title');
          setIsSaving(false);
          return;
        }

        const result = createCase({
          title: newCaseTitle,
          description: newCaseDescription || `Investigation started with ${toolName}`,
          priority: 'medium',
        });

        if (result.success) {
          targetCaseId = result.case.id;
          toast.success(`Case "${newCaseTitle}" created`);
        } else {
          throw new Error('Failed to create case');
        }
      }

      // Create evidence object
      const evidence = {
        id: `evidence-${Date.now()}`,
        type: 'tool_result',
        tool: toolName,
        query: query,
        data: data,
        notes: notes,
        timestamp: new Date().toISOString(),
      };

      // Get the case to update
      const caseToUpdate = cases.find(c => c.id === targetCaseId);
      if (caseToUpdate) {
        // Update case with new evidence
        updateCase(targetCaseId, {
          evidence: [...(caseToUpdate.evidence || []), evidence],
          dataPoints: (caseToUpdate.dataPoints || 0) + 1,
          timeline: [
            ...(caseToUpdate.timeline || []),
            {
              time: new Date().toISOString(),
              event: `${toolName} results saved${query ? ` (${query})` : ''}`,
              type: 'action'
            }
          ]
        });
      }

      setSaveSuccess(true);
      toast.success(`Results saved to case`);
      
      setTimeout(() => {
        onClose();
        setSaveSuccess(false);
      }, 1500);

    } catch (error) {
      console.error('Save to case failed:', error);
      toast.error('Failed to save to case');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border ${
              isDark 
                ? 'bg-slate-900 border-white/10' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? 'border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10' : 'border-gray-200 bg-gradient-to-r from-violet-50 to-cyan-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <FolderPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Save to Case
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {toolName} {query && `- "${query}"`}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Create New Toggle */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCreateNew(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                    !createNew
                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Folder className="w-5 h-5" />
                  Existing Case
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCreateNew(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                    createNew
                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  New Case
                </motion.button>
              </div>

              {/* Existing Case Selection */}
              {!createNew && (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cases..."
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                        isDark 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500'
                      } outline-none`}
                    />
                  </div>

                  {/* Cases List */}
                  <div className="max-h-[250px] overflow-y-auto space-y-2 custom-scrollbar">
                    {filteredCases.length > 0 ? (
                      filteredCases.map(caseItem => (
                        <motion.button
                          key={caseItem.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedCase(caseItem)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedCase?.id === caseItem.id
                              ? 'border-violet-500 bg-violet-500/10'
                              : isDark
                                ? 'border-white/10 bg-white/5 hover:border-white/20'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {caseItem.title}
                                </span>
                                {selectedCase?.id === caseItem.id && (
                                  <CheckCircle className="w-4 h-4 text-violet-400" />
                                )}
                              </div>
                              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {caseItem.id}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityColors[caseItem.priority]}`}>
                              {caseItem.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs">
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {formatTimeAgo(caseItem.lastActivity)}
                            </span>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                              {caseItem.dataPoints} data points
                            </span>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                              {caseItem.progress}% complete
                            </span>
                          </div>
                        </motion.button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Folder className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                        <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                          {searchQuery ? 'No cases match your search' : 'No active cases found'}
                        </p>
                        <button
                          onClick={() => setCreateNew(true)}
                          className="mt-3 text-sm text-violet-400 hover:text-violet-300"
                        >
                          Create a new case
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* New Case Form */}
              {createNew && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Case Title *
                    </label>
                    <input
                      type="text"
                      value={newCaseTitle}
                      onChange={(e) => setNewCaseTitle(e.target.value)}
                      placeholder="Enter case title..."
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isDark 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500'
                      } outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <textarea
                      value={newCaseDescription}
                      onChange={(e) => setNewCaseDescription(e.target.value)}
                      placeholder="Brief description of the investigation..."
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                        isDark 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500'
                      } outline-none`}
                    />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FileText className="w-4 h-4 inline mr-1" />
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this evidence..."
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500'
                  } outline-none`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2 text-emerald-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Saved successfully!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-xl text-sm ${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveToCase}
                    disabled={isSaving || (!selectedCase && !createNew) || (createNew && !newCaseTitle.trim())}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
                      isSaving || (!selectedCase && !createNew) || (createNew && !newCaseTitle.trim())
                        ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Zap className="w-4 h-4" />
                        </motion.div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-4 h-4" />
                        Save to Case
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveToCaseModal;
