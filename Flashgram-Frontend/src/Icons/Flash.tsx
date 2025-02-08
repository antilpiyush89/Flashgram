import { motion } from "framer-motion";

export function Flash({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base layer with gradient fill */}
      <path
        d="M13 3L4 14H12L11 21L20 10H12L13 3Z"
        fill="url(#gradient-fill)"
        filter="url(#shadow)"
      />

      {/* Highlight layer */}
      <path
        d="M13 3L4 14H12L11 21L20 10H12L13 3Z"
        fill="url(#highlight)"
        opacity="0.6"
      />

      {/* Animated outline */}
      <motion.path
        d="M13 3L4 14H12L11 21L20 10H12L13 3Z"
        stroke="url(#stroke-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
      />

      {/* Definitions for gradients and filters */}
      <defs>
        {/* Main gradient fill */}
        <linearGradient id="gradient-fill" x1="4" y1="3" x2="20" y2="21">
          <stop offset="0%" stopColor="#4ff0d1" />
          <stop offset="100%" stopColor="#3ad1b3" />
        </linearGradient>

        {/* Highlight gradient */}
        <linearGradient id="highlight" x1="4" y1="3" x2="20" y2="21">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Stroke gradient */}
        <linearGradient id="stroke-gradient" x1="4" y1="3" x2="20" y2="21">
          <stop offset="0%" stopColor="#4ff0d1" />
          <stop offset="100%" stopColor="#2fb399" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feFlood floodColor="#4ff0d1" floodOpacity="0.3" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}