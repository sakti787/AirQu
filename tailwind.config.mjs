import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.svg',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        heading: ['Montserrat', 'Poppins', ...fontFamily.sans],
      },
      colors: {
        background: '#F8F9FA',
        foreground: '#212529',
        muted: '#6C757D',
        accent: {
          DEFAULT: '#007BFF',
          500: '#007BFF',
        },
        aqi: {
          good: '#7be495', // softened green
          'good-200': '#c8f4d5', // lighter green variant
          moderate: '#ffe066', // softened yellow
          'moderate-200': '#fff4b3', // lighter yellow variant
          sensitive: '#ffd670', // softened orange
          'sensitive-200': '#ffe7b3', // lighter orange variant
          unhealthy: '#ff8787', // softened red
          'unhealthy-200': '#ffb3b3', // lighter red variant
          'very-unhealthy': '#b197fc', // softened purple
          'very-unhealthy-200': '#d4c5fe', // lighter purple variant
          hazardous: '#ff6f91', // softened pink-red
          'hazardous-200': '#ffb3c6', // lighter pink-red variant
        },
        // Keep compatibility with existing slate colors
        slate: {
          50: '#f8fafc',
          400: '#94a3b8',
          500: '#64748b',
          800: '#1e293b',
        },
        // Add additional grays for flexibility
        gray: {
          50: '#f9fafb',
          200: '#e5e7eb',
        },
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
