import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader';
import { 
  Crosshair,
  Target, 
  ShieldAlert, 
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Layers,
  AlertTriangle,
  Activity,
  Database,
  Shield
} from 'lucide-react';

const DemoSelector = () => {
  const navigate = useNavigate();
  const { loginAsDemo, isLoading, isAuthenticated, user } = useAuth();
  const [showLoader, setShowLoader] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user && showLoader) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, showLoader, navigate]);

  const handleDemoSelect = (role) => {
    setSelectedRole(role);
    setShowLoader(true);
  };

  const handleLoaderComplete = () => {
    loginAsDemo(selectedRole);
  };

  const demoOptions = [
    {
      role: 'student',
      title: 'Restricted Field Interface',
      subtitle: 'LIMITED ACCESS • FIELD OPERATIVE',
      icon: Crosshair,
      emoji: '🎓',
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-950/30 to-slate-950',
      borderColor: 'border-cyan-500/30',
      hoverBorder: 'hover:border-cyan-400/50',
      features: [
        { icon: Eye, text: 'Limited result depth', warning: true },
        { icon: Zap, text: 'Higher credit consumption', warning: true },
        { icon: AlertTriangle, text: 'Frequent system warnings' }
      ],
      stats: { depth: 'RESTRICTED', correlation: '1 Layer', creditRate: '1.5x' },
      description: 'All tools available with restricted output depth. Faster credit drain and system-enforced limitations.'
    },
    {
      role: 'user',
      title: 'Open Investigation Workspace',
      subtitle: 'STANDARD ACCESS • INVESTIGATOR',
      icon: Target,
      emoji: '👤',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-950/20 to-stone-950',
      borderColor: 'border-amber-500/30',
      hoverBorder: 'hover:border-amber-400/50',
      features: [
        { icon: Layers, text: 'Multi-layer correlation' },
        { icon: Database, text: 'Full case management' },
        { icon: Activity, text: 'Flexible workspace layout' }
      ],
      stats: { depth: 'STANDARD', correlation: '3 Layers', creditRate: '1.0x' },
      description: 'Full tool access with standard output depth. Adaptive workspace with case management capabilities.'
    }
  ];

  if (showLoader) {
    return <Loader targetPage="dashboard" onComplete={handleLoaderComplete} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 container-responsive py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">Select Investigation Interface</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-gradient-student">Access Level</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            All interfaces access the same tools. The difference is in 
            <span className="text-cyan-400"> output depth</span>,
            <span className="text-amber-400"> correlation layers</span>, and
            <span className="text-red-400"> credit efficiency</span>.
          </p>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {demoOptions.map((option, index) => {
            const IconComponent = option.icon;
            
            return (
              <motion.div
                key={option.role}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                <div className={`
                  relative rounded-2xl overflow-hidden
                  bg-gradient-to-br ${option.bgGradient}
                  border ${option.borderColor} ${option.hoverBorder}
                  transition-all duration-500
                  hover:scale-[1.02]
                `}>
                  {/* Scan line effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                      className={`absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-${option.color}-500/40 to-transparent`}
                      initial={{ top: '-10%' }}
                      animate={{ top: '110%' }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    />
                  </div>

                  <div className="p-6 sm:p-8 relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-14 h-14 rounded-xl bg-gradient-to-br ${option.gradient}
                          flex items-center justify-center text-3xl
                          shadow-lg shadow-${option.color}-500/20
                        `}>
                          {option.emoji}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {option.title}
                          </h3>
                          <p className={`text-xs text-${option.color}-400 font-mono tracking-wider`}>
                            {option.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 mb-6 p-3 rounded-lg bg-black/30 border border-white/5">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">DEPTH</p>
                        <p className={`text-sm font-bold text-${option.color}-400`}>{option.stats.depth}</p>
                      </div>
                      <div className="text-center border-x border-white/5">
                        <p className="text-xs text-gray-500 mb-1">CORRELATION</p>
                        <p className={`text-sm font-bold text-${option.color}-400`}>{option.stats.correlation}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">CREDIT RATE</p>
                        <p className={`text-sm font-bold text-${option.color}-400`}>{option.stats.creditRate}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {option.features.map((feature, i) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`
                              w-8 h-8 rounded-lg 
                              ${feature.warning ? 'bg-amber-500/10' : `bg-${option.color}-500/10`}
                              flex items-center justify-center
                            `}>
                              <FeatureIcon className={`w-4 h-4 ${feature.warning ? 'text-amber-400' : `text-${option.color}-400`}`} />
                            </div>
                            <span className="text-gray-300 text-sm">{feature.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Button */}
                    <motion.button
                      onClick={() => handleDemoSelect(option.role)}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full py-3.5 rounded-xl font-semibold
                        bg-gradient-to-r ${option.gradient}
                        text-white flex items-center justify-center gap-2
                        transition-all duration-300
                        shadow-lg shadow-${option.color}-500/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      Initialize Interface
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">
              SIMULATION MODE — All data is synthetic. No real intelligence operations.
            </span>
          </div>

          <p className="mt-4 text-gray-500 text-sm">
            Session resets on refresh • No persistent data •{' '}
            <button 
              onClick={() => navigate('/select-role')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign in for full access
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoSelector;
