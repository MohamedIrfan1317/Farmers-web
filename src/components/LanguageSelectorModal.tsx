import React from 'react';
import { Languages, Check, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onSelectLanguage: (lang: Language) => void;
  currentLanguage: Language;
  onClose?: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onSelectLanguage,
  currentLanguage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6E2D3] text-center relative overflow-hidden">
        {/* Decorative background aura */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E6F0E4] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FDF0EC] rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-[#4A6741] text-white mx-auto flex items-center justify-center mb-4 shadow-md">
          <Languages className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3129] tracking-tight">
          Choose your preferred language
        </h2>
        <p className="text-sm sm:text-base text-[#827D6B] mt-2 max-w-sm mx-auto">
          உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும் / अपनी भाषा चुनें
        </p>

        <div className="grid grid-cols-1 gap-3.5 mt-8">
          {/* Tamil Button */}
          <button
            onClick={() => onSelectLanguage('ta')}
            className={`group relative p-4 rounded-3xl border text-left transition-all flex items-center justify-between ${
              currentLanguage === 'ta'
                ? 'border-[#4A6741] bg-[#E6F0E4] shadow-xs ring-2 ring-[#4A6741]/20'
                : 'border-[#E6E2D3] hover:border-[#4A6741] hover:bg-[#FDFCF8]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🌾</span>
              <div>
                <div className="text-lg font-bold text-[#2D3129]">தமிழ் (Tamil)</div>
                <div className="text-xs text-[#827D6B]">விவசாயிகள் & வாடிக்கையாளர்கள்</div>
              </div>
            </div>
            {currentLanguage === 'ta' ? (
              <span className="w-7 h-7 rounded-full bg-[#4A6741] text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#4A6741] group-hover:underline">தேர்வு செய்</span>
            )}
          </button>

          {/* English Button */}
          <button
            onClick={() => onSelectLanguage('en')}
            className={`group relative p-4 rounded-3xl border text-left transition-all flex items-center justify-between ${
              currentLanguage === 'en'
                ? 'border-[#4A6741] bg-[#E6F0E4] shadow-xs ring-2 ring-[#4A6741]/20'
                : 'border-[#E6E2D3] hover:border-[#4A6741] hover:bg-[#FDFCF8]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🌱</span>
              <div>
                <div className="text-lg font-bold text-[#2D3129]">English</div>
                <div className="text-xs text-[#827D6B]">Direct Farmer-to-Customer Marketplace</div>
              </div>
            </div>
            {currentLanguage === 'en' ? (
              <span className="w-7 h-7 rounded-full bg-[#4A6741] text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#4A6741] group-hover:underline">Select</span>
            )}
          </button>

          {/* Hindi Button */}
          <button
            onClick={() => onSelectLanguage('hi')}
            className={`group relative p-4 rounded-3xl border text-left transition-all flex items-center justify-between ${
              currentLanguage === 'hi'
                ? 'border-[#4A6741] bg-[#E6F0E4] shadow-xs ring-2 ring-[#4A6741]/20'
                : 'border-[#E6E2D3] hover:border-[#4A6741] hover:bg-[#FDFCF8]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🚜</span>
              <div>
                <div className="text-lg font-bold text-[#2D3129]">हिन्दी (Hindi)</div>
                <div className="text-xs text-[#827D6B]">किसान और ग्राहक मंच</div>
              </div>
            </div>
            {currentLanguage === 'hi' ? (
              <span className="w-7 h-7 rounded-full bg-[#4A6741] text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#4A6741] group-hover:underline">चुनें</span>
            )}
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 text-xs text-[#827D6B] font-semibold hover:text-[#2D3129]"
          >
            Continue with current selection
          </button>
        )}
      </div>
    </div>
  );
};
