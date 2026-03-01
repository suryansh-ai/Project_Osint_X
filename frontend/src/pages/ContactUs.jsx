import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
  ArrowLeft,
  CheckCircle,
  Linkedin,
  Twitter,
  Github,
  Home,
  ExternalLink,
  BookOpen,
  Newspaper,
  Camera,
  User,
  Calendar
} from 'lucide-react';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('[ContactUs] Form submitted:', formData);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    { icon: User, label: 'Name', value: 'Deepak Yadav', href: '#' },
    { icon: Phone, label: 'Phone', value: '+91 9457496915', href: 'tel:+919457496915' },
    { icon: Mail, label: 'Email', value: 'deepakyadavsquad@gmail.com', href: 'mailto:deepakyadavsquad@gmail.com' },
    { icon: Mail, label: 'Business Email', value: 'info@osintx.com', href: 'mailto:info@osintx.com' },
    { icon: MapPin, label: 'Address', value: 'Uttar Pradesh, Agra', href: '#' },
    { icon: Clock, label: 'Support Hours', value: 'Mon-Sat: 10AM - 7PM', href: '#' },
  ];

  const otherWebsites = [
    { icon: BookOpen, name: 'Courses Website', url: 'https://osintx.com/home', color: 'from-cyan-500 to-blue-500' },
    { icon: Newspaper, name: 'Cyber News Website', url: 'https://cyberdeepakyadav.com/', color: 'from-purple-500 to-pink-500' },
    { icon: Camera, name: 'Photography Website', url: 'https://osintx.com/page/invite', color: 'from-amber-500 to-orange-500' },
    { icon: User, name: 'Personal Portfolio', url: 'https://yadavdeepak.in/', color: 'from-emerald-500 to-teal-500' },
  ];

  const schedule = [
    { day: 'Sunday', time: 'OFF', isOff: true },
    { day: 'Monday', time: '10:00 AM - 07:00 PM', isOff: false },
    { day: 'Tuesday', time: '10:00 AM - 07:00 PM', isOff: false },
    { day: 'Wednesday', time: '10:00 AM - 07:00 PM', isOff: false },
    { day: 'Thursday', time: '10:00 AM - 07:00 PM', isOff: false },
    { day: 'Friday', time: '10:00 AM - 07:00 PM', isOff: false },
    { day: 'Saturday', time: '10:00 AM - 07:00 PM', isOff: false },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
              <Link to="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-cyan-400 font-medium">
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Get in </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about our OSINT platform? We're here to help. Reach out to our team for support, partnerships, or inquiries.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {!submitted ? (
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                <p className="text-gray-400 mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                  <p className="text-white font-medium text-sm">{item.value}</p>
                </motion.a>
              ))}
            </div>

            {/* My Other Websites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                My Other Websites
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {otherWebsites.map((site, index) => (
                  <motion.a
                    key={site.name}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group flex flex-col items-center text-center"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${site.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <site.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1">
                      {site.name}
                      <ExternalLink className="w-3 h-3" />
                    </p>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Call Us Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Call Us Schedule
              </h3>
              <div className="space-y-2">
                {schedule.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                      item.isOff ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
                    }`}
                  >
                    <span className={`font-medium ${item.isOff ? 'text-red-400' : 'text-white'}`}>
                      {item.day}
                    </span>
                    <span className={`text-sm ${item.isOff ? 'text-red-400' : 'text-cyan-400'}`}>
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
              <div className="flex items-center gap-4">
                <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                  <Twitter className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                  <Github className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
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
            <span className="text-xs text-gray-600 font-mono">
              Uttar Pradesh, Agra, India
            </span>
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

export default ContactUs;
