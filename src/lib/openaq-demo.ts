/**
 * OpenAQ API Demo - Practical examples of fetching air quality data
 * 
 * This file demonstrates the main TypeScript function for getting air quality data
 * from the OpenAQ API with proper types and error handling.
 */

import { 
  getNearbyStationsWithMeasurements 
} from './openaq-api';

import { 
  MonitoringStation
} from './types';

import { generateMockStations } from './mockData';

// ============================================================================
// MAIN FUNCTION: Get Air Quality Data from OpenAQ API
// ============================================================================

/**
 * Fetches nearby air quality monitoring stations with measurements and AQI data
 * 
 * @param latitude - Latitude coordinate (-90 to 90)
 * @param longitude - Longitude coordinate (-180 to 180)
 * @param radiusKm - Search radius in kilometers (default: 25km)
 * @param maxStations - Maximum number of stations to return (default: 10)
 * @returns Promise<MonitoringStation[]> - Array of monitoring stations with AQI data
 * 
 * @example
 * // Get air quality data for Surakarta, Indonesia
 * const stations = await getAirQualityData(-7.5617, 110.8318, 50, 5);
 * console.log(`Found ${stations.length} stations`);
 * stations.forEach(station => {
 *   console.log(`${station.name}: AQI ${station.aqi} (${station.aqiCategory?.label})`);
 * });
 */
export async function getAirQualityData(
  latitude: number,
  longitude: number,
  radiusKm: number = 25,
  maxStations: number = 10
): Promise<MonitoringStation[]> {
  
  // Validate input coordinates
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
  
  if (radiusKm <= 0 || radiusKm > 1000) {
    throw new Error('Radius must be between 1 and 1000 kilometers');
  }

  try {
    console.log(`🔍 Searching for air quality stations near (${latitude}, ${longitude})`);
    console.log(`📍 Search radius: ${radiusKm}km, Max stations: ${maxStations}`);
    
    // Try to fetch stations from OpenAQ API
    try {
      const stations = await getNearbyStationsWithMeasurements(latitude, longitude, {
        radius: radiusKm,
        limit: maxStations,
        parameters: ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'] // Common air pollutants
      });

      if (stations && stations.length > 0) {
        console.log(`✅ Found ${stations.length} monitoring stations from OpenAQ API`);
        
        // Log summary of results
        stations.forEach((station, index) => {
          const aqiStatus = station.aqi 
            ? `AQI: ${station.aqi} (${station.aqiCategory?.label})` 
            : 'AQI: Not available';
          
          console.log(`${index + 1}. ${station.name} - ${aqiStatus} - ${station.distance?.toFixed(1)}km away`);
        });

        return stations;
      }
    } catch (apiError) {
      console.warn('⚠️ OpenAQ API unavailable, falling back to mock data');
      console.warn('API Error:', apiError instanceof Error ? apiError.message : 'Unknown error');
    }

    // Fallback to mock data if API fails or returns no results
    console.log('🔄 Using mock data for demonstration');
    const mockStations = generateMockStations(latitude, longitude, maxStations);
    
    console.log(`✅ Generated ${mockStations.length} mock monitoring stations`);
    
    // Log summary of mock results
    mockStations.forEach((station, index) => {
      const aqiStatus = station.aqi 
        ? `AQI: ${station.aqi} (${station.aqiCategory?.label})` 
        : 'AQI: Not available';
      
      console.log(`${index + 1}. ${station.name} - ${aqiStatus} - ${station.distance?.toFixed(1)}km away`);
    });

    return mockStations;

  } catch (error) {
    console.error('❌ Error fetching air quality data:', error);
    throw new Error(`Failed to fetch air quality data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// DEMO FUNCTIONS
// ============================================================================

/**
 * Demo function: Get air quality for Surakarta (Solo), Indonesia
 */
export async function demoSurakartaAirQuality(): Promise<void> {
  console.log('\n🌟 DEMO: Air Quality in Surakarta, Indonesia\n');
  
  try {
    const stations = await getAirQualityData(-7.5617, 110.8318, 50, 5);
    
    if (stations.length === 0) {
      console.log('❌ No monitoring stations found in the area');
      return;
    }

    console.log('\n📊 DETAILED RESULTS:');
    console.log('=' .repeat(60));
    
    stations.forEach((station, index) => {
      console.log(`\n${index + 1}. ${station.name.toUpperCase()}`);
      console.log(`   📍 Location: ${station.city}, ${station.country}`);
      console.log(`   🗺️  Coordinates: ${station.coordinates.latitude}, ${station.coordinates.longitude}`);
      console.log(`   📏 Distance: ${station.distance?.toFixed(1)} km`);
      
      if (station.aqi && station.aqiCategory) {
        console.log(`   🌬️  AQI: ${station.aqi} (${station.aqiCategory.label})`);
        console.log(`   🎨 Color: ${station.aqiCategory.color}`);
        console.log(`   ℹ️  Status: ${station.aqiCategory.description}`);
      }
      
      if (station.measurements && station.measurements.length > 0) {
        console.log('   🔬 Latest Measurements:');
        station.measurements.slice(0, 3).forEach(measurement => {
          console.log(`      • ${measurement.parameter.toUpperCase()}: ${measurement.value} ${measurement.unit}`);
        });
      }
      
      console.log(`   🕒 Last Updated: ${new Date(station.lastUpdated).toLocaleString('id-ID')}`);
    });

  } catch (error) {
    console.error('Demo failed:', error);
  }
}

/**
 * Demo function: Get air quality for Jakarta, Indonesia
 */
export async function demoJakartaAirQuality(): Promise<void> {
  console.log('\n🌟 DEMO: Air Quality in Jakarta, Indonesia\n');
  
  try {
    // Jakarta coordinates
    const stations = await getAirQualityData(-6.2088, 106.8456, 30, 3);
    
    console.log('\n📊 JAKARTA AIR QUALITY SUMMARY:');
    stations.forEach(station => {
      if (station.aqi) {
        const emoji = getAQIEmoji(station.aqi);
        console.log(`${emoji} ${station.name}: AQI ${station.aqi} - ${station.aqiCategory?.label}`);
      }
    });

  } catch (error) {
    console.error('Jakarta demo failed:', error);
  }
}

/**
 * Utility function to get emoji based on AQI level
 */
function getAQIEmoji(aqi: number): string {
  if (aqi <= 50) return '🟢'; // Good
  if (aqi <= 100) return '🟡'; // Moderate
  if (aqi <= 150) return '🟠'; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return '🔴'; // Unhealthy
  if (aqi <= 300) return '🟣'; // Very Unhealthy
  return '🔴'; // Hazardous
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Basic usage with custom coordinates
 */
export async function exampleBasicUsage() {
  try {
    // Get air quality data for any location
    const stations = await getAirQualityData(-7.5617, 110.8318); // Surakarta
    
    // Process the results
    stations.forEach(station => {
      console.log(`Station: ${station.name}`);
      console.log(`AQI: ${station.aqi || 'N/A'}`);
      console.log(`Distance: ${station.distance?.toFixed(1)} km`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 2: React component usage
 */
export async function exampleReactComponentUsage() {
  // This is how you'd use it in a React component
  
  /*
  import { useEffect, useState } from 'react';
  import { getAirQualityData } from '@/lib/openaq-demo';
  import { MonitoringStation } from '@/lib/types';

  export function AirQualityWidget({ lat, lng }: { lat: number; lng: number }) {
    const [stations, setStations] = useState<MonitoringStation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function fetchData() {
        setLoading(true);
        setError(null);
        
        try {
          const data = await getAirQualityData(lat, lng, 25, 5);
          setStations(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }, [lat, lng]);

    if (loading) return <div>Loading air quality data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h3>Nearby Air Quality Stations</h3>
        {stations.map(station => (
          <div key={station.id} style={{ marginBottom: '10px' }}>
            <strong>{station.name}</strong>
            {station.aqi && (
              <span style={{ color: station.aqiCategory?.color }}>
                AQI: {station.aqi} ({station.aqiCategory?.label})
              </span>
            )}
            <small>Distance: {station.distance?.toFixed(1)} km</small>
          </div>
        ))}
      </div>
    );
  }
  */
}

// Export all the types for easy use
export type {
  MonitoringStation,
  Coordinates,
  AirQualityMeasurement,
  AQICategory
} from './types';