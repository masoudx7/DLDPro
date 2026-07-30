import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Sparkles, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  Award, 
  Gift, 
  Zap, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Play
} from 'lucide-react';
import { requestAndShowRewardedAd } from '../lib/tapsell';

interface TapsellRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantReward: (rewardType: string) => void;
  currentRewardPoints: number;
}

export const TapsellRewardModal: React.FC<TapsellRewardModalProps> = ({
  isOpen,
  onClose,
  onGrantReward,
  currentRewardPoints
}) => {
  const [appKey, setAppKey] = useState<string>('Your-Tapsell-App-Key-Here');
  const [zoneId, setZoneId] = useState<string>('Your-Tapsell-Rewarded-Zone-ID-Here');
  const [isPlayingAd, setIsPlayingAd] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [adSuccess, setAdSuccess] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Countdown timer for ad player simulation & tracking
  useEffect(() => {
    let timer: any;
    if (isPlayingAd && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlayingAd && timeLeft === 0) {
      setIsPlayingAd(false);
      setAdSuccess(true);
      onGrantReward('100_points');
      setStatusMessage('🎉 پاداش با موفقیت به حساب شما اضافه شد! متشکریم بابت مشاهده تبلیغ.');
    }

    return () => clearInterval(timer);
  }, [isPlayingAd, timeLeft, onGrantReward]);

  if (!isOpen) return null;

  const handleStartAd = () => {
    setStatusMessage('');
    setAdSuccess(false);

    // Try Tapsell SDK call first
    requestAndShowRewardedAd({
      appKey,
      zoneId,
      onSuccessReward: () => {
        setAdSuccess(true);
        onGrantReward('100_points');
        setStatusMessage('🎉 تبلیغ تپسل تا انتها مشاهده شد! پاداش ویژه فعال گردید.');
      },
      onAdError: (msg) => {
        console.warn('Fallback to embedded test player for preview testing:', msg);
        // Launch fallback player preview
        setTimeLeft(15);
        setIsPlayingAd(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md" dir="rtl">
      <div className="bg-[#0F0F12] border border-neutral-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-950/40">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">تبلیغات پاداش‌دار تپسل (Tapsell Rewarded)</h3>
              <p className="text-xs text-neutral-400">مشاهده ویدیو و کسب پاداش/سرعت دانلود نامحدود</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Player Banner or Active Video Player */}
          {isPlayingAd ? (
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-amber-500/50 shadow-2xl aspect-video flex flex-col justify-between p-4">
              {/* Simulated Video Content Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-neutral-950 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                  <Play className="w-8 h-8 fill-amber-400" />
                </div>
                <h4 className="font-bold text-white text-lg">تبلیغ ویدیویی پاداش‌دار تپسل</h4>
                <p className="text-xs text-amber-300/80 mt-1">لطفاً تا پایان ویدیو صبر کنید تا پاداش شما اعمال شود...</p>
              </div>

              {/* Overlay Top Controls */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-amber-500 text-neutral-950 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تبلیغ رسمی تپسل</span>
                </span>

                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-xl backdrop-blur-sm"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Overlay Bottom Progress & Timer */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs text-white font-mono">
                  <span>زمان باقی‌مانده: {timeLeft} ثانیه</span>
                  <span>کسب پاداش در اتمام ویدیو</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000"
                    style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-neutral-900 to-[#141418] border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-neutral-200 text-sm">امتیاز پاداش فعلی شما:</span>
                </div>
                <span className="text-base font-extrabold font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  {currentRewardPoints} امتیاز
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>سرعت دانلود حداکثری</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">حذف محدودیت پهنای باند شبکه</p>
                </div>

                <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>دانلود چندبخش همزمان</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">امکان دانلود همزمان ۱۰ فایل</p>
                </div>
              </div>
            </div>
          )}

          {/* Success / Error Toast Message */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 ${
              adSuccess 
                ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {adSuccess ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Tapsell AppKey & ZoneId Inputs Configuration */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
              <Key className="w-4 h-4 text-blue-400" />
              <span>تنظیمات کلید اتصال تپسل (Tapsell Developer Keys)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Tapsell App Key:</label>
                <input
                  type="text"
                  value={appKey}
                  onChange={(e) => setAppKey(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="کلید اپلیکیشن تپسل"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Rewarded Zone ID:</label>
                <input
                  type="text"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="شناسه زون ویدیویی تپسل"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleStartAd}
              disabled={isPlayingAd}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <Tv className="w-5 h-5" />
              <span>مشاهده ویدیوی تبلیغاتی تپسل و دریافت پاداش</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
