// Re-export the air quality data fetching function from openaq-demo.ts
// This provides a clean API interface for the Map component

export { getAirQualityData } from './openaq-demo';
export type { MonitoringStation, AirQualityMeasurement, AQICategory } from './types';