import React, { useState } from 'react';
import { 
  X, 
  Link, 
  FolderDown, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { DownloadCategory, DownloadItem, DownloadStatus } from '../types';

interface AddDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDownload: (item: Omit<DownloadItem, 'id' | 'downloadedBytes' | 'speed' | 'progress' | 'status' | 'eta' | 'createdAt'>) => void;
  defaultPath: string;
}

export const AddDownloadModal: React.FC<AddDownloadModalProps> = ({
  isOpen,
  onClose,
  onAddDownload,
  defaultPath
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<{
    title: string;
    fileSize: number;
    category: DownloadCategory;
    thumbnail: string;
    qualityOptions: string[];
    platform: 'youtube' | 'instagram' | 'telegram' | 'direct';
  } | null>(null);

  const [selectedQuality, setSelectedQuality] = useState('1080p (MP4)');
  const [selectedCategory, setSelectedCategory] = useState<DownloadCategory>('video');
  const [savePath, setSavePath] = useState(defaultPath);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('23:30');
  const [stopTime, setStopTime] = useState('06:00');

  if (!isOpen) return null;

  const handleParseLink = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/parse-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) {
        setParsedData(data.data);
        setSelectedCategory(data.data.category);
        if (data.data.qualityOptions && data.data.qualityOptions.length > 0) {
          setSelectedQuality(data.data.qualityOptions[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const title = parsedData?.title || 'فایل دانلودی جدید';
    const fileSize = parsedData?.fileSize || 105 * 1024 * 1024;
    const platform = parsedData?.platform || 'direct';
    const thumbnail = parsedData?.thumbnail || '';
    const status: DownloadStatus = isScheduled ? 'scheduled' : 'downloading';

    onAddDownload({
      title,
      url,
      fileSize,
      category: selectedCategory,
      thumbnail,
      quality: selectedQuality,
      savePath,
      scheduledTime: isScheduled ? scheduledTime : undefined,
      stopTime: isScheduled ? stopTime : undefined,
      platform
    });

    // Reset & Close
    setUrl('');
    setParsedData(null);
    setIsScheduled(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-100 text-base">افزودن لینک دانلود جدید</h2>
              <p className="text-xs text-neutral-400">پشتیبانی از یوتیوب، اینستاگرام، تلگرام و لینک‌های مستقیم</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">لینک دانلود (URL)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/watch?v=... یا لینک مستقیم"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-neutral-900 text-neutral-200 placeholder-neutral-600 text-sm rounded-xl pr-11 pl-4 py-3 border border-neutral-700 focus:outline-none focus:border-blue-500 transition-all font-mono text-left"
                  dir="ltr"
                />
              </div>
              <button
                type="button"
                disabled={loading || !url}
                onClick={handleParseLink}
                className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-blue-400 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'در حال تحلیل...' : 'تحلیل لینک (yt-dl)'}</span>
              </button>
            </div>
          </div>

          {/* Parsed Meta Card */}
          {parsedData && (
            <div className="bg-neutral-900 border border-blue-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                {parsedData.thumbnail && (
                  <img src={parsedData.thumbnail} alt="" className="w-16 h-12 object-cover rounded-lg border border-neutral-800" />
                )}
                <div>
                  <div className="text-xs text-blue-400 font-bold mb-1">اطلاعات استخراج شده از {parsedData.platform.toUpperCase()}</div>
                  <div className="text-sm font-semibold text-neutral-200 line-clamp-1">{parsedData.title}</div>
                </div>
              </div>

              {/* Quality Selector */}
              {parsedData.qualityOptions && parsedData.qualityOptions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                  <label className="text-[11px] text-neutral-400">کیفیت / فرمت دانلود:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {parsedData.qualityOptions.map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setSelectedQuality(q)}
                        className={`text-xs py-2 px-3 rounded-xl border text-right transition-all font-mono ${
                          selectedQuality === q
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category & Save Path */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">دسته‌بندی خودکار</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as DownloadCategory)}
                className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="video">ویدیو (Video)</option>
                <option value="audio">صوت (Audio / MP3)</option>
                <option value="software">نرم‌افزار (Software)</option>
                <option value="document">سند و مدرک (Document)</option>
                <option value="archive">فشرده (Archive / Zip)</option>
                <option value="other">سایر (Other)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">مسیر ذخیره فایل</label>
              <input
                type="text"
                value={savePath}
                onChange={(e) => setSavePath(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 focus:outline-none focus:border-blue-500 transition-all font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Scheduling Toggle & Time Range */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-neutral-200">زمان‌بندی هوشمند و قطع/وصل خودکار</span>
              </div>
              <input 
                type="checkbox" 
                checked={isScheduled} 
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>

            {isScheduled && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">ساعت شروع خودکار:</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-neutral-950 text-neutral-200 text-sm rounded-xl px-3 py-2 border border-neutral-800 font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">ساعت توقف خودکار:</label>
                  <input
                    type="time"
                    value={stopTime}
                    onChange={(e) => setStopTime(e.target.value)}
                    className="w-full bg-neutral-950 text-neutral-200 text-sm rounded-xl px-3 py-2 border border-neutral-800 font-mono text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-950/50 transition-all"
            >
              شروع دانلود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

