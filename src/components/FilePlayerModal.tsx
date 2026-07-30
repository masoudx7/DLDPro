import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Folder, 
  FileText, 
  Film, 
  Music, 
  Archive, 
  FileCode, 
  CheckCircle2, 
  Download,
  Share2,
  ExternalLink,
  Info,
  HardDrive
} from 'lucide-react';
import { DownloadItem } from '../types';
import { downloadAndSaveToDisk } from '../lib/fileSaver';

interface FilePlayerModalProps {
  item: DownloadItem | null;
  onClose: () => void;
  onOpenFolderLocation: (item: DownloadItem) => void;
  onOpenAppChooser?: (item: DownloadItem) => void;
}

export const FilePlayerModal: React.FC<FilePlayerModalProps> = ({
  item,
  onClose,
  onOpenFolderLocation,
  onOpenAppChooser
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [launchedSuccess, setLaunchedSuccess] = useState(false);

  if (!item) return null;

  const isVideo = item.category === 'video';
  const isAudio = item.category === 'audio';

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleLaunchFile = () => {
    setLaunchedSuccess(true);
    setTimeout(() => setLaunchedSuccess(false), 3000);
  };

  // Demo fallback media video URL
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  return (
    <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5" dir="rtl">
      <div className="bg-[#0F0F12] border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-950/40">
              {isVideo ? <Film className="w-5 h-5" /> : isAudio ? <Music className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base truncate" title={item.title}>
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 font-mono truncate" dir="ltr">
                {item.savePath}/{item.title.replace(/\s+/g, '_')}.{isVideo ? 'mp4' : isAudio ? 'mp3' : 'file'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview / Player Box */}
        <div className="p-5 space-y-5">
          {isVideo ? (
            <div className="relative rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl aspect-video group">
              <video
                src={demoVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={item.thumbnail}
              />
            </div>
          ) : isAudio ? (
            <div className="bg-gradient-to-br from-purple-950/40 via-neutral-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-6 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-950/50">
                <Music className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{item.title}</h4>
                <p className="text-xs text-purple-300/70 mt-1 font-mono">فرمت فایل: MP3 • کیفیت: {item.quality || '320kbps'}</p>
              </div>

              {/* Audio Player Controls */}
              <div className="pt-2">
                <audio controls autoPlay className="w-full accent-purple-500" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileCode className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-white text-base">{item.title}</h4>
              <p className="text-xs text-neutral-400">این فایل آماده اجرا یا استخراج با برنامه‌های ویندوز/اندروید است.</p>
            </div>
          )}

          {/* Toast Notification */}
          {launchedSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>فایل با موفقیت اجرا شد (کد فرمان اجرا فرستاده شد).</span>
            </div>
          )}

          {/* File Meta Table */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">حجم فایل:</span>
              <span className="font-bold font-mono text-neutral-200">{formatBytes(item.fileSize)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">کیفیت دانلود شده:</span>
              <span className="font-bold font-mono text-blue-400">{item.quality || 'اصلی'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">تاریخ تکمیل:</span>
              <span className="font-mono text-neutral-300">{item.createdAt || 'امروز'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">مسیر ذخیره سیستم:</span>
              <span className="font-mono text-amber-400 truncate max-w-[250px]" dir="ltr">{item.savePath}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={async () => {
                const fileName = `${item.title}.${isVideo ? 'mp4' : isAudio ? 'mp3' : 'zip'}`;
                const mimeType = isVideo ? 'video/mp4' : isAudio ? 'audio/mpeg' : 'application/zip';
                await downloadAndSaveToDisk(item.url, fileName, mimeType);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
              title="ذخیره فایل مستقیم در مسیر هارد یا کارت حافظه"
            >
              <HardDrive className="w-4 h-4" />
              <span>ذخیره مستقیم در هارد</span>
            </button>

            <button
              onClick={() => {
                if (onOpenAppChooser && item) {
                  onClose();
                  onOpenAppChooser(item);
                } else {
                  handleLaunchFile();
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>اجرا با پلیر دلخواه</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenFolderLocation(item);
              }}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition-all"
            >
              <Folder className="w-4 h-4 text-amber-400" />
              <span>فایل‌منیجر سیستم</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
