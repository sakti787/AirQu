'use client';

import { useState, useEffect, useCallback } from 'react';
import { MonitoringStation } from '@/lib/types';
import { LazyMapWrapper, LazyDetailsPanelWrapper } from '@/components/LazyComponents';
import SelectionStatus from '@/components/SelectionStatus';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { useDesignSystemShowcase } from '@/components/DesignSystemShowcase';
import { motion } from 'framer-motion';

export default function Home() {
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null);
  const [isDetailsPanelLoading, setIsDetailsPanelLoading] = useState(false);

  // Initialize design system showcase
  useDesignSystemShowcase();

  // Handler function to manage station selection with additional logic
  const handleStationSelect = useCallback((station: MonitoringStation | null) => {
    // Show loading state when selecting a new station
    if (station !== selectedStation) {
      setIsDetailsPanelLoading(true);
      
      // Simulate some processing time for station data
      setTimeout(() => {
        setSelectedStation(station);
        setIsDetailsPanelLoading(false);
      }, 300);
    } else {
      setSelectedStation(station);
    }
    
    // Optional: Add console logging for debugging
    if (station) {
      console.log('Selected station:', station.name, 'AQI:', station.aqi);
    } else {
      console.log('Station deselected');
    }
  }, [selectedStation]);

  // Keyboard support for clearing selection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedStation) {
        handleStationSelect(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedStation, handleStationSelect]);

  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section with staggered animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="font-[Poppins] font-bold text-4xl text-foreground mb-2"
          >
            Dashboard AirQu
          </motion.h1>
          
          <div className="flex items-center gap-3">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="text-lg text-muted"
            >
              Pantau kualitas udara secara real-time di Jakarta dan sekitarnya
            </motion.p>
            
            {/* Live Data Indicator */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            >
              <div className="w-2 h-2 bg-aqi-good rounded-full animate-pulse"></div>
              <span className="text-sm text-muted">Live Data</span>
            </motion.div>
          </div>


        </motion.div>

        {/* Selection Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        >
          <SelectionStatus 
            selectedStation={selectedStation} 
            onClearSelection={() => handleStationSelect(null)} 
          />
        </motion.div>

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Map Section - Takes 75% width on xl screens with staggered animation */}
          <motion.div
            className="xl:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          >
            {/* Map Container - No colored background boxes */}
            <div className="h-[600px] relative">
              <LazyMapWrapper 
                className="w-full h-full rounded-2xl shadow-soft overflow-hidden" 
                onStationSelect={handleStationSelect}
                selectedStation={selectedStation}
              />
            </div>
          </motion.div>

          {/* Details Panel - Takes 25% width on xl screens with delayed animation */}
          <motion.div
            className="xl:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
          >
            <LazyDetailsPanelWrapper 
              selectedStation={selectedStation} 
              isLoading={isDetailsPanelLoading}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}
