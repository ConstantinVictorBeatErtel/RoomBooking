/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      // Brand Colors
      'brand-blue': '#003262',
      'brand-gold': '#FDB515',

      // Neutrals
      white: '#ffffff',
      black: '#000000',
      'neutral-lightest': '#dfe1e2', // Very light gray for hovers/backgrounds
      'neutral-light': '#e2e8f0', // Light gray for borders
      'neutral-medium': '#64748b', // Medium gray for subtitles, secondary text
      'neutral-dark': '#1e293b', // Dark gray for primary text

      // Transparent, for things like border color
      transparent: 'transparent',
    },
    extend: {
    },
  },
};
