import React from 'react';
import { DownloadItem } from '../types';
import { 
  Download,
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Film, 
  FileText, 
  Archive, 
  FileCode, 
  Clock, 
  Youtube, 
  Instagram, 
  Send, 
  Link2,
  HardDrive
} from 'lucide-react';

interface DownloadListProps {
  items: DownloadItem[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRestart: (id: string) => void;
  onDelete: (id: string) => void;
  onConvertToFFmpeg: (item: DownloadItem) => void;
}

export const DownloadList: React.FC<DownloadListProps> = ({
  items,
  onPause,
  onResume,
  onRestart,
  onDelete,
  onConvertToFFmpeg
}) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSec: number) => {
    if (bytesPerSec === 0) return '۰ کیلوبایت/ثانیه';
    if (bytesPerSec > 1024 * 1024) {
      return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} مگ/ثانیه`;
    }
    return `${(bytesPerSec / 1024).toFixed(0)} کیلوبایت/ثانیه`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'telegram': return <Send className="w-4 h-4 text-sky-400" />;
      default: return <Link2 className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video': return <Film className="w-5 h-5 text-rose-400" />;
      case 'audio': return <Film className="w-5 h-5 text-purple-400" />;
      case 'archive': return <Archive className="w-5 h-5 text-amber-400" />;
      case 'software': return <FileCode className="w-5 h-5 text-emerald-400" />;
      default: return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4" dir="rtl">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 mb-4 shadow-xl">
          <Download className="w-10 h-10 animate-pulse text-blue-500/50" />
        </div>
        <h3 className="text-lg font-bold text-neutral-300 mb-1">هیچ دانلودی در این بخش وجود ندارد</h3>
        <p className="text-sm text-neutral-500 max-w-sm">
          می‌توانید با زدن دکمه «افزودن دانلود» لینک مستقیم، یوتیوب، اینستاگرام یا تلگرام را وارد کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {items.map((item) => {
        const isCompleted = item.status === 'completed';
        const isDownloading = item.status === 'downloading';
        const isPaused = item.status === 'paused';
        const isScheduled = item.status === 'scheduled';

        return (
          <div 
            key={item.id}
            className="p-3.5 sm:p-5 bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 rounded-2xl transition-all duration-200 shadow-lg group"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
                {/* Thumbnail or Category Icon */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    getCategoryIcon(item.category)
                  )}
                  <div className="absolute top-1 left-1 bg-neutral-950/80 backdrop-blur-sm p-0.5 sm:p-1 rounded-md">
                    {getPlatformIcon(item.platform)}
                  </div>
                </div>

                {/* Details & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <h3 className="font-bold text-neutral-200 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-md" title={item.title}>
                      {item.title}
                    </h3>
                    <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isCompleted ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      isDownloading ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      isPaused ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      isScheduled ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {isCompleted ? 'تکمیل شده' : 
                       isDownloading ? 'در حال دانلود' : 
                       isPaused ? 'متوقف شده' : 
                       isScheduled ? 'زمان‌بندی شده' : 'خطا'}
                    </span>
                    {item.quality && (
                      <span className="text-[9px] sm:text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-mono shrink-0">
                        {item.quality}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] sm:text-xs text-neutral-400 truncate mb-2 sm:mb-3 font-mono" dir="ltr">
                    {item.url}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono">
                      <span className="text-neutral-300">
                        {formatBytes(item.downloadedBytes)} از {formatBytes(item.fileSize)}
                      </span>
                      <span className="text-blue-400 font-bold">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${
                          isCompleted ? 'bg-green-500' :
                          isDownloading ? 'bg-blue-500' :
                          isPaused ? 'bg-amber-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Speed & ETA stats */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2.5 text-[11px] sm:text-xs text-neutral-400 font-mono">
                    {isDownloading && (
                      <>
                        <div>سرعت: <span className="text-blue-400 font-bold">{formatSpeed(item.speed)}</span></div>
                        <div>زمان: <span className="text-neutral-300">{item.eta}</span></div>
                      </>
                    )}
                    {isScheduled && item.scheduledTime && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>شروع: {item.scheduledTime}</span>
                      </div>
                    )}
                    <div className="hidden sm:flex text-[11px] text-neutral-500 items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[160px]">{item.savePath}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60 shrink-0">
                {isDownloading ? (
                  <button
                    onClick={() => onPause(item.id)}
                    title="توقف"
                    className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 text-amber-400 transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onResume(item.id)}
                    title="شروع / ادامه"
                    className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onRestart(item.id)}
                  title="شروع مجدد"
                  className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {isCompleted && (item.category === 'video' || item.category === 'audio') && (
                  <button
                    onClick={() => onConvertToFFmpeg(item)}
                    title="تبدیل با FFmpeg"
                    className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 text-rose-400 transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onDelete(item.id)}
                  title="حذف"
                  className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

