# OpenAQ API Integration - Complete Guide

## Overview

This project includes a complete TypeScript implementation for fetching air quality data from the OpenAQ API. The implementation includes proper type definitions, error handling, AQI calculations, and distance measurements.

## 📁 File Structure

```
src/lib/
├── types.ts           # TypeScript type definitions for all data structures
├── openaq-api.ts      # Core API functions with inline utilities
├── utils.ts           # Additional utility functions
├── example-usage.ts   # Usage examples and helper functions
├── openaq-demo.ts     # Main demo and practical examples
└── test-openaq.ts     # Test functions for verification
```

## 🚀 Main Function

### `getAirQualityData(latitude, longitude, radiusKm?, maxStations?)`

**The primary function for fetching air quality data from OpenAQ API**

```typescript
import { getAirQualityData } from '@/lib/openaq-demo';

// Get air quality data for Surakarta, Indonesia
const stations = await getAirQualityData(-7.5617, 110.8318, 50, 5);

console.log(`Found ${stations.length} monitoring stations`);
stations.forEach(station => {
  if (station.aqi) {
    console.log(`${station.name}: AQI ${station.aqi} (${station.aqiCategory?.label})`);
  }
});
```

**Parameters:**
- `latitude: number` - Latitude coordinate (-90 to 90)
- `longitude: number` - Longitude coordinate (-180 to 180)
- `radiusKm?: number` - Search radius in kilometers (default: 25)
- `maxStations?: number` - Maximum stations to return (default: 10)

**Returns:** `Promise<MonitoringStation[]>`

## 📊 TypeScript Types

### Core Types

```typescript
// Monitoring station with all data
interface MonitoringStation {
  id: number;
  name: string;
  coordinates: Coordinates;
  city: string;
  country: string;
  countryCode: string;
  isAnalysis: boolean;
  isMobile: boolean;
  isActive: boolean;
  lastUpdated: string;
  firstUpdated: string;
  parameters: AirQualityParameter[];
  measurements?: AirQualityMeasurement[];
  aqi?: number;                    // Calculated AQI value
  aqiCategory?: AQICategory;       // AQI category with color and description
  distance?: number;               // Distance from query point in km
}

// Geographic coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Individual pollutant measurement
interface AirQualityMeasurement {
  parameter: string;               // 'pm25', 'pm10', 'o3', etc.
  value: number;
  lastUpdated: string;
  unit: string;
  sourceName: string;
  averagingPeriod: {
    value: number;
    unit: string;
  };
}

// AQI category information
interface AQICategory {
  level: number;                   // 1-6
  label: string;                   // 'Baik', 'Sedang', etc.
  color: string;                   // Hex color code
  description: string;             // Health advisory
}
```

## 🌍 Available API Functions

### 1. `getNearbyStations(lat, lng, options?)`
Fetches nearby stations without measurements (faster)

### 2. `getNearbyStationsWithMeasurements(lat, lng, options?)`
Fetches stations with latest measurements and AQI calculations

### 3. `getStationMeasurements(stationId, parameters?)`
Gets measurements for a specific station

### 4. `getAirQualityData(lat, lng, radius?, limit?)`
**Main function** - Gets stations with AQI data (recommended)

## 🎯 AQI Categories

| AQI Range | Level | Label (Indonesian) | Color | Description |
|-----------|-------|-------------------|-------|-------------|
| 0-50 | 1 | Baik | 🟢 #00E400 | Kualitas udara baik dan tidak berbahaya |
| 51-100 | 2 | Sedang | 🟡 #FFFF00 | Kualitas udara dapat diterima |
| 101-150 | 3 | Tidak Sehat untuk Kelompok Sensitif | 🟠 #FF7E00 | Kelompok sensitif mungkin mengalami masalah |
| 151-200 | 4 | Tidak Sehat | 🔴 #FF0000 | Setiap orang mungkin mengalami masalah |
| 201-300 | 5 | Sangat Tidak Sehat | 🟣 #8F3F97 | Peringatan kesehatan darurat |
| 301+ | 6 | Berbahaya | 🔴 #7E0023 | Efek kesehatan serius untuk semua |

## 🔧 Usage Examples

### Basic Usage
```typescript
import { getAirQualityData } from '@/lib/openaq-demo';

try {
  const stations = await getAirQualityData(-7.5617, 110.8318);
  console.log(`Found ${stations.length} stations`);
  
  stations.forEach(station => {
    console.log(`${station.name}: AQI ${station.aqi || 'N/A'}`);
  });
} catch (error) {
  console.error('Error fetching air quality data:', error);
}
```

### React Component Usage
```typescript
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
        <div key={station.id} className="mb-2 p-2 border rounded">
          <strong>{station.name}</strong>
          {station.aqi && (
            <div style={{ color: station.aqiCategory?.color }}>
              AQI: {station.aqi} ({station.aqiCategory?.label})
            </div>
          )}
          <small>Distance: {station.distance?.toFixed(1)} km</small>
        </div>
      ))}
    </div>
  );
}
```

### Map Integration
```typescript
// Use with react-leaflet map
import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { getAirQualityData } from '@/lib/openaq-demo';

export function AirQualityMarkers({ mapBounds }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Fetch stations for current map view
    const center = mapBounds.getCenter();
    getAirQualityData(center.lat, center.lng, 50)
      .then(setStations)
      .catch(console.error);
  }, [mapBounds]);

  return (
    <>
      {stations.map(station => (
        <Marker
          key={station.id}
          position={[station.coordinates.latitude, station.coordinates.longitude]}
        >
          <Popup>
            <div>
              <h4>{station.name}</h4>
              {station.aqi && (
                <p style={{ color: station.aqiCategory?.color }}>
                  AQI: {station.aqi} ({station.aqiCategory?.label})
                </p>
              )}
              <small>{station.city}, {station.country}</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
```

## 🧪 Testing

Run the test functions to verify the API integration:

```typescript
import { testOpenAQAPI, runFullDemo } from '@/lib/test-openaq';

// Quick test
await testOpenAQAPI();

// Full demo with detailed output
await runFullDemo();
```

## 🛠️ Features

- ✅ **Complete TypeScript types** for all API responses
- ✅ **AQI calculations** based on EPA standards
- ✅ **Distance calculations** using Haversine formula
- ✅ **Error handling** with custom error types
- ✅ **Input validation** for coordinates and parameters
- ✅ **Flexible options** for radius, limits, and pollutant types
- ✅ **Indonesian language support** for AQI categories
- ✅ **Color coding** for AQI levels
- ✅ **React-ready** with hooks and component examples
- ✅ **No API keys required** - uses public OpenAQ API

## 🌏 Example Locations

**Indonesia:**
- Surakarta (Solo): `-7.5617, 110.8318`
- Jakarta: `-6.2088, 106.8456`
- Surabaya: `-7.2575, 112.7521`
- Bandung: `-6.9175, 107.6191`

**Other regions:** The API works worldwide wherever OpenAQ has monitoring stations.

## 📝 Notes

- The OpenAQ API is free and requires no authentication
- Response times vary based on data availability
- AQI calculations use US EPA standards
- All functions include comprehensive error handling
- Built for Next.js 15 with App Router compatibility