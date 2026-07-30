import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Activity, Zap, TrendingUp, Gauge } from 'lucide-react';

interface SpeedDataPoint {
  time: string;
  speedMB: number; // Speed in MB/s
}

interface SpeedChartProps {
  currentSpeedBytes: number; // Current total speed in bytes/sec
  activeCount: number;
}

export const SpeedChart: React.FC<SpeedChartProps> = ({ currentSpeedBytes, activeCount }) => {
  const [dataHistory, setDataHistory] = useState<SpeedDataPoint[]>([]);
  const [peakSpeedMB, setPeakSpeedMB] = useState<number>(0);

  // Update history buffer every second
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const currentSpeedMB = parseFloat((currentSpeedBytes / (1024 * 1024)).toFixed(2));

    if (currentSpeedMB > peakSpeedMB) {
      setPeakSpeedMB(currentSpeedMB);
    }

    setDataHistory(prev => {
      const updated = [...prev, { time: timeStr, speedMB: currentSpeedMB }];
      // Keep last 25 data points
      if (updated.length > 25) {
        return updated.slice(updated.length - 25);
      }
      return updated;
    });
  }, [currentSpeedBytes]);

  const currentMB = (currentSpeedBytes / (1024 * 1024)).toFixed(2);
  const avgMB = dataHistory.length > 0 
    ? (dataHistory.reduce((acc, curr) => acc + curr.speedMB, 0) / dataHistory.length).toFixed(2)
    : '0.00';

  return (
    <div className="bg-[#0F0F12] border border-neutral-800/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4" dir="rtl">
      {/* Top Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-950/40 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>نمودار زنده سرعت دانلود</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">پایش لحظه‌ای پهنای باند و ترافیک مصرفی دانلودها</p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-right shrink-0">
            <span className="text-[10px] text-neutral-400 block">سرعت فعلی:</span>
            <span className="text-xs sm:text-sm font-extrabold font-mono text-cyan-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>{currentMB} MB/s</span>
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-right shrink-0">
            <span className="text-[10px] text-neutral-400 block">اوج سرعت:</span>
            <span className="text-xs sm:text-sm font-extrabold font-mono text-indigo-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{peakSpeedMB.toFixed(2)} MB/s</span>
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-right shrink-0">
            <span className="text-[10px] text-neutral-400 block">میانگین:</span>
            <span className="text-xs sm:text-sm font-extrabold font-mono text-purple-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              <span>{avgMB} MB/s</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-44 sm:h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#525252" 
              tick={{ fill: '#737373', fontSize: 10 }} 
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
            />
            <YAxis 
              stroke="#525252" 
              tick={{ fill: '#737373', fontSize: 10 }} 
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
              unit="MB"
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-neutral-900 border border-neutral-700 p-2.5 rounded-xl shadow-2xl text-xs text-right font-sans" dir="rtl">
                      <div className="text-neutral-400 text-[10px] mb-1">{payload[0].payload.time}</div>
                      <div className="font-bold text-cyan-400 font-mono">
                        سرعت: {payload[0].value} مگابایت/ثانیه
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="speedMB" 
              stroke="#06b6d4" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#speedGradient)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
