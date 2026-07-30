import React from 'react';
import { 
  Download, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle2, 
  Clock, 
  Film, 
  Settings, 
  Menu,
  X,
  Crown
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
  youtubeCount: number;
  isPro: boolean;
  onOpenPurchase: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  counts, 
  youtubeCount, 
  isPro, 
  onOpenPurchase,
  isMobileOpen = false,
  setIsMobileOpen
}) => {
  const menuItems = [
    { id: 'all', label: 'همه دانلودها', icon: Download, count: counts.all, color: 'text-blue-400', dotColor: 'bg-blue-400' },
    { id: 'active', label: 'در حال دانلود', icon: PlayCircle, count: counts.active, color: 'text-orange-400', dotColor: 'bg-orange-400' },
    { id: 'paused', label: 'متوقف شده', icon: PauseCircle, count: counts.paused, color: 'text-amber-400', dotColor: 'bg-amber-400' },
    { id: 'completed', label: 'تکمیل شده', icon: CheckCircle2, count: counts.completed, color: 'text-green-400', dotColor: 'bg-green-400' },
    { id: 'scheduled', label: 'زمان‌بندی شده', icon: Clock, count: counts.scheduled, color: 'text-purple-400', dotColor: 'bg-purple-400' },
    { id: 'ffmpeg', label: 'استودیوی FFmpeg', icon: Film, count: null, color: 'text-rose-400', dotColor: 'bg-rose-400' },
    { id: 'settings', label: 'تنظیمات و مسیرها', icon: Settings, count: null, color: 'text-neutral-400', dotColor: 'bg-neutral-500' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* App Branding */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-950/40 text-white font-black text-sm tracking-tighter">
            un
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-neutral-100 text-base tracking-tight">DLD-Pro</h1>
              <span className="text-[10px] bg-neutral-800 text-blue-400 font-mono px-1.5 py-0.5 rounded border border-neutral-700">undo</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] text-neutral-500">موتور فعال پیشرفته</span>
            </div>
          </div>
        </div>
        {setIsMobileOpen && (
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2">کتابخانه</div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-neutral-800 text-blue-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${item.dotColor}`}></div>
              <span className="flex-1 text-right">{item.label}</span>
              {item.count !== null && (
                <span className="text-xs opacity-60 font-mono font-bold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* YouTube Quota & Pro Upgrade Card */}
      <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400 font-medium">سهمیه یوتیوب (ماهانه)</span>
          <span className="font-mono font-bold text-neutral-200">
            {isPro ? 'نامحدود (PRO)' : `${youtubeCount}/5`}
          </span>
        </div>
        {!isPro && (
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${youtubeCount >= 5 ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(100, (youtubeCount / 5) * 100)}%` }}
            ></div>
          </div>
        )}
        {!isPro ? (
          <button
            onClick={() => {
              onOpenPurchase();
              if (setIsMobileOpen) setIsMobileOpen(false);
            }}
            className="w-full mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold py-2 px-3 rounded-xl transition-all shadow-md shadow-blue-950/40 flex items-center justify-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>خرید اشتراک (بازار / مایکت)</span>
          </button>
        ) : (
          <div className="text-[11px] text-green-400 font-bold text-center bg-green-500/10 py-1.5 rounded-lg border border-green-500/20">
            اشتراک طلایی فعال است ✨
          </div>
        )}
      </div>

      {/* Scheduler Info Footer */}
      <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-neutral-200">زمان‌بندی فعال</span>
        </div>
        <p className="text-[11px] text-neutral-500">شروع خودکار: 02:00 بامداد</p>
        <p className="text-[11px] text-neutral-500">توقف خودکار: 07:00 صبح</p>
        <div className="pt-2 mt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span>توسعه‌دهنده:</span>
          <span className="font-bold text-blue-400 font-mono">undo group</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0D0D0D] border-l border-neutral-800 p-6 flex-col gap-6 h-screen select-none shrink-0" dir="rtl">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" dir="rtl">
          <div 
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#0D0D0D] border-l border-neutral-800 p-5 flex flex-col gap-5 h-full z-10 select-none overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-neutral-800 flex items-center justify-around py-2 px-1 select-none" dir="rtl">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === 'all' ? 'text-blue-400 bg-blue-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <Download className="w-5 h-5" />
          <span>همه</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === 'active' ? 'text-orange-400 bg-orange-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <PlayCircle className="w-5 h-5" />
          <span>دانلود ({counts.active})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === 'completed' ? 'text-green-400 bg-green-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>تکمیل</span>
        </button>

        <button
          onClick={() => setActiveTab('scheduled')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === 'scheduled' ? 'text-purple-400 bg-purple-500/10 font-bold' : 'text-neutral-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>صف</span>
        </button>

        <button
          onClick={() => setIsMobileOpen && setIsMobileOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium text-neutral-400 hover:text-white transition-all"
        >
          <Menu className="w-5 h-5" />
          <span>منو</span>
        </button>
      </nav>
    </>
  );
};

