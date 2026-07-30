import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Zap, TrendingUp, Gauge, Activity } from 'lucide-react';

interface SpeedDataPoint {
  time: string;
  speedMB: number;
}

interface SpeedChartProps {
  currentSpeedBytes: number;
  activeCount: number;
}

export const SpeedChart: React.FC<SpeedChartProps> = ({ currentSpeedBytes, activeCount }) => {
  const [dataHistory, setDataHistory] = useState<SpeedDataPoint[]>([]);
  const [peakSpeedMB, setPeakSpeedMB] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const currentSpeedMB = parseFloat((currentSpeedBytes / (1024 * 1024)).toFixed(2));

    if (currentSpeedMB > peakSpeedMB) {
      setPeakSpeedMB(currentSpeedMB);
    }

    setDataHistory(prev => {
      const updated = [...prev, { time: timeStr, speedMB: currentSpeedMB }];
      if (updated.length > 20) {
        return updated.slice(updated.length - 20);
      }
      return updated;
    });
  }, [currentSpeedBytes]);

  const currentMB = (currentSpeedBytes / (1024 * 1024)).toFixed(2);
  const avgMB = dataHistory.length > 0 
    ? (dataHistory.reduce((acc, curr) => acc + curr.speedMB, 0) / dataHistory.length).toFixed(2)
    : '0.00';

  return (
    <div className="bg-[#0F0F12] border border-neutral-800/80 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3" dir="rtl">
      {/* Sleek Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white">پایش زنده سرعت دانلود</h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {activeCount} دانلود فعال
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span className="text-neutral-400">سرعت:</span>
            <span className="text-cyan-400 font-extrabold">{currentMB} MB/s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-neutral-400">اوج:</span>
            <span className="text-purple-400 font-bold">{peakSpeedMB.toFixed(2)} MB/s</span>
          </div>
        </div>
      </div>

      {/* Modern Minimal Area Chart */}
      <div className="h-36 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#404040" 
              tick={{ fill: '#737373', fontSize: 9 }} 
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
            />
            <YAxis 
              stroke="#404040" 
              tick={{ fill: '#737373', fontSize: 9 }} 
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
              unit="MB"
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 px-3 py-1.5 rounded-xl shadow-2xl text-[11px] font-sans" dir="rtl">
                      <div className="text-neutral-400 text-[9px]">{payload[0].payload.time}</div>
                      <div className="font-bold text-cyan-400 font-mono">
                        {payload[0].value} مگابایت/ثانیه
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
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#speedGlow)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
