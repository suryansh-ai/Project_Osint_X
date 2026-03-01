import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Reusable Logo component for OsintX
 * Uses the cyber globe logo image from /images/logo.png
 * Brand name displayed in Papyrus font with cyber holographic glitch effects
 * @param {Object} props
 * @param {string} props.size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
 * @param {boolean} props.showText - Whether to show the text alongside logo
 * @param {boolean} props.showSubtext - Whether to show the subtext
 * @param {boolean} props.animated - Whether to animate the logo
 * @param {string} props.className - Additional CSS classes
 */

const sizeMap = {
  xs: { text: 'text-base', scan: '16px' },
  sm: { text: 'text-lg', scan: '20px' },
  md: { text: 'text-xl', scan: '24px' },
  lg: { text: 'text-2xl', scan: '28px' },
  xl: { text: 'text-3xl', scan: '32px' },
  '2xl': { text: 'text-4xl', scan: '40px' },
  '3xl': { text: 'text-5xl', scan: '48px' }
};

// Cyber Holographic Letter with glitch effect
const CyberLetter = ({ letter, index, size, isHovered }) => {
  const controls = useAnimation();
  const [glitching, setGlitching] = useState(false);
  
  // Random glitch trigger
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  const glitchVariants = {
    normal: { x: 0, skewX: 0, filter: 'none' },
    glitch: {
      x: [0, -2, 3, -1, 0],
      skewX: [0, -5, 8, -3, 0],
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(-90deg)',
        'hue-rotate(45deg)',
        'hue-rotate(0deg)'
      ],
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.span
      className={`${sizeMap[size]?.text || sizeMap.md.text} inline-block relative`}
      style={{
        fontFamily: "'Papyrus', 'Copperplate', 'Luminari', fantasy",
        fontWeight: 'bold',
        letterSpacing: '0.05em',
      }}
      initial={{ opacity: 0, y: 30, rotateY: -90, scale: 0 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.12,
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
        damping: 10
      }}
      whileHover={{
        scale: 1.3,
        rotateY: [0, 15, -15, 0],
        transition: { duration: 0.4 }
      }}
    >
      {/* Main letter with holographic gradient */}
      <motion.span
        className="relative z-10"
        style={{
          background: `linear-gradient(
            135deg,
            #00ffff 0%,
            #00d4ff 15%,
            #0099ff 30%,
            #00ffff 45%,
            #7fffd4 60%,
            #00ffff 75%,
            #00d4ff 90%,
            #00ffff 100%
          )`,
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'holoShift 3s ease-in-out infinite',
          animationDelay: `${index * 0.2}s`,
        }}
        variants={glitchVariants}
        animate={glitching ? 'glitch' : 'normal'}
      >
        {letter}
      </motion.span>
      
      {/* Cyan glow layer */}
      <motion.span
        className="absolute inset-0 z-0"
        style={{
          fontFamily: "'Papyrus', 'Copperplate', 'Luminari', fantasy",
          fontWeight: 'bold',
          color: '#22d3ee',
          filter: 'blur(4px)',
          opacity: 0.7,
        }}
        animate={{
          opacity: [0.5, 0.9, 0.5],
          filter: ['blur(4px)', 'blur(8px)', 'blur(4px)']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.15
        }}
      >
        {letter}
      </motion.span>

      {/* Electric spark effect on hover */}
      {isHovered && (
        <motion.span
          className="absolute -inset-1"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.span>
  );
};

// Animated brand text with cyber effects
const AnimatedBrandText = ({ size }) => {
  const [isHovered, setIsHovered] = useState(false);
  const brandName = 'OsintX';
  
  return (
    <motion.div 
      className="relative inline-flex items-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Scanning line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(90deg, transparent, #22d3ee, #00ffff, #22d3ee, transparent)',
          boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee',
        }}
        animate={{
          top: ['-10%', '110%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1
        }}
      />
      
      {/* Letter container with perspective */}
      <div className="flex" style={{ perspective: '500px' }}>
        {brandName.split('').map((letter, index) => (
          <CyberLetter 
            key={index} 
            letter={letter} 
            index={index} 
            size={size}
            isHovered={isHovered}
          />
        ))}
      </div>

      {/* Background pulse effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

// Static brand text with Papyrus styling and subtle glow
const StaticBrandText = ({ size }) => {
  return (
    <span
      className={`${sizeMap[size]?.text || sizeMap.md.text} font-bold relative`}
      style={{
        fontFamily: "'Papyrus', 'Copperplate', 'Luminari', fantasy",
        background: 'linear-gradient(135deg, #00ffff, #22d3ee, #7fffd4, #22d3ee, #00ffff)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'holoShift 4s ease-in-out infinite',
        letterSpacing: '0.08em',
        filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))'
      }}
    >
      OsintX
    </span>
  );
};

const Logo = ({ 
  size = 'md', 
  showText = true, 
  showSubtext = false,
  animated = false,
  className = '' 
}) => {
  const sizeConfig = {
    xs: {
      container: 'w-8 h-8',
      image: 'w-8 h-8',
      title: 'text-base',
      subtitle: 'text-[7px]',
      gap: 'gap-2'
    },
    sm: {
      container: 'w-10 h-10',
      image: 'w-10 h-10',
      title: 'text-lg',
      subtitle: 'text-[8px]',
      gap: 'gap-2'
    },
    md: {
      container: 'w-12 h-12',
      image: 'w-12 h-12',
      title: 'text-xl',
      subtitle: 'text-[10px]',
      gap: 'gap-3'
    },
    lg: {
      container: 'w-14 h-14',
      image: 'w-14 h-14',
      title: 'text-2xl',
      subtitle: 'text-xs',
      gap: 'gap-3'
    },
    xl: {
      container: 'w-16 h-16',
      image: 'w-16 h-16',
      title: 'text-3xl',
      subtitle: 'text-sm',
      gap: 'gap-4'
    },
    '2xl': {
      container: 'w-20 h-20',
      image: 'w-20 h-20',
      title: 'text-4xl',
      subtitle: 'text-base',
      gap: 'gap-4'
    },
    '3xl': {
      container: 'w-28 h-28',
      image: 'w-28 h-28',
      title: 'text-5xl',
      subtitle: 'text-lg',
      gap: 'gap-5'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  const LogoImage = () => (
    <img 
      src="/images/logo.png" 
      alt="OsintX" 
      className={`${config.image} object-contain flex-shrink-0`} 
      style={{ 
        filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.5))',
      }} 
    />
  );

  const AnimatedLogoImage = () => (
    <motion.img
      src="/images/logo.png"
      alt="OsintX"
      className={`${config.image} object-contain flex-shrink-0`}
      animate={{ 
        filter: [
          'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))',
          'drop-shadow(0 0 20px rgba(34, 211, 238, 0.7))',
          'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))'
        ],
        rotate: [0, 360]
      }}
      transition={{ 
        filter: { duration: 2, repeat: Infinity },
        rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
      }}
    />
  );

  return (
    <motion.div 
      className={`flex items-center ${config.gap} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {animated ? <AnimatedLogoImage /> : <LogoImage />}
      
      {showText && (
        <div className="text-center sm:text-left">
          <motion.h1 
            className="font-bold tracking-wide flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {animated ? (
              <AnimatedBrandText size={size} />
            ) : (
              <StaticBrandText size={size} />
            )}
          </motion.h1>
          {showSubtext && (
            <motion.p 
              className={`${config.subtitle} tracking-[0.2em] uppercase mt-1`}
              style={{
                fontFamily: "'Papyrus', 'Copperplate', fantasy",
                color: 'rgba(34, 211, 238, 0.6)',
                textShadow: '0 0 10px rgba(34, 211, 238, 0.3)'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              OSINT Investigation Platform
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Simple logo image only - useful for favicons and small icons
 */
export const LogoIcon = ({ size = 'md', className = '', animated = false }) => {
  const sizeConfig = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
    '3xl': 'w-20 h-20'
  };

  if (animated) {
    return (
      <motion.img 
        src="/images/logo.png" 
        alt="OsintX" 
        className={`object-contain ${sizeConfig[size] || sizeConfig.md} ${className}`}
        style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    );
  }

  return (
    <img 
      src="/images/logo.png" 
      alt="OsintX" 
      className={`object-contain ${sizeConfig[size] || sizeConfig.md} ${className}`}
      style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))' }}
    />
  );
};

export default Logo;
