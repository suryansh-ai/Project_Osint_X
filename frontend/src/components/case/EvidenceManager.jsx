import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Image, Link as LinkIcon, Database, Network,
  X, Plus, Tag, Trash2, Eye, Download, Clock, User, Check,
  AlertTriangle, Lock, Shield, ChevronRight, Search, Filter
} from 'lucide-react';

const evidenceTypes = [
  { id: 'document', label: 'Document', icon: FileText, color: 'blue', accept: '.pdf,.doc,.docx,.txt' },
  { id: 'image', label: 'Image', icon: Image, color: 'purple', accept: 'image/*' },
  { id: 'link', label: 'URL/Link', icon: LinkIcon, color: 'cyan', accept: null },
  { id: 'data', label: 'Data File', icon: Database, color: 'amber', accept: '.json,.csv,.xml,.log' },
  { id: 'network', label: 'Network Capture', icon: Network, color: 'green', accept: '.pcap,.pcapng' },
];

const predefinedTags = [
  { id: 'malware', label: 'Malware', color: 'red' },
  { id: 'phishing', label: 'Phishing', color: 'orange' },
  { id: 'credentials', label: 'Credentials', color: 'purple' },
  { id: 'c2', label: 'C2 Server', color: 'pink' },
  { id: 'exfiltration', label: 'Exfiltration', color: 'amber' },
  { id: 'ransomware', label: 'Ransomware', color: 'red' },
  { id: 'apt', label: 'APT', color: 'cyan' },
  { id: 'insider', label: 'Insider Threat', color: 'emerald' },
  { id: 'ioc', label: 'IOC', color: 'blue' },
  { id: 'verified', label: 'Verified', color: 'green' },
];

const EvidenceManager = ({ 
  evidence = [], 
  onAddEvidence, 
  onUpdateEvidence, 
  onDeleteEvidence,
  onLinkEvidence,
  caseId 
}) => {
  const fileInputRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [selectedType, setSelectedType] = useState('document');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [newEvidence, setNewEvidence] = useState({
    title: '',
    type: 'document',
    description: '',
    source: '',
    url: '',
    tags: [],
    file: null,
    chainOfCustody: []
  });
  const [linkingMode, setLinkingMode] = useState(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvidence({
        ...newEvidence,
        file,
        title: newEvidence.title || file.name,
      });
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Determine type from file
      let type = 'document';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.name.match(/\.(pcap|pcapng)$/i)) type = 'network';
      else if (file.name.match(/\.(json|csv|xml|log)$/i)) type = 'data';

      setSelectedType(type);
      setNewEvidence({
        ...newEvidence,
        type,
        file,
        title: file.name,
      });
      setShowAddModal(true);
    }
  };

  // Add evidence
  const handleAddEvidence = () => {
    const evidenceItem = {
      id: `EVD-${Date.now()}`,
      ...newEvidence,
      type: selectedType,
      addedAt: new Date().toISOString(),
      addedBy: 'Current User',
      chainOfCustody: [
        {
          action: 'Created',
          user: 'Current User',
          timestamp: new Date().toISOString(),
          notes: 'Evidence item created'
        }
      ],
      linkedEvidence: []
    };

    onAddEvidence?.(evidenceItem);
    setNewEvidence({
      title: '',
      type: 'document',
      description: '',
      source: '',
      url: '',
      tags: [],
      file: null,
      chainOfCustody: []
    });
    setShowAddModal(false);
  };

  // Toggle tag
  const toggleTag = (tagId) => {
    const tags = newEvidence.tags.includes(tagId)
      ? newEvidence.tags.filter(t => t !== tagId)
      : [...newEvidence.tags, tagId];
    setNewEvidence({ ...newEvidence, tags });
  };

  // Link evidence
  const handleLinkEvidence = (fromId, toId) => {
    onLinkEvidence?.(fromId, toId);
    setLinkingMode(null);
  };

  // Filter evidence
  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'all' || e.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  // Format time ago
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
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300 outline-none focus:border-amber-500/50"
            />
          </div>
          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300 outline-none"
          >
            <option value="all">All Tags</option>
            {predefinedTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold"
        >
          <Plus className="w-4 h-4" />
          Add Evidence
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors"
      >
        <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Drag & drop files here, or click Add Evidence</p>
        <p className="text-xs text-gray-600 mt-1">Supports documents, images, network captures, and data files</p>
      </div>

      {/* Evidence Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((item, i) => {
          const typeConfig = evidenceTypes.find(t => t.id === item.type) || evidenceTypes[0];
          const TypeIcon = typeConfig.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-4 bg-gray-900/50 border transition-all cursor-pointer ${
                linkingMode === item.id
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-amber-500/20 hover:border-amber-500/40'
              }`}
              onClick={() => {
                if (linkingMode && linkingMode !== item.id) {
                  handleLinkEvidence(linkingMode, item.id);
                } else {
                  setShowDetailModal(item);
                }
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${typeConfig.color}-500/20 flex items-center justify-center`}>
                    <TypeIcon className={`w-5 h-5 text-${typeConfig.color}-400`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white truncate max-w-[150px]">{item.title}</h4>
                    <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLinkingMode(linkingMode === item.id ? null : item.id);
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      linkingMode === item.id
                        ? 'bg-amber-500 text-white'
                        : 'hover:bg-gray-800 text-gray-500'
                    }`}
                    title="Link to another evidence"
                  >
                    <LinkIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEvidence?.(item.id);
                    }}
                    className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
              )}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map(tagId => {
                    const tag = predefinedTags.find(t => t.id === tagId);
                    return tag ? (
                      <span
                        key={tagId}
                        className={`text-[10px] px-2 py-0.5 rounded bg-${tag.color}-500/20 text-${tag.color}-400`}
                      >
                        #{tag.label}
                      </span>
                    ) : null;
                  })}
                  {item.tags.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Linked Evidence */}
              {item.linkedEvidence?.length > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <LinkIcon className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{item.linkedEvidence.length} linked</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(item.addedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.addedBy}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery || filterTag !== 'all' ? 'No evidence matches your filters' : 'No evidence added yet'}
          </p>
        </div>
      )}

      {/* Linking Mode Banner */}
      <AnimatePresence>
        {linkingMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg bg-amber-500 text-white flex items-center gap-3"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Click another evidence item to link</span>
            <button
              onClick={() => setLinkingMode(null)}
              className="p-1 rounded hover:bg-amber-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Evidence Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-gray-900 rounded-2xl border border-amber-500/30"
            >
              <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Add Evidence</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Evidence Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {evidenceTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                            selectedType === type.id
                              ? `bg-${type.color}-500/20 border border-${type.color}-500/50`
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className={`w-5 h-5 text-${type.color}-400`} />
                          <span className="text-[10px] text-gray-400">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* File Upload */}
                {selectedType !== 'link' && (
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Upload File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={evidenceTypes.find(t => t.id === selectedType)?.accept || '*/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 rounded-lg border-2 border-dashed border-gray-700 hover:border-amber-500/50 transition-colors text-center"
                    >
                      {newEvidence.file ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">{newEvidence.file.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                          <span className="text-sm text-gray-500">Click to upload</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* URL for links */}
                {selectedType === 'link' && (
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">URL</label>
                    <input
                      type="url"
                      value={newEvidence.url}
                      onChange={e => setNewEvidence({ ...newEvidence, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500/50"
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Title *</label>
                  <input
                    type="text"
                    value={newEvidence.title}
                    onChange={e => setNewEvidence({ ...newEvidence, title: e.target.value })}
                    placeholder="Evidence title..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description</label>
                  <textarea
                    value={newEvidence.description}
                    onChange={e => setNewEvidence({ ...newEvidence, description: e.target.value })}
                    placeholder="Describe this evidence..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none resize-none focus:border-amber-500/50"
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Source</label>
                  <input
                    type="text"
                    value={newEvidence.source}
                    onChange={e => setNewEvidence({ ...newEvidence, source: e.target.value })}
                    placeholder="Where was this collected?"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          newEvidence.tags.includes(tag.id)
                            ? `bg-${tag.color}-500/30 text-${tag.color}-400 border border-${tag.color}-500/50`
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        #{tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-800 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
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

      {/* Evidence Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDetailModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-gray-900 rounded-2xl border border-amber-500/30"
            >
              <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const typeConfig = evidenceTypes.find(t => t.id === showDetailModal.type) || evidenceTypes[0];
                      const Icon = typeConfig.icon;
                      return (
                        <div className={`w-10 h-10 rounded-lg bg-${typeConfig.color}-500/20 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${typeConfig.color}-400`} />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-lg font-bold text-white">{showDetailModal.title}</h2>
                      <p className="text-sm text-gray-500">Evidence ID: {showDetailModal.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDetailModal(null)} className="text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-white capitalize">{showDetailModal.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Source</p>
                    <p className="text-sm text-white">{showDetailModal.source || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Added At</p>
                    <p className="text-sm text-white">{new Date(showDetailModal.addedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Added By</p>
                    <p className="text-sm text-white">{showDetailModal.addedBy}</p>
                  </div>
                </div>

                {/* Description */}
                {showDetailModal.description && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-300">{showDetailModal.description}</p>
                  </div>
                )}

                {/* Tags */}
                {showDetailModal.tags?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {showDetailModal.tags.map(tagId => {
                        const tag = predefinedTags.find(t => t.id === tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className={`text-xs px-3 py-1 rounded bg-${tag.color}-500/20 text-${tag.color}-400`}
                          >
                            #{tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Chain of Custody */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <p className="text-sm font-medium text-white">Chain of Custody</p>
                  </div>
                  <div className="space-y-2">
                    {(showDetailModal.chainOfCustody || []).map((entry, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                        <div className="flex-1">
                          <p className="text-sm text-white">{entry.action}</p>
                          <p className="text-xs text-gray-500">
                            {entry.user} • {new Date(entry.timestamp).toLocaleString()}
                          </p>
                          {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                        </div>
                      </div>
                    ))}
                    {(!showDetailModal.chainOfCustody || showDetailModal.chainOfCustody.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-4">No custody records</p>
                    )}
                  </div>
                </div>

                {/* Linked Evidence */}
                {showDetailModal.linkedEvidence?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Linked Evidence</p>
                    <div className="space-y-2">
                      {showDetailModal.linkedEvidence.map((linkedId, i) => {
                        const linked = evidence.find(e => e.id === linkedId);
                        return linked ? (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                            <LinkIcon className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-300">{linked.title}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800 flex gap-3">
                <button
                  onClick={() => {
                    // Download file logic would go here
                    setShowDetailModal(null);
                  }}
                  className="flex-1 py-3 rounded-lg bg-gray-800 text-gray-300 hover:text-white flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    // Open investigation tool
                    setShowDetailModal(null);
                  }}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Investigate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvidenceManager;
