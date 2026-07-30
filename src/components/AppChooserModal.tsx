import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Play, 
  Film, 
  Music, 
  FileText, 
  Archive, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Download, 
  Folder, 
  Settings,
  Sparkles
} from 'lucide-react';
import { DownloadItem } from '../types';

interface SystemApp {
  id: string;
  name: string;
  iconName: string;
  platform: 'windows' | 'android' | 'all';
  category: 'video' | 'audio' | 'general' | 'archive';
  description: string;
  recommended?: boolean;
}

interface AppChooserModalProps {
  item: DownloadItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppChooserModal: React.FC<AppChooserModalProps> = ({
  item,
  isOpen,
  onClose
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [alwaysUse, setAlwaysUse] = useState<boolean>(false);
  const [launchedMessage, setLaunchedMessage] = useState<string>('');

  if (!isOpen || !item) return null;

  // Auto-detect browser OS
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const currentPlatformName = isAndroid ? 'اندروید (Android)' : 'ویندوز (Windows Desktop)';

  // System installed applications database mock
  const systemApps: SystemApp[] = [
    // Video Apps
    { id: 'vlc', name: 'VLC Media Player', iconName: '🍊', platform: 'all', category: 'video', description: 'پخش‌کننده قدرتمند مالتی‌مدیا و زیرنویس فارسی', recommended: true },
    { id: 'potplayer', name: 'PotPlayer 64bit', iconName: '🟡', platform: 'windows', category: 'video', description: 'محبوب‌ترین پلیر تخصصی ویندوز با کدک‌های کامل', recommended: true },
    { id: 'mxplayer', name: 'MX Player Pro', iconName: '🔹', platform: 'android', category: 'video', description: 'بهترین نرم‌افزار پخش ویدیو اندروید با رمزگشایی HW+', recommended: true },
    { id: 'windows_media', name: 'Windows Media Player Legacy', iconName: '💻', platform: 'windows', category: 'video', description: 'پخش‌کننده پیش‌فرض سیستم‌عامل ویندوز' },
    { id: 'kmplayer', name: 'KMPlayer Ultra HD', iconName: '🟣', platform: 'all', category: 'video', description: 'پخش ویدیوهای 4K و 8K با کیفیت بالا' },

    // Audio Apps
    { id: 'samsung_music', name: 'Samsung / Android Music Player', iconName: '🎵', platform: 'android', category: 'audio', description: 'موزیک پلیر استاندارد دستگاه اندرویدی', recommended: true },
    { id: 'poweramp', name: 'Poweramp Music Player', iconName: '⚡', platform: 'android', category: 'audio', description: 'موزیک پلیر حرفه‌ای با اکولایزر پیشرفته' },
    { id: 'winamp', name: 'Winamp Classic', iconName: '⚡', platform: 'windows', category: 'audio', description: 'پخش‌کننده نوستالژیک فایل‌های صوتی' },

    // General & Archive Apps
    { id: 'winrar', name: 'WinRAR / 7-Zip File Manager', iconName: '📦', platform: 'windows', category: 'archive', description: 'مدیریت و استخراج فایل‌های فشرده ZIP/RAR', recommended: true },
    { id: 'zarchiver', name: 'ZArchiver Pro', iconName: '🟢', platform: 'android', category: 'archive', description: 'مدیریت و فشرده‌سازی فایل در اندروید', recommended: true },
    { id: 'file_explorer', name: 'سیستم فایل‌منیجر (File Explorer)', iconName: '📂', platform: 'all', category: 'general', description: 'مدیریت فایل و پوشه استاندارد دستگاه' },
    { id: 'browser_default', name: 'مرورگر پیش‌فرض سیستم (Chrome/Edge)', iconName: '🌐', platform: 'all', category: 'general', description: 'باز کردن فایل یا لینک مستقیم در مرورگر' }
  ];

  // Filter apps according to current item category & platform
  const relevantApps = systemApps.filter(app => {
    const matchesCategory = item.category === app.category || app.category === 'general';
    const matchesPlatform = app.platform === 'all' || (isAndroid ? app.platform === 'android' : app.platform === 'windows');
    return matchesCategory && matchesPlatform;
  });

  const handleLaunchWithApp = (app: SystemApp) => {
    setSelectedAppId(app.id);
    setLaunchedMessage(`در حال ارسال فایل "${item.title}" به برنامه ${app.name}...`);

    // Trigger local browser download / file save intent
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.title}.${item.category === 'video' ? 'mp4' : item.category === 'audio' ? 'mp3' : 'zip'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setLaunchedMessage(`✅ فایل با موفقیت در نرم‌افزار ${app.name} فراخوانی شد.`);
      setTimeout(() => {
        setLaunchedMessage('');
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5" dir="rtl">
      <div className="bg-[#0F0F12] border border-neutral-800 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              {isAndroid ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">باز کردن با... (Open With)</h3>
              <p className="text-xs text-neutral-400">انتخاب برنامه نصب شده رو سیستم ({currentPlatformName})</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected File Badge */}
        <div className="p-4 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
            {item.category === 'video' ? <Film className="w-5 h-5" /> :
             item.category === 'audio' ? <Music className="w-5 h-5" /> :
             <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-neutral-200 text-xs truncate" title={item.title}>{item.title}</h4>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate" dir="ltr">{item.savePath}</p>
          </div>
        </div>

        {/* Launch Confirmation Notification Toast */}
        {launchedMessage && (
          <div className="p-3 bg-blue-500/10 border-b border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{launchedMessage}</span>
          </div>
        )}

        {/* App Selection List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[11px] text-neutral-400 mb-2 font-medium">
            برنامه‌های سازگار یافت شده روی دستگاه شما:
          </div>

          {relevantApps.map((app) => {
            const isSelected = selectedAppId === app.id;
            return (
              <button
                key={app.id}
                onClick={() => handleLaunchWithApp(app)}
                className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                    : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xl shrink-0">
                    {app.iconName}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-neutral-200 text-xs sm:text-sm group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </h5>
                      {app.recommended && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>پیشنهادی</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{app.description}</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-neutral-800 group-hover:bg-blue-600 text-neutral-400 group-hover:text-white transition-all shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 space-y-3">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={alwaysUse}
              onChange={(e) => setAlwaysUse(e.target.checked)}
              className="rounded bg-neutral-900 border-neutral-700 text-blue-600 focus:ring-0 w-4 h-4"
            />
            <span>همیشه این نوع فایل‌ها را با برنامه انتخابی باز کن (Set Default App)</span>
          </label>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => {
                if (relevantApps.length > 0) {
                  handleLaunchWithApp(relevantApps[0]);
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>اجرا با برنامه پیش‌فرض</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all"
            >
              انصراف
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
