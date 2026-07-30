import React, { useState } from 'react';
import { Settings, X, FolderOpen } from 'lucide-react';
import { AppSettings } from '../types';
import { pickSystemDirectory } from '../lib/fileSaver';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  isOpen
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

  if (!isOpen) return null;

  const handlePickDirectory = async () => {
    const chosen = await pickSystemDirectory();
    if (chosen) {
      setFormData({ ...formData, defaultPath: chosen });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-100 text-base">تنظیمات پیشرفته مدیریت دانلود</h2>
              <p className="text-xs text-neutral-400">مدیریت مسیرها، همزمانی و محدودیت سرعت</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">مسیر پیش‌فرض ذخیره فایل‌ها:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={formData.defaultPath}
                onChange={(e) => setFormData({ ...formData, defaultPath: e.target.value })}
                className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 font-mono text-left"
                dir="ltr"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePickDirectory}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-950/40"
                  title="انتخاب پوشه از حافظه دستگاه"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>انتخاب پوشه</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
                    setFormData({ 
                      ...formData, 
                      defaultPath: isAndroid ? '/storage/emulated/0/Download/UndoDownloadManager' : 'C:/Users/Public/Downloads/UndoDownloadManager' 
                    });
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-3 rounded-xl text-xs font-bold transition-all"
                >
                  پیش‌فرض
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">حداکثر دانلود همزمان:</label>
              <select
                value={formData.maxSimultaneous}
                onChange={(e) => setFormData({ ...formData, maxSimultaneous: Number(e.target.value) })}
                className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 font-mono"
              >
                <option value="1">۱ دانلود</option>
                <option value="3">۳ دانلود همزمان</option>
                <option value="5">۵ دانلود همزمان</option>
                <option value="10">۱۰ دانلود همزمان</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">محدودیت سرعت کلی:</label>
              <select
                value={formData.speedLimit}
                onChange={(e) => setFormData({ ...formData, speedLimit: Number(e.target.value) })}
                className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 font-mono"
              >
                <option value="0">نامحدود (حداکثر سرعت)</option>
                <option value="1024">۱ مگابایت بر ثانیه</option>
                <option value="5120">۵ مگابایت بر ثانیه</option>
                <option value="10240">۱۰ مگابایت بر ثانیه</option>
              </select>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">خاموش شدن سیستم پس از پایان صف</span>
              <input
                type="checkbox"
                checked={formData.autoShutdown}
                onChange={(e) => setFormData({ ...formData, autoShutdown: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <span className="text-xs font-bold text-neutral-300">پخش صدا پس از اتمام دانلود</span>
              <input
                type="checkbox"
                checked={formData.soundEnabled}
                onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-950/50"
            >
              ذخیره تنظیمات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

