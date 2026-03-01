/**
 * Theme Toggle Component
 * Animated toggle switch for dark/light mode
 */

import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ showLabel = false, size = 'md' }) => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  const sizes = {
    sm: { button: 'w-14 h-7', icon: 'w-3 h-3', thumb: 'w-5 h-5', translate: 28 },
    md: { button: 'w-16 h-8', icon: 'w-4 h-4', thumb: 'w-6 h-6', translate: 32 },
    lg: { button: 'w-20 h-10', icon: 'w-5 h-5', thumb: 'w-8 h-8', translate: 40 },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {isDark ? 'Dark' : 'Light'} Mode
        </span>
      )}
      
      <motion.button
        onClick={toggleTheme}
        className={`relative ${s.button} rounded-full p-1 transition-colors ${
          isDark 
            ? 'bg-slate-700 border border-slate-600' 
            : 'bg-amber-100 border border-amber-200'
        }`}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <Moon className={`${s.icon} ${isDark ? 'text-violet-400' : 'text-gray-400'} transition-colors`} />
          <Sun className={`${s.icon} ${isDark ? 'text-gray-500' : 'text-amber-500'} transition-colors`} />
        </div>

        {/* Thumb */}
        <motion.div
          animate={{ x: isDark ? 0 : s.translate }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`relative ${s.thumb} rounded-full shadow-md flex items-center justify-center ${
            isDark 
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600' 
              : 'bg-gradient-to-br from-amber-400 to-orange-500'
          }`}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isDark ? (
              <Moon className={`${s.icon} text-white`} />
            ) : (
              <Sun className={`${s.icon} text-white`} />
            )}
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  );
};

// Alternative Theme Selector (dropdown style)
export const ThemeSelector = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="flex gap-2">
      {themes.map(({ id, label, icon: Icon }) => (
        <motion.button
          key={id}
          onClick={() => setTheme(id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            theme === id
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg'
              : isDark
                ? 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeToggle;
