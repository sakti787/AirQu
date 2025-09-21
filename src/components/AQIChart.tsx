'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonitoringStation } from '@/lib/types';
import { getAQIColor, getAQICategory } from '@/lib/design-system';

interface AQIChartProps {
  station: MonitoringStation;
}

// Generate mock historical data for the last 24 hours
const generateHistoricalData = (currentAQI: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Every hour
    
    // Generate realistic AQI variations (±20 from current value)
    const variation = (Math.random() - 0.5) * 40; // -20 to +20
    let aqi = Math.max(0, Math.round(currentAQI + variation));
    
    // Add some trend patterns
    if (i > 12) {
      // Morning hours - slightly higher due to traffic
      aqi = Math.round(aqi * 1.1);
    } else if (i < 6) {
      // Evening hours - higher pollution
      aqi = Math.round(aqi * 1.15);
    }
    
    // Ensure reasonable bounds
    aqi = Math.min(500, Math.max(0, aqi));
    
    data.push({
      time: time.getHours(),
      timeLabel: time.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      aqi: aqi,
      fullTime: time
    });
  }
  
  return data;
};

// Custom tooltip component
interface TooltipPayload {
  payload: {
    timeLabel: string;
    aqi: number;
    category: string;
  };
  value: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const aqi = payload[0].value;
    
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/30 dark:border-slate-600/30 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {data.timeLabel}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getAQIColor(aqi) }}
          ></div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            AQI: <span className="font-semibold">{aqi}</span>
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {getAQICategory(aqi)}
        </p>
      </div>
    );
  }
  return null;
};

export default function AQIChart({ station }: AQIChartProps) {
  if (!station.aqi) {
    return (
      <div className="bg-slate-50/50 dark:bg-slate-700/50 backdrop-blur-lg rounded-lg p-6 text-center border border-white/20 dark:border-slate-600/30">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Data historis tidak tersedia
        </p>
      </div>
    );
  }

  const historicalData = generateHistoricalData(station.aqi);
  const currentAQI = station.aqi;
  const chartColor = getAQIColor(currentAQI);

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/20 dark:border-slate-600/30">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Tren AQI 24 Jam Terakhir
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Data per jam untuk {station.name}
        </p>
      </div>
      
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={historicalData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 'dataMax + 50']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#aqiGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartColor }}
              ></div>
              <span>AQI Level</span>
            </div>
          </div>
          <div className="text-right">
            <p>Rata-rata: {Math.round(historicalData.reduce((sum, item) => sum + item.aqi, 0) / historicalData.length)}</p>
            <p>Tertinggi: {Math.max(...historicalData.map(item => item.aqi))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}