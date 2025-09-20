import { Coordinates, AQICategory } from './types';

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
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

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate AQI value for a given pollutant concentration
 * @param concentration - Pollutant concentration
 * @param pollutant - Pollutant type ('pm25', 'pm10', 'o3', etc.)
 * @returns AQI value
 */
export function calculateAQI(concentration: number, pollutant: string): number {
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

/**
 * Get AQI category information for a given AQI value
 * @param aqi - AQI value
 * @returns AQI category
 */
export function getAQICategory(aqi: number): AQICategory {
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

/**
 * Format timestamp to readable date string
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param timestamp - ISO timestamp string
 * @returns Relative time string
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return formatTimestamp(timestamp);
  }
}

/**
 * Validate coordinates
 * @param latitude - Latitude value
 * @param longitude - Longitude value
 * @returns Boolean indicating if coordinates are valid
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
}

/**
 * Get color for AQI value
 * @param aqi - AQI value
 * @returns Hex color string
 */
export function getAQIColor(aqi: number): string {
  return getAQICategory(aqi).color;
}
