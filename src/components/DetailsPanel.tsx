
'use client';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

import { MonitoringStation } from '@/lib/types';
import { DetailsPanelSkeleton } from './LoadingComponents';
import { LazyAQIChartWrapper } from './LazyComponents';
import { getAQIColor, getAQIColorScheme, getAQICategory, COMPONENT_STYLES } from '@/lib/design-system';

interface DetailsPanelProps {
  selectedStation: MonitoringStation | null;
  isLoading?: boolean;
}

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

// Function to get health recommendations based on AQI
const getHealthRecommendations = (aqi: number | undefined): string[] => {
  if (!aqi) {
    return ['Data kualitas udara tidak tersedia'];
  }
  
  if (aqi <= 50) {
    return [
      'Kualitas udara sangat baik untuk aktivitas outdoor',
      'Aman untuk semua kelompok, termasuk anak-anak dan lansia',
      'Ideal untuk olahraga dan aktivitas fisik di luar ruangan',
      'Ventilasi alami dapat dibuka sepanjang hari'
    ];
  }
  
  if (aqi <= 100) {
    return [
      'Kualitas udara dapat diterima untuk sebagian besar orang',
      'Kelompok sensitif sebaiknya mengurangi aktivitas outdoor yang berat',
      'Aman untuk aktivitas ringan di luar ruangan',
      'Gunakan masker jika memiliki sensitivitas terhadap polusi'
    ];
  }
  
  if (aqi <= 150) {
    return [
      'Kelompok sensitif sebaiknya menghindari aktivitas outdoor',
      'Orang sehat dapat merasakan efek ringan',
      'Gunakan masker N95 saat beraktivitas di luar ruangan',
      'Batasi aktivitas fisik yang intens di luar ruangan',
      'Tutup jendela dan gunakan air purifier dalam ruangan'
    ];
  }
  
  if (aqi <= 200) {
    return [
      'Semua orang sebaiknya menghindari aktivitas outdoor yang berat',
      'Kelompok sensitif sebaiknya tetap di dalam ruangan',
      'Gunakan masker N95 jika harus keluar rumah',
      'Gunakan air purifier dan tutup semua ventilasi',
      'Konsultasi dengan dokter jika mengalami gejala pernapasan'
    ];
  }
  
  if (aqi <= 300) {
    return [
      'Hindari semua aktivitas outdoor',
      'Semua orang sebaiknya tetap di dalam ruangan',
      'Gunakan masker N95 atau P100 jika harus keluar',
      'Gunakan air purifier berkualitas tinggi',
      'Segera konsultasi medis jika mengalami sesak napas'
    ];
  }
  
  return [
    'PERINGATAN: Kondisi berbahaya untuk semua orang',
    'Tetap di dalam ruangan dengan ventilasi tertutup',
    'Gunakan masker P100 jika terpaksa keluar',
    'Segera cari bantuan medis jika merasa tidak nyaman',
    'Pertimbangkan untuk pindah sementara ke area yang lebih aman'
  ];
};

// Animated Number Component
function AnimatedNumber({ value }: { value: number | undefined }) {
  const spring = useSpring(0, { damping: 15, stiffness: 100 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value || 0);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}



export default function DetailsPanel({ selectedStation, isLoading = false }: DetailsPanelProps) {
  // Show loading skeleton when loading or if we're fetching station data
  if (isLoading || (!selectedStation && isLoading)) {
    return <DetailsPanelSkeleton />;
  }

  if (!selectedStation) {
    return (
      <div className="xl:col-span-1">
        {/* Single Clean Card */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-6">
            Detail Stasiun
          </h3>
          
          {/* Centered instruction */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-muted">
              Klik sebuah titik di peta untuk melihat detail kualitas udara
            </p>
          </div>

          {/* Legend Section */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground mb-4">
              Keterangan Warna
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-aqi-good"></span>
                  <span className="text-foreground">Baik</span>
                </div>
                <span className="text-sm text-muted">0-50</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-aqi-moderate"></span>
                  <span className="text-foreground">Sedang</span>
                </div>
                <span className="text-sm text-muted">51-100</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-aqi-sensitive"></span>
                  <span className="text-foreground">Tidak Sehat (Sensitif)</span>
                </div>
                <span className="text-sm text-muted">101-150</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-aqi-unhealthy"></span>
                  <span className="text-foreground">Tidak Sehat</span>
                </div>
                <span className="text-sm text-muted">151-200</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-aqi-very-unhealthy"></span>
                  <span className="text-foreground">Sangat Tidak Sehat</span>
                </div>
                <span className="text-sm text-muted">201-300</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-aqi-hazardous"></span>
                  <span className="text-foreground">Berbahaya</span>
                </div>
                <span className="text-sm text-muted">300+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainPollutant = getMainPollutant(selectedStation);
  const healthRecommendations = getHealthRecommendations(selectedStation.aqi);
  const aqiColor = getAQIColor(selectedStation.aqi);

  // Animation variants
  const parentVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
    exit: {},
  };
  // Hanya gunakan duration
  const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.32 } },
    exit: { opacity: 0, y: 16, transition: { duration: 0.18 } },
  };

  return (
    <motion.div
      className="xl:col-span-1"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedStation.id || selectedStation.name}
          variants={parentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Single Clean Card for Selected Station */}
          <motion.div 
            className="bg-white rounded-2xl shadow-soft p-6"
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Title */}
            <h3 className="text-lg font-bold text-foreground mb-6">
              Detail Stasiun
            </h3>
            
            {/* Station Name & Location */}
            <div className="text-center mb-6">
              <motion.h2
                className="text-xl font-bold text-foreground mb-2"
                variants={fadeInUp}
              >
                {selectedStation.name}
              </motion.h2>
              <motion.p
                className="text-sm text-muted"
                variants={fadeInUp}
              >
                {selectedStation.city}, {selectedStation.country}
              </motion.p>
            </div>

            {/* AQI Display */}
            <motion.div className="text-center mb-6" variants={fadeInUp}>
              <div className="inline-flex flex-col items-center">
                <motion.div
                  key={selectedStation.aqi}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-soft"
                  style={{ backgroundColor: aqiColor }}
                >
                  <span
                    className={`text-3xl font-bold ${getAQIColorScheme(selectedStation.aqi).text}`}
                  >
                    <AnimatedNumber value={selectedStation.aqi} />
                  </span>
                </motion.div>
                <motion.div
                  key={selectedStation.aqiCategory?.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-center"
                >
                  <p className="text-sm font-medium text-foreground">
                    {selectedStation.aqiCategory?.label || 'Data tidak tersedia'}
                  </p>
                  <p className="text-xs text-muted">
                    Polutan utama: {mainPollutant}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Measurements */}
            {selectedStation.measurements && selectedStation.measurements.length > 0 && (
              <motion.div className="mb-6" variants={fadeInUp}>
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Pengukuran Terbaru
                </h4>
                <div className="space-y-3">
                  {selectedStation.measurements.slice(0, 4).map((measurement, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-foreground">
                        {measurement.parameter.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted">
                        {measurement.value} {measurement.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Health Recommendations */}
            <motion.div className="mb-6" variants={fadeInUp}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Rekomendasi Kesehatan
              </h4>
              <ul className="space-y-3">
                {healthRecommendations.slice(0, 3).map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2"></div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {recommendation}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Distance */}
            <motion.div className="text-center pt-4 border-t border-slate-100" variants={fadeInUp}>
              <p className="text-xs text-muted">
                📍 Jarak: {selectedStation.distance?.toFixed(1)} km dari pusat
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}