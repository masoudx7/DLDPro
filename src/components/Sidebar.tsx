import React from 'react';
import { 
  Download, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle2, 
  Clock, 
  Film, 
  Settings, 
  Gauge,
  X,
  SlidersHorizontal,
  ChevronLeft,
  Tv
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: {
    all: number;
    active: number;
    paused: number;
    completed: number;
    scheduled: number;
  };
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  counts, 
  isMobileOpen = false,
  setIsMobileOpen
}) => {
  const menuItems = [
    { id: 'all', label: 'همه دانلودها', icon: Download, count: counts.all, dotColor: 'bg-blue-400' },
    { id: 'active', label: 'در حال دانلود', icon: PlayCircle, count: counts.active, dotColor: 'bg-orange-400' },
    { id: 'paused', label: 'متوقف شده', icon: PauseCircle, count: counts.paused, dotColor: 'bg-amber-400' },
    { id: 'completed', label: 'تکمیل شده', icon: CheckCircle2, count: counts.completed, dotColor: 'bg-green-400' },
    { id: 'scheduled', label: 'صف دانلود', icon: Clock, count: counts.scheduled, dotColor: 'bg-purple-400' },
    { id: 'schedule_settings', label: 'زمان‌بندی و سرعت', icon: Gauge, count: null, dotColor: 'bg-indigo-400' },
    { id: 'tapsell_reward', label: 'تبلیغ و پاداش تپسل', icon: Tv, count: null, dotColor: 'bg-amber-400' },
    { id: 'ffmpeg', label: 'استودیوی FFmpeg', icon: Film, count: null, dotColor: 'bg-rose-400' },
    { id: 'settings', label: 'تنظیمات و مسیرها', icon: Settings, count: null, dotColor: 'bg-neutral-500' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const sidebarInner = (
    <div className="flex flex-col h-full justify-between" dir="rtl">
      {/* App Branding */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-950/40 text-white font-black text-base tracking-tighter shrink-0">
              un
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-neutral-100 text-base tracking-tight">DLD-Pro</h1>
                <span className="text-[10px] bg-neutral-800 text-blue-400 font-mono px-1.5 py-0.5 rounded border border-neutral-700">undo</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[11px] text-neutral-400">موتور دانلود آماده به کار</span>
              </div>
            </div>
          </div>
          {setIsMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="md:hidden p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-colors"
              aria-label="بستن منو"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2">منوی اصلی</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 text-xs sm:text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-950/20 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-900/80 hover:text-white'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.dotColor}`} />
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-neutral-400'}`} />
                <span className="flex-1 text-right truncate">{item.label}</span>
                {item.count !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {item.count}
                  </span>
                )}
                {isActive && <ChevronLeft className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheduler Active Info Box */}
      <div className="mt-6 pt-4 border-t border-neutral-800/80 space-y-3">
        <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-neutral-200">زمان‌بندی شبانه (02:00 الی 07:00)</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            دانلودهای زمان‌بندی شده به‌صورت خودکار در این ساعات شروع می‌شوند.
          </p>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500">
          <span>توسعه‌دهنده:</span>
          <span className="font-bold text-blue-400 font-mono">undo group</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0D0D0D] border-l border-neutral-800 p-5 flex-col h-screen select-none shrink-0" dir="rtl">
        {sidebarInner}
      </aside>

      {/* Mobile Sidebar Full Screen Drawer / Slide-Over */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden" dir="rtl">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          />

          {/* Slideout Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0D0D0D] border-l border-neutral-800 p-5 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between">
            {sidebarInner}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-neutral-800/90 flex items-center justify-around py-2 px-1 select-none shadow-2xl" dir="rtl">
        <button
          onClick={() => handleTabClick('all')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-medium transition-all ${
            activeTab === 'all' ? 'text-blue-400 bg-blue-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <Download className="w-5 h-5" />
          <span>دانلودها</span>
        </button>

        <button
          onClick={() => handleTabClick('schedule_settings')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-medium transition-all ${
            activeTab === 'schedule_settings' ? 'text-indigo-400 bg-indigo-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <Gauge className="w-5 h-5" />
          <span>زمان‌بندی</span>
        </button>

        <button
          onClick={() => handleTabClick('ffmpeg')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-medium transition-all ${
            activeTab === 'ffmpeg' ? 'text-rose-400 bg-rose-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <Film className="w-5 h-5" />
          <span>استودیو</span>
        </button>

        <button
          onClick={() => setIsMobileOpen && setIsMobileOpen(true)}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-medium transition-all ${
            isMobileOpen ? 'text-white bg-neutral-800 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>منوی کامل</span>
        </button>
      </nav>
    </>
  );
};
