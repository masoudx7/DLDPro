import React, { useState, useRef } from 'react';
import { 
  X, 
  Folder, 
  HardDrive, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Film, 
  Music, 
  FolderOpen,
  Search,
  Upload,
  Plus,
  Info
} from 'lucide-react';
import { DownloadItem } from '../types';
import { openSystemFileManagerPicker, downloadAndSaveToDisk } from '../lib/fileSaver';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadItems: DownloadItem[];
  selectedItem?: DownloadItem | null;
  defaultPath: string;
  onImportLocalFiles?: (importedFiles: DownloadItem[]) => void;
}

export const FileManagerModal: React.FC<FileManagerModalProps> = ({
  isOpen,
  onClose,
  downloadItems,
  selectedItem,
  defaultPath,
  onImportLocalFiles
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [importedStatus, setImportedStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPath = selectedItem?.savePath || defaultPath;

  const handleCopyPath = () => {
    try {
      navigator.clipboard.writeText(currentPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Clipboard error');
    }
  };

  const handleOpenNativeFileManager = () => {
    openSystemFileManagerPicker((files) => {
      if (files && files.length > 0) {
        const newItems: DownloadItem[] = Array.from(files).map((f, idx) => ({
          id: `local_${Date.now()}_${idx}`,
          title: f.name,
          url: URL.createObjectURL(f),
          fileSize: f.size,
          downloadedBytes: f.size,
          speed: 0,
          progress: 100,
          status: 'completed',
          category: f.type.startsWith('video/') ? 'video' : f.type.startsWith('audio/') ? 'audio' : 'other',
          platform: 'direct',
          eta: 'موجود در حافظه محلی',
          quality: 'فایل محلی',
          savePath: currentPath,
          createdAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }));

        if (onImportLocalFiles) {
          onImportLocalFiles(newItems);
        }

        setImportedStatus(`✅ تعداد ${files.length} فایل از فایل‌منیجر سیستم انتخاب و اضافه شد.`);
        setTimeout(() => setImportedStatus(''), 4000);
      }
    });
  };

  const completedFiles = downloadItems.filter(i => i.status === 'completed');
  const filteredFiles = completedFiles.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5" dir="rtl">
      <div className="bg-[#0F0F12] border border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Explorer Title Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">فایل‌منیجر و مدیریت حافظه دستگاه</h3>
              <p className="text-xs text-neutral-400">دسترسی مستقیم به پوشه دانلودها و مرور فایل‌های سیستم</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary File Manager Trigger Actions */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/40 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleOpenNativeFileManager}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all"
            >
              <HardDrive className="w-4 h-4" />
              <span>باز کردن فایل‌منیجر سیستم (انتخاب و مرور فایل‌های حافظه)</span>
            </button>

            <button
              onClick={handleCopyPath}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-neutral-700 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'مسیر کپی شد' : 'کپی مسیر پوشه سیستم'}</span>
            </button>
          </div>

          {/* Current Saved Path Display */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 text-xs flex items-center gap-2">
            <span className="text-neutral-400 shrink-0 font-bold">مسیر پوشه در حافظه:</span>
            <span className="font-mono text-amber-300 text-[11px] sm:text-xs overflow-x-auto whitespace-nowrap dir-ltr flex-1">{currentPath}</span>
          </div>

          {importedStatus && (
            <div className="p-2.5 bg-green-950/50 border border-green-500/30 rounded-xl text-xs text-green-300 font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{importedStatus}</span>
            </div>
          )}

          {/* Search inside downloaded directory */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="جستجو در لیست فایل‌های دانلود شده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Directory File List View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-3">
              <Folder className="w-12 h-12 mx-auto text-neutral-700 stroke-1" />
              <p className="text-xs">هیچ فایلی در لیست این پوشه یافت نشد.</p>
              <button
                onClick={handleOpenNativeFileManager}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold rounded-xl border border-neutral-700 transition-all inline-flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                <span>انتخاب فایل از فایل‌منیجر گوشی / ویندوز</span>
              </button>
            </div>
          ) : (
            filteredFiles.map((f) => {
              const isSelected = selectedItem?.id === f.id;
              return (
                <div 
                  key={f.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500/40' 
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 shrink-0">
                      {f.category === 'video' ? <Film className="w-5 h-5 text-rose-400" /> :
                       f.category === 'audio' ? <Music className="w-5 h-5 text-purple-400" /> :
                       <FileText className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-neutral-200 text-xs truncate" title={f.title}>
                        {f.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                        <span>{formatBytes(f.fileSize)}</span>
                        <span>•</span>
                        <span className="text-amber-400">{f.quality || 'کیفیت اصلی'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={async () => {
                        const ext = f.category === 'video' ? 'mp4' : f.category === 'audio' ? 'mp3' : 'zip';
                        await downloadAndSaveToDisk(f.url, `${f.title}.${ext}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                      title="ذخیره مستقیم فایل روی حافظه سیستم"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>ذخیره روی حافظه</span>
                    </button>

                    <a
                      href={f.url}
                      download={f.title}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>پخش / اجرا</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & Guidance */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              نکته: برای دسترسی دستی در گوشی‌های اندروید، برنامه <b>My Files</b> یا <b>فایل‌های من</b> را باز کرده و وارد پوشه Download شوید.
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>مجموع فایل‌های آماده: {completedFiles.length} فایل</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-all"
            >
              بستن
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
