import {
  MonitoringStation,
  OpenAQLocation,
  OpenAQMeasurement,
  OpenAQResponse,
  LocationQuery,
  MeasurementQuery,
  Coordinates,
  OpenAQError,
  AQICategory
} from './types';

// Utility functions defined inline to avoid import issues
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
    Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateAQI(concentration: number, pollutant: string): number {
  // PM2.5 AQI calculation (simplified)
  if (pollutant === 'pm25') {
    if (concentration <= 12.0) return Math.round((50 / 12.0) * concentration);
    if (concentration <= 35.4) return Math.round(51 + (49 / 23.4) * (concentration - 12.1));
    if (concentration <= 55.4) return Math.round(101 + (49 / 19.9) * (concentration - 35.5));
    if (concentration <= 150.4) return Math.round(151 + (49 / 94.9) * (concentration - 55.5));
    if (concentration <= 250.4) return Math.round(201 + (99 / 99.9) * (concentration - 150.5));
    return Math.round(301 + (199 / 249.9) * (concentration - 250.5));
  }
  
  // PM10 AQI calculation (simplified)
  if (pollutant === 'pm10') {
    if (concentration <= 54) return Math.round((50 / 54) * concentration);
    if (concentration <= 154) return Math.round(51 + (49 / 100) * (concentration - 55));
    if (concentration <= 254) return Math.round(101 + (49 / 100) * (concentration - 155));
    if (concentration <= 354) return Math.round(151 + (49 / 100) * (concentration - 255));
    if (concentration <= 424) return Math.round(201 + (99 / 70) * (concentration - 355));
    return Math.round(301 + (199 / 180) * (concentration - 425));
  }
  
  // O3 AQI calculation (simplified)
  if (pollutant === 'o3') {
    if (concentration <= 108) return Math.round((50 / 108) * concentration);
    if (concentration <= 140) return Math.round(51 + (49 / 32) * (concentration - 109));
    if (concentration <= 180) return Math.round(101 + (49 / 40) * (concentration - 141));
    if (concentration <= 240) return Math.round(151 + (49 / 60) * (concentration - 181));
    if (concentration <= 700) return Math.round(201 + (99 / 460) * (concentration - 241));
    return Math.round(301 + (199 / 300) * (concentration - 701));
  }
  
  // Default fallback
  return Math.round(concentration / 10); // Simple approximation
}

function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) {
    return {
      level: 1,
      label: 'Baik',
      color: '#00E400',
      description: 'Kualitas udara baik dan tidak berbahaya'
    };
  } else if (aqi <= 100) {
    return {
      level: 2,
      label: 'Sedang',
      color: '#FFFF00',
      description: 'Kualitas udara dapat diterima untuk sebagian besar orang'
    };
  } else if (aqi <= 150) {
    return {
      level: 3,
      label: 'Tidak Sehat untuk Kelompok Sensitif',
      color: '#FF7E00',
      description: 'Anggota kelompok sensitif mungkin mengalami masalah kesehatan'
    };
  } else if (aqi <= 200) {
    return {
      level: 4,
      label: 'Tidak Sehat',
      color: '#FF0000',
      description: 'Setiap orang mungkin mulai mengalami masalah kesehatan'
    };
  } else if (aqi <= 300) {
    return {
      level: 5,
      label: 'Sangat Tidak Sehat',
      color: '#8F3F97',
      description: 'Peringatan kesehatan kondisi darurat'
    };
  } else {
    return {
      level: 6,
      label: 'Berbahaya',
      color: '#7E0023',
      description: 'Peringatan kesehatan: setiap orang mungkin mengalami efek kesehatan serius'
    };
  }
}

// OpenAQ API base URL
const OPENAQ_BASE_URL = 'https://api.openaq.org/v2';

// Get API key from environment
const getApiHeaders = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAQ_API_KEY;
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  
  return headers;
};

// Default query parameters
const DEFAULT_RADIUS = 25; // kilometers
const DEFAULT_LIMIT = 10;

/**
 * Fetches nearby monitoring stations from OpenAQ API
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param options - Additional query options
 * @returns Promise<MonitoringStation[]>
 */
export async function getNearbyStations(
  latitude: number,
  longitude: number,
  options: Partial<LocationQuery> = {}
): Promise<MonitoringStation[]> {
  try {
    const {
      radius = DEFAULT_RADIUS,
      limit = DEFAULT_LIMIT,
      sort = 'asc',
      orderBy = 'lastUpdated'
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
      coordinates: `${latitude},${longitude}`,
      radius: radius.toString(),
      limit: limit.toString(),
      sort: sort,
      order_by: orderBy,
    });

    const url = `${OPENAQ_BASE_URL}/locations?${params}`;
    
    console.log('Fetching stations from:', url);

    const response = await fetch(url, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      throw new OpenAQError(
        `Failed to fetch stations: ${response.statusText}`,
        response.status
      );
    }

    const data: OpenAQResponse<OpenAQLocation> = await response.json();
    
    // Transform OpenAQ locations to our MonitoringStation format
    const stations: MonitoringStation[] = data.results.map((location) => {
      const distance = calculateDistance(
        { latitude, longitude },
        location.coordinates
      );

      return {
        id: location.id,
        name: location.name,
        coordinates: {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
        },
        city: location.city,
        country: location.country,
        countryCode: location.countryCode,
        isAnalysis: location.isAnalysis,
        isMobile: location.isMobile,
        isActive: location.isActive,
        lastUpdated: location.lastUpdated,
        firstUpdated: location.firstUpdated,
        parameters: location.parameters,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      };
    });

    return stations;
  } catch (error) {
    if (error instanceof OpenAQError) {
      throw error;
    }
    throw new OpenAQError(
      `Error fetching nearby stations: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches latest measurements for nearby stations
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param options - Additional query options
 * @returns Promise<MonitoringStation[]>
 */
export async function getNearbyStationsWithMeasurements(
  latitude: number,
  longitude: number,
  options: Partial<MeasurementQuery> = {}
): Promise<MonitoringStation[]> {
  try {
    const {
      radius = DEFAULT_RADIUS,
      limit = DEFAULT_LIMIT,
      parameters = ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'],
      sort = 'desc',
      orderBy = 'datetime'
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
      coordinates: `${latitude},${longitude}`,
      radius: radius.toString(),
      limit: (limit * 3).toString(), // Get more measurements to ensure we have recent data
      sort: sort,
      order_by: orderBy,
      parameter: parameters.join(','),
    });

    const url = `${OPENAQ_BASE_URL}/measurements?${params}`;
    
    console.log('Fetching measurements from:', url);

    const response = await fetch(url, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      throw new OpenAQError(
        `Failed to fetch measurements: ${response.statusText}`,
        response.status
      );
    }

    const data: OpenAQResponse<OpenAQMeasurement> = await response.json();
    
    // Group measurements by location
    const stationMap = new Map<number, MonitoringStation>();
    
    data.results.forEach((measurement) => {
      const locationId = measurement.locationId;
      const distance = calculateDistance(
        { latitude, longitude },
        measurement.coordinates
      );

      if (!stationMap.has(locationId)) {
        stationMap.set(locationId, {
          id: locationId,
          name: measurement.location,
          coordinates: {
            latitude: measurement.coordinates.latitude,
            longitude: measurement.coordinates.longitude,
          },
          city: measurement.city,
          country: measurement.country,
          countryCode: '', // Not available in measurements endpoint
          isAnalysis: measurement.isAnalysis,
          isMobile: measurement.isMobile,
          isActive: true, // Assume active if we have recent measurements
          lastUpdated: measurement.date.utc,
          firstUpdated: measurement.date.utc,
          parameters: [], // Will be filled based on available measurements
          measurements: [],
          distance: Math.round(distance * 100) / 100,
        });
      }

      const station = stationMap.get(locationId)!;
      
      // Add measurement to station
      station.measurements!.push({
        parameter: measurement.parameter,
        value: measurement.value,
        lastUpdated: measurement.date.utc,
        unit: measurement.unit,
        sourceName: measurement.entity,
        averagingPeriod: {
          value: 1,
          unit: 'hour' // Default averaging period
        }
      });

      // Update last updated time if this measurement is more recent
      if (new Date(measurement.date.utc) > new Date(station.lastUpdated)) {
        station.lastUpdated = measurement.date.utc;
      }
    });

    // Convert map to array and calculate AQI for each station
    const stations = Array.from(stationMap.values()).map((station) => {
      // Calculate AQI based on available measurements
      const pm25Measurement = station.measurements?.find(m => m.parameter === 'pm25');
      const pm10Measurement = station.measurements?.find(m => m.parameter === 'pm10');
      const o3Measurement = station.measurements?.find(m => m.parameter === 'o3');

      let aqi: number | undefined;
      
      if (pm25Measurement) {
        aqi = calculateAQI(pm25Measurement.value, 'pm25');
      } else if (pm10Measurement) {
        aqi = calculateAQI(pm10Measurement.value, 'pm10');
      } else if (o3Measurement) {
        aqi = calculateAQI(o3Measurement.value, 'o3');
      }

      if (aqi !== undefined) {
        station.aqi = Math.round(aqi);
        station.aqiCategory = getAQICategory(aqi);
      }

      return station;
    });

    // Sort by distance and limit results
    return stations
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, limit);

  } catch (error) {
    if (error instanceof OpenAQError) {
      throw error;
    }
    throw new OpenAQError(
      `Error fetching stations with measurements: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches latest measurements for a specific station
 * @param stationId - Station ID
 * @param parameters - Array of parameters to fetch (optional)
 * @returns Promise<MonitoringStation | null>
 */
export async function getStationMeasurements(
  stationId: number,
  parameters?: string[]
): Promise<MonitoringStation | null> {
  try {
    const params = new URLSearchParams({
      location_id: stationId.toString(),
      limit: '20',
      sort: 'desc',
      order_by: 'datetime',
    });

    if (parameters && parameters.length > 0) {
      params.append('parameter', parameters.join(','));
    }

    const url = `${OPENAQ_BASE_URL}/measurements?${params}`;
    
    const response = await fetch(url, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      throw new OpenAQError(
        `Failed to fetch station measurements: ${response.statusText}`,
        response.status
      );
    }

    const data: OpenAQResponse<OpenAQMeasurement> = await response.json();
    
    if (data.results.length === 0) {
      return null;
    }

    const firstMeasurement = data.results[0];
    
    const station: MonitoringStation = {
      id: stationId,
      name: firstMeasurement.location,
      coordinates: {
        latitude: firstMeasurement.coordinates.latitude,
        longitude: firstMeasurement.coordinates.longitude,
      },
      city: firstMeasurement.city,
      country: firstMeasurement.country,
      countryCode: '',
      isAnalysis: firstMeasurement.isAnalysis,
      isMobile: firstMeasurement.isMobile,
      isActive: true,
      lastUpdated: firstMeasurement.date.utc,
      firstUpdated: firstMeasurement.date.utc,
      parameters: [],
      measurements: data.results.map(measurement => ({
        parameter: measurement.parameter,
        value: measurement.value,
        lastUpdated: measurement.date.utc,
        unit: measurement.unit,
        sourceName: measurement.entity,
        averagingPeriod: {
          value: 1,
          unit: 'hour'
        }
      }))
    };

    // Calculate AQI
    const pm25Measurement = station.measurements?.find(m => m.parameter === 'pm25');
    if (pm25Measurement) {
      const aqi = calculateAQI(pm25Measurement.value, 'pm25');
      station.aqi = Math.round(aqi);
      station.aqiCategory = getAQICategory(aqi);
    }

    return station;

  } catch (error) {
    if (error instanceof OpenAQError) {
      throw error;
    }
    throw new OpenAQError(
      `Error fetching station measurements: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}