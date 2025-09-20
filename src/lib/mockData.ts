// Mock data for development and fallback when OpenAQ API is unavailable
import { MonitoringStation, AirQualityMeasurement } from './types';

// Generate realistic mock data for Jakarta area
export const generateMockStations = (centerLat: number, centerLng: number, count: number = 8): MonitoringStation[] => {
  const mockStations: MonitoringStation[] = [];
  
  // Base station names for Jakarta area with specific coordinates
  const stationData = [
    { name: 'Monas Jakarta Pusat', lat: -6.1754, lng: 106.8272 },
    { name: 'Balai Kota DKI Jakarta', lat: -6.1612, lng: 106.8246 },
    { name: 'UI Depok', lat: -6.3621, lng: 106.8270 },
    { name: 'RSUPN Cipto Mangunkusumo', lat: -6.1867, lng: 106.8312 },
    { name: 'Grand Indonesia', lat: -6.1944, lng: 106.8231 },
    { name: 'Taman Mini Indonesia', lat: -6.3025, lng: 106.8951 },
    { name: 'Mall Taman Anggrek', lat: -6.1785, lng: 106.7925 },
    { name: 'Bandara Soekarno-Hatta', lat: -6.1275, lng: 106.6537 }
  ];

  for (let i = 0; i < Math.min(count, stationData.length); i++) {
    const station = stationData[i];
    const lat = station.lat;
    const lng = station.lng;
    
    // Generate realistic AQI values (mostly moderate to unhealthy for Indonesian cities)
    const aqiValues = [45, 65, 85, 110, 125, 95, 75, 135];
    const aqi = aqiValues[i] || Math.floor(Math.random() * 100) + 30;
    
    // Generate measurements based on AQI
    const pm25Value = Math.max(5, aqi * 0.4 + Math.random() * 10);
    const pm10Value = Math.max(10, pm25Value * 1.5 + Math.random() * 15);
    const o3Value = Math.max(20, aqi * 0.6 + Math.random() * 20);
    
    const measurements: AirQualityMeasurement[] = [
      {
        parameter: 'pm25',
        value: Math.round(pm25Value * 10) / 10,
        unit: 'µg/m³',
        lastUpdated: new Date().toISOString(),
        averagingPeriod: { value: 1, unit: 'hours' },
        sourceName: 'Mock Data'
      },
      {
        parameter: 'pm10',
        value: Math.round(pm10Value * 10) / 10,
        unit: 'µg/m³',
        lastUpdated: new Date().toISOString(),
        averagingPeriod: { value: 1, unit: 'hours' },
        sourceName: 'Mock Data'
      },
      {
        parameter: 'o3',
        value: Math.round(o3Value * 10) / 10,
        unit: 'µg/m³',
        lastUpdated: new Date().toISOString(),
        averagingPeriod: { value: 1, unit: 'hours' },
        sourceName: 'Mock Data'
      }
    ];

    // Calculate distance from center
    const deltaLat = lat - centerLat;
    const deltaLng = lng - centerLng;
    const distance = Math.sqrt(Math.pow(deltaLat * 111, 2) + Math.pow(deltaLng * 111 * Math.cos(centerLat * Math.PI / 180), 2));

    const mockStation: MonitoringStation = {
      id: 1000 + i,
      name: station.name,
      coordinates: {
        latitude: lat,
        longitude: lng
      },
      city: 'Jakarta',
      country: 'Indonesia',
      countryCode: 'ID',
      isAnalysis: false,
      isMobile: false,
      isActive: true,
      lastUpdated: new Date().toISOString(),
      firstUpdated: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
      parameters: [
        { id: 1, name: 'pm25', displayName: 'PM2.5', description: 'Particulate matter < 2.5 micrometers' },
        { id: 2, name: 'pm10', displayName: 'PM10', description: 'Particulate matter < 10 micrometers' },
        { id: 3, name: 'o3', displayName: 'O3', description: 'Ground-level ozone' }
      ],
      measurements,
      aqi,
      aqiCategory: getAQICategory(aqi),
      distance: Math.round(distance * 10) / 10
    };

    mockStations.push(mockStation);
  }

  return mockStations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

// Helper function to get AQI category
function getAQICategory(aqi: number) {
  if (aqi <= 50) {
    return {
      level: 1,
      label: 'Baik',
      color: '#00e400',
      description: 'Kualitas udara baik dan aman untuk semua aktivitas'
    };
  }
  if (aqi <= 100) {
    return {
      level: 2,
      label: 'Sedang',
      color: '#ffff00',
      description: 'Kualitas udara dapat diterima untuk sebagian besar orang'
    };
  }
  if (aqi <= 150) {
    return {
      level: 3,
      label: 'Tidak Sehat untuk Kelompok Sensitif',
      color: '#ff7e00',
      description: 'Kelompok sensitif sebaiknya mengurangi aktivitas outdoor'
    };
  }
  if (aqi <= 200) {
    return {
      level: 4,
      label: 'Tidak Sehat',
      color: '#ff0000',
      description: 'Semua orang sebaiknya mengurangi aktivitas outdoor'
    };
  }
  if (aqi <= 300) {
    return {
      level: 5,
      label: 'Sangat Tidak Sehat',
      color: '#8f3f97',
      description: 'Peringatan kesehatan: semua orang sebaiknya menghindari aktivitas outdoor'
    };
  }
  return {
    level: 6,
    label: 'Berbahaya',
    color: '#7e0023',
    description: 'Peringatan darurat: kondisi berbahaya untuk semua orang'
  };
}