import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DownloadList } from './components/DownloadList';
import { AddDownloadModal } from './components/AddDownloadModal';
import { FFmpegStudio } from './components/FFmpegStudio';
import { SettingsModal } from './components/SettingsModal';
import { PurchaseModal } from './components/PurchaseModal';
import { DownloadItem, AppSettings, DownloadCategory } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);

  // YouTube monthly quota state (limit = 5 free downloads per month)
  const [youtubeCount, setYoutubeCount] = useState<number>(3);
  const [isPro, setIsPro] = useState<boolean>(false);

  const [settings, setSettings] = useState<AppSettings>({
    defaultPath: 'C:/Users/Masoud/Downloads/AriaDownloads',
    maxSimultaneous: 3,
    autoShutdown: false,
    soundEnabled: true,
    theme: 'dark',
    speedLimit: 0
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
        id: 'dl_1',
        title: 'آموزش جامع ری اکت ۱۸ و معماری مدرن (YouTube)',
        url: 'https://www.youtube.com/watch?v=react18_tutorial',
        fileSize: 480 * 1024 * 1024,
        downloadedBytes: 192 * 1024 * 1024,
        speed: 3.2 * 1024 * 1024,
        progress: 40,
        status: 'downloading',
        category: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
        quality: '1080p (MP4)',
        savePath: 'C:/Users/Masoud/Downloads/AriaDownloads',
        eta: '۰۱:۵۵',
        createdAt: '14:20',
        platform: 'youtube'
    },
    {
        id: 'dl_2',
        title: 'بسته گرافیکی و آیکون‌های وکتور اینستاگرام',
        url: 'https://www.instagram.com/p/reel_sample_pack',
        fileSize: 125 * 1024 * 1024,
        downloadedBytes: 125 * 1024 * 1024,
        speed: 0,
        progress: 100,
        status: 'completed',
        category: 'archive',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        quality: 'Original',
        savePath: 'C:/Users/Masoud/Downloads/AriaDownloads',
        eta: 'اتمام یافته',
        createdAt: '13:05',
        platform: 'instagram'
    },
    {
        id: 'dl_3',
        title: 'پروژه سورس‌کد ربات تلگرام پیشرفته Node.js',
        url: 'https://t.me/developer_channel/zip_source',
        fileSize: 45 * 1024 * 1024,
        downloadedBytes: 15 * 1024 * 1024,
        speed: 1.1 * 1024 * 1024,
        progress: 33,
        status: 'paused',
        category: 'software',
        thumbnail: '',
        quality: 'ZIP',
        savePath: 'C:/Users/Masoud/Downloads/AriaDownloads',
        eta: '--:--',
        createdAt: '14:10',
        platform: 'telegram'
    },
    {
        id: 'dl_4',
        title: 'مستند سینمایی طبیعت و کهکشان‌ها (زمان‌بندی شده)',
        url: 'https://example.com/videos/galaxy_documentary_4k.mp4',
        fileSize: 1850 * 1024 * 1024,
        downloadedBytes: 0,
        speed: 0,
        progress: 0,
        status: 'scheduled',
        category: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
        quality: '1080p (MP4)',
        savePath: 'C:/Users/Masoud/Downloads/AriaDownloads',
        eta: 'شروع در ۰۲:۰۰ بامداد',
        createdAt: '14:30',
        platform: 'direct',
        scheduledTime: '02:00'
    }
  ]);

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
    if (newItemData.platform === 'youtube' && !isPro && youtubeCount >= 5) {
      setIsAddModalOpen(false);
      setIsPurchaseModalOpen(true);
      return;
    }

    if (newItemData.platform === 'youtube' && !isPro) {
      setYoutubeCount(prev => prev + 1);
    }

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
    <div className="flex h-screen bg-[#0A0A0A] text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'settings') setIsSettingsOpen(true);
          else setActiveTab(tab);
        }} 
        counts={counts}
        youtubeCount={youtubeCount}
        isPro={isPro}
        onOpenPurchase={() => setIsPurchaseModalOpen(true)}
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
        />

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'ffmpeg' ? (
            <FFmpegStudio completedDownloads={completedDownloadsList} />
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Tab Title */}
              <div className="flex items-center justify-between" dir="rtl">
                <div>
                  <h2 className="text-lg font-bold text-neutral-100">
                    {activeTab === 'all' && 'همه دانلودها'}
                    {activeTab === 'active' && 'دانلودهای در حال انجام'}
                    {activeTab === 'paused' && 'دانلودهای متوقف شده'}
                    {activeTab === 'completed' && 'فایل‌های دانلود شده'}
                    {activeTab === 'scheduled' && 'صف زمان‌بندی شده خودکار'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">مدیریت فایل‌ها، زمان‌بندی هوشمند و سرعت انتقال</p>
                </div>
                <div className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
                  تعداد: {filteredDownloads.length} فایل
                </div>
              </div>

              <DownloadList 
                items={filteredDownloads}
                onPause={handlePause}
                onResume={handleResume}
                onRestart={handleRestart}
                onDelete={handleDelete}
                onConvertToFFmpeg={() => setActiveTab('ffmpeg')}
              />
            </div>
          )}
        </main>
      </div>

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

      {/* Purchase Modal (Bazaar & Myket IAP) */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccessPurchase={() => {
          setIsPro(true);
          setYoutubeCount(0);
        }}
        usedCount={youtubeCount}
        maxCount={5}
      />
    </div>
  );
}
