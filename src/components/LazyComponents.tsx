'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { MonitoringStation } from '@/lib/types';
import { DetailsPanelSkeleton, MapLoadingSpinner, LoadingSpinner } from './LoadingComponents';

/**
 * Lazy-loaded component wrappers with proper SSR handling
 * This file exports dynamically imported components to improve performance
 */

// Type definitions
export interface LazyMapWrapperProps {
  className?: string;
  onStationSelect?: (station: MonitoringStation | null) => void;
  selectedStation?: MonitoringStation | null;
  onLoadingChange?: (isLoading: boolean) => void;
}

export interface LazyDetailsPanelWrapperProps {
  selectedStation: MonitoringStation | null;
  isLoading?: boolean;
}

export interface LazyAQIChartWrapperProps {
  station: MonitoringStation | null;
}

// Lazy load Map component with SSR disabled to prevent window errors
export const LazyMapWrapper = dynamic(
  () => import('./Map'),
  {
    ssr: false,
    loading: () => <MapLoadingSpinner />
  }
);

// Lazy load DetailsPanel component
export const LazyDetailsPanelWrapper = dynamic(
  () => import('./DetailsPanel'),
  {
    ssr: true,
    loading: () => <DetailsPanelSkeleton />
  }
);

// Lazy load AQI Chart component
export const LazyAQIChartWrapper = dynamic(
  () => import('./AQIChart'),
  {
    ssr: true,
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="medium" text="Memuat grafik..." />
      </div>
    )
  }
);