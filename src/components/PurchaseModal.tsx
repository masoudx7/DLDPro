import React, { useState } from 'react';
import { X, CheckCircle2, Crown, Code, BookOpen, Terminal } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPurchase: () => void;
  usedCount: number;
  maxCount: number;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  onSuccessPurchase,
  usedCount,
  maxCount
}) => {
  const [selectedGateway, setSelectedGateway] = useState<'bazaar' | 'myket'>('myket');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  if (!isOpen) return null;

  const handlePayment = (gateway: 'bazaar' | 'myket') => {
    setSelectedGateway(gateway);
    setLoading(true);

    // Simulate Myket & Cafe Bazaar AIDL In-App Billing Service flow
    // Service Action: ir.myket.billing.InAppBillingService.BIND
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccessPurchase();
        setSuccess(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-100 text-base">خرید درون‌برنامه‌ای (مایکت و کافه بازار)</h2>
              <p className="text-xs text-neutral-500">ارتقای سهمیه یوتیوب DLD-Pro توسط گروه undo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {success ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-neutral-100">پرداخت و فعال‌سازی موفقیت‌آمیز!</h3>
              <p className="text-xs text-neutral-400">اشتراک نامحدود یوتیوب برای شما فعال شد. از موتور قدرتمند DLD-Pro لذت ببرید.</p>
            </div>
          ) : (
            <>
              {/* Quota Notice Banner */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">وضعیت سهمیه رایگان یوتیوب:</div>
                  <div className="text-sm font-bold text-neutral-200 font-mono mt-0.5">
                    {usedCount} از {maxCount} ویدیو مصرف شده (ماهانه)
                  </div>
                </div>
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-full">
                  تکمیل سهمیه رایگان
                </div>
              </div>

              {/* Documentation Toggle Button */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-900/60 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>راهنمای فنی مستندات پرداخت درون‌برنامه‌ای مایکت و بازار (IAB)</span>
                </div>
                <button
                  onClick={() => setShowDocs(!showDocs)}
                  className="text-xs font-bold text-blue-400 hover:underline px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  {showDocs ? 'بستن راهنما' : 'مشاهده مستندات فنی'}
                </button>
              </div>

              {/* Technical Documentation Panel (Matching Myket IAB docs) */}
              {showDocs && (
                <div className="p-4 rounded-2xl bg-[#090909] border border-neutral-800 space-y-3 text-xs text-neutral-300 animate-in fade-in" dir="rtl">
                  <div className="font-bold text-blue-400 flex items-center gap-2 pb-2 border-b border-neutral-800">
                    <Terminal className="w-4 h-4" />
                    <span>مستندات پیاده‌سازی In-App Billing مایکت و بازار</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    مطابق با مستندات رسمی مایکت (به آدرس <span className="font-mono text-blue-400" dir="ltr">myket.ir/kb/pages/iab-flutter/</span>) و کافه بازار، ارتباط با سرویس پرداخت از طریق AIDL و اتصال به سرویس امن صورت می‌گیرد:
                  </p>
                  <div className="space-y-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 font-mono text-[11px] text-left text-neutral-300" dir="ltr">
                    <div className="text-neutral-500">// Myket IAB Service Binding Intent</div>
                    <div>Intent serviceIntent = new Intent("ir.myket.billing.InAppBillingService.BIND");</div>
                    <div>serviceIntent.setPackage("ir.myket");</div>
                    <div className="mt-2 text-neutral-500">// Cafe Bazaar IAB Service Binding Intent</div>
                    <div>Intent bazaarIntent = new Intent("ir.cafebazaar.pardakht.InAppBillingService.BIND");</div>
                    <div>bazaarIntent.setPackage("com.farsitel.bazaar");</div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400 text-[11px]">
                    <li>متد <code className="text-blue-400">getBuyIntent</code> برای ایجاد درخواست خرید محصول اشتراکی (SKU: <code className="text-neutral-200">dld_pro_monthly</code>).</li>
                    <li>بررسی امضای دیجیتال و توکن خرید (<code className="text-neutral-200">purchaseToken</code>) جهت تایید صحت تراکنش در سمت سرور گروه undo.</li>
                    <li>مدیریت پایداری اتصال و هندل کردن خطاهای رایج (مانند نصب نبودن مارکت یا عدم به‌روزرسانی).</li>
                  </ul>
                </div>
              )}

              {/* Payment Gateways: Myket & Cafe Bazaar */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">انتخاب درگاه پرداخت درون‌برنامه‌ای:</div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Myket */}
                  <button
                    disabled={loading}
                    onClick={() => handlePayment('myket')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                      selectedGateway === 'myket'
                        ? 'bg-orange-600/10 border-orange-500 text-orange-300 shadow-lg shadow-orange-950/30'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-xs">
                        مایکت
                      </div>
                      <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                        ir.myket.billing
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-100">پرداخت با مایکت (Myket IAB)</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">۵۹,۰۰۰ تومان / اشتراک ماهانه</div>
                    </div>
                    {loading && selectedGateway === 'myket' && (
                      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-400 animate-pulse">اتصال به سرویس مایکت...</span>
                      </div>
                    )}
                  </button>

                  {/* Cafe Bazaar */}
                  <button
                    disabled={loading}
                    onClick={() => handlePayment('bazaar')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                      selectedGateway === 'bazaar'
                        ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-lg shadow-blue-950/30'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-500 font-bold flex items-center justify-center text-xs">
                        بازار
                      </div>
                      <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                        ir.cafebazaar
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-100">پرداخت با کافه بازار</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">۵۹,۰۰۰ تومان / اشتراک ماهانه</div>
                    </div>
                    {loading && selectedGateway === 'bazaar' && (
                      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-400 animate-pulse">اتصال به سرویس بازار...</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-[11px] text-neutral-500">
          <span>گروه توسعه‌دهنده undo • DLD-Pro v7.2</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

