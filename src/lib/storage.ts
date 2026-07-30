// IndexedDB & LocalStorage persistent storage helper for Undo Download Manager

import { DownloadItem, AppSettings } from '../types';

const DB_NAME = 'UndoDownloadManagerDB';
const DB_VERSION = 1;
const STORE_DOWNLOADS = 'downloads';
const STORE_SETTINGS = 'settings';

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_DOWNLOADS)) {
        db.createObjectStore(STORE_DOWNLOADS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }
    };
  });
}

// Initial Sample Downloads if database is fresh and empty
const defaultInitialDownloads: DownloadItem[] = [
  {
    id: 'dl_init_1',
    title: 'ویدیو آموزش جامع برنامه‌نویسی ری‌اکت و تایپ‌اسکریپت 2026.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileSize: 450 * 1024 * 1024,
    downloadedBytes: 450 * 1024 * 1024,
    speed: 0,
    progress: 100,
    status: 'completed',
    category: 'video',
    platform: 'youtube',
    eta: 'اتمام یافته',
    quality: '1080p Full HD',
    savePath: typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent) 
      ? '/storage/emulated/0/Download/UndoDownloadManager' 
      : 'C:/Users/Public/Downloads/UndoDownloadManager',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    createdAt: '۱۰:۳۰'
  },
  {
    id: 'dl_init_2',
    title: 'فایل صوتی پادکست هوش مصنوعی و طراحی رابط کاربری.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fileSize: 32 * 1024 * 1024,
    downloadedBytes: 18 * 1024 * 1024,
    speed: 2800000,
    progress: 56,
    status: 'downloading',
    category: 'audio',
    platform: 'direct',
    eta: '۰۰:۰۸',
    quality: '320kbps MP3',
    savePath: typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent) 
      ? '/storage/emulated/0/Download/UndoDownloadManager' 
      : 'C:/Users/Public/Downloads/UndoDownloadManager',
    createdAt: '۱۱:۱۵'
  },
  {
    id: 'dl_init_3',
    title: 'پکیج افکت‌های صوتی و قالب‌های گرافیکی HD.zip',
    url: 'https://example.com/assets/graphic-bundle.zip',
    fileSize: 1250 * 1024 * 1024,
    downloadedBytes: 0,
    speed: 0,
    progress: 0,
    status: 'scheduled',
    category: 'archive',
    platform: 'telegram',
    scheduledTime: '۰۲:۰۰ بامداد',
    eta: 'زمان‌بندی شده',
    savePath: typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent) 
      ? '/storage/emulated/0/Download/UndoDownloadManager' 
      : 'C:/Users/Public/Downloads/UndoDownloadManager',
    createdAt: '۱۲:۰۰'
  }
];

// Load Downloads with IndexedDB + localStorage fallback
export async function loadPersistentDownloads(): Promise<DownloadItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DOWNLOADS, 'readonly');
    const store = tx.objectStore(STORE_DOWNLOADS);

    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result as DownloadItem[];
        if (results && results.length > 0) {
          resolve(results);
        } else {
          // Check localStorage as secondary fallback
          const localData = localStorage.getItem('undo_dm_downloads');
          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              if (Array.isArray(parsed) && parsed.length > 0) {
                savePersistentDownloads(parsed);
                resolve(parsed);
                return;
              }
            } catch (e) {
              console.warn('LocalStorage parse error', e);
            }
          }
          // Populate default initial data if completely new
          savePersistentDownloads(defaultInitialDownloads);
          resolve(defaultInitialDownloads);
        }
      };
      request.onerror = () => {
        resolve(getLocalStorageDownloads());
      };
    });
  } catch (err) {
    console.warn('IndexedDB unavailable, falling back to LocalStorage', err);
    return getLocalStorageDownloads();
  }
}

function getLocalStorageDownloads(): DownloadItem[] {
  try {
    const data = localStorage.getItem('undo_dm_downloads');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(e);
  }
  return defaultInitialDownloads;
}

// Save Downloads to IndexedDB & LocalStorage
export async function savePersistentDownloads(items: DownloadItem[]): Promise<void> {
  // Always update LocalStorage immediately for instant sync
  try {
    localStorage.setItem('undo_dm_downloads', JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Save to IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DOWNLOADS, 'readwrite');
    const store = tx.objectStore(STORE_DOWNLOADS);

    // Clear existing store & add all current items
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const item of items) {
      store.add(item);
    }
  } catch (err) {
    console.warn('IndexedDB save failed, saved to LocalStorage:', err);
  }
}

// Load App Settings
export function loadPersistentSettings(defaultPath: string): AppSettings {
  try {
    const stored = localStorage.getItem('undo_dm_settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Settings load error', e);
  }
  return {
    defaultPath,
    maxSimultaneous: 3,
    autoShutdown: false,
    soundEnabled: true,
    theme: 'dark',
    speedLimit: 0
  };
}

// Save App Settings
export function savePersistentSettings(settings: AppSettings): void {
  try {
    localStorage.setItem('undo_dm_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Settings save error', e);
  }
}

// Load Reward Points
export function loadPersistentPoints(): number {
  try {
    const stored = localStorage.getItem('undo_dm_reward_points');
    if (stored) {
      return parseInt(stored, 10) || 250;
    }
  } catch (e) {
    console.warn('Points load error', e);
  }
  return 250;
}

// Save Reward Points
export function savePersistentPoints(points: number): void {
  try {
    localStorage.setItem('undo_dm_reward_points', points.toString());
  } catch (e) {
    console.warn('Points save error', e);
  }
}
