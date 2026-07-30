import React, { useState } from 'react';
import { Film, Scissors, Volume2, Play, CheckCircle2, Cpu } from 'lucide-react';
import { FFmpegJob, DownloadItem } from '../types';

interface FFmpegStudioProps {
  completedDownloads: DownloadItem[];
}

export const FFmpegStudio: React.FC<FFmpegStudioProps> = ({ completedDownloads }) => {
  const [selectedFile, setSelectedFile] = useState<string>(completedDownloads[0]?.title || 'sample_video.mp4');
  const [operation, setOperation] = useState<'convert' | 'extract_audio' | 'compress' | 'trim'>('convert');
  const [targetFormat, setTargetFormat] = useState('mp4');
  const [jobs, setJobs] = useState<FFmpegJob[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleRunFFmpeg = () => {
    setProcessing(true);
    const newJob: FFmpegJob = {
      id: 'job_' + Date.now(),
      fileName: selectedFile,
      operation,
      targetFormat,
      status: 'processing',
      progress: 10,
      createdAt: new Date().toLocaleTimeString('fa-IR')
    };

    setJobs(prev => [newJob, ...prev]);

    // Simulate progress
    let prog = 10;
    const interval = setInterval(() => {
      prog += 30;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setProcessing(false);
        setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: 'completed', progress: 100, outputName: `${j.fileName.split('.')[0]}_processed.${targetFormat}` } : j));
      } else {
        setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, progress: prog } : j));
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-100">استودیوی پردازش رسانه (FFmpeg داخلی)</h2>
            <p className="text-xs text-neutral-400">تبدیل فرمت‌های ویدیو و صوت، استخراج صدا، فشرده‌سازی و برش حرفه‌ای فایل‌ها بدون نیاز به نرم‌افزار جانبی</p>
          </div>
        </div>

        {/* Operation Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={() => { setOperation('convert'); setTargetFormat('mp4'); }}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col gap-2 ${
              operation === 'convert'
                ? 'bg-rose-500/10 border-rose-500/50 text-rose-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <Film className="w-5 h-5 text-rose-400" />
            <div className="font-bold text-sm">تبدیل فرمت ویدیو</div>
            <div className="text-[11px] text-neutral-500">MKV به MP4, WebM و غیره</div>
          </button>

          <button
            onClick={() => { setOperation('extract_audio'); setTargetFormat('mp3'); }}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col gap-2 ${
              operation === 'extract_audio'
                ? 'bg-purple-500/10 border-purple-500/50 text-purple-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <Volume2 className="w-5 h-5 text-purple-400" />
            <div className="font-bold text-sm">استخراج صوت (MP3)</div>
            <div className="text-[11px] text-neutral-500">تبدیل ویدیو به فایل صوتی باکیفیت</div>
          </button>

          <button
            onClick={() => { setOperation('compress'); setTargetFormat('mp4'); }}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col gap-2 ${
              operation === 'compress'
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <Cpu className="w-5 h-5 text-blue-400" />
            <div className="font-bold text-sm">فشرده‌سازی هوشمند</div>
            <div className="text-[11px] text-neutral-500">کاهش حجم ویدیو بدون افت کیفیت</div>
          </button>

          <button
            onClick={() => { setOperation('trim'); setTargetFormat('mp4'); }}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col gap-2 ${
              operation === 'trim'
                ? 'bg-green-500/10 border-green-500/50 text-green-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <Scissors className="w-5 h-5 text-green-400" />
            <div className="font-bold text-sm">برش و کات ویدیو</div>
            <div className="text-[11px] text-neutral-500">انتخاب بازه زمانی دلخواه</div>
          </button>
        </div>
      </div>

      {/* Configuration & Action Card */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="font-bold text-neutral-200 text-sm">تنظیمات عملیات FFmpeg</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">انتخاب فایل مبدأ:</label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 focus:outline-none focus:border-rose-500 transition-all"
            >
              {completedDownloads.length > 0 ? (
                completedDownloads.map(d => (
                  <option key={d.id} value={d.title}>{d.title}</option>
                ))
              ) : (
                <option value="sample_video.mp4">ویدیو نمونه سیستم (sample_video.mp4)</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">فرمت خروجی نهایی:</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full bg-neutral-900 text-neutral-200 text-sm rounded-xl px-4 py-3 border border-neutral-700 focus:outline-none focus:border-rose-500 transition-all font-mono"
            >
              {operation === 'extract_audio' ? (
                <>
                  <option value="mp3">MP3 (High Quality)</option>
                  <option value="aac">AAC</option>
                  <option value="wav">WAV</option>
                </>
              ) : (
                <>
                  <option value="mp4">MP4 (H.264 / AAC)</option>
                  <option value="mkv">MKV</option>
                  <option value="webm">WebM</option>
                  <option value="gif">GIF (انیمیشن)</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            disabled={processing}
            onClick={handleRunFFmpeg}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-rose-950/50 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>{processing ? 'در حال اجرای عملیات FFmpeg...' : 'شروع پردازش رسانه'}</span>
          </button>
        </div>
      </div>

      {/* Jobs Log */}
      {jobs.length > 0 && (
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-neutral-200 text-sm">تاریخچه پردازش‌های FFmpeg</h3>
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-neutral-200">{job.fileName}</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    عملیات: {job.operation} • خروجی: .{job.targetFormat} • {job.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {job.status === 'processing' ? (
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${job.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-mono text-rose-400">{job.progress}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تکمیل شد: {job.outputName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

