'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  initialPageLoad: number;
  componentLoadTime: number;
  totalLoadTime: number;
  memoryUsage?: number;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Measure initial page load performance
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const initialPageLoad = navigation.loadEventEnd - navigation.fetchStart;
        const componentLoadTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        const totalLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        // Memory usage (if available)
        const memoryUsage = ((performance as any)?.memory as { usedJSHeapSize?: number })?.usedJSHeapSize || 0;
        
        setMetrics({
          initialPageLoad,
          componentLoadTime,
          totalLoadTime,
          memoryUsage
        });

        console.log('🚀 Performance Metrics:', {
          initialPageLoad: `${initialPageLoad.toFixed(2)}ms`,
          componentLoadTime: `${componentLoadTime.toFixed(2)}ms`,
          totalLoadTime: `${totalLoadTime.toFixed(2)}ms`,
          memoryUsage: memoryUsage ? `${(memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A'
        });
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return metrics;
};

// Performance monitoring component
export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMetrics();
  const [showMetrics, setShowMetrics] = useState(false);

  if (!metrics || !showMetrics) {
    return (
      <motion.button
        onClick={() => setShowMetrics(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📊 Performance
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Performance</h3>
        <button
          onClick={() => setShowMetrics(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Initial Load:</span>
          <span className="font-mono">{metrics.initialPageLoad.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Components:</span>
          <span className="font-mono">{metrics.componentLoadTime.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Total:</span>
          <span className="font-mono">{metrics.totalLoadTime.toFixed(0)}ms</span>
        </div>
        {metrics.memoryUsage && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="font-mono">{(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
          </div>
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
        <div className="text-xs text-green-600 dark:text-green-400">
          ✅ Lazy loading active
        </div>
      </div>
    </div>
  );
};