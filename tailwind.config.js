/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        sage: {
          50:  '#f3f7f3',
          100: '#e6efe7',
          200: '#c9ddcc',
          300: '#a3c4a8',
          400: '#79a684',
          500: '#588968',
          600: '#426c52',
          700: '#2f5440',
          800: '#1f3d2d',
          900: '#14281e',
        },
        ink: {
          DEFAULT: '#14281e',
          2: '#2f5440',
          3: '#6a7d6f',
          4: '#9aa89e',
        },
      },
      boxShadow: {
        'glow-sage': '0 12px 32px rgba(88, 137, 104, 0.30)',
        'soft': '0 4px 14px rgba(20, 40, 30, 0.08), 0 1px 3px rgba(20, 40, 30, 0.04)',
      },
      keyframes: {
        panelIn: {
          from: { opacity: '0', transform: 'translateY(14px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        msgIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        notifIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'panel-in': 'panelIn 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'msg-in':   'msgIn 280ms cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'notif-in': 'notifIn 280ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
