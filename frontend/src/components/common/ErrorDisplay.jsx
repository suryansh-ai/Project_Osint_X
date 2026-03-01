/**
 * Error Display Components
 * Standardized error states and messages
 */

import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ErrorMessage = ({ 
  message, 
  onRetry, 
  type = 'error',
  className = '' 
}) => {
  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  };

  const Icon = type === 'error' ? XCircle : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${styles[type]} border rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ErrorPage = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showHome = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4"
        >
          <XCircle className="w-8 h-8 text-red-400" />
        </motion.div>
        
        <h1 className="text-2xl font-bold text-red-400 mb-2">{title}</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          {showHome && (
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const EmptyState = ({ 
  icon: Icon = AlertTriangle,
  title = 'No data found',
  message = 'Try adjusting your search or filters',
  action,
  actionLabel = 'Reset',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 max-w-sm">{message}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const InlineError = ({ message, onRetry }) => {
  return (
    <div className="flex items-center gap-2 text-red-400 text-sm p-2 bg-red-500/10 rounded border border-red-500/30">
      <XCircle className="w-4 h-4" />
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-auto underline hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
