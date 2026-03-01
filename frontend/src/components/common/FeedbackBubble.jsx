import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Star, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * FeedbackBubble Component
 * 
 * A floating feedback button that opens a feedback form modal.
 * Ready for backend integration.
 * 
 * Backend Integration Points:
 * - POST /api/feedback - Submit feedback
 *   Request Body: {
 *     type: 'bug' | 'feature' | 'improvement' | 'other',
 *     rating: 1-5,
 *     message: string,
 *     email?: string,
 *     screenshot?: File (base64),
 *     metadata: { page, userAgent, timestamp, userId }
 *   }
 *   Response: { success: boolean, ticketId?: string, message?: string }
 */

const FEEDBACK_TYPES = [
  { id: 'bug', label: 'Bug Report', emoji: '🐛', color: 'red' },
  { id: 'feature', label: 'Feature Request', emoji: '💡', color: 'amber' },
  { id: 'improvement', label: 'Improvement', emoji: '✨', color: 'cyan' },
  { id: 'other', label: 'Other', emoji: '💬', color: 'purple' },
];

const FeedbackBubble = ({ userId, userEmail, currentPage = window.location.pathname, position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Position classes based on prop
  const positionClasses = position === 'left' 
    ? 'bottom-24 left-6' 
    : 'bottom-24 right-6';
  const modalPositionClasses = position === 'left'
    ? 'bottom-24 left-6'
    : 'bottom-24 right-6';
  const [feedbackType, setFeedbackType] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [ticketId, setTicketId] = useState('');

  const resetForm = () => {
    setFeedbackType('');
    setRating(0);
    setMessage('');
    setSubmitStatus(null);
    setTicketId('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackType || !rating || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Prepare feedback payload
    const feedbackPayload = {
      type: feedbackType,
      rating,
      message: message.trim(),
      email: email.trim() || undefined,
      metadata: {
        page: currentPage,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: userId || 'anonymous',
        screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      }
    };

    try {
      // ============================================
      // BACKEND INTEGRATION POINT
      // ============================================
      // Replace this mock with actual API call:
      // const response = await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackPayload),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      // setTicketId(data.ticketId);
      // ============================================

      // Mock API call - simulating network delay
      console.log('[FeedbackBubble] Submitting feedback:', feedbackPayload);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      const mockTicketId = `FB-${Date.now().toString(36).toUpperCase()}`;
      setTicketId(mockTicketId);
      setSubmitStatus('success');
      
      console.log('[FeedbackBubble] Feedback submitted successfully. Ticket ID:', mockTicketId);
      
    } catch (error) {
      console.error('[FeedbackBubble] Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses} z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform group`}
        title="Send Feedback"
      >
        <MessageSquarePlus className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
        
        {/* Tooltip */}
        <div className={`absolute ${position === 'left' ? 'left-full ml-3' : 'right-full mr-3'} px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
          Send Feedback
        </div>
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed ${modalPositionClasses} z-[101] w-[380px] max-h-[80vh] overflow-hidden rounded-2xl bg-[#0a1520] border border-purple-500/30 shadow-2xl shadow-purple-500/20`}
            >
              {/* Header */}
              <div className="p-4 border-b border-purple-500/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                      <MessageSquarePlus className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Send Feedback</h3>
                      <p className="text-xs text-gray-400">Help us improve OsintX</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Thank You!</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Your feedback has been submitted successfully.
                    </p>
                    {ticketId && (
                      <div className="inline-block px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <p className="text-xs text-gray-400">Ticket ID</p>
                        <p className="text-sm font-mono text-purple-400">{ticketId}</p>
                      </div>
                    )}
                    <button
                      onClick={handleClose}
                      className="mt-6 px-6 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Submission Failed</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Something went wrong. Please try again.
                    </p>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Feedback Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        What type of feedback?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {FEEDBACK_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              feedbackType === type.id
                                ? `bg-${type.color}-500/20 border-${type.color}-500/50 ring-2 ring-${type.color}-500/30`
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <span className="text-lg">{type.emoji}</span>
                            <p className={`text-xs mt-1 ${feedbackType === type.id ? 'text-white' : 'text-gray-400'}`}>
                              {type.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        How would you rate your experience?
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                star <= (hoverRating || rating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-sm text-gray-400">
                            {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Great' : 'Excellent'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tell us more <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your feedback in detail..."
                        rows={4}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none transition-all"
                      />
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email <span className="text-gray-500 text-xs">(optional, for follow-up)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedbackType || !rating || !message.trim()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackBubble;
