import React, { useState } from 'react';
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
  ChevronLeft,
  Search
} from 'lucide-react';
import { DownloadItem } from '../types';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadItems: DownloadItem[];
  selectedItem?: DownloadItem | null;
  defaultPath: string;
}

export const FileManagerModal: React.FC<FileManagerModalProps> = ({
  isOpen,
  onClose,
  downloadItems,
  selectedItem,
  defaultPath
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
              <h3 className="font-bold text-white text-sm sm:text-base">فایل‌منیجر و پوشه ذخیره‌سازی</h3>
              <p className="text-xs text-neutral-400">هدایت مستقیم و مدیریت فایل‌های دانلود شده روی سیستم</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Manager Address Bar */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/80 space-y-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 overflow-x-auto whitespace-nowrap" dir="ltr">
              {currentPath}
            </div>
            <button
              onClick={handleCopyPath}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border border-neutral-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copied ? 'کپی شد' : 'کپی مسیر'}</span>
            </button>
          </div>

          {/* Search inside downloaded directory */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="جستجو در پوشه فایل‌های دانلود شده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl pr-9 pl-4 py-2 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Directory File List View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Folder className="w-12 h-12 mx-auto text-neutral-700 stroke-1" />
              <p className="text-xs">هیچ فایلی در این پوشه یافت نشد.</p>
            </div>
          ) : (
            filteredFiles.map((f) => {
              const isSelected = selectedItem?.id === f.id;
              return (
                <div 
                  key={f.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500/40' 
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 shrink-0">
                      {f.category === 'video' ? <Film className="w-5 h-5 text-rose-400" /> :
                       f.category === 'audio' ? <Music className="w-5 h-5 text-purple-400" /> :
                       <FileText className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-200 text-xs truncate" title={f.title}>
                        {f.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                        <span>{formatBytes(f.fileSize)}</span>
                        <span>•</span>
                        <span className="text-amber-400">{f.quality || 'نامشخص'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={f.url}
                      download={f.title}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>باز کردن فایل</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <span>مجموع فایل‌های ذخیره شده: {completedFiles.length} فایل</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-all"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
