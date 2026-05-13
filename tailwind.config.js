/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // Forces these animation utilities into the build even when they're
  // referenced from inline styles or HTML strings that Tailwind can't auto-detect.
  safelist: [
    'animate-slide-up',
    'animate-slide-in',
    'animate-message-in',
    'animate-fade-in',
    'animate-hex-pulse',
    'animate-btn-float',
    'animate-btn-pulse',
    'animate-btn-pulse-late',
    'animate-btn-sparkle',
    'animate-typing-wave-1',
    'animate-typing-wave-2',
    'animate-typing-wave-3',
    'animate-typing-icon',
    'animate-typing-shimmer',
    'animate-typing-dots',
    'animate-limit-shimmer',
    'animate-limit-pulse',
    'animate-new-chat-flow',
    'animate-new-chat-sparkle',
    'animate-header-flow',
  ],

  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f5f9f6',
          100: '#e8f4ea',
          200: '#d4e4d4',
          300: '#a8c5a8',
          400: '#7db88e',
          500: '#6b9e78',
          600: '#4a7c59',
          700: '#2d3e2d',
        },
      },

      keyframes: {
        // ───── Core layout & messages ─────
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          'to':   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        messageSlideIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        hexagonPulse: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)',    opacity: '1' },
          '50%':      { transform: 'scale(0.7) rotate(30deg)', opacity: '0.6' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
        'slide-in': {
          'from': { transform: 'translateX(400px)', opacity: '0' },
          'to':   { transform: 'translateX(0)',     opacity: '1' },
        },

        // ───── Chat trigger button ─────
        chatButtonFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        chatButtonPulse: {
          '0%':   { transform: 'scale(1)',   opacity: '0.5' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        chatButtonSparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)',     opacity: '1' },
          '50%':      { transform: 'scale(0.5) rotate(180deg)', opacity: '0.3' },
        },

        // ───── Typing indicator ─────
        typingHexWave: {
          '0%, 70%, 100%': { transform: 'translateY(0) scale(0.7) rotate(0deg)',    opacity: '0.4' },
          '30%':           { transform: 'translateY(-8px) scale(1.15) rotate(60deg)', opacity: '1' },
          '50%':           { transform: 'translateY(-2px) scale(0.9) rotate(120deg)', opacity: '0.7' },
        },
        typingIconPulse: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.85' },
          '50%':      { transform: 'scale(1.18)', opacity: '1' },
        },
        typingShimmer: {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        typingDots: {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '25%':  { clipPath: 'inset(0 66% 0 0)' },
          '50%':  { clipPath: 'inset(0 33% 0 0)' },
          '75%':  { clipPath: 'inset(0 0 0 0)' },
          '100%': { clipPath: 'inset(0 100% 0 0)' },
        },

        // ───── Session limit card ─────
        limitShimmer: {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        limitIconPulse: {
          '0%, 100%': { transform: 'scale(1)',    boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.3)' },
          '50%':      { transform: 'scale(1.05)', boxShadow: '0 0 0 6px rgba(245, 158, 11, 0)' },
        },

        // ───── "Start New Chat" button ─────
        newChatGradientFlow: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%':      { backgroundPosition: '100% center' },
        },
        newChatSparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)',     opacity: '1' },
          '50%':      { transform: 'scale(0.55) rotate(180deg)', opacity: '0.4' },
        },

        // ───── Chat header ─────
        headerGradientFlow: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%':      { backgroundPosition: '100% center' },
        },
      },

      animation: {
        // ───── Core ─────
        'slide-up':         'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in':         'slide-in 0.3s ease-out',
        'message-in':       'messageSlideIn 0.3s ease-out',
        'fade-in':          'fadeIn 0.3s ease-out',
        'hex-pulse':        'hexagonPulse 1.5s ease-in-out infinite',

        // ───── Chat trigger button ─────
        'btn-float':        'chatButtonFloat 3s ease-in-out infinite',
        'btn-pulse':        'chatButtonPulse 2.5s cubic-bezier(0,0,0.2,1) infinite',
        'btn-pulse-late':   'chatButtonPulse 2.5s cubic-bezier(0,0,0.2,1) 1.25s infinite',
        'btn-sparkle':      'chatButtonSparkle 2.2s ease-in-out infinite',

        // ───── Typing indicator (3 staggered waves) ─────
        'typing-wave-1':    'typingHexWave 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0s infinite',
        'typing-wave-2':    'typingHexWave 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.18s infinite',
        'typing-wave-3':    'typingHexWave 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.36s infinite',
        'typing-icon':      'typingIconPulse 1.5s ease-in-out infinite',
        'typing-shimmer':   'typingShimmer 2.2s linear infinite',
        'typing-dots':      'typingDots 1.4s steps(4, end) infinite',

        // ───── Session limit card ─────
        'limit-shimmer':    'limitShimmer 2.5s linear infinite',
        'limit-pulse':      'limitIconPulse 2.5s ease-in-out infinite',

        // ───── "Start New Chat" button ─────
        'new-chat-flow':    'newChatGradientFlow 4s ease-in-out infinite',
        'new-chat-sparkle': 'newChatSparkle 2s ease-in-out infinite',

        // ───── Header ─────
        'header-flow':      'headerGradientFlow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};