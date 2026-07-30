import React, { useState } from 'react';
import { 
  Download, 
  Clipboard, 
  Sparkles, 
  Sliders, 
  Check,
  ArrowLeft
} from 'lucide-react';
import { DownloadCategory, DownloadItem } from '../types';

interface QuickDownloadBoxProps {
  onAddDownload: (item: Omit<DownloadItem, 'id' | 'downloadedBytes' | 'speed' | 'progress' | 'status' | 'eta' | 'createdAt'>) => void;
  onOpenAdvancedModal: () => void;
  defaultPath: string;
}

export const QuickDownloadBox: React.FC<QuickDownloadBoxProps> = ({
  onAddDownload,
  onOpenAdvancedModal,
  defaultPath
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pasted, setPasted] = useState(false);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          setPasted(true);
          setTimeout(() => setPasted(false), 2000);
        }
      }
    } catch (err) {
      console.log('Clipboard access not allowed or unavailable');
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);

    let category: DownloadCategory = 'video';
    let platform: 'youtube' | 'instagram' | 'telegram' | 'direct' = 'direct';
    let title = 'فایل دانلودی جدید';
    let quality = '1080p (MP4)';
    let fileSize = 120 * 1024 * 1024;
    let thumbnail = '';

    try {
      const res = await fetch('/api/parse-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success && data.data) {
        title = data.data.title || title;
        fileSize = data.data.fileSize || fileSize;
        category = data.data.category || category;
        platform = data.data.platform || platform;
        thumbnail = data.data.thumbnail || thumbnail;
        if (data.data.qualityOptions && data.data.qualityOptions.length > 0) {
          quality = data.data.qualityOptions[0];
        }
      }
    } catch (err) {
      // Fallback detection
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        platform = 'youtube';
        title = 'ویدیو یوتیوب با کیفیت HD';
        category = 'video';
      } else if (url.includes('instagram.com')) {
        platform = 'instagram';
        title = 'پست/ریلز اینستاگرام';
        category = 'video';
      } else if (url.includes('t.me')) {
        platform = 'telegram';
        title = 'فایل تلگرامی';
        category = 'archive';
      }
    } finally {
      setLoading(false);
    }

    onAddDownload({
      title,
      url,
      fileSize,
      category,
      thumbnail,
      quality,
      savePath: defaultPath,
      platform
    });

    setUrl('');
  };

  return (
    <div className="relative mb-8" dir="rtl">
      {/* Outer Glow Card Wrapper */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[2px] rounded-3xl shadow-2xl shadow-blue-950/40">
        <div className="bg-[#0F0F12] rounded-[22px] p-4 sm:p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle Background Glow Spheres */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
                  شروع سریع دانلود
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  لینک مستقیم، یوتیوب، اینستاگرام یا تلگرام را اینجا وارد کنید
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAdvancedModal}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs font-medium transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>تنظیمات پیشرفته و زمان‌بندی</span>
            </button>
          </div>

          {/* Large Main Input Form */}
          <form onSubmit={handleQuickSubmit} className="relative z-10 space-y-4">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
              {/* Input wrapper with paste button */}
              <div className="relative flex-1 min-w-0">
                <input
                  type="url"
                  required
                  placeholder="https://example.com/file.mp4 یا لینک یوتیوب/اینستاگرام..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-neutral-950/90 border-2 border-neutral-800 focus:border-blue-500 text-white placeholder-neutral-500 text-xs sm:text-sm md:text-base rounded-2xl py-3.5 sm:py-4 pr-4 pl-24 transition-all duration-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-mono"
                  dir="ltr"
                />

                {/* Paste Button inside input */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs transition-colors border border-neutral-700"
                  title="چسباندن از حافظه"
                >
                  {pasted ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Clipboard className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{pasted ? 'چسبانده شد' : 'جای‌گذاری'}</span>
                </button>
              </div>

              {/* Huge Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base px-6 py-3.5 sm:py-4 rounded-2xl transition-all shadow-xl shadow-blue-950/60 flex items-center justify-center gap-2.5 shrink-0 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>شروع دانلود</span>
                    <ArrowLeft className="w-4 h-4 text-blue-200 hidden sm:inline" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
