import React from 'react';
import { motion } from 'framer-motion';

export const BotCharacter = () => {
  return (
    <motion.div 
      className="relative w-10 h-10"
      animate={{
        y: [0, -3, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Body */}
        <motion.path
          d="M35 50h50v45c0 5.523-4.477 10-10 10H45c-5.523 0-10-4.477-10-10V50z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Head */}
        <motion.path
          d="M30 40c0-16.569 13.431-30 30-30s30 13.431 30 30v10H30V40z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Eyes */}
        <motion.circle
          cx="45"
          cy="35"
          r="5"
          fill="white"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.circle
          cx="75"
          cy="35"
          r="5"
          fill="white"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        
        {/* Mouth */}
        <motion.path
          d="M50 45h20"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            d: ["M50 45h20", "M50 48c5 5 15 5 20 0", "M50 45h20"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        
        {/* Arms */}
        <motion.path
          d="M25 60c-5.523 0-10-4.477-10-10s4.477-10 10-10"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-primary"
          animate={{
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.path
          d="M95 60c5.523 0 10-4.477 10-10s-4.477-10-10-10"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-primary"
          animate={{
            rotate: [10, -10, 10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        
        {/* Legs */}
        <motion.path
          d="M45 105c0 5.523-4.477 10-10 10s-10-4.477-10-10"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-primary"
          animate={{
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
        <motion.path
          d="M75 105c0 5.523 4.477 10 10 10s10-4.477 10-10"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-primary"
          animate={{
            rotate: [5, -5, 5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />

        {/* Antenna */}
        <motion.path
          d="M60 10V5"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-primary"
          animate={{
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        <motion.circle
          cx="60"
          cy="3"
          r="2"
          fill="currentColor"
          className="text-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </svg>
    </motion.div>
  );
}; 