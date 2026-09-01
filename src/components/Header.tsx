import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Languages,
  Bell,
  PhoneCall,
  User,
  ShoppingBasket,
  Building2,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Search,
  LogOut,
  LogIn,
  UserCheck,
} from 'lucide-react';
import { Language, UserRole, UserProfile, NotificationItem } from '../types';
import { storageService } from '../services/storageService';
import { getTranslation } from '../translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserProfile | null;
  onRoleChange: (role: UserRole) => void;
  onOpenIVR: () => void;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
  onOpenTraceabilityScan: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  currentUser,
  onRoleChange,
  onOpenIVR,
  onOpenAuth,
  onOpenArchitecture,
  onOpenTraceabilityScan,
  onOpenSearch,
  onLogout,
}) => {
  const t = getTranslation(currentLanguage);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    const updateNotifs = () => {
      setNotifications(storageService.getNotifications(currentUser?.id));
    };
    updateNotifs();
    return storageService.subscribe(updateNotifs);
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'FARMER':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'GROCERY':
        return <ShoppingBasket className="w-4 h-4 text-amber-600" />;
      case 'BULK':
        return <Building2 className="w-4 h-4 text-sky-600" />;
      case 'ADMIN':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'FARMER':
        return t.roleFarmer;
      case 'GROCERY':
        return t.roleGrocery;
      case 'BULK':
        return t.roleBulk;
      case 'ADMIN':
        return t.roleAdmin;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6E2D3] shadow-xs">
      {/* Top Banner with Vision Statement */}
      <div className="bg-[#4A6741] text-white px-3 py-1.5 text-center text-xs font-medium tracking-wide flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E9C46A] animate-pulse"></span>
          <span className="text-[#F2EFE6]">100% Direct Farm-to-Customer Connectivity</span>
        </div>
        <div className="w-full sm:w-auto text-center sm:text-left font-semibold text-white">
          🌾 “{t.tagline}”
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-[#F2EFE6]">
          <button
            onClick={onOpenIVR}
            className="hover:text-white flex items-center gap-1 font-mono transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#E9C46A]" /> Toll-Free: 1800-425-FARM
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#4A6741] flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#4A6741] tracking-tight flex items-center gap-1.5">
                  <span>FarmerConnect</span>
                </h1>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1] uppercase">
                  Inclusive Agro
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#827D6B] font-medium">
                {currentLanguage === 'ta'
                  ? 'விவசாயி - நுகர்வோர் நேரடி சந்தை'
                  : currentLanguage === 'hi'
                  ? 'सीधा किसान-ग्राहक कृषि बाजार'
                  : 'Direct Agricultural Marketplace'}
              </p>
            </div>
          </div>

          {/* Central Search Engine Trigger Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full pl-3.5 pr-3 py-2 bg-[#F2EFE6] hover:bg-[#EAE6DA] border border-[#E6E2D3] hover:border-[#4A6741]/50 rounded-2xl text-xs text-left text-[#827D6B] flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-[#4A6741] group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">
                  {currentLanguage === 'ta'
                    ? 'பயிர்கள், நெல், தக்காளி, QR பேட்ச் தேடவும்...'
                    : currentLanguage === 'hi'
                    ? 'फसलें, धान, टमाटर, मंडी भाव खोजें...'
                    : 'Search crops, grains, QR batches, cold rooms...'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <kbd className="px-1.5 py-0.5 bg-white rounded-md border border-[#E6E2D3] font-mono text-[10px] font-bold text-[#2D3129] shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Center/Right Nav Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-[#4A6741] bg-[#F2EFE6] hover:bg-[#E6F0E4] rounded-full transition-colors border border-[#E6E2D3]"
              title="Search Engine"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector Buttons */}
            <div className="inline-flex p-1 bg-[#F2EFE6] rounded-full border border-[#E6E2D3]">
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  currentLanguage === 'ta'
                    ? 'bg-white text-[#2D3129] shadow-xs'
                    : 'text-[#827D6B] hover:text-[#2D3129]'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-white text-[#2D3129] shadow-xs'
                    : 'text-[#827D6B] hover:text-[#2D3129]'
                }`}
                title="English"
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  currentLanguage === 'hi'
                    ? 'bg-white text-[#2D3129] shadow-xs'
                    : 'text-[#827D6B] hover:text-[#2D3129]'
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
            </div>

            {/* Toll Free IVR Simulation Quick Trigger */}
            <button
              onClick={onOpenIVR}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#F2EFE6] text-[#2D3129] border border-[#E6E2D3] hover:bg-[#EAE6DA] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
              <span>{currentLanguage === 'ta' ? 'IVR போன்' : currentLanguage === 'hi' ? 'IVR फोन' : 'IVR Voice Demo'}</span>
            </button>

            {/* Traceability Scan */}
            <button
              onClick={onOpenTraceabilityScan}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#F2EFE6] text-[#2D3129] border border-[#E6E2D3] hover:bg-[#EAE6DA] transition-colors"
            >
              <span>🔍 {currentLanguage === 'ta' ? 'QR ஆய்வு' : currentLanguage === 'hi' ? 'QR स्कैन' : 'Scan QR'}</span>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6] rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D97757] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-[#E6E2D3] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D3] mb-2">
                    <span className="text-xs font-bold text-[#2D3129]">
                      {currentLanguage === 'ta' ? 'அறிவிப்புகள்' : currentLanguage === 'hi' ? 'अधिसूचनाएं' : 'Notifications'} ({notifications.length})
                    </span>
                    <button
                      onClick={() => {
                        notifications.forEach((n) => storageService.markNotificationAsRead(n.id));
                        setShowNotifDropdown(false);
                      }}
                      className="text-[11px] text-[#4A6741] hover:underline font-semibold"
                    >
                      {currentLanguage === 'ta' ? 'அனைத்தும் படித்ததாக குறிக்க' : currentLanguage === 'hi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark all read'}
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F2EFE6]">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#827D6B] py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => storageService.markNotificationAsRead(notif.id)}
                          className={`py-2.5 px-2 rounded-xl cursor-pointer transition-colors ${
                            !notif.read ? 'bg-[#F2EFE6] text-[#2D3129] font-medium' : 'text-[#827D6B] hover:bg-[#FDFCF8]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-xs font-bold text-[#2D3129]">{notif.title}</span>
                            <span className="text-[10px] text-[#827D6B] whitespace-nowrap">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#827D6B] mt-0.5 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Role Switcher / Logout Controls */}
            {currentUser ? (
              <div className="flex items-center gap-1">
                {/* User & Role Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 bg-[#D97757] text-white rounded-full hover:bg-[#BF5E3E] transition-colors shadow-xs"
                    title={`Logged in as ${currentUser.name} (${getRoleLabel(currentUser.role)})`}
                  >
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-medium truncate max-w-[130px]">
                        {currentUser.name}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full hidden md:inline">
                      {getRoleLabel(currentUser.role)}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                  </button>

                  {showRoleDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-[#E6E2D3] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Active Profile Info Header */}
                      <div className="p-3 bg-[#F2EFE6] rounded-2xl mb-3 border border-[#E6E2D3]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-[#2D3129] flex items-center gap-1.5">
                              <span>{currentUser.name}</span>
                              <CheckCircle className="w-3.5 h-3.5 text-[#4A6741]" />
                            </div>
                            <div className="text-[11px] text-[#827D6B] font-mono mt-0.5">
                              +91 {currentUser.phone}
                            </div>
                            <div className="text-[10px] text-[#827D6B] mt-0.5">
                              📍 {currentUser.location || 'Coimbatore, Tamil Nadu'}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-white rounded-full text-[10px] font-bold text-[#4A6741] border border-[#E6E2D3] shrink-0">
                            {getRoleLabel(currentUser.role)}
                          </span>
                        </div>
                      </div>

                      {/* Demo Persona Switcher */}
                      <div className="px-1 py-1 mb-1.5">
                        <span className="text-[11px] font-bold text-[#827D6B] uppercase tracking-wider">
                          {t.whoAreYou} (Switch Persona)
                        </span>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            onRoleChange('FARMER');
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2.5 transition-colors ${
                            currentUser?.role === 'FARMER' ? 'bg-[#4A6741] text-white font-medium' : 'hover:bg-[#F2EFE6] text-[#2D3129]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentUser?.role === 'FARMER' ? 'bg-white/20 text-white' : 'bg-[#E6F0E4] text-[#4A6741]'}`}>
                            <Sprout className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{t.roleFarmer}</div>
                            <div className={`text-[10px] ${currentUser?.role === 'FARMER' ? 'text-white/80' : 'text-[#827D6B]'}`}>Muthusamy Gounder (Farmer)</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            onRoleChange('GROCERY');
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2.5 transition-colors ${
                            currentUser?.role === 'GROCERY' ? 'bg-[#D97757] text-white font-medium' : 'hover:bg-[#F2EFE6] text-[#2D3129]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentUser?.role === 'GROCERY' ? 'bg-white/20 text-white' : 'bg-[#FDF2ED] text-[#D97757]'}`}>
                            <ShoppingBasket className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{t.roleGrocery}</div>
                            <div className={`text-[10px] ${currentUser?.role === 'GROCERY' ? 'text-white/80' : 'text-[#827D6B]'}`}>Kavitha (Grocery Consumer)</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            onRoleChange('BULK');
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2.5 transition-colors ${
                            currentUser?.role === 'BULK' ? 'bg-[#4A6741] text-white font-medium' : 'hover:bg-[#F2EFE6] text-[#2D3129]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentUser?.role === 'BULK' ? 'bg-white/20 text-white' : 'bg-[#F2EFE6] text-[#4A6741]'}`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{t.roleBulk}</div>
                            <div className={`text-[10px] ${currentUser?.role === 'BULK' ? 'text-white/80' : 'text-[#827D6B]'}`}>Annapoorna Hotel (Bulk Buyer)</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            onRoleChange('ADMIN');
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2.5 transition-colors ${
                            currentUser?.role === 'ADMIN' ? 'bg-[#2D3129] text-white font-medium' : 'hover:bg-[#F2EFE6] text-[#2D3129]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentUser?.role === 'ADMIN' ? 'bg-white/20 text-white' : 'bg-[#F2EFE6] text-[#2D3129]'}`}>
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{t.roleAdmin}</div>
                            <div className={`text-[10px] ${currentUser?.role === 'ADMIN' ? 'text-white/80' : 'text-[#827D6B]'}`}>FPO Operations Lead</div>
                          </div>
                        </button>
                      </div>

                      {/* Log Out and Other Actions */}
                      <div className="mt-3 pt-2.5 border-t border-[#E6E2D3] space-y-1.5">
                        <button
                          onClick={() => {
                            setShowRoleDropdown(false);
                            onLogout();
                          }}
                          className="w-full text-left p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold text-[#D97757] hover:bg-[#FDF2ED] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-[#D97757]" />
                            <span>{t.logoutAction || 'Log Out'}</span>
                          </div>
                          <span className="text-[10px] text-[#827D6B] font-normal">
                            {currentLanguage === 'ta' ? 'வெளியேறு' : currentLanguage === 'hi' ? 'लॉग आउट' : 'Sign out'}
                          </span>
                        </button>

                        <div className="flex items-center justify-between pt-1 px-1 text-xs">
                          <button
                            onClick={() => {
                              setShowRoleDropdown(false);
                              onOpenAuth();
                            }}
                            className="text-[#4A6741] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <User className="w-3.5 h-3.5" /> {t.loginTitle}
                          </button>
                          <button
                            onClick={() => {
                              storageService.resetToDefaults();
                              setShowRoleDropdown(false);
                            }}
                            className="text-[#827D6B] font-medium hover:text-[#2D3129] flex items-center gap-1 text-[11px]"
                            title="Reset initial dataset"
                          >
                            <RotateCcw className="w-3 h-3" /> Reset Demo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct 1-Click Logout Quick Action Button */}
                <button
                  onClick={onLogout}
                  className="p-2 text-[#827D6B] hover:text-[#D97757] hover:bg-[#FDF2ED] rounded-full transition-colors border border-[#E6E2D3]"
                  title={`${t.logoutAction || 'Log Out'} (${currentUser.name})`}
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* When Logged Out: Direct Sign In Button */
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#4A6741] hover:bg-[#3D5635] text-white rounded-full font-bold text-xs shadow-xs transition-transform hover:scale-105"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.loginTitle}</span>
              </button>
            )}

            {/* Architecture Guide Modal Button */}
            <button
              onClick={onOpenArchitecture}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F2EFE6] text-[#2D3129] border border-[#E6E2D3] hover:bg-[#EAE6DA] transition-colors"
              title="System Architecture, Database Schema, Real OTP & IVR setup"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#827D6B]" />
              <span>Docs</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
