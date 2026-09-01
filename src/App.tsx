import React, { useState, useEffect } from 'react';
import { Language, UserRole, UserProfile, ProductListing, Order, UnsoldStockAlert, BulkRFQ, ColdRoom } from './types';
import { storageService } from './services/storageService';
import { getTranslation } from './translations';
import { Header } from './components/Header';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { AuthModal } from './components/AuthModal';
import { FarmerDashboard } from './components/FarmerDashboard/FarmerDashboard';
import { GroceryMarketplace } from './components/GroceryMarketplace/GroceryMarketplace';
import { BulkMarketplace } from './components/BulkMarketplace/BulkMarketplace';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { IVRSimulatorModal } from './components/IVR/IVRSimulatorModal';
import { TraceabilityModal } from './components/Traceability/TraceabilityModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SearchEngineModal } from './components/Search/SearchEngineModal';
import { LoggedOutView } from './components/Auth/LoggedOutView';
import { PhoneCall, QrCode, Sparkles, Sprout, ShoppingBasket, Building2, ShieldCheck, Heart, Search, LogOut, LogIn } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>(storageService.getLanguage());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(storageService.getCurrentUser());
  const [products, setProducts] = useState<ProductListing[]>(storageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());
  const [stockAlerts, setStockAlerts] = useState<UnsoldStockAlert[]>(storageService.getStockAlerts());
  const [rfqs, setRfqs] = useState<BulkRFQ[]>(storageService.getRFQs());
  const [coldRooms, setColdRooms] = useState<ColdRoom[]>(storageService.getColdRooms());
  const [users, setUsers] = useState<UserProfile[]>(storageService.getAllUsers());

  // Modal visibility states
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isIVRModalOpen, setIsIVRModalOpen] = useState(false);
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState(false);
  const [traceBatchId, setTraceBatchId] = useState<string>('BATCH_COIMB_01');
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  // Global Keyboard Shortcut (⌘K, Ctrl+K, or /) to trigger Search Engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subscribe to storage service updates
  useEffect(() => {
    const updateState = () => {
      setLanguage(storageService.getLanguage());
      setCurrentUser(storageService.getCurrentUser());
      setProducts(storageService.getProducts());
      setOrders(storageService.getOrders());
      setStockAlerts(storageService.getStockAlerts());
      setRfqs(storageService.getRFQs());
      setColdRooms(storageService.getColdRooms());
      setUsers(storageService.getAllUsers());
    };

    updateState();
    return storageService.subscribe(updateState);
  }, []);

  const t = getTranslation(language);

  const handleLanguageChange = (newLang: Language) => {
    storageService.setLanguage(newLang);
    setLanguage(newLang);
  };

  const handleRoleChange = (newRole: UserRole) => {
    storageService.switchUserByRole(newRole);
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
  };

  const handleOpenTraceability = (batchId: string) => {
    setTraceBatchId(batchId);
    setIsTraceabilityOpen(true);
  };

  const handleOpenSearchWithQuery = (query: string = '') => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D3129] flex flex-col font-sans selection:bg-[#E6F0E4]">
      {/* Universal Header */}
      <Header
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenIVR={() => setIsIVRModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenTraceabilityScan={() => handleOpenTraceability('BATCH_COIMB_01')}
        onOpenSearch={() => handleOpenSearchWithQuery('')}
        onLogout={handleLogout}
      />

      {/* Main Role-Based Screen View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser && (
          <LoggedOutView
            language={language}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSelectRole={(role) => handleRoleChange(role)}
            onOpenSearch={() => handleOpenSearchWithQuery('')}
            onOpenTraceability={handleOpenTraceability}
            onOpenIVR={() => setIsIVRModalOpen(true)}
          />
        )}

        {currentUser?.role === 'FARMER' && (
          <FarmerDashboard
            language={language}
            currentUser={currentUser}
            products={products}
            orders={orders}
            stockAlerts={stockAlerts}
            onOpenIVR={() => setIsIVRModalOpen(true)}
            onOpenTraceability={handleOpenTraceability}
          />
        )}

        {currentUser?.role === 'GROCERY' && (
          <GroceryMarketplace
            language={language}
            currentUser={currentUser}
            products={products}
            orders={orders}
            onOpenTraceability={handleOpenTraceability}
          />
        )}

        {currentUser?.role === 'BULK' && (
          <BulkMarketplace
            language={language}
            currentUser={currentUser}
            products={products}
            rfqs={rfqs}
            onOpenTraceability={handleOpenTraceability}
          />
        )}

        {currentUser?.role === 'ADMIN' && (
          <AdminDashboard
            language={language}
            products={products}
            orders={orders}
            users={users}
            coldRooms={coldRooms}
          />
        )}
      </main>

      {/* Persistent Bottom Quick-Switch Floating Bar */}
      <div className="sticky bottom-4 z-30 max-w-lg mx-auto px-4 w-full">
        <div className="bg-white/95 backdrop-blur-md text-[#2D3129] p-1.5 rounded-full shadow-lg border border-[#E6E2D3] flex items-center justify-between gap-1 text-xs">
          <span className="text-[10px] font-bold text-[#827D6B] pl-3 uppercase tracking-wider hidden sm:inline">
            Role:
          </span>

          <div className="flex items-center gap-1 flex-1 justify-around">
            <button
              onClick={() => handleRoleChange('FARMER')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                currentUser?.role === 'FARMER'
                  ? 'bg-[#4A6741] text-white shadow-xs'
                  : 'text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6]'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{t.roleFarmer}</span>
            </button>

            <button
              onClick={() => handleRoleChange('GROCERY')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                currentUser?.role === 'GROCERY'
                  ? 'bg-[#D97757] text-white shadow-xs'
                  : 'text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6]'
              }`}
            >
              <ShoppingBasket className="w-3.5 h-3.5" />
              <span>{t.roleGrocery}</span>
            </button>

            <button
              onClick={() => handleRoleChange('BULK')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                currentUser?.role === 'BULK'
                  ? 'bg-[#4A6741] text-white shadow-xs'
                  : 'text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.roleBulk}</span>
            </button>

            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                currentUser?.role === 'ADMIN'
                  ? 'bg-[#2D3129] text-white shadow-xs'
                  : 'text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenSearchWithQuery('')}
            className="p-2 bg-[#4A6741] hover:bg-[#3D5635] text-white rounded-full font-bold shadow-xs transition-transform hover:scale-105 ml-1"
            title="Open Agricultural Search Engine (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="p-2 text-[#827D6B] hover:text-[#D97757] hover:bg-[#FDF2ED] rounded-full transition-colors border border-[#E6E2D3]"
              title={`${t.logoutAction || 'Log Out'} (${currentUser.name})`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 bg-[#4A6741] hover:bg-[#3D5635] text-white rounded-full font-bold shadow-xs transition-transform hover:scale-105"
              title="Sign In"
            >
              <LogIn className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsIVRModalOpen(true)}
            className="p-2 bg-[#D97757] hover:bg-[#BF5E3E] text-white rounded-full font-bold shadow-xs transition-transform hover:scale-105"
            title="Toll-Free Voice IVR Simulation"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F2EFE6] text-[#827D6B] py-8 px-4 border-t border-[#E6E2D3] text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#2D3129] font-bold text-sm">
              <Sprout className="w-4 h-4 text-[#4A6741]" />
              <span>FarmerConnect – Direct Agricultural Marketplace</span>
            </div>
            <p className="mt-1 text-[#827D6B]">
              “{t.tagline}”
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => handleOpenSearchWithQuery('')}
              className="text-[#2D3129] hover:text-[#4A6741] font-medium underline flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-[#4A6741]" />
              <span>Agricultural Search Engine</span>
            </button>

            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="text-[#2D3129] hover:text-[#4A6741] font-medium underline"
            >
              🌐 Language: {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिन्दी' : 'English'}
            </button>

            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="text-[#2D3129] hover:text-[#4A6741] font-medium underline"
            >
              Architecture & API Integration
            </button>

            <button
              onClick={() => handleOpenTraceability('BATCH_COIMB_01')}
              className="text-[#2D3129] hover:text-[#4A6741] font-medium underline"
            >
              QR Traceability Matrix
            </button>

            <button
              onClick={() => setIsIVRModalOpen(true)}
              className="text-[#D97757] hover:text-[#BF5E3E] font-mono font-bold"
            >
              📞 Toll-Free: 1800-425-3276
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SearchEngineModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        currentUser={currentUser}
        initialQuery={searchInitialQuery}
        onOpenTraceability={(batchId) => {
          setIsSearchOpen(false);
          handleOpenTraceability(batchId);
        }}
        onOpenIVR={() => {
          setIsSearchOpen(false);
          setIsIVRModalOpen(true);
        }}
        onSwitchRole={(role) => {
          handleRoleChange(role);
        }}
      />

      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onSelectLanguage={(lang) => {
          handleLanguageChange(lang);
          setIsLanguageModalOpen(false);
        }}
        currentLanguage={language}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <IVRSimulatorModal
        isOpen={isIVRModalOpen}
        onClose={() => setIsIVRModalOpen(false)}
        language={language}
      />

      <TraceabilityModal
        isOpen={isTraceabilityOpen}
        onClose={() => setIsTraceabilityOpen(false)}
        initialBatchId={traceBatchId}
        language={language}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}

export default App;
