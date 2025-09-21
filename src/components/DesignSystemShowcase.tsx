'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getAQIColorScheme, COMPONENT_STYLES } from '@/lib/design-system';

export const DesignSystemShowcase: React.FC = () => {
  const aqiValues = [25, 75, 125, 175, 250, 350];

  return (
    <div className="fixed bottom-4 left-4 max-w-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-6 z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Design System</h3>
        <motion.button 
          onClick={(e) => e.currentTarget.parentElement?.parentElement?.remove()}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>
      </div>

      {/* Primary Colors */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Primary Color</h4>
        <div className="flex space-x-2">
          {['primary-400', 'primary-500', 'primary-600'].map((color) => (
            <div key={color} className={`w-8 h-8 rounded bg-${color}`}></div>
          ))}
        </div>
      </div>

      {/* AQI Colors */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">AQI Colors</h4>
        <div className="space-y-2">
          {aqiValues.map((aqi) => {
            const colorScheme = getAQIColorScheme(aqi);
            return (
              <div key={aqi} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colorScheme.value }}
                ></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  AQI {aqi}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Button Styles */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Buttons</h4>
        <div className="space-y-2">
          <motion.button className={COMPONENT_STYLES.button.primary} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Primary</motion.button>
          <motion.button className={COMPONENT_STYLES.button.secondary} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Secondary</motion.button>
          <motion.button className={COMPONENT_STYLES.button.outline} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Outline</motion.button>
        </div>
      </div>

      {/* Typography */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Typography (Inter)</h4>
        <div className="space-y-1">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Extra Small Text</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Small Text</p>
          <p className="text-base text-neutral-700 dark:text-neutral-300">Base Text</p>
          <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Large Text</p>
        </div>
      </div>
    </div>
  );
};

// Hook to add design system showcase
export const useDesignSystemShowcase = () => {
  React.useEffect(() => {
    const showDesignSystem = () => {
      // Remove any existing showcase
      const existing = document.getElementById('design-system-showcase');
      if (existing) existing.remove();

      // Create new showcase
      const showcase = document.createElement('div');
      showcase.id = 'design-system-showcase';
      document.body.appendChild(showcase);

      // Render the showcase (this is a simplified approach)
      showcase.innerHTML = `
        <div class="fixed bottom-4 left-4 max-w-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-4 z-50">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">Design System Active</h3>
            <button onclick="this.parentElement.parentElement.remove()" class="text-neutral-400 hover:text-neutral-600">✕</button>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">✅ Inter font loaded</p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">✅ Modern color palette</p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">✅ AQI semantic colors</p>
        </div>
      `;
    };

    // Show after a short delay to let the page load
    const timer = setTimeout(showDesignSystem, 2000);
    return () => clearTimeout(timer);
  }, []);
};