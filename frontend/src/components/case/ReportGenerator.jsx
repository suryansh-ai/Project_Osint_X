import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, FileImage, File, Loader2, Check,
  X, ChevronRight, Calendar, User, Shield, Target,
  Clock, BarChart3, AlertTriangle, CheckCircle, Hash
} from 'lucide-react';

const reportTemplates = [
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'High-level overview for management and stakeholders',
    icon: Target,
    sections: ['summary', 'key_findings', 'risk_assessment', 'recommendations'],
    color: 'amber'
  },
  {
    id: 'technical',
    name: 'Technical Report',
    description: 'Detailed technical analysis with evidence and IOCs',
    icon: Hash,
    sections: ['summary', 'methodology', 'findings', 'evidence', 'timeline', 'iocs', 'recommendations'],
    color: 'cyan'
  },
  {
    id: 'legal',
    name: 'Legal Evidence Report',
    description: 'Chain of custody and evidence documentation for legal proceedings',
    icon: Shield,
    sections: ['summary', 'chain_of_custody', 'evidence_catalog', 'findings', 'declarations'],
    color: 'purple'
  },
  {
    id: 'incident',
    name: 'Incident Report',
    description: 'Standard incident documentation and response timeline',
    icon: AlertTriangle,
    sections: ['incident_overview', 'timeline', 'impact', 'response_actions', 'lessons_learned'],
    color: 'red'
  }
];

const sectionLabels = {
  summary: 'Executive Summary',
  key_findings: 'Key Findings',
  risk_assessment: 'Risk Assessment',
  recommendations: 'Recommendations',
  methodology: 'Methodology',
  findings: 'Detailed Findings',
  evidence: 'Evidence Analysis',
  timeline: 'Investigation Timeline',
  iocs: 'Indicators of Compromise',
  chain_of_custody: 'Chain of Custody',
  evidence_catalog: 'Evidence Catalog',
  declarations: 'Declarations & Signatures',
  incident_overview: 'Incident Overview',
  impact: 'Impact Assessment',
  response_actions: 'Response Actions',
  lessons_learned: 'Lessons Learned'
};

const ReportGenerator = ({ caseData, evidence = [], timeline = [], onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customSections, setCustomSections] = useState([]);
  const [reportOptions, setReportOptions] = useState({
    includeCharts: true,
    includeScreenshots: true,
    includeTimeline: true,
    includeEvidence: true,
    classificationLevel: 'confidential',
    format: 'pdf'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [previewContent, setPreviewContent] = useState(null);

  const generationSteps = [
    'Compiling case data...',
    'Processing evidence...',
    'Generating timeline...',
    'Creating visualizations...',
    'Formatting document...',
    'Finalizing report...'
  ];

  const generateReport = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate report generation with steps
    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenerationStep(i + 1);
    }

    // Generate report content
    const template = reportTemplates.find(t => t.id === selectedTemplate);
    const sections = [...template.sections, ...customSections];
    
    const reportContent = generateReportContent(sections);
    setPreviewContent(reportContent);
    setIsGenerating(false);
  };

  const generateReportContent = (sections) => {
    const content = {
      title: `${caseData?.title || 'Investigation'} Report`,
      caseId: caseData?.id,
      generatedAt: new Date().toISOString(),
      classification: reportOptions.classificationLevel.toUpperCase(),
      template: selectedTemplate,
      sections: []
    };

    sections.forEach(sectionId => {
      const section = {
        id: sectionId,
        title: sectionLabels[sectionId] || sectionId,
        content: generateSectionContent(sectionId)
      };
      content.sections.push(section);
    });

    return content;
  };

  const generateSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return {
          text: caseData?.description || 'No description available.',
          stats: {
            dataPoints: caseData?.dataPoints || 0,
            correlations: caseData?.correlations || 0,
            evidence: evidence.length,
            progress: caseData?.progress || 0
          }
        };
      case 'key_findings':
        return {
          findings: [
            { severity: 'high', text: 'Suspicious network activity detected from multiple IPs' },
            { severity: 'medium', text: 'Potential data exfiltration patterns identified' },
            { severity: 'low', text: 'Outdated security certificates found' }
          ]
        };
      case 'risk_assessment':
        return {
          overallRisk: caseData?.priority || 'medium',
          score: Math.round((caseData?.progress || 50) * 0.8),
          factors: [
            { name: 'Threat Level', score: 7 },
            { name: 'Vulnerability', score: 6 },
            { name: 'Impact Potential', score: 8 },
            { name: 'Likelihood', score: 5 }
          ]
        };
      case 'timeline':
        return {
          events: timeline.slice(0, 10).map(e => ({
            time: e.time,
            event: e.event,
            type: e.type
          }))
        };
      case 'evidence':
        return {
          items: evidence.map(e => ({
            id: e.id,
            title: e.title,
            type: e.type,
            addedAt: e.addedAt,
            description: e.description
          }))
        };
      case 'iocs':
        return {
          indicators: [
            { type: 'IP', value: '192.168.1.100', context: 'C2 Communication' },
            { type: 'Domain', value: 'malicious-domain.com', context: 'Phishing' },
            { type: 'Hash', value: 'a1b2c3d4e5f6...', context: 'Malware Sample' }
          ]
        };
      case 'recommendations':
        return {
          items: [
            { priority: 'critical', text: 'Immediately isolate affected systems' },
            { priority: 'high', text: 'Reset credentials for compromised accounts' },
            { priority: 'medium', text: 'Implement additional monitoring' },
            { priority: 'low', text: 'Review and update security policies' }
          ]
        };
      default:
        return { text: `Content for ${sectionId} section` };
    }
  };

  const downloadReport = (format) => {
    if (!previewContent) return;

    const filename = `${caseData?.id || 'case'}_report_${Date.now()}`;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(previewContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'txt') {
      let text = `${'='.repeat(60)}\n`;
      text += `${previewContent.title}\n`;
      text += `${'='.repeat(60)}\n\n`;
      text += `Case ID: ${previewContent.caseId}\n`;
      text += `Generated: ${new Date(previewContent.generatedAt).toLocaleString()}\n`;
      text += `Classification: ${previewContent.classification}\n\n`;
      
      previewContent.sections.forEach(section => {
        text += `${'-'.repeat(40)}\n`;
        text += `${section.title}\n`;
        text += `${'-'.repeat(40)}\n`;
        text += JSON.stringify(section.content, null, 2) + '\n\n';
      });

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For PDF, we'd use a library like jsPDF in production
      // For now, generate HTML that can be printed to PDF
      let html = `<!DOCTYPE html><html><head><title>${previewContent.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
          h2 { color: #334155; margin-top: 30px; }
          .meta { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .section { margin: 20px 0; padding: 15px; background: #fafafa; border-radius: 8px; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          .high { background: #fef2f2; color: #dc2626; }
          .medium { background: #fffbeb; color: #d97706; }
          .low { background: #f0fdf4; color: #16a34a; }
        </style>
      </head><body>`;
      html += `<h1>${previewContent.title}</h1>`;
      html += `<div class="meta">
        <strong>Case ID:</strong> ${previewContent.caseId}<br>
        <strong>Generated:</strong> ${new Date(previewContent.generatedAt).toLocaleString()}<br>
        <strong>Classification:</strong> ${previewContent.classification}
      </div>`;
      
      previewContent.sections.forEach(section => {
        html += `<h2>${section.title}</h2>`;
        html += `<div class="section"><pre>${JSON.stringify(section.content, null, 2)}</pre></div>`;
      });
      
      html += '</body></html>';

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[85vh] overflow-hidden bg-gray-900 rounded-2xl border border-amber-500/30 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Generate Investigation Report</h2>
              <p className="text-sm text-gray-500">Create professional reports from case data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!previewContent ? (
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Select Report Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {reportTemplates.map(template => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedTemplate === template.id
                            ? `bg-${template.color}-500/20 border-${template.color}-500/50`
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-5 h-5 text-${template.color}-400`} />
                          <span className="font-medium text-white">{template.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">{template.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.sections.slice(0, 3).map(s => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                              {sectionLabels[s]?.split(' ')[0]}
                            </span>
                          ))}
                          {template.sections.length > 3 && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                              +{template.sections.length - 3} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Report Options */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Report Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportOptions.includeCharts}
                        onChange={e => setReportOptions({ ...reportOptions, includeCharts: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-300">Include Charts & Graphs</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportOptions.includeTimeline}
                        onChange={e => setReportOptions({ ...reportOptions, includeTimeline: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-300">Include Timeline</span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportOptions.includeEvidence}
                        onChange={e => setReportOptions({ ...reportOptions, includeEvidence: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-300">Include Evidence Details</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportOptions.includeScreenshots}
                        onChange={e => setReportOptions({ ...reportOptions, includeScreenshots: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-300">Include Screenshots</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Classification Level</h3>
                <div className="flex gap-3">
                  {['public', 'internal', 'confidential', 'restricted'].map(level => (
                    <button
                      key={level}
                      onClick={() => setReportOptions({ ...reportOptions, classificationLevel: level })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        reportOptions.classificationLevel === level
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    <span className="text-white font-medium">Generating Report...</span>
                  </div>
                  <div className="space-y-2">
                    {generationSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {i < generationStep ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : i === generationStep ? (
                          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-600" />
                        )}
                        <span className={`text-sm ${i <= generationStep ? 'text-gray-300' : 'text-gray-600'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Report Preview</h3>
                <button
                  onClick={() => setPreviewContent(null)}
                  className="text-sm text-amber-400 hover:text-amber-300"
                >
                  ← Back to Options
                </button>
              </div>

              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <h4 className="text-xl font-bold text-white">{previewContent.title}</h4>
                    <p className="text-sm text-gray-500">
                      Case ID: {previewContent.caseId} • Generated: {new Date(previewContent.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                    previewContent.classification === 'RESTRICTED' ? 'bg-red-500/20 text-red-400' :
                    previewContent.classification === 'CONFIDENTIAL' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {previewContent.classification}
                  </span>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {previewContent.sections.map((section, i) => (
                    <div key={i} className="p-4 rounded-lg bg-gray-900/50">
                      <h5 className="text-sm font-medium text-amber-400 mb-2">{section.title}</h5>
                      <pre className="text-xs text-gray-400 overflow-x-auto">
                        {JSON.stringify(section.content, null, 2).slice(0, 200)}...
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex items-center justify-between shrink-0">
          {!previewContent ? (
            <>
              <p className="text-xs text-gray-500">
                {selectedTemplate
                  ? `${reportTemplates.find(t => t.id === selectedTemplate)?.sections.length} sections will be generated`
                  : 'Select a template to continue'}
              </p>
              <button
                onClick={generateReport}
                disabled={!selectedTemplate || isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500">
                {previewContent.sections.length} sections • Ready to download
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadReport('txt')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                >
                  <File className="w-4 h-4" />
                  TXT
                </button>
                <button
                  onClick={() => downloadReport('json')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                >
                  <FileText className="w-4 h-4" />
                  JSON
                </button>
                <button
                  onClick={() => downloadReport('pdf')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold"
                >
                  <Download className="w-4 h-4" />
                  Download HTML/PDF
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportGenerator;
