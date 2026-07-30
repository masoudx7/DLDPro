import React, { useState } from 'react';
import { Clock, Gauge, ShieldCheck, Check, Sliders, Zap, Calendar, Play, Pause } from 'lucide-react';
import { AppSettings } from '../types';

interface ScheduleSpeedTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const ScheduleSpeedTab: React.FC<ScheduleSpeedTabProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [speedLimit, setSpeedLimit] = useState<number>(settings.speedLimit || 0);
  const [maxSimultaneous, setMaxSimultaneous] = useState<number>(settings.maxSimultaneous || 3);
  const [scheduleEnabled, setScheduleEnabled] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<string>('02:00');
  const [endTime, setEndTime] = useState<string>('07:00');
  const [autoShutdown, setAutoShutdown] = useState<boolean>(settings.autoShutdown || false);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      speedLimit,
      maxSimultaneous,
      autoShutdown
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const speedOptions = [
    { label: 'نامحدود (حداکثر سرعت شبکه)', value: 0 },
    { label: '۱ مگابایت بر ثانیه (1 MB/s)', value: 1024 * 1024 },
    { label: '۲ مگابایت بر ثانیه (2 MB/s)', value: 2 * 1024 * 1024 },
    { label: '۵ مگابایت بر ثانیه (5 MB/s)', value: 5 * 1024 * 1024 },
    { label: '۱۰ مگابایت بر ثانیه (10 MB/s)', value: 10 * 1024 * 1024 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">تنظیمات سرعت و زمان‌بندی شبانه</h2>
            <p className="text-xs text-neutral-400 mt-0.5">مدیریت پهنای باند و ساعات دانلود خودکار بدون مصرف حجم روزانه</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-xs font-bold animate-in fade-in duration-200">
            <Check className="w-4 h-4" />
            <span>تنظیمات ذخیره شد</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Nightly Scheduler */}
        <div className="bg-[#0D0D0D] border border-neutral-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-neutral-200 text-sm sm:text-base">دانلود خودکار در ساعت خاص (زمان‌بندی شبانه)</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={scheduleEnabled} 
                onChange={(e) => setScheduleEnabled(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            با فعال‌سازی این بخش، تمام دانلودهای موجود در صف «زمان‌بندی شده» رأس ساعت تعیین‌شده به‌صورت خودکار شروع شده و در ساعت پایان متوقف می‌شوند.
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-200 ${scheduleEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Start Time */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-green-400" />
                <span>ساعت شروع دانلود:</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:border-purple-500 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500 block">مثال: 02:00 بامداد (اینترنت رایگان شبانه)</span>
            </div>

            {/* End Time */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>ساعت پایان/توقف:</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:border-purple-500 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500 block">مثال: 07:00 صبح</span>
            </div>
          </div>

          {/* Auto Shutdown after completed */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs text-neutral-300">
            <span>خاموش کردن سیستم یا توقف موتور پس از اتمام صف:</span>
            <input
              type="checkbox"
              checked={autoShutdown}
              onChange={(e) => setAutoShutdown(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Section 2: Speed Limiter */}
        <div className="bg-[#0D0D0D] border border-neutral-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Gauge className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-neutral-200 text-sm sm:text-base">محدودکننده سرعت و دانلود همزمان</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">سقف سرعت دانلود کل:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {speedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSpeedLimit(opt.value)}
                    className={`p-3 rounded-xl border text-xs text-right font-medium transition-all flex items-center justify-between ${
                      speedLimit === opt.value
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {speedLimit === opt.value && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">حداکثر تعداد دانلود همزمان:</label>
                <select
                  value={maxSimultaneous}
                  onChange={(e) => setMaxSimultaneous(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs sm:text-sm rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                >
                  <option value={1}>۱ فایل همزمان (پیش‌نهادی برای اینترنت کُند)</option>
                  <option value={2}>۲ فایل همزمان</option>
                  <option value={3}>۳ فایل همزمان (استاندارد)</option>
                  <option value={5}>۵ فایل همزمان</option>
                  <option value={10}>۱۰ فایل همزمان (حداکثر)</option>
                </select>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-neutral-400">
                <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
                <span>الگوریتم مدیریت هوشمند ترافیک فعال است و مانع افت سرعت وب‌گردی هنگام دانلود می‌شود.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-purple-950/50 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>ذخیره تنظیمات زمان‌بندی و سرعت</span>
          </button>
        </div>
      </form>
    </div>
  );
};
