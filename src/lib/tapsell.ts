// Tapsell Web SDK Integration Helper for React & TypeScript

declare global {
  interface Window {
    tapsell?: {
      init: (appKey: string) => void;
      requestAd: (
        params: { zoneId: string },
        onSuccess: (adId: string) => void,
        onError: (error: any) => void
      ) => void;
      showAd: (
        params: {
          adId: string;
          onClosed?: () => void;
          onCompleted?: () => void;
          onError?: (err: any) => void;
        }
      ) => void;
    };
    tapsellPlus?: any;
    TAPSELL_APP_KEY?: string;
    TAPSELL_REWARDED_ZONE_ID?: string;
  }
}

export interface TapsellAdOptions {
  appKey?: string;
  zoneId?: string;
  onSuccessReward: () => void;
  onAdClosed?: () => void;
  onAdError?: (errorMsg: string) => void;
}

/**
 * Initializes Tapsell Web SDK with the given App Key.
 */
export function initTapsell(appKey?: string): boolean {
  const key = appKey || window.TAPSELL_APP_KEY || 'default_tapsell_app_key';
  
  if (typeof window !== 'undefined' && window.tapsell) {
    try {
      window.tapsell.init(key);
      console.log('✅ Tapsell SDK initialized successfully with key:', key);
      return true;
    } catch (error) {
      console.warn('⚠️ Tapsell SDK init error:', error);
      return false;
    }
  } else {
    console.warn('⚠️ Tapsell SDK script not loaded on window yet.');
    return false;
  }
}

/**
 * Requests and plays a Tapsell Rewarded Video Ad.
 * If Tapsell SDK is available and returns an ad, it presents the official video.
 * If SDK is unavailable or in offline/demo mode, it triggers custom callback support.
 */
export function requestAndShowRewardedAd(options: TapsellAdOptions): void {
  const zoneId = options.zoneId || window.TAPSELL_REWARDED_ZONE_ID || 'default_rewarded_zone';
  const appKey = options.appKey || window.TAPSELL_APP_KEY || 'default_tapsell_app_key';

  // Attempt standard Tapsell Web SDK call
  if (typeof window !== 'undefined' && window.tapsell) {
    try {
      window.tapsell.init(appKey);
      
      console.log(`🎬 Requesting Tapsell Rewarded Ad for Zone ID: ${zoneId}...`);
      
      window.tapsell.requestAd(
        { zoneId },
        (adId: string) => {
          console.log(`✨ Ad received (Ad ID: ${adId}). Displaying Rewarded Video...`);
          
          window.tapsell?.showAd({
            adId,
            onCompleted: () => {
              console.log('🎉 Ad completed successfully! Granting user reward...');
              options.onSuccessReward();
            },
            onClosed: () => {
              console.log('ℹ️ Ad window closed by user.');
              if (options.onAdClosed) options.onAdClosed();
            },
            onError: (err: any) => {
              console.error('❌ Error playing Tapsell Ad:', err);
              if (options.onAdError) {
                options.onAdError(typeof err === 'string' ? err : 'خطا در پخش تبلیغ ویدیویی تپسل');
              }
            }
          });
        },
        (error: any) => {
          console.warn('⚠️ Tapsell Ad Request returned error or no ad available:', error);
          if (options.onAdError) {
            options.onAdError('تبلیغی برای نمایش یافت نشد. لطفاً بعداً تلاش کنید.');
          }
        }
      );
      return;
    } catch (e) {
      console.warn('⚠️ Exception calling window.tapsell:', e);
    }
  }

  // If SDK call couldn't be fulfilled directly, return error callback
  if (options.onAdError) {
    options.onAdError('اسکریپت تپسل یافت نشد یا کلید تپسل تنظیم نشده است.');
  }
}
