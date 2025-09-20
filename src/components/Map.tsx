'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents, ZoomControl } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import '@/styles/leaflet-custom.css';
import { useEffect, useState } from 'react';
import { getAirQualityData, MonitoringStation } from '@/lib/airQualityAPI';
import { fixLeafletIcons } from '@/lib/leafletUtils';
import { MapLoadingSpinner } from './LoadingComponents';
import { AlertTriangle } from 'lucide-react';
import { getAQIColor } from '@/lib/design-system';

// Jakarta coordinates [latitude, longitude] - Monumen Nasional area
const JAKARTA_COORDINATES: [number, number] = [-6.2088, 106.8456];

interface MapProps {
  className?: string;
  onStationSelect?: (station: MonitoringStation | null) => void;
  selectedStation?: MonitoringStation | null;
  onLoadingChange?: (isLoading: boolean) => void;
};

// Function to get main pollutant
const getMainPollutant = (station: MonitoringStation): string => {
  if (!station.measurements || station.measurements.length === 0) {
    return 'Data tidak tersedia';
  }
  
  // Find the measurement with highest concentration relative to standard
  const mainMeasurement = station.measurements.reduce((max, current) => {
    // Prioritize PM2.5 and PM10 as they're most common AQI contributors
    if (current.parameter === 'pm25') return current;
    if (current.parameter === 'pm10' && max.parameter !== 'pm25') return current;
    return max;
  });
  
  return mainMeasurement.parameter.toUpperCase();
};

// Component to handle map click events
function MapClickHandler({ onStationSelect }: { onStationSelect?: (station: MonitoringStation | null) => void }) {
  useMapEvents({
    click: () => {
      onStationSelect?.(null);
    },
  });
  return null;
}

export default function Map({ className = '', onStationSelect, selectedStation, onLoadingChange }: MapProps) {
  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Fix for default markers in react-leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fix Leaflet marker icons for Next.js
      fixLeafletIcons();
    }
  }, []);

  // Notify parent component of loading state changes
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  // Fetch air quality data when component mounts
  useEffect(() => {
    const fetchAirQualityData = async () => {
      try {
        setLoading(true);
        setUsingMockData(false);
        
        // Fetch air quality data around Jakarta (25km radius, max 10 stations)
        const data = await getAirQualityData(
          JAKARTA_COORDINATES[0], // latitude
          JAKARTA_COORDINATES[1], // longitude
          25, // radius in km
          10  // max stations
        );
        
        setStations(data);
        
        // Check if we're using mock data (stations with IDs >= 1000 are mock)
        const hasMockData = data.some(station => station.id >= 1000);
        setUsingMockData(hasMockData);
        
      } catch (error) {
        console.error('Error fetching air quality data:', error);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQualityData();
  }, []);

  return (
    <div className={`w-full h-full ${className} relative`}>
      {/* Loading Spinner */}
      {loading && <MapLoadingSpinner />}
      
      {/* Demo Mode Badge */}
      {usingMockData && (
        <div className="absolute top-4 left-4 z-50 bg-yellow-400/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-soft">
          <p className="font-medium text-xs text-yellow-900">Demo Mode</p>
        </div>
      )}
      
      <MapContainer
        center={JAKARTA_COORDINATES}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0 rounded-2xl"
        zoomControl={false}
      >
        <MapClickHandler onStationSelect={onStationSelect} />
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Original Jakarta marker */}
        <Marker position={JAKARTA_COORDINATES}>
          <Popup>
            <div className="text-center p-2 min-w-[200px]">
              <h3 className="font-bold text-lg text-slate-800 mb-1">Jakarta</h3>
              <p className="text-sm text-slate-600 mb-2">DKI Jakarta, Indonesia</p>
              {loading && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-600">Memuat data kualitas udara...</p>
                </div>
              )}
              {!loading && (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Ditemukan {stations.length} stasiun monitoring
                    </p>
                  </div>
                  {usingMockData && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <p className="text-xs text-yellow-700 font-medium">
                        ⚠️ Menggunakan data simulasi
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Air quality station markers */}
        <AnimatePresence>
          {!loading && stations.map((station) => (
            <motion.div
              key={station.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              <CircleMarker
                center={[station.coordinates.latitude, station.coordinates.longitude]}
                radius={selectedStation?.id === station.id ? 12 : 8}
                pathOptions={{
                  fillColor: getAQIColor(station.aqi),
                  color: selectedStation?.id === station.id ? '#333' : '#fff',
                  weight: selectedStation?.id === station.id ? 3 : 2,
                  opacity: 1,
                  fillOpacity: selectedStation?.id === station.id ? 1 : 0.8,
                }}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent?.stopPropagation();
                    if (selectedStation?.id === station.id) {
                      onStationSelect?.(null);
                    } else {
                      onStationSelect?.(station);
                    }
                  },
                  mouseover: (e) => {
                    const target = e.target;
                    target.setStyle({
                      weight: 4,
                      opacity: 1
                    });
                  },
                  mouseout: (e) => {
                    const target = e.target;
                    const isSelected = selectedStation?.id === station.id;
                    target.setStyle({
                      weight: isSelected ? 3 : 2,
                      opacity: 1
                    });
                  }
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <div className="text-center mb-3">
                      <h3 className="font-bold text-base text-slate-800 mb-1">{station.name}</h3>
                      <p className="text-xs text-slate-600">{station.city}, {station.country}</p>
                    </div>
                    {station.aqi ? (
                      <div className="mb-3">
                        <div className="flex items-center justify-center mb-2">
                          <div 
                            className="inline-flex items-center px-3 py-2 rounded-lg text-white font-bold shadow-sm"
                            style={{ backgroundColor: getAQIColor(station.aqi) }}
                          >
                            <span className="text-lg">AQI: {station.aqi}</span>
                          </div>
                        </div>
                        {station.aqiCategory && (
                          <p className="text-center text-sm font-semibold text-slate-700">
                            {station.aqiCategory.label}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-3 bg-slate-100 border border-slate-300 rounded-lg p-2">
                        <p className="text-xs text-slate-500 text-center">Data AQI tidak tersedia</p>
                      </div>
                    )}
                    {station.measurements && station.measurements.length > 0 && (
                      <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <p className="text-xs font-semibold text-blue-800 mb-2">Pengukuran Terbaru:</p>
                        <div className="space-y-1">
                          {station.measurements.slice(0, 3).map((measurement, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-xs font-medium text-blue-700">{measurement.parameter}:</span>
                              <span className="text-xs text-blue-600">{measurement.value} {measurement.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-center pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        📍 Jarak: {station.distance?.toFixed(1)} km dari pusat
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </motion.div>
          ))}
        </AnimatePresence>
      </MapContainer>
    </div>
  );
}