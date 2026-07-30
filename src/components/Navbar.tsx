import React from 'react';
import { 
  Plus, 
  Search, 
  Zap, 
  FolderOpen, 
  Play, 
  Pause,
  Menu,
  Tv
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  globalSpeed: number; // in bytes per second
  onPauseAll: () => void;
  onResumeAll: () => void;
  selectedSavePath: string;
  onOpenMobileMenu?: () => void;
  onOpenTapsellModal?: () => void;
  rewardPoints?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  globalSpeed,
  onPauseAll,
  onResumeAll,
  selectedSavePath,
  onOpenMobileMenu,
  onOpenTapsellModal,
  rewardPoints = 0
}) => {
  const formatSpeed = (bytesPerSec: number) => {
    if (bytesPerSec === 0) return '۰ کیلوبایت/ثانیه';
    if (bytesPerSec > 1024 * 1024) {
      return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} مگابایت/ثانیه`;
    }
    return `${(bytesPerSec / 1024).toFixed(0)} کیلوبایت/ثانیه`;
  };

  return (
    <header className="min-h-[64px] md:h-20 bg-[#0F0F0F] border-b border-neutral-800 px-3 sm:px-6 md:px-8 py-2 flex items-center justify-between gap-2 z-20 sticky top-0" dir="rtl">
      {/* Right Side: Mobile Menu Button & Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-2xl min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 hover:text-white shrink-0 transition-colors"
            title="منوی اصلی"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="جستجوی لینک یا فایل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-500 text-xs sm:text-sm rounded-full py-2 pr-9 pl-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Live Global Speed Badge */}
        <div className="hidden lg:flex items-center gap-3 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-medium">سرعت کل شبکه</div>
            <div className="text-xs font-bold text-blue-300 font-mono" dir="ltr">{formatSpeed(globalSpeed)}</div>
          </div>
        </div>
      </div>

      {/* Left Side: Actions & Path */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Tapsell Rewarded Video Button */}
        {onOpenTapsellModal && (
          <button
            onClick={onOpenTapsellModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all shadow-md"
            title="تبلیغ ویدیویی تپسل و کسب پاداش"
          >
            <Tv className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden md:inline">تبلیغ و پاداش تپسل</span>
            <span className="bg-amber-500 text-neutral-950 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold font-mono">{rewardPoints}</span>
          </button>
        )}

        {/* Path Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono max-w-[180px] truncate" title={selectedSavePath}>{selectedSavePath}</span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={onResumeAll}
            title="ادامه همه"
            className="p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg text-green-400 transition-colors"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <div className="w-[1px] h-4 bg-neutral-800 my-auto"></div>
          <button
            onClick={onPauseAll}
            title="توقف همه"
            className="p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg text-amber-400 transition-colors"
          >
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Add Download Button */}
        <button
          onClick={onOpenAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-lg shadow-blue-950/50 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">افزودن دانلود</span>
          <span className="sm:hidden">افزودن</span>
        </button>
      </div>
    </header>
  );
};


