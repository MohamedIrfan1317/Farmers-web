import React from 'react';
import {
  Sprout,
  ShoppingBasket,
  Building2,
  ShieldCheck,
  LogIn,
  PhoneCall,
  QrCode,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { Language, UserRole } from '../../types';
import { getTranslation } from '../../translations';

interface LoggedOutViewProps {
  language: Language;
  onOpenAuth: () => void;
  onSelectRole: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenTraceability: (batchId: string) => void;
  onOpenIVR: () => void;
}

export const LoggedOutView: React.FC<LoggedOutViewProps> = ({
  language,
  onOpenAuth,
  onSelectRole,
  onOpenSearch,
  onOpenTraceability,
  onOpenIVR,
}) => {
  const t = getTranslation(language);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4 space-y-8 animate-in fade-in duration-200">
      {/* Top Hero Card */}
      <div className="bg-[#4A6741] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#3D5635] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-semibold text-[#E6F0E4]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2EFE6]" />
            <span>
              {language === 'ta'
                ? 'நேரடி விவசாயம் & கொள்முதல் தளம்'
                : language === 'hi'
                ? 'प्रत्यक्ष कृषि एवं खरीद मंच'
                : 'Direct Farm-to-Consumer & Bulk Procurement'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
            {t.loggedOutTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#E6F0E4] leading-relaxed">
            {t.loggedOutSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-white text-[#2D3129] font-bold rounded-2xl hover:bg-[#F2EFE6] transition-all shadow-md flex items-center gap-2 text-sm group"
            >
              <LogIn className="w-4 h-4 text-[#4A6741] group-hover:scale-110 transition-transform" />
              <span>{t.loginTitle}</span>
              <ArrowRight className="w-4 h-4 text-[#827D6B]" />
            </button>

            <button
              onClick={onOpenSearch}
              className="px-5 py-3 bg-[#3D5635] hover:bg-[#2D4028] text-white font-semibold rounded-2xl transition-all border border-white/20 flex items-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>
                {language === 'ta'
                  ? 'விளைபொருட்களை தேடவும்'
                  : language === 'hi'
                  ? 'फसलें खोजें'
                  : 'Search All Crops'}
              </span>
            </button>
          </div>
        </div>

        {/* Decorative Background Accents */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Sprout className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2D3129]">
              {language === 'ta'
                ? 'ஒரு மாதிரி பயனராக உடனடியாக நுழையுங்கள்'
                : language === 'hi'
                ? 'तुरंत डेमो भूमिका चुनें'
                : 'Or Instant 1-Click Demo Persona Sign In'}
            </h2>
            <p className="text-xs text-[#827D6B]">
              {language === 'ta'
                ? 'எந்த போர்ட்டலையும் உடனடியாக சோதிக்க கீழே உள்ள அட்டையை தேர்வு செய்யவும்'
                : language === 'hi'
                ? 'किसी भी पोर्टल का परीक्षण करने के लिए नीचे कार्ड चुनें'
                : 'Click any role below to explore its specialized features, views, and workflows.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Farmer Card */}
          <div
            onClick={() => onSelectRole('FARMER')}
            className="p-5 bg-white rounded-3xl border border-[#E6E2D3] hover:border-[#4A6741] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-bold text-[#2D3129] text-base">{t.roleFarmer}</h3>
                <span className="text-[10px] font-bold text-[#4A6741] bg-[#E6F0E4] px-2 py-0.5 rounded-full">
                  Seller
                </span>
              </div>
              <p className="text-xs text-[#827D6B] mt-2 line-clamp-3 leading-relaxed">
                {t.roleFarmerDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-[#F2EFE6] mt-4 flex items-center justify-between text-xs font-bold text-[#4A6741]">
              <span>Muthusamy Gounder</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Grocery Shopper Card */}
          <div
            onClick={() => onSelectRole('GROCERY')}
            className="p-5 bg-white rounded-3xl border border-[#E6E2D3] hover:border-[#D97757] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2ED] text-[#D97757] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <ShoppingBasket className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-bold text-[#2D3129] text-base">{t.roleGrocery}</h3>
                <span className="text-[10px] font-bold text-[#D97757] bg-[#FDF2ED] px-2 py-0.5 rounded-full">
                  Direct
                </span>
              </div>
              <p className="text-xs text-[#827D6B] mt-2 line-clamp-3 leading-relaxed">
                {t.roleGroceryDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-[#F2EFE6] mt-4 flex items-center justify-between text-xs font-bold text-[#D97757]">
              <span>Kavitha Senthil</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bulk Buyer Card */}
          <div
            onClick={() => onSelectRole('BULK')}
            className="p-5 bg-white rounded-3xl border border-[#E6E2D3] hover:border-[#4A6741] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F2EFE6] text-[#4A6741] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-bold text-[#2D3129] text-base">{t.roleBulk}</h3>
                <span className="text-[10px] font-bold text-[#4A6741] bg-[#F2EFE6] px-2 py-0.5 rounded-full">
                  Wholesale
                </span>
              </div>
              <p className="text-xs text-[#827D6B] mt-2 line-clamp-3 leading-relaxed">
                {t.roleBulkDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-[#F2EFE6] mt-4 flex items-center justify-between text-xs font-bold text-[#4A6741]">
              <span>Annapoorna Hotel</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin / FPO Card */}
          <div
            onClick={() => onSelectRole('ADMIN')}
            className="p-5 bg-white rounded-3xl border border-[#E6E2D3] hover:border-[#2D3129] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F2EFE6] text-[#2D3129] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-bold text-[#2D3129] text-base">{t.roleAdmin}</h3>
                <span className="text-[10px] font-bold text-[#2D3129] bg-[#F2EFE6] px-2 py-0.5 rounded-full">
                  Desk
                </span>
              </div>
              <p className="text-xs text-[#827D6B] mt-2 line-clamp-3 leading-relaxed">
                {t.roleAdminDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-[#F2EFE6] mt-4 flex items-center justify-between text-xs font-bold text-[#2D3129]">
              <span>FPO Operations Lead</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Features Quick Strip */}
      <div className="bg-[#F2EFE6] rounded-3xl p-5 border border-[#E6E2D3] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#4A6741] flex items-center justify-center border border-[#E6E2D3]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2D3129]">
              {language === 'ta'
                ? 'QR குறியீட்டுடன் விவசாய தடம் அறிக'
                : language === 'hi'
                ? 'क्यूआर कोड से फार्म ट्रेसिबिलिटी जांचें'
                : 'Inspect Batch Traceability & Cold Chain'}
            </h4>
            <p className="text-[11px] text-[#827D6B]">
              {language === 'ta'
                ? 'அறுவடை தேதி, சூரிய குளிர் அறை நிலை மற்றும் விவசாயி விவரங்கள்'
                : language === 'hi'
                ? 'कटाई की तारीख, सौर कोल्ड रूम तापमान और किसान विवरण'
                : 'Audit harvest dates, solar temperature logs, and farmer KYC.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTraceability('BATCH_COIMB_01')}
            className="px-4 py-2 bg-white hover:bg-[#FDFCF8] text-[#2D3129] border border-[#E6E2D3] rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'ta' ? 'மாதிரி QR ஆய்வு' : language === 'hi' ? 'डेमो QR जांच' : 'Test QR Scan'}
          </button>
          <button
            onClick={onOpenIVR}
            className="px-4 py-2 bg-[#D97757] hover:bg-[#BF5E3E] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'IVR டெமோ' : language === 'hi' ? 'IVR डेमो' : 'IVR Voice'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
