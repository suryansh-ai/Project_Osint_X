/**
 * Rate Limit Component
 * Display rate limit information and warnings
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

export const RateLimitBanner = ({ remaining, limit, resetTime }) => {
  const [timeUntilReset, setTimeUntilReset] = useState('');
  
  useEffect(() => {
    if (!resetTime) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const reset = new Date(resetTime).getTime();
      const diff = reset - now;
      
      if (diff <= 0) {
        setTimeUntilReset('Resetting...');
        return;
      }
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeUntilReset(`${minutes}m ${seconds}s`);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [resetTime]);

  const percentage = (remaining / limit) * 100;
  const isLow = percentage < 20;
  const isVeryLow = percentage < 10;

  if (remaining === limit) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
          border rounded-lg p-3
          ${isVeryLow 
            ? 'bg-red-500/10 border-red-500/30' 
            : isLow 
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
          }
        `}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {isVeryLow ? (
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            ) : (
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={`text-sm font-medium ${
                  isVeryLow ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {remaining} / {limit} requests remaining
                </p>
                
                {resetTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{timeUntilReset}</span>
                  </div>
                )}
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className={`h-full rounded-full ${
                    isVeryLow 
                      ? 'bg-red-500' 
                      : isLow 
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {isVeryLow && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-red-400 mt-2"
          >
            Rate limit almost reached. Requests will be queued automatically.
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export const RateLimitModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-red-500/30 rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-red-400">Rate Limit Exceeded</h3>
        </div>

        <p className="text-gray-300 mb-4">
          You've reached your request limit. Your requests will be automatically queued and processed when the limit resets.
        </p>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">What happens now?</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Requests are queued automatically</li>
            <li>• Queue is processed when limit resets</li>
            <li>• You'll be notified when complete</li>
            <li>• No requests are lost</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          Understood
        </button>
      </motion.div>
    </motion.div>
  );
};

export default RateLimitBanner;
