// Selection Status component to show current selection state
'use client';

import { MonitoringStation } from '@/lib/types';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface SelectionStatusProps {
  selectedStation: MonitoringStation | null;
  onClearSelection: () => void;
}

export default function SelectionStatus({ selectedStation, onClearSelection }: SelectionStatusProps) {
  if (!selectedStation) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-4 h-4 text-muted" />
        <p className="text-sm text-muted">
          Klik marker pada peta untuk melihat detail kualitas udara
        </p>
      </div>
    );
  }

  const getAQIColor = (aqi: number | undefined): string => {
    if (!aqi) return '#6C757D';
    if (aqi <= 50) return '#7be495';
    if (aqi <= 100) return '#ffe066';
    if (aqi <= 150) return '#ffd670';
    if (aqi <= 200) return '#ff8787';
    if (aqi <= 300) return '#b197fc';
    return '#ff6f91';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getAQIColor(selectedStation.aqi) }}
          ></div>
          <div>
            <p className="font-semibold text-foreground">
              {selectedStation.name}
            </p>
            <p className="text-sm text-muted">
              {selectedStation.city}, {selectedStation.country}
              {selectedStation.aqi && (
                <span className="ml-2 font-medium">
                  • AQI: {selectedStation.aqi}
                </span>
              )}
            </p>
          </div>
        </div>
        <motion.button
          onClick={onClearSelection}
          className="text-muted hover:text-foreground transition-colors"
          title="Clear selection (ESC)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}