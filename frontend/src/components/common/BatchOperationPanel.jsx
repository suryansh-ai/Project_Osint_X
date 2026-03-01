/**
 * Batch Operations Component
 * Upload CSV for bulk operations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../common/Toast';
import { exportToCSV } from '../../utils/export';

export const BatchOperationPanel = ({ 
  onProcess, 
  toolName, 
  maxItems = 100,
  exampleCSV = 'ip\n8.8.8.8\n1.1.1.1'
}) => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const toast = useToast();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv') && !uploadedFile.name.endsWith('.txt')) {
      toast.error('Please upload a CSV or TXT file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));

        // Skip header if present
        const data = lines[0].toLowerCase().includes(toolName) ? lines.slice(1) : lines;

        if (data.length === 0) {
          toast.error('No data found in file');
          return;
        }

        if (data.length > maxItems) {
          toast.warning(`Limiting to first ${maxItems} items`);
        }

        setItems(data.slice(0, maxItems));
        setFile(uploadedFile);
        toast.success(`Loaded ${Math.min(data.length, maxItems)} items`);
      } catch (error) {
        toast.error('Failed to parse file');
        console.error(error);
      }
    };

    reader.readAsText(uploadedFile);
  };

  const handleProcess = async () => {
    if (items.length === 0) {
      toast.error('No items to process');
      return;
    }

    setProcessing(true);
    setResults([]);
    setErrors([]);

    try {
      const batchResults = await onProcess(items);
      
      const successResults = batchResults.filter(r => r.success);
      const errorResults = batchResults.filter(r => !r.success);

      setResults(successResults);
      setErrors(errorResults);

      toast.success(`Processed ${successResults.length}/${items.length} items`);
    } catch (error) {
      toast.error('Batch processing failed');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleExportResults = () => {
    const data = results.map(r => ({
      input: r.input,
      ...r.data,
    }));

    exportToCSV(data, `${toolName}_batch_results_${Date.now()}.csv`);
    toast.success('Results exported');
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([exampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${toolName}_template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setItems([]);
    setResults([]);
    setErrors([]);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-400">Batch Operations</h3>
        <button
          onClick={handleDownloadTemplate}
          className="text-sm text-gray-400 hover:text-cyan-400 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>

      {/* Upload Area */}
      {!file && (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-700 hover:border-cyan-500/50 rounded-lg p-8 text-center transition-colors">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Drop CSV file here or click to browse</p>
            <p className="text-sm text-gray-600">Max {maxItems} items per batch</p>
          </div>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      )}

      {/* File Info */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-gray-300">{file.name}</p>
                <p className="text-xs text-gray-500">{items.length} items loaded</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview */}
          <div className="bg-gray-900 rounded p-3 mb-3">
            <p className="text-xs text-gray-500 mb-2">Preview (first 5 items):</p>
            <div className="space-y-1">
              {items.slice(0, 5).map((item, i) => (
                <p key={i} className="text-xs font-mono text-gray-400">{item}</p>
              ))}
              {items.length > 5 && (
                <p className="text-xs text-gray-600">... and {items.length - 5} more</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Batch'
              )}
            </button>
            
            {results.length > 0 && (
              <button
                onClick={handleExportResults}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      <AnimatePresence>
        {(results.length > 0 || errors.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Success */}
            {results.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="font-medium text-green-400">
                    {results.length} successful
                  </p>
                </div>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <p className="font-medium text-red-400">
                    {errors.length} failed
                  </p>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {errors.slice(0, 5).map((error, i) => (
                    <p key={i} className="text-xs text-red-400">
                      {error.input}: {error.error}
                    </p>
                  ))}
                  {errors.length > 5 && (
                    <p className="text-xs text-red-600">
                      ... and {errors.length - 5} more errors
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-400">
            <p className="font-medium mb-1">CSV Format:</p>
            <p>• One item per line</p>
            <p>• Optional header row</p>
            <p>• Comments start with #</p>
            <p>• Maximum {maxItems} items per batch</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchOperationPanel;
