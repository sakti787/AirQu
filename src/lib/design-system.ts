/**
 * Design System - Color Utilities
 * Modern color palette with semantic AQI colors and utility functions
 */

// AQI Color Mapping
export const AQI_COLORS = {
  good: {
    value: '#10b981',
    bg: 'bg-aqi-good-50',
    text: 'text-aqi-good-700',
    border: 'border-aqi-good-200',
    button: 'bg-aqi-good-500 hover:bg-aqi-good-600',
  },
  moderate: {
    value: '#f59e0b',
    bg: 'bg-aqi-moderate-50',
    text: 'text-aqi-moderate-700',
    border: 'border-aqi-moderate-200',
    button: 'bg-aqi-moderate-500 hover:bg-aqi-moderate-600',
  },
  sensitive: {
    value: '#f97316',
    bg: 'bg-aqi-sensitive-50',
    text: 'text-aqi-sensitive-700',
    border: 'border-aqi-sensitive-200',
    button: 'bg-aqi-sensitive-500 hover:bg-aqi-sensitive-600',
  },
  unhealthy: {
    value: '#ef4444',
    bg: 'bg-aqi-unhealthy-50',
    text: 'text-aqi-unhealthy-700',
    border: 'border-aqi-unhealthy-200',
    button: 'bg-aqi-unhealthy-500 hover:bg-aqi-unhealthy-600',
  },
  'very-unhealthy': {
    value: '#8b5cf6',
    bg: 'bg-aqi-very-unhealthy-50',
    text: 'text-aqi-very-unhealthy-700',
    border: 'border-aqi-very-unhealthy-200',
    button: 'bg-aqi-very-unhealthy-500 hover:bg-aqi-very-unhealthy-600',
  },
  hazardous: {
    value: '#7f1d1d',
    bg: 'bg-aqi-hazardous-50',
    text: 'text-aqi-hazardous-700',
    border: 'border-aqi-hazardous-200',
    button: 'bg-aqi-hazardous-500 hover:bg-aqi-hazardous-600',
  }
} as const;

// AQI Utility Functions
export const getAQIColorScheme = (aqi: number | undefined) => {
  if (!aqi) return AQI_COLORS.moderate;
  
  if (aqi <= 50) return AQI_COLORS.good;
  if (aqi <= 100) return AQI_COLORS.moderate;
  if (aqi <= 150) return AQI_COLORS.sensitive;
  if (aqi <= 200) return AQI_COLORS.unhealthy;
  if (aqi <= 300) return AQI_COLORS['very-unhealthy'];
  return AQI_COLORS.hazardous;
};

export const getAQIColor = (aqi: number | undefined): string => {
  return getAQIColorScheme(aqi).value;
};

export const getAQICategory = (aqi: number | undefined): string => {
  if (!aqi) return 'Data tidak tersedia';
  
  if (aqi <= 50) return 'Baik';
  if (aqi <= 100) return 'Sedang';
  if (aqi <= 150) return 'Tidak Sehat untuk Kelompok Sensitif';
  if (aqi <= 200) return 'Tidak Sehat';
  if (aqi <= 300) return 'Sangat Tidak Sehat';
  return 'Berbahaya';
};

// Common Design System Classes
export const DESIGN_TOKENS = {
  // Spacing
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  },
  
  // Rounded corners
  rounded: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },
  
  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  
  // Typography
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  },
  
  // Weights
  weight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }
} as const;

// Component Base Classes
export const COMPONENT_STYLES = {
  card: 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 transition-all duration-300',
  button: {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md',
    outline: 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm',
  },
  input: 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
  searchInput: 'w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 shadow-sm hover:shadow-md focus:shadow-md',
  badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200',
} as const;