import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DownloadList } from './components/DownloadList';
import { QuickDownloadBox } from './components/QuickDownloadBox';
import { AddDownloadModal } from './components/AddDownloadModal';
import { FFmpegStudio } from './components/FFmpegStudio';
import { SettingsModal } from './components/SettingsModal';
import { ScheduleSpeedTab } from './components/ScheduleSpeedTab';
import { TapsellRewardModal } from './components/TapsellRewardModal';
import { SpeedChart } from './components/SpeedChart';
import { FilePlayerModal } from './components/FilePlayerModal';
import { FileManagerModal } from './components/FileManagerModal';
import { AppChooserModal } from './components/AppChooserModal';
import { DownloadItem, AppSettings } from './types';
import { CheckCircle2, FolderCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isTapsellModalOpen, setIsTapsellModalOpen] = useState<boolean>(false);
  const [rewardPoints, setRewardPoints] = useState<number>(250);

  // Initial folder created toast banner
  const [showFolderCreatedToast, setShowFolderCreatedToast] = useState<boolean>(true);

  // File Player, File Manager & App Chooser Modals State
  const [selectedFileToPlay, setSelectedFileToPlay] = useState<DownloadItem | null>(null);
  const [selectedAppChooserItem, setSelectedAppChooserItem] = useState<DownloadItem | null>(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState<boolean>(false);
  const [selectedFolderItem, setSelectedFolderItem] = useState<DownloadItem | null>(null);

  const handleGrantReward = (rewardType: string) => {
    setRewardPoints(prev => prev + 100);
  };

  // Auto-detect system download path on initial launch
  const isAndroidOS = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const defaultOSPath = isAndroidOS 
    ? '/storage/emulated/0/Download/UndoDownloadManager' 
    : 'C:/Users/Public/Downloads/UndoDownloadManager';

  const [settings, setSettings] = useState<AppSettings>({
    defaultPath: defaultOSPath,
    maxSimultaneous: 3,
    autoShutdown: false,
    soundEnabled: true,
    theme: 'dark',
    speedLimit: 0
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  // Simulate real-time progress for downloading items
  useEffect(() => {
    const timer = setInterval(() => {
      setDownloads(prev => prev.map(item => {
        if (item.status === 'downloading') {
          const increment = Math.floor(Math.random() * 2500000) + 800000; // ~1-3 MB chunk
          const newDownloaded = Math.min(item.fileSize, item.downloadedBytes + increment);
          const newProgress = Math.floor((newDownloaded / item.fileSize) * 100);
          const isDone = newProgress >= 100;

          return {
            ...item,
            downloadedBytes: newDownloaded,
            progress: newProgress,
            status: isDone ? 'completed' : 'downloading',
            speed: isDone ? 0 : Math.floor(Math.random() * 3000000) + 1200000,
            eta: isDone ? 'اتمام یافته' : '۰۰:۴۵'
          };
        }
        return item;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handlePause = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'paused', speed: 0 } : d));
  };

  const handleResume = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'downloading', speed: 2500000 } : d));
  };

  const handleRestart = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, downloadedBytes: 0, progress: 0, status: 'downloading', speed: 3000000 } : d));
  };

  const handleDelete = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handlePauseAll = () => {
    setDownloads(prev => prev.map(d => d.status === 'downloading' ? { ...d, status: 'paused', speed: 0 } : d));
  };

  const handleResumeAll = () => {
    setDownloads(prev => prev.map(d => d.status === 'paused' ? { ...d, status: 'downloading', speed: 2500000 } : d));
  };

  const handleAddDownload = (newItemData: Omit<DownloadItem, 'id' | 'downloadedBytes' | 'speed' | 'progress' | 'status' | 'eta' | 'createdAt'>) => {
    const newItem: DownloadItem = {
      ...newItemData,
      id: 'dl_' + Date.now(),
      downloadedBytes: 0,
      speed: newItemData.scheduledTime ? 0 : 3500000,
      progress: 0,
      status: newItemData.scheduledTime ? 'scheduled' : 'downloading',
      eta: '۰۱:۲۰',
      createdAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    setDownloads(prev => [newItem, ...prev]);
  };

  // Counts for sidebar
  const counts = {
    all: downloads.length,
    active: downloads.filter(d => d.status === 'downloading').length,
    paused: downloads.filter(d => d.status === 'paused').length,
    completed: downloads.filter(d => d.status === 'completed').length,
    scheduled: downloads.filter(d => d.status === 'scheduled').length,
  };

  // Filtered downloads based on active tab and search
  const filteredDownloads = downloads.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.url.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'active') return d.status === 'downloading';
    if (activeTab === 'paused') return d.status === 'paused';
    if (activeTab === 'completed') return d.status === 'completed';
    if (activeTab === 'scheduled') return d.status === 'scheduled';
    return true;
  });

  const globalSpeed = downloads.reduce((acc, curr) => acc + (curr.status === 'downloading' ? curr.speed : 0), 0);
  const completedDownloadsList = downloads.filter(d => d.status === 'completed');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0A0A0A] text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else if (tab === 'tapsell_reward') {
            setIsTapsellModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }} 
        counts={counts}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          onOpenAddModal={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          globalSpeed={globalSpeed}
          onPauseAll={handlePauseAll}
          onResumeAll={handleResumeAll}
          selectedSavePath={settings.defaultPath}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenTapsellModal={() => setIsTapsellModalOpen(true)}
          rewardPoints={rewardPoints}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          {/* Initial Folder Created Toast Banner */}
          {showFolderCreatedToast && (
            <div className="max-w-5xl mx-auto mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-950/60 via-neutral-900 to-amber-950/40 border border-blue-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in duration-300" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                  <FolderCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white">پوشه ذخیره‌سازی محلی سیستم ایجاد و آماده شد: </span>
                  <span className="font-mono text-amber-300 text-xs dir-ltr block sm:inline mt-0.5 sm:mt-0">{settings.defaultPath}</span>
                </div>
              </div>
              <button
                onClick={() => setShowFolderCreatedToast(false)}
                className="text-neutral-400 hover:text-white px-2 py-1 rounded-lg text-xs font-bold"
              >
                متوجه شدم
              </button>
            </div>
          )}

          {activeTab === 'ffmpeg' ? (
            <FFmpegStudio completedDownloads={completedDownloadsList} />
          ) : activeTab === 'schedule_settings' ? (
            <ScheduleSpeedTab 
              settings={settings}
              onUpdateSettings={setSettings}
            />
          ) : (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Prominent Eye-Catching Quick Download Box */}
              <QuickDownloadBox 
                onAddDownload={handleAddDownload}
                onOpenAdvancedModal={() => setIsAddModalOpen(true)}
                defaultPath={settings.defaultPath}
              />

              {/* Tab Title & Header */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80" dir="rtl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
                    <span>
                      {activeTab === 'all' && 'لیست همه دانلودها'}
                      {activeTab === 'active' && 'دانلودهای در حال انجام'}
                      {activeTab === 'paused' && 'دانلودهای متوقف شده'}
                      {activeTab === 'completed' && 'فایل‌های دانلود شده'}
                      {activeTab === 'scheduled' && 'صف زمان‌بندی شده خودکار'}
                    </span>
                  </h3>
                </div>
                <div className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-800">
                  تعداد: {filteredDownloads.length} فایل
                </div>
              </div>

              {/* Real-time Download Speed Chart for Active Downloads */}
              {(activeTab === 'active' || activeTab === 'all') && (
                <SpeedChart 
                  currentSpeedBytes={globalSpeed} 
                  activeCount={counts.active} 
                />
              )}

              <DownloadList 
                items={filteredDownloads}
                onPause={handlePause}
                onResume={handleResume}
                onRestart={handleRestart}
                onDelete={handleDelete}
                onConvertToFFmpeg={() => setActiveTab('ffmpeg')}
                onPlayFile={(item) => setSelectedFileToPlay(item)}
                onOpenFolderLocation={(item) => {
                  setSelectedFolderItem(item);
                  setIsFileManagerOpen(true);
                }}
                onOpenAppChooser={(item) => setSelectedAppChooserItem(item)}
              />
            </div>
          )}
        </main>
      </div>

      {/* App Chooser (Open With) Modal */}
      <AppChooserModal
        item={selectedAppChooserItem}
        isOpen={!!selectedAppChooserItem}
        onClose={() => setSelectedAppChooserItem(null)}
      />

      {/* File Player & Executer Modal */}
      <FilePlayerModal 
        item={selectedFileToPlay}
        onClose={() => setSelectedFileToPlay(null)}
        onOpenFolderLocation={(item) => {
          setSelectedFolderItem(item);
          setIsFileManagerOpen(true);
        }}
        onOpenAppChooser={(item) => setSelectedAppChooserItem(item)}
      />

      {/* File Manager Folder Location Modal */}
      <FileManagerModal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        downloadItems={downloads}
        selectedItem={selectedFolderItem}
        defaultPath={settings.defaultPath}
      />

      {/* Tapsell Rewarded Video Ad Modal */}
      <TapsellRewardModal
        isOpen={isTapsellModalOpen}
        onClose={() => setIsTapsellModalOpen(false)}
        onGrantReward={handleGrantReward}
        currentRewardPoints={rewardPoints}
      />

      {/* Add Download Modal */}
      <AddDownloadModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDownload={handleAddDownload}
        defaultPath={settings.defaultPath}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
