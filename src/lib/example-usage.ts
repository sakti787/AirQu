/**
 * Example usage of OpenAQ API functions
 * This file demonstrates how to use the air quality data fetching functions
 */

import { getNearbyStations, getNearbyStationsWithMeasurements } from './openaq-api';
import { validateCoordinates, formatTimestamp, getRelativeTime } from './utils';

// Surakarta coordinates for testing
const SURAKARTA_LAT = -7.5617;
const SURAKARTA_LNG = 110.8318;

/**
 * Example function to fetch and display nearby stations
 */
export async function fetchNearbyStationsExample() {
  try {
    // Validate coordinates first
    if (!validateCoordinates(SURAKARTA_LAT, SURAKARTA_LNG)) {
      throw new Error('Invalid coordinates');
    }

    console.log('Fetching nearby monitoring stations...');
    
    // Fetch nearby stations without measurements (faster)
    const stations = await getNearbyStations(SURAKARTA_LAT, SURAKARTA_LNG, {
      radius: 50, // 50km radius
      limit: 10   // Get up to 10 stations
    });

    console.log(`Found ${stations.length} nearby monitoring stations:`);
    
    stations.forEach((station, index) => {
      console.log(`\n${index + 1}. ${station.name}`);
      console.log(`   Location: ${station.city}, ${station.country}`);
      console.log(`   Coordinates: ${station.coordinates.latitude}, ${station.coordinates.longitude}`);
      console.log(`   Distance: ${station.distance}km`);
      console.log(`   Active: ${station.isActive ? 'Yes' : 'No'}`);
      console.log(`   Last Updated: ${formatTimestamp(station.lastUpdated)}`);
      console.log(`   Parameters: ${station.parameters.map(p => p.name).join(', ')}`);
    });

    return stations;

  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    throw error;
  }
}

/**
 * Example function to fetch stations with latest measurements and AQI
 */
export async function fetchStationsWithMeasurementsExample() {
  try {
    console.log('Fetching nearby stations with measurements...');
    
    // Fetch stations with latest measurements
    const stationsWithData = await getNearbyStationsWithMeasurements(
      SURAKARTA_LAT, 
      SURAKARTA_LNG,
      {
        radius: 50,
        limit: 5,
        parameters: ['pm25', 'pm10', 'o3', 'no2'] // Specific pollutants
      }
    );

    console.log(`Found ${stationsWithData.length} stations with measurements:`);
    
    stationsWithData.forEach((station, index) => {
      console.log(`\n${index + 1}. ${station.name}`);
      console.log(`   Distance: ${station.distance}km`);
      
      if (station.aqi !== undefined) {
        console.log(`   AQI: ${station.aqi} (${station.aqiCategory?.label})`);
        console.log(`   Category: ${station.aqiCategory?.description}`);
      }
      
      if (station.measurements && station.measurements.length > 0) {
        console.log('   Latest Measurements:');
        station.measurements.forEach(measurement => {
          console.log(`     ${measurement.parameter.toUpperCase()}: ${measurement.value} ${measurement.unit}`);
          console.log(`     Updated: ${getRelativeTime(measurement.lastUpdated)}`);
        });
      }
    });

    return stationsWithData;

  } catch (error) {
    console.error('Error fetching stations with measurements:', error);
    throw error;
  }
}

/**
 * Utility function to get air quality summary for a location
 */
export async function getAirQualitySummary(latitude: number, longitude: number) {
  try {
    const stations = await getNearbyStationsWithMeasurements(latitude, longitude, {
      radius: 25,
      limit: 3
    });

    if (stations.length === 0) {
      return {
        status: 'no-data',
        message: 'Tidak ada stasiun monitoring terdekat yang ditemukan'
      };
    }

    // Find station with the best AQI data
    const stationWithAQI = stations.find(s => s.aqi !== undefined);
    
    if (!stationWithAQI) {
      return {
        status: 'no-aqi',
        message: 'Data AQI tidak tersedia untuk area ini',
        stations: stations.length
      };
    }

    return {
      status: 'success',
      aqi: stationWithAQI.aqi,
      category: stationWithAQI.aqiCategory,
      nearestStation: stationWithAQI.name,
      distance: stationWithAQI.distance,
      lastUpdated: stationWithAQI.lastUpdated,
      totalStations: stations.length
    };

  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Export utility functions for use in components
export {
  validateCoordinates,
  formatTimestamp,
  getRelativeTime
} from './utils';

export {
  getNearbyStations,
  getNearbyStationsWithMeasurements,
  getStationMeasurements
} from './openaq-api';

export type {
  MonitoringStation,
  Coordinates,
  AirQualityMeasurement,
  AQICategory
} from './types';