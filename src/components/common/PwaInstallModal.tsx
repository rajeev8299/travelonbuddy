import React from 'react';
import { X, Download, Share, PlusSquare, Sparkles } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { useApp } from '../../context/AppContext';
import { getAssetUrl } from '../../utils/assetHelper';

export const PwaInstallModal: React.FC = () => {
  const { showPrompt, isIos, installApp, dismissPrompt } = usePwaInstall();
  const { language } = useApp();

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        className="w-[calc(100%-32px)] sm:w-[calc(100%-40px)] max-w-[440px] bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E8E6] shadow-2xl relative transition-all duration-300 transform translate-y-0"
      >
        {/* Dismiss Close Icon */}
        <button
          type="button"
          onClick={dismissPrompt}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Container */}
        <div className="flex flex-col items-center text-center space-y-3 pt-1">
          {/* Official TravelOnBuddy Logo (compact 68px) */}
          <div className="relative">
            <div className="w-[68px] h-[68px] rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] p-1.5 flex items-center justify-center shadow-xs">
              <img
                src={getAssetUrl('logo.png')}
                alt="TravelOnBuddy"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#FFF7ED] border border-[#FF5F1F]/30 text-[#FF5F1F] shadow-xs">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {/* Brand & Heading & Description */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5F1F]">
              TravelOnBuddy
            </span>
            <h2
              id="pwa-install-title"
              className="text-lg sm:text-xl font-sans font-bold text-[#1D1D1F] tracking-tight leading-snug"
            >
              {language === 'HI' ? 'TravelOnBuddy को अपने फोन में लाएं!' : 'Take TravelOnBuddy With You!'}
            </h2>
            <p className="text-xs text-[#6E6E73] font-light leading-relaxed max-w-sm pt-0.5">
              {language === 'HI'
                ? 'बेहतर यात्रा अनुभव और अपने स्थानीय साथी तक तुरंत पहुंच के लिए TravelOnBuddy ऐप इंस्टॉल करें।'
                : 'Install TravelOnBuddy for a smoother travel experience and quick access to your travel companion.'}
            </p>
          </div>

          {/* iOS Specific Safari Instructions Fallback */}
          {isIos ? (
            <div className="w-full p-3 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] text-left space-y-1.5 text-xs">
              <span className="font-bold text-[#1D1D1F] block text-center mb-0.5">
                {language === 'HI' ? 'iPhone पर इंस्टॉल करने का तरीका:' : 'To install on iOS Safari:'}
              </span>
              <div className="flex items-center gap-2 text-[#48484A]">
                <div className="p-1 rounded-md bg-white border border-[#E8E8E6] text-[#007AFF] shrink-0">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <span>1. {language === 'HI' ? 'सफारी में शेयर (Share) आइकन पर टैप करें।' : 'Tap the Share icon in Safari.'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#48484A]">
                <div className="p-1 rounded-md bg-white border border-[#E8E8E6] text-[#1D1D1F] shrink-0">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <span>2. {language === 'HI' ? 'सूची में "Add to Home Screen" चुनें।' : 'Select "Add to Home Screen".'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#48484A]">
                <span className="font-bold text-[#FF5F1F] shrink-0 px-1.5 py-0.5 rounded bg-white border border-[#E8E8E6] text-[10px]">Add</span>
                <span>3. {language === 'HI' ? 'ऊपर दाईं ओर "Add" पर टैप करें।' : 'Confirm by tapping "Add".'}</span>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="w-full space-y-1.5 pt-1.5">
            {!isIos && (
              <button
                type="button"
                onClick={installApp}
                className="w-full py-2.5 sm:py-3 px-5 rounded-full bg-[#FF5F1F] text-white text-xs sm:text-sm font-semibold hover:bg-[#EC5800] transition-all duration-200 shadow-[0_4px_14px_rgba(255,95,31,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'HI' ? 'TravelOnBuddy इंस्टॉल करें' : 'Install TravelOnBuddy'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={dismissPrompt}
              className="w-full py-2 px-5 rounded-full text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
            >
              {language === 'HI' ? 'बाद में (Maybe Later)' : 'Maybe Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
