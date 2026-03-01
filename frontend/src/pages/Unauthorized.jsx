/**
 * Unauthorized Access Page
 * Displayed when user doesn't have permission
 */

import { motion } from 'framer-motion';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-xl p-8 text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.1, 1, 1.1, 1] 
          }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6"
        >
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-red-400 mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this resource. Contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
