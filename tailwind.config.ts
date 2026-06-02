import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette
        dark: '#1C1C1C',
        light: '#F5F5F5',
        primary: { DEFAULT: '#2563C4', hover: '#1d4fa3' },
        cta: { DEFAULT: '#A020C8', hover: '#8a1aab' },
        // Secondary palette (sparingly)
        promo: '#F5A800',
        success: '#5BBD2F',
        danger: '#E8231A',
        // Legacy aliases for existing components
        cream: '#F5F5F5',
        charcoal: '#1C1C1C',
        burgundy: { DEFAULT: '#2563C4', hover: '#1d4fa3' },
        gold: '#F5A800',
        border: { subtle: 'rgba(37,99,196,0.2)', DEFAULT: 'rgba(37,99,196,0.3)' },
        muted: '#6B6B6B',
        warning: '#F5A800',
        error: '#E8231A',
        info: '#2563C4',
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '999px',
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'marquee': 'marquee 60s linear infinite',
        'blob': 'blob 7s infinite',
        'slide-in-right': 'slideInRight 200ms ease-out',
        'slide-in-down': 'slideInDown 200ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        'fade-in': 'fadeIn 400ms ease-out',
        'fade-in-up': 'fadeInUp 500ms ease-out',
        'toast-in': 'toastIn 300ms ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
