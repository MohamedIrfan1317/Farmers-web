import React, { useState } from 'react';
import {
  Phone,
  KeyRound,
  Sprout,
  ShoppingBasket,
  Building2,
  X,
  ArrowRight,
  CheckCircle,
  Building,
  MapPin,
  Package,
} from 'lucide-react';
import { Language, UserRole, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { getTranslation } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccess,
}) => {
  const t = getTranslation(language);
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'ROLE_SELECT' | 'BULK_DETAILS'>('PHONE');
  const [phone, setPhone] = useState('9842156789');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');

  // Bulk Buyer Profile fields
  const [businessName, setBusinessName] = useState('Annapoorna Hospitality Group');
  const [businessType, setBusinessType] = useState<'Hotel' | 'Restaurant' | 'Retailer' | 'Food Processor' | 'Commercial Buyer'>('Restaurant');
  const [location, setLocation] = useState('Gandhipuram, Coimbatore');
  const [requiredProducts, setRequiredProducts] = useState('Tomato, Onion, Rice, Cabbage');
  const [requiredVolume, setRequiredVolume] = useState('500 kg / week');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456' || otp === '1234' || otp.length === 6) {
      setStep('ROLE_SELECT');
      setOtpError('');
    } else {
      setOtpError('Invalid OTP. Please enter 123456 for demo verification.');
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'BULK') {
      setStep('BULK_DETAILS');
    } else {
      finishLogin(role);
    }
  };

  const finishLogin = (role: UserRole) => {
    const matched = storageService.getAllUsers().find((u) => u.role === role);
    let finalUser: UserProfile;

    if (matched) {
      finalUser = { ...matched, phone: phone || matched.phone, language };
    } else if (role === 'BULK') {
      finalUser = {
        id: `bulk_${Date.now()}`,
        phone,
        name: 'Procurement Manager',
        businessName,
        businessType,
        location,
        role: 'BULK',
        language,
        requiredProducts: requiredProducts.split(',').map((s) => s.trim()),
        requiredMonthlyVolume: requiredVolume,
        isApproved: true,
      };
    } else {
      finalUser = {
        id: `user_${role.toLowerCase()}_${Date.now()}`,
        phone,
        name: role === 'FARMER' ? 'Muthusamy Gounder' : 'Kavitha Senthil',
        role,
        language,
        location: 'Coimbatore, Tamil Nadu',
      };
    }

    storageService.setCurrentUser(finalUser);
    onSuccess(finalUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6E2D3] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#827D6B] hover:text-[#2D3129] hover:bg-[#FDFCF8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Phone Entry */}
        {step === 'PHONE' && (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center mb-4">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2D3129]">{t.loginTitle}</h3>
            <p className="text-xs sm:text-sm text-[#827D6B] mt-1">{t.loginSubtitle}</p>

            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D3129] uppercase tracking-wider mb-1.5">
                  {t.mobileNumber}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-[#827D6B] font-semibold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98421 56789"
                    className="w-full pl-14 pr-4 py-3 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-[#2D3129] font-mono font-medium focus:ring-2 focus:ring-[#4A6741] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4A6741] hover:bg-[#3D5635] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t.sendOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E6E2D3] text-center">
              <span className="text-xs text-[#827D6B] font-medium">Quick Demo Profiles:</span>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                <button
                  onClick={() => {
                    setPhone('9842156789');
                    handleSelectRole('FARMER');
                  }}
                  className="px-2.5 py-1 text-xs bg-[#E6F0E4] text-[#4A6741] font-semibold rounded-lg hover:bg-[#d8e6d5]"
                >
                  🌾 Farmer
                </button>
                <button
                  onClick={() => {
                    setPhone('9443322110');
                    handleSelectRole('GROCERY');
                  }}
                  className="px-2.5 py-1 text-xs bg-[#FDF0EC] text-[#D97757] font-semibold rounded-lg hover:bg-[#fae4dd]"
                >
                  🛒 Grocery Buyer
                </button>
                <button
                  onClick={() => {
                    setPhone('9894455667');
                    handleSelectRole('BULK');
                  }}
                  className="px-2.5 py-1 text-xs bg-[#F5F2E9] text-[#2D3129] font-semibold rounded-lg hover:bg-[#ece7d8]"
                >
                  🏢 Bulk Buyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'OTP' && (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#FDF0EC] text-[#D97757] flex items-center justify-center mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2D3129]">{t.enterOtp}</h3>
            <p className="text-xs sm:text-sm text-[#827D6B] mt-1">
              Sent to +91 {phone}. <span className="text-[#4A6741] font-medium">Use demo code 123456</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-center text-[#2D3129] font-mono text-2xl tracking-[0.4em] font-bold focus:ring-2 focus:ring-[#4A6741] focus:outline-none"
                  autoFocus
                />
                {otpError && <p className="text-xs text-[#D97757] mt-1.5 font-medium">{otpError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="px-3 py-2 text-xs font-semibold bg-[#F5F2E9] text-[#2D3129] rounded-lg hover:bg-[#E6E2D3]"
                >
                  ⚡ Auto-fill 123456
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4A6741] hover:bg-[#3D5635] text-white font-bold rounded-2xl shadow-md transition-all"
              >
                {t.verifyOtp}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Who are you? Role Selection */}
        {step === 'ROLE_SELECT' && (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2D3129] text-center">{t.whoAreYou}</h3>
            <p className="text-xs sm:text-sm text-[#827D6B] text-center mt-1">
              {t.selectRolePrompt}
            </p>

            <div className="grid grid-cols-1 gap-3.5 mt-6">
              {/* Farmer Option */}
              <button
                onClick={() => handleSelectRole('FARMER')}
                className="p-4 rounded-3xl border border-[#E6E2D3] hover:border-[#4A6741] hover:bg-[#E6F0E4]/40 transition-all text-left flex items-start gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#4A6741] text-white flex items-center justify-center shrink-0">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-[#2D3129] group-hover:text-[#4A6741]">
                    {t.roleFarmer}
                  </div>
                  <p className="text-xs text-[#827D6B] mt-0.5 leading-relaxed">{t.roleFarmerDesc}</p>
                </div>
              </button>

              {/* Grocery Option */}
              <button
                onClick={() => handleSelectRole('GROCERY')}
                className="p-4 rounded-3xl border border-[#E6E2D3] hover:border-[#D97757] hover:bg-[#FDF0EC]/40 transition-all text-left flex items-start gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D97757] text-white flex items-center justify-center shrink-0">
                  <ShoppingBasket className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-[#2D3129] group-hover:text-[#D97757]">
                    {t.roleGrocery}
                  </div>
                  <p className="text-xs text-[#827D6B] mt-0.5 leading-relaxed">{t.roleGroceryDesc}</p>
                </div>
              </button>

              {/* Bulk Option */}
              <button
                onClick={() => handleSelectRole('BULK')}
                className="p-4 rounded-3xl border border-[#E6E2D3] hover:border-[#4A6741] hover:bg-[#F5F2E9] transition-all text-left flex items-start gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2D3129] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-[#2D3129] group-hover:text-[#4A6741]">
                    {t.roleBulk}
                  </div>
                  <p className="text-xs text-[#827D6B] mt-0.5 leading-relaxed">{t.roleBulkDesc}</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Bulk Buyer Business Details */}
        {step === 'BULK_DETAILS' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F5F2E9] text-[#2D3129] flex items-center justify-center mb-3">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2D3129]">
              {language === 'ta' ? 'மொத்த வணிக வாங்குபவர் விவரம்' : language === 'hi' ? 'थोक खरीदार व्यापार विवरण' : 'Bulk Buyer Business Profile'}
            </h3>
            <p className="text-xs text-[#827D6B] mt-1">
              Required for commercial procurement and farm direct invoicing
            </p>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-sm"
                  placeholder="e.g. Annapoorna Hospitality"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-sm"
                >
                  <option value="Restaurant">Restaurant & Catering</option>
                  <option value="Hotel">Hotel & Hospitality</option>
                  <option value="Retailer">Supermarket / Retail Chain</option>
                  <option value="Food Processor">Food Processing Unit / Factory</option>
                  <option value="Commercial Buyer">Commercial Aggregator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-sm"
                  placeholder="e.g. Gandhipuram, Coimbatore"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Required Produce</label>
                <input
                  type="text"
                  value={requiredProducts}
                  onChange={(e) => setRequiredProducts(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-sm"
                  placeholder="e.g. Tomato, Onion, Rice"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Estimated Monthly Volume</label>
                <input
                  type="text"
                  value={requiredVolume}
                  onChange={(e) => setRequiredVolume(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-sm"
                  placeholder="e.g. 5-10 Metric Tons"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setStep('ROLE_SELECT')}
                className="px-4 py-2.5 text-xs font-semibold text-[#827D6B] bg-[#F5F2E9] rounded-2xl hover:bg-[#E6E2D3]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => finishLogin('BULK')}
                className="flex-1 py-2.5 bg-[#4A6741] hover:bg-[#3D5635] text-white font-bold text-xs rounded-2xl shadow-md"
              >
                Complete Registration & Enter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
