export type DownloadCategory = 'video' | 'audio' | 'software' | 'document' | 'archive' | 'other';

export type DownloadStatus = 'downloading' | 'paused' | 'scheduled' | 'completed' | 'error';

export interface DownloadItem {
  id: string;
  title: string;
  url: string;
  fileSize: number; // in bytes
  downloadedBytes: number;
  speed: number; // bytes per second
  progress: number; // 0 - 100
  status: DownloadStatus;
  category: DownloadCategory;
  thumbnail?: string;
  quality?: string;
  savePath: string;
  eta: string; // e.g. "02:45"
  createdAt: string;
  scheduledTime?: string; // ISO string or time string
  stopTime?: string;
  platform: 'youtube' | 'instagram' | 'telegram' | 'direct';
}

export interface FFmpegJob {
  id: string;
  fileName: string;
  operation: 'convert' | 'extract_audio' | 'compress' | 'trim';
  targetFormat: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  outputName?: string;
  createdAt: string;
}

export interface AppSettings {
  defaultPath: string;
  maxSimultaneous: number;
  autoShutdown: boolean;
  soundEnabled: boolean;
  theme: 'dark';
  speedLimit: number; // 0 = unlimited, or KB/s
}
