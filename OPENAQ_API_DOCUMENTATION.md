# OpenAQ API Integration Documentation

## Overview

This module provides TypeScript functions to fetch air quality data from the OpenAQ API with proper type definitions, error handling, and AQI calculations.

## Files Structure

```
src/lib/
├── types.ts          # TypeScript type definitions
├── utils.ts          # Utility functions for calculations
├── openaq-api.ts     # Main API functions
└── example-usage.ts  # Usage examples and exports
```

## Main Functions

### `getNearbyStations(latitude, longitude, options?)`

Fetches nearby monitoring stations without measurements (faster).

**Parameters:**
- `latitude: number` - Latitude coordinate
- `longitude: number` - Longitude coordinate  
- `options?: Partial<LocationQuery>` - Optional query parameters

**Options:**
- `radius?: number` - Search radius in kilometers (default: 25)
- `limit?: number` - Maximum number of results (default: 10)
- `sort?: 'asc' | 'desc'` - Sort order (default: 'asc')
- `orderBy?: string` - Sort field (default: 'lastUpdated')

**Returns:** `Promise<MonitoringStation[]>`

**Example:**
```typescript
import { getNearbyStations } from '@/lib/example-usage';

const stations = await getNearbyStations(-7.5617, 110.8318, {
  radius: 50,
  limit: 10
});
```

### `getNearbyStationsWithMeasurements(latitude, longitude, options?)`

Fetches nearby stations with latest measurements and calculated AQI values.

**Parameters:**
- `latitude: number` - Latitude coordinate
- `longitude: number` - Longitude coordinate
- `options?: Partial<MeasurementQuery>` - Optional query parameters

**Options:**
- `radius?: number` - Search radius in kilometers (default: 25)
- `limit?: number` - Maximum number of results (default: 10)
- `parameters?: string[]` - Pollutants to fetch (default: ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'])
- `sort?: 'asc' | 'desc'` - Sort order (default: 'desc')
- `orderBy?: string` - Sort field (default: 'datetime')

**Returns:** `Promise<MonitoringStation[]>`

**Example:**
```typescript
import { getNearbyStationsWithMeasurements } from '@/lib/example-usage';

const stations = await getNearbyStationsWithMeasurements(-7.5617, 110.8318, {
  radius: 30,
  limit: 5,
  parameters: ['pm25', 'pm10', 'o3']
});
```

### `getStationMeasurements(stationId, parameters?)`

Fetches latest measurements for a specific station.

**Parameters:**
- `stationId: number` - Station ID
- `parameters?: string[]` - Optional array of parameters to fetch

**Returns:** `Promise<MonitoringStation | null>`

## Type Definitions

### `MonitoringStation`

```typescript
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
  aqi?: number;
  aqiCategory?: AQICategory;
  distance?: number; // in kilometers
}
```

### `AirQualityMeasurement`

```typescript
interface AirQualityMeasurement {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
  sourceName: string;
  averagingPeriod: {
    value: number;
    unit: string;
  };
}
```

### `AQICategory`

```typescript
interface AQICategory {
  level: number;
  label: string;
  color: string;
  description: string;
}
```

## AQI Categories

The system uses Indonesian AQI categories based on US EPA standards:

| AQI Range | Level | Label | Color | Description |
|-----------|-------|-------|-------|-------------|
| 0-50 | 1 | Baik | #00E400 | Kualitas udara baik dan tidak berbahaya |
| 51-100 | 2 | Sedang | #FFFF00 | Kualitas udara dapat diterima untuk sebagian besar orang |
| 101-150 | 3 | Tidak Sehat untuk Kelompok Sensitif | #FF7E00 | Anggota kelompok sensitif mungkin mengalami masalah kesehatan |
| 151-200 | 4 | Tidak Sehat | #FF0000 | Setiap orang mungkin mulai mengalami masalah kesehatan |
| 201-300 | 5 | Sangat Tidak Sehat | #8F3F97 | Peringatan kesehatan kondisi darurat |
| 301+ | 6 | Berbahaya | #7E0023 | Peringatan kesehatan: setiap orang mungkin mengalami efek kesehatan serius |

## Utility Functions

### AQI Calculation
- `calculateAQI(concentration, pollutant)` - Calculate AQI for a pollutant
- `getAQICategory(aqi)` - Get category information for AQI value
- `getAQIColor(aqi)` - Get color for AQI value

### Distance Calculation
- `calculateDistance(coord1, coord2)` - Calculate distance between coordinates using Haversine formula

### Data Formatting
- `formatTimestamp(timestamp)` - Format ISO timestamp to readable Indonesian format
- `getRelativeTime(timestamp)` - Get relative time string (e.g., "2 jam yang lalu")

### Validation
- `validateCoordinates(lat, lng)` - Validate coordinate values

### Sorting
- `sortStations(stations, sortBy, order)` - Sort stations by various criteria

## Error Handling

The module includes comprehensive error handling:

```typescript
// Custom error class
class OpenAQError extends Error {
  status?: number;
  code?: string;
}

// Usage
try {
  const stations = await getNearbyStations(lat, lng);
} catch (error) {
  if (error instanceof OpenAQError) {
    console.error('OpenAQ API Error:', error.message, error.status);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Example Usage Scenarios

### 1. Basic Station Lookup
```typescript
import { getNearbyStations } from '@/lib/example-usage';

// Get stations near Surakarta
const stations = await getNearbyStations(-7.5617, 110.8318);
console.log(`Found ${stations.length} stations`);
```

### 2. Air Quality Dashboard
```typescript
import { getNearbyStationsWithMeasurements } from '@/lib/example-usage';

const stationsWithAQI = await getNearbyStationsWithMeasurements(-7.5617, 110.8318, {
  radius: 25,
  limit: 5
});

stationsWithAQI.forEach(station => {
  if (station.aqi) {
    console.log(`${station.name}: AQI ${station.aqi} (${station.aqiCategory?.label})`);
  }
});
```

### 3. Location Summary
```typescript
import { getAirQualitySummary } from '@/lib/example-usage';

const summary = await getAirQualitySummary(-7.5617, 110.8318);
if (summary.status === 'success') {
  console.log(`AQI: ${summary.aqi} - ${summary.category?.label}`);
  console.log(`Nearest station: ${summary.nearestStation} (${summary.distance}km)`);
}
```

## Integration with React Components

```typescript
// In a React component
import { useEffect, useState } from 'react';
import { MonitoringStation } from '@/lib/example-usage';
import { getNearbyStationsWithMeasurements } from '@/lib/example-usage';

export function AirQualityWidget({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getNearbyStationsWithMeasurements(latitude, longitude);
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [latitude, longitude]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {stations.map(station => (
        <div key={station.id}>
          <h3>{station.name}</h3>
          {station.aqi && (
            <div style={{ color: station.aqiCategory?.color }}>
              AQI: {station.aqi} ({station.aqiCategory?.label})
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Performance Considerations

1. **Caching**: Consider implementing caching for API responses to reduce requests
2. **Rate Limiting**: OpenAQ API may have rate limits, implement appropriate delays
3. **Error Boundaries**: Use React error boundaries for graceful error handling
4. **Loading States**: Always provide loading indicators for better UX

## Next Steps

1. Implement caching mechanism for API responses
2. Add retry logic for failed requests
3. Create React hooks for easier component integration
4. Add more pollutant types and regional AQI standards
5. Implement real-time data updates via WebSocket (if available)