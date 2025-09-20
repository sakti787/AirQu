import { ComponentType } from 'react';
import { MonitoringStation } from '../lib/types';

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

export declare const LazyMapWrapper: ComponentType<LazyMapWrapperProps>;
export declare const LazyDetailsPanelWrapper: ComponentType<LazyDetailsPanelWrapperProps>;
export declare const LazyAQIChartWrapper: ComponentType<LazyAQIChartWrapperProps>;