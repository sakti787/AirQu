'use client';

import React from 'react';

// Reusable skeleton components
const SkeletonText = ({ className = '', width = 'w-full' }: { className?: string; width?: string }) => (
  <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${width} ${className}`} />
);

const SkeletonCircle = ({ size = 'w-4 h-4' }: { size?: string }) => (
  <div className={`${size} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`} />
);

const SkeletonCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse ${className}`}>
    {children}
  </div>
);

// Details Panel Skeleton Component
export const DetailsPanelSkeleton = () => {
  return (
    <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto animate-pulse">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <SkeletonText width="w-3/4" className="mb-2 h-6" />
        <SkeletonText width="w-1/2" className="h-4" />
      </div>

      <div className="p-6 space-y-6">
        {/* Main AQI Card */}
        <SkeletonCard>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <SkeletonText width="w-1/2" className="h-5" />
          </div>
          <div className="p-6">
            {/* AQI Number */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
              <SkeletonText width="w-32 mx-auto" className="h-5 mb-2" />
              <SkeletonText width="w-24 mx-auto" className="h-4" />
            </div>

            {/* Main Pollutant */}
            <div className="mb-6">
              <SkeletonText width="w-1/3" className="h-4 mb-3" />
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <SkeletonText width="w-1/4" className="h-5" />
              </div>
            </div>

            {/* Measurements */}
            <div className="mb-6">
              <SkeletonText width="w-2/5" className="h-4 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <SkeletonText width="w-16" className="h-4" />
                    <SkeletonText width="w-20" className="h-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <SkeletonText width="w-40 mx-auto" className="h-3" />
            </div>
          </div>
        </SkeletonCard>

        {/* Health Recommendations */}
        <SkeletonCard>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <SkeletonText width="w-1/2" className="h-5" />
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-start space-x-3">
                  <SkeletonCircle size="w-2 h-2 mt-2" />
                  <SkeletonText width={index % 2 === 0 ? 'w-full' : 'w-5/6'} className="h-4" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>

        {/* Chart Skeleton */}
        <SkeletonCard>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <SkeletonText width="w-2/5" className="h-5" />
          </div>
          <div className="p-6">
            {/* Chart area */}
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg relative overflow-hidden animate-pulse">
              {/* Animated gradient overlay for chart effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              {/* Mock chart lines */}
              <div className="absolute inset-4">
                <div className="relative h-full">
                  {[1, 2, 3, 4, 5].map((line) => (
                    <div 
                      key={line}
                      className="absolute w-full h-px bg-gray-300 dark:bg-gray-600 opacity-30"
                      style={{ top: `${line * 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
};

// Map Loading Spinner Component
export const MapLoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-[1000]">
      <div className="text-center">
        {/* Spinning circle */}
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Memuat peta...
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mengambil data stasiun monitoring
          </p>
        </div>
      </div>
    </div>
  );
};

// Generic Loading Spinner
export const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Memuat...',
  className = '' 
}: { 
  size?: 'small' | 'medium' | 'large'; 
  text?: string;
  className?: string;
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-2`}></div>
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Shimmer animation CSS (to be added to globals.css)
export const shimmerAnimation = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;