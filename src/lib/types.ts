// Types for OpenAQ API responses and air quality data

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AirQualityParameter {
  id: number;
  name: string;
  displayName: string;
  description: string;
}

export interface AirQualityMeasurement {
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

export interface MonitoringStation {
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
  aqi?: number; // Calculated AQI value
  aqiCategory?: AQICategory;
  distance?: number; // Distance from query point in kilometers
}

export interface AQICategory {
  level: number;
  label: string;
  color: string;
  description: string;
}

// OpenAQ API Response interfaces
export interface OpenAQLocation {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  city: string;
  country: string;
  countryCode: string;
  isAnalysis: boolean;
  isMobile: boolean;
  isActive: boolean;
  lastUpdated: string;
  firstUpdated: string;
  parameters: Array<{
    id: number;
    name: string;
    displayName: string;
    description: string;
  }>;
}

export interface OpenAQMeasurement {
  locationId: number;
  location: string;
  parameter: string;
  value: number;
  date: {
    utc: string;
    local: string;
  };
  unit: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
  city: string;
  isMobile: boolean;
  isAnalysis: boolean;
  entity: string;
  sensorType: string;
}

export interface OpenAQResponse<T> {
  meta: {
    name: string;
    license: string;
    website: string;
    page: number;
    limit: number;
    found: number;
  };
  results: T[];
}

// AQI calculation parameters for different pollutants
export interface AQIBreakpoint {
  pollutant: string;
  unit: string;
  breakpoints: Array<{
    low: number;
    high: number;
    aqiLow: number;
    aqiHigh: number;
    category: AQICategory;
  }>;
}

// API query parameters
export interface LocationQuery {
  coordinates: Coordinates;
  radius?: number; // in kilometers
  limit?: number;
  page?: number;
  sort?: 'asc' | 'desc';
  orderBy?: 'lastUpdated' | 'firstUpdated' | 'count' | 'random';
}

export interface MeasurementQuery {
  coordinates: Coordinates;
  radius?: number;
  limit?: number;
  page?: number;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'asc' | 'desc';
  orderBy?: 'datetime' | 'value';
  parameters?: string[]; // e.g., ['pm25', 'pm10', 'o3']
}

// Error handling
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

export class OpenAQError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'OpenAQError';
    this.status = status;
    this.code = code;
  }
}