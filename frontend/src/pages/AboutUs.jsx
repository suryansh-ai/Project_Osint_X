import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Globe,
  Target,
  Users,
  Award,
  Zap,
  Eye,
  Lock,
  Database,
  Cpu,
  CheckCircle,
  ArrowRight,
  Home
} from 'lucide-react';

const AboutUs = () => {
  const team = [
    { name: 'Security Team', role: 'Cybersecurity Experts', image: '🛡️' },
    { name: 'Data Scientists', role: 'AI & ML Specialists', image: '🧠' },
    { name: 'OSINT Analysts', role: 'Intelligence Researchers', image: '🔍' },
    { name: 'Engineers', role: 'Platform Development', image: '⚙️' },
  ];

  const values = [
    { icon: Shield, title: 'Security First', description: 'Military-grade encryption and zero-knowledge architecture protect your investigations.' },
    { icon: Eye, title: 'Transparency', description: 'Clear data sourcing and ethical OSINT practices guide everything we do.' },
    { icon: Zap, title: 'Innovation', description: 'Cutting-edge AI and machine learning power our investigation tools.' },
    { icon: Users, title: 'Collaboration', description: 'Built for teams with real-time collaboration and secure case sharing.' },
  ];

  const milestones = [
    { year: '2022', title: 'Founded', description: 'OsintX was established with a mission to democratize OSINT.' },
    { year: '2023', title: 'Platform Launch', description: 'Released our comprehensive investigation platform with 15+ tools.' },
    { year: '2024', title: 'AI Integration', description: 'Introduced AI-powered analysis and threat detection capabilities.' },
    { year: '2025', title: 'Global Expansion', description: 'Expanded to serve investigators in 50+ countries worldwide.' },
    { year: '2026', title: 'Enterprise Suite', description: 'Launched enterprise features for law enforcement and corporations.' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="OsintX" className="w-12 h-12 object-contain" style={{ filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.5))' }} />
              <div>
                <h1 className="text-xl font-bold" style={{ fontFamily: "'Papyrus', 'Copperplate', fantasy", background: 'linear-gradient(135deg, #00ffff, #22d3ee, #7fffd4, #22d3ee, #00ffff)', backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'holoShift 4s ease-in-out infinite', letterSpacing: '0.1em' }}>
                  OsintX
                </h1>
              </div>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link to="/about" className="text-cyan-400 font-medium">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Contact Us
              </Link>
              <Link 
                to="/select-role"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm mb-8">
                <Award className="w-4 h-4" />
                Trusted by 10,000+ Investigators Worldwide
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                <span className="text-white">About </span>
                <span style={{ fontFamily: "'Papyrus', 'Copperplate', fantasy", background: 'linear-gradient(135deg, #00ffff, #22d3ee, #7fffd4, #a855f7, #00ffff)', backgroundSize: '400% 400%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'holoShift 5s ease-in-out infinite', letterSpacing: '0.08em' }}>
                  OsintX
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                We're on a mission to empower investigators with world-class OSINT tools, 
                making digital intelligence accessible, ethical, and effective.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-6 py-20 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-cyan-400">Our Mission</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  OsintX was founded with a clear purpose: to provide investigators, 
                  security researchers, and law enforcement agencies with powerful, ethical 
                  OSINT tools that were previously only available to large organizations.
                </p>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  In a world where digital threats evolve rapidly, we believe everyone 
                  deserves access to professional-grade intelligence tools. Our platform 
                  combines cutting-edge AI with comprehensive data sources to deliver 
                  actionable insights in seconds.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    50+ Data Sources
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    AI-Powered Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Real-time Intelligence
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full"
              >
                {/* Stats Container */}
                <div className="w-full space-y-6">
                  {/* Top Row - First 2 Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Stat 1: Countries */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      viewport={{ once: true }}
                      className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 p-8 md:p-10"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                        >
                          50+
                        </motion.div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">🌍</div>
                          <p className="text-gray-300 font-medium text-sm md:text-base">Countries Served</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Stat 2: Records */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 p-8 md:p-10"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3.2, repeat: Infinity }}
                          className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                        >
                          1B+
                        </motion.div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">📊</div>
                          <p className="text-gray-300 font-medium text-sm md:text-base">Records Indexed</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Row - Last 2 Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Stat 3: Cases */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                      className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 p-8 md:p-10"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3.4, repeat: Infinity }}
                          className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                        >
                          10K+
                        </motion.div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎯</div>
                          <p className="text-gray-300 font-medium text-sm md:text-base">Cases Solved</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Stat 4: Users */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                      className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-pink-400/30 p-8 md:p-10"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3.6, repeat: Infinity }}
                          className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent"
                        >
                          10K+
                        </motion.div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">👥</div>
                          <p className="text-gray-300 font-medium text-sm md:text-base">Active Users</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-white">Our </span>
                <span className="text-purple-400">Core Values</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                The principles that guide our work and define our commitment to the intelligence community.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="px-6 py-20 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-white">Our </span>
                <span className="text-cyan-400">Journey</span>
              </h2>
              <p className="text-gray-500">Key milestones in our mission to transform digital investigations.</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500" />
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 p-6 rounded-2xl bg-white/5 border border-white/10 ${index % 2 === 0 ? 'text-right mr-8' : 'text-left ml-8'}`}>
                    <span className="text-cyan-400 font-mono font-bold">{milestone.year}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 border-4 border-[#030712]" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-white">Our </span>
                <span className="text-purple-400">Team</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                A diverse team of experts dedicated to building the future of digital investigations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-purple-500/30 transition-all group"
                >
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/20 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Investigating?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of investigators who trust OsintX for their OSINT needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/signup"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/contact"
                  className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="OsintX" className="w-8 h-8 object-contain" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))' }} />
            <span className="text-sm text-gray-500 font-mono">
              © 2026 <span style={{ fontFamily: "'Papyrus', 'Copperplate', fantasy", background: 'linear-gradient(135deg, #06b6d4, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: '0 0 15px rgba(34, 211, 238, 0.4)' }}>OsintX</span> • OSINT INVESTIGATION PLATFORM
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 font-mono flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
