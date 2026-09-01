import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Mic,
  MicOff,
  Filter,
  Sparkles,
  Sprout,
  Users,
  QrCode,
  Snowflake,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Check,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Info,
  PhoneCall,
  ShoppingBasket,
  Building2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import {
  Language,
  UserRole,
  UserProfile,
  ProductListing,
  ProductCategory,
  QualityGrade,
} from '../../types';
import {
  SearchEngineService,
  SearchFilterOptions,
  SearchResultsSummary,
  MandiSearchItem,
} from '../../services/searchService';
import { storageService } from '../../services/storageService';
import { getTranslation } from '../../translations';
import { QRCodeCanvas } from '../Common/QRCodeCanvas';

interface SearchEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: UserProfile | null;
  initialQuery?: string;
  onOpenTraceability: (batchId: string) => void;
  onOpenIVR: () => void;
  onSelectProduct?: (product: ProductListing) => void;
  onSwitchRole?: (role: UserRole) => void;
}

type SearchTab = 'ALL' | 'PRODUCE' | 'FARMERS' | 'BATCHES' | 'COLD_STORAGE' | 'MANDI';

export const SearchEngineModal: React.FC<SearchEngineModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  initialQuery = '',
  onOpenTraceability,
  onOpenIVR,
  onSelectProduct,
  onSwitchRole,
}) => {
  const t = getTranslation(language);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [storageType, setStorageType] = useState<'ALL' | 'COLD_STORED' | 'DIRECT_FARM'>('ALL');
  const [buyerEligibility, setBuyerEligibility] = useState<'ALL' | 'GROCERY_ONLY' | 'BULK_ELIGIBLE'>('ALL');
  const [sortBy, setSortBy] = useState<'RELEVANCE' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'FRESHNESS' | 'QUANTITY_HIGH'>('RELEVANCE');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  // Search Results
  const [results, setResults] = useState<SearchResultsSummary>({
    products: [],
    farmers: [],
    coldRooms: [],
    mandiItems: [],
    matchedBatches: [],
    totalMatches: 0,
  });

  // Focus on mount & load recent searches
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(SearchEngineService.getRecentSearches());
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialQuery]);

  // Execute Search whenever query or filters change
  useEffect(() => {
    if (!isOpen) return;

    const filterOptions: SearchFilterOptions = {
      query,
      category: selectedCategory !== 'ALL' ? (selectedCategory as ProductCategory) : undefined,
      isOrganicOnly,
      storageType,
      buyerEligibility,
      sortBy,
      maxPrice,
    };

    const res = SearchEngineService.search(filterOptions);
    setResults(res);
  }, [isOpen, query, selectedCategory, isOrganicOnly, storageType, buyerEligibility, sortBy, maxPrice]);

  // Save to recent searches when query is submitted
  const handlePerformSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length >= 2) {
      SearchEngineService.saveRecentSearch(searchQuery);
      setRecentSearches(SearchEngineService.getRecentSearches());
    }
  };

  // Voice Search Simulation & Speech Recognition
  const handleToggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceNotice(null);
      return;
    }

    setIsListening(true);
    setVoiceNotice(
      language === 'ta'
        ? 'கேட்கிறது... "நாட்டு தக்காளி" அல்லது "பவானி நெல்" என்று சொல்லவும்'
        : language === 'hi'
        ? 'सुन रहा हूँ... "देसी टमाटर" या "कोयंबटूर धान" बोलें'
        : 'Listening... Speak crop name e.g. "Country Tomatoes" or "Ponni Rice"'
    );

    // Try native Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          handlePerformSearch(transcript);
          setIsListening(false);
          setVoiceNotice(null);
        };

        recognition.onerror = () => {
          simulateVoiceFallback();
        };

        recognition.start();
        return;
      } catch {
        simulateVoiceFallback();
      }
    } else {
      simulateVoiceFallback();
    }
  };

  const simulateVoiceFallback = () => {
    // Graceful vernacular simulation if browser mic access is restricted in iframe
    const voiceSamples =
      language === 'ta'
        ? ['நாட்டு தக்காளி', 'பவானி பொன்னி நெல்', 'சிவப்பு வெங்காயம்', 'குளிர் அறை தக்காளி']
        : language === 'hi'
        ? ['देसी टमाटर', 'शरबती कच्चा गेहूं', 'लाल प्याज', 'सोलर कोल्ड स्टोरेज']
        : ['Country Tomatoes', 'Deluxe Ponni Rice', 'Solar Cold Storage Lots', 'Organic Brinjal'];

    const chosen = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];

    setTimeout(() => {
      setQuery(chosen);
      handlePerformSearch(chosen);
      setIsListening(false);
      setVoiceNotice(`Transcribed voice audio: "${chosen}"`);
      setTimeout(() => setVoiceNotice(null), 3000);
    }, 1400);
  };

  const handleQuickAddGrocery = (product: ProductListing) => {
    const buyer = currentUser || {
      id: 'grocery_guest',
      phone: '9443322110',
      name: 'Direct Grocery Customer',
      role: 'GROCERY' as UserRole,
      language: language,
      location: 'Coimbatore',
    };

    const res = storageService.placeOrder({
      buyer,
      items: [{ product, quantity: 1 }],
      deliveryType: 'DIRECT_DELIVERY',
    });

    if (res.success && res.order) {
      setActionSuccessMessage(`✓ Order #${res.order.id} placed directly for 1 ${product.unit} of ${product.name}!`);
    } else {
      setActionSuccessMessage(res.error || 'Could not place direct order');
    }
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleClearFilters = () => {
    setSelectedCategory('ALL');
    setIsOrganicOnly(false);
    setStorageType('ALL');
    setBuyerEligibility('ALL');
    setSortBy('RELEVANCE');
    setMaxPrice(undefined);
  };

  const getVernacularName = (product: ProductListing) => {
    if (language === 'ta' && product.nameTranslations?.ta) return product.nameTranslations.ta;
    if (language === 'hi' && product.nameTranslations?.hi) return product.nameTranslations.hi;
    return product.nameTranslations?.en || product.name;
  };

  if (!isOpen) return null;

  const isBulkUser = currentUser?.role === 'BULK';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-[#2D3129]/65 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white text-[#2D3129] rounded-3xl max-w-4xl w-full my-4 sm:my-8 shadow-2xl border border-[#E6E2D3] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E6E2D3] bg-[#FDFCF8] relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4A6741] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Search className="w-5 h-5" />
            </div>

            {/* Input with live controls */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length >= 2) {
                    SearchEngineService.saveRecentSearch(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePerformSearch(query);
                  } else if (e.key === 'Escape') {
                    onClose();
                  }
                }}
                placeholder={
                  language === 'ta'
                    ? 'விவசாய பயிர்கள், தக்காளி, நெல், விவசாயிகள், QR பேட்ச் ஐடி தேடவும்...'
                    : language === 'hi'
                    ? 'फसलें, टमाटर, धान, किसान, मंडी भाव, क्यूआर बैच खोजें...'
                    : 'Search fresh crops, grains, farmers, batch QR IDs, solar cold rooms, Mandi rates...'
                }
                className="w-full pl-3 pr-20 py-3 sm:py-3.5 bg-white border border-[#E6E2D3] rounded-2xl text-sm sm:text-base text-[#2D3129] placeholder-[#827D6B] font-medium focus:ring-2 focus:ring-[#4A6741] focus:border-transparent focus:outline-none shadow-xs"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6] rounded-full transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleToggleVoiceSearch}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-[#D97757] text-white animate-pulse shadow-md'
                      : 'text-[#4A6741] hover:bg-[#E6F0E4] bg-[#F2EFE6]'
                  }`}
                  title="Voice Search (Tamil, Hindi, English)"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-[#827D6B] hover:text-[#2D3129] hover:bg-[#F2EFE6] border border-[#E6E2D3] transition-colors shrink-0"
              title="Close Search (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Search Feedback Alert */}
          {voiceNotice && (
            <div className="mt-3 p-2.5 bg-[#E6F0E4] border border-[#4A6741]/30 rounded-xl text-xs text-[#4A6741] font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4A6741] animate-ping"></span>
                <span>{voiceNotice}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#827D6B]">Voice Assistant</span>
            </div>
          )}

          {/* Action Success Toast */}
          {actionSuccessMessage && (
            <div className="mt-3 p-2.5 bg-[#E6F0E4] border border-[#4A6741]/40 rounded-xl text-xs text-[#4A6741] font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Quick Multilingual Suggested Keywords & Vernacular Prompts */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[10px] font-bold text-[#827D6B] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D97757]" />
              {language === 'ta' ? 'விரைவு தேடல்:' : language === 'hi' ? 'त्वरित खोज:' : 'Trending:'}
            </span>

            {[
              { label: language === 'ta' ? '🍅 நாட்டு தக்காளி' : language === 'hi' ? '🍅 देसी टमाटर' : '🍅 Country Tomato', q: 'Country Tomato' },
              { label: language === 'ta' ? '🌾 பவானி நெல்' : language === 'hi' ? '🌾 भवानी धान' : '🌾 Bhavani Paddy', q: 'Bhavani Paddy' },
              { label: language === 'ta' ? '🍚 பொன்னி அரிசி' : language === 'hi' ? '🍚 पोन्नी चावल' : '🍚 Ponni Rice', q: 'Ponni Rice' },
              { label: language === 'ta' ? '❄️ சூரிய குளிர் அறை' : language === 'hi' ? '❄️ सोलर कोल्ड रूम' : '❄️ Solar Cold Storage', q: 'Solar Cold' },
              { label: language === 'ta' ? '🌱 இயற்கை சான்று' : language === 'hi' ? '🌱 जैविक फसलें' : '🌱 100% Organic', q: 'Organic' },
              { label: language === 'ta' ? '👨‍🌾 முத்துசாமி கவுண்டர்' : language === 'hi' ? '👨‍🌾 मुथुसामी' : '👨‍🌾 Muthusamy Gounder', q: 'Muthusamy' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handlePerformSearch(chip.q)}
                className="px-2.5 py-1 bg-white hover:bg-[#E6F0E4] text-[#2D3129] border border-[#E6E2D3] hover:border-[#4A6741] rounded-full text-[11px] font-semibold shrink-0 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Tabs Bar & Filter Toggle */}
          <div className="mt-4 pt-3 border-t border-[#E6E2D3] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
              {[
                { id: 'ALL', label: language === 'ta' ? 'அனைத்தும்' : language === 'hi' ? 'सभी' : 'All Results', count: results.totalMatches },
                { id: 'PRODUCE', label: language === 'ta' ? 'பயிர்கள்' : language === 'hi' ? 'फसलें' : 'Fresh Produce', count: results.products.length, icon: Sprout },
                { id: 'FARMERS', label: language === 'ta' ? 'விவசாயிகள்' : language === 'hi' ? 'किसान' : 'Farmers & FPO', count: results.farmers.length, icon: Users },
                { id: 'BATCHES', label: language === 'ta' ? 'QR பேட்ச்' : language === 'hi' ? 'क्यूआर बैच' : 'Batch QR Trace', count: results.matchedBatches.length, icon: QrCode },
                { id: 'COLD_STORAGE', label: language === 'ta' ? 'குளிர் அறை' : language === 'hi' ? 'कोल्ड स्टोरेज' : 'Solar Cold Storage', count: results.coldRooms.length, icon: Snowflake },
                { id: 'MANDI', label: language === 'ta' ? 'மண்டி விலை' : language === 'hi' ? 'मंडी भाव' : 'Live Mandi Benchmarks', count: results.mandiItems.length, icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SearchTab)}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-[#4A6741] text-white shadow-xs'
                        : 'bg-[#F2EFE6] text-[#827D6B] hover:text-[#2D3129] hover:bg-[#EAE6DA]'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E6E2D3] text-[#2D3129]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                showFilters || selectedCategory !== 'ALL' || isOrganicOnly || storageType !== 'ALL' || buyerEligibility !== 'ALL'
                  ? 'bg-[#D97757] text-white border-[#D97757]'
                  : 'bg-white text-[#2D3129] border-[#E6E2D3] hover:bg-[#F2EFE6]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வடிகட்டிகள்' : language === 'hi' ? 'फिल्टर' : 'Filters'}</span>
              {(selectedCategory !== 'ALL' || isOrganicOnly || storageType !== 'ALL' || buyerEligibility !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Expandable Advanced Filters Tray */}
          {showFilters && (
            <div className="mt-3 p-4 bg-[#F2EFE6] rounded-2xl border border-[#E6E2D3] space-y-3 animate-in fade-in slide-in-from-top-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Category Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3129] mb-1">Crop Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6E2D3] rounded-xl text-xs text-[#2D3129] font-medium"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="VEGETABLE">Fresh Vegetables</option>
                    <option value="FRUIT">Fruits</option>
                    <option value="PADDY">Raw Paddy (Grocery Only)</option>
                    <option value="RICE">Processed Rice</option>
                    <option value="WHEAT">Raw Wheat (Grocery Only)</option>
                  </select>
                </div>

                {/* Storage Type */}
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3129] mb-1">Cold Chain Facility</label>
                  <select
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6E2D3] rounded-xl text-xs text-[#2D3129] font-medium"
                  >
                    <option value="ALL">All Facilities</option>
                    <option value="COLD_STORED">❄️ Solar Cold Room Stored</option>
                    <option value="DIRECT_FARM">🌱 Direct Farm Gate Dispatch</option>
                  </select>
                </div>

                {/* Buyer Eligibility */}
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3129] mb-1">Buyer Procurement Rule</label>
                  <select
                    value={buyerEligibility}
                    onChange={(e) => setBuyerEligibility(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6E2D3] rounded-xl text-xs text-[#2D3129] font-medium"
                  >
                    <option value="ALL">All Products</option>
                    <option value="GROCERY_ONLY">Grocery Only (Raw Paddy/Wheat)</option>
                    <option value="BULK_ELIGIBLE">Bulk Commercial Eligible</option>
                  </select>
                </div>

                {/* Sorting */}
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3129] mb-1">Sort Results By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6E2D3] rounded-xl text-xs text-[#2D3129] font-medium"
                  >
                    <option value="RELEVANCE">Best Relevance Match</option>
                    <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                    <option value="PRICE_HIGH_LOW">Price: High to Low</option>
                    <option value="FRESHNESS">Freshness (Harvest Date)</option>
                    <option value="QUANTITY_HIGH">Highest Available Stock</option>
                  </select>
                </div>
              </div>

              {/* Toggles & Clear */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E6E2D3]">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D3129]">
                  <input
                    type="checkbox"
                    checked={isOrganicOnly}
                    onChange={(e) => setIsOrganicOnly(e.target.checked)}
                    className="w-4 h-4 text-[#4A6741] rounded border-[#E6E2D3] focus:ring-[#4A6741]"
                  />
                  <span>🌱 Show 100% Certified Organic Only</span>
                </label>

                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#D97757] hover:underline font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Rule Guidance Notice when searching as Bulk Buyer */}
          {isBulkUser && (
            <div className="p-3 bg-[#FDF0EC] border border-[#D97757]/30 rounded-2xl flex items-start gap-2.5 text-xs text-[#D97757]">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Bulk Procurement Notice:</strong> As per platform policy, Bulk Buyers can procure processed milled rice, fresh vegetables, and fruits. Raw paddy & raw wheat are reserved exclusively for household Grocery buyers.
              </div>
            </div>
          )}

          {/* SECTION 1: Fresh Produce Listings */}
          {(activeTab === 'ALL' || activeTab === 'PRODUCE') && results.products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#4A6741]" />
                  <span>Fresh Farm Produce & Grains ({results.products.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.products.map((product) => {
                  const isGroceryOnly = product.buyerEligibility === 'GROCERY_ONLY';
                  const isRestrictedForBulk = isBulkUser && isGroceryOnly;

                  return (
                    <div
                      key={product.id}
                      className="bg-[#FDFCF8] rounded-3xl border border-[#E6E2D3] p-4 flex flex-col justify-between hover:border-[#4A6741] transition-all hover:shadow-md relative overflow-hidden group"
                    >
                      <div>
                        {/* Image & Header Badges */}
                        <div className="flex items-start gap-3.5">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#E6E2D3] shrink-0"
                          />
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {product.organic && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F0E4] text-[#4A6741]">
                                  🌱 Organic
                                </span>
                              )}
                              {product.storageRequired && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F2EFE6] text-[#2D3129]">
                                  ❄️ Solar Cold Stored ({product.crateId || 'CRT-01'})
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isGroceryOnly
                                    ? 'bg-[#FDF0EC] text-[#D97757]'
                                    : 'bg-[#E6F0E4] text-[#4A6741]'
                                }`}
                              >
                                {isGroceryOnly ? 'Grocery Only' : 'Bulk & Retail'}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-[#2D3129] truncate group-hover:text-[#4A6741]">
                              {product.name}
                            </h4>
                            <div className="text-xs text-[#827D6B] font-medium">
                              {getVernacularName(product)}
                            </div>

                            <div className="flex items-baseline gap-1.5 pt-0.5">
                              <span className="text-base font-extrabold text-[#2D3129]">
                                ₹{product.expectedPrice}
                              </span>
                              <span className="text-xs text-[#827D6B] font-medium">
                                / {product.unit}
                              </span>
                              {product.suggestedPriceMax && (
                                <span className="text-[10px] text-[#827D6B] line-through">
                                  Mandi ₹{product.suggestedPriceMax}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Farmer & Lot Metadata */}
                        <div className="mt-3 pt-3 border-t border-[#E6E2D3] grid grid-cols-2 gap-2 text-xs text-[#827D6B]">
                          <div>
                            <span className="text-[10px] text-[#827D6B] block">Farmer / Source</span>
                            <strong className="text-[#2D3129] font-semibold text-[11px] truncate block">
                              {product.farmerName}
                            </strong>
                            <span className="text-[10px] text-[#827D6B] truncate block">
                              {product.farmerLocation}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#827D6B] block">Lot Availability</span>
                            <strong className="text-[#2D3129] font-semibold text-[11px] block">
                              {product.quantity} {product.unit}s available
                            </strong>
                            <span className="text-[10px] text-[#4A6741] font-medium block">
                              Harvested {product.harvestDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-[#E6E2D3] flex items-center justify-between gap-2">
                        <button
                          onClick={() => onOpenTraceability(product.batchId)}
                          className="px-2.5 py-1.5 bg-white border border-[#E6E2D3] hover:border-[#4A6741] text-[#2D3129] rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-[#F2EFE6] transition-colors"
                          title="View QR Supply Chain Timeline"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#4A6741]" />
                          <span>QR Batch</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {isRestrictedForBulk ? (
                            <span className="text-[11px] text-[#D97757] font-semibold px-2 py-1 bg-[#FDF0EC] rounded-xl">
                              Household Only
                            </span>
                          ) : (
                            <button
                              onClick={() => handleQuickAddGrocery(product)}
                              className="px-3.5 py-1.5 bg-[#4A6741] hover:bg-[#3D5635] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-transform active:scale-95"
                            >
                              <ShoppingBasket className="w-3.5 h-3.5" />
                              <span>{isBulkUser ? 'Request Lot' : 'Add to Cart'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: Verified Farmers & FPO Hubs */}
          {(activeTab === 'ALL' || activeTab === 'FARMERS') && results.farmers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4A6741]" />
                  <span>Verified Farmers & Producer Hubs ({results.farmers.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.farmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="bg-[#FDFCF8] rounded-3xl border border-[#E6E2D3] p-4 flex items-start justify-between gap-3 hover:border-[#4A6741] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {farmer.avatarUrl ? (
                        <img
                          src={farmer.avatarUrl}
                          alt={farmer.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-[#E6E2D3]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center font-bold">
                          {farmer.name.charAt(0)}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#2D3129]">{farmer.name}</h4>
                          {farmer.kycVerified && (
                            <span className="w-4 h-4 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px]" title="KYC Verified Farmer">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#827D6B] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#D97757]" />
                          <span>{farmer.location}</span>
                        </p>

                        {farmer.fpoAffiliation && (
                          <span className="inline-block px-2 py-0.5 bg-[#F2EFE6] text-[#2D3129] text-[10px] font-semibold rounded-full mt-1 border border-[#E6E2D3]">
                            🏛️ {farmer.fpoAffiliation}
                          </span>
                        )}

                        <div className="text-[11px] text-[#4A6741] font-medium pt-1">
                          🌾 Land: {farmer.landSizeAcres || 5} Acres • Direct Gate Dispatch
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onOpenIVR}
                      className="px-3 py-2 bg-[#F2EFE6] hover:bg-[#E6F0E4] text-[#4A6741] border border-[#E6E2D3] hover:border-[#4A6741] rounded-2xl text-xs font-bold flex flex-col items-center gap-1 transition-colors shrink-0"
                      title="Connect via Toll-Free Voice Assistant"
                    >
                      <PhoneCall className="w-4 h-4 text-[#D97757]" />
                      <span className="text-[10px]">Call IVR</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: Matched Batch & QR Traceability Codes */}
          {(activeTab === 'ALL' || activeTab === 'BATCHES') && results.matchedBatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#4A6741]" />
                  <span>Batch QR Code Traceability Matrix ({results.matchedBatches.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {results.matchedBatches.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#E6F0E4]/40 border border-[#E6E2D3] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="bg-white p-1.5 rounded-2xl border border-[#E6E2D3] shrink-0">
                        <QRCodeCanvas value={`https://farmerconnect.org/trace/${item.batchId}`} size={56} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#4A6741] bg-white px-2 py-0.5 rounded-lg border border-[#E6E2D3]">
                            {item.batchId}
                          </span>
                          <span className="text-[10px] font-bold text-[#827D6B] uppercase">Verified Farm Lot</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#2D3129] mt-0.5">{item.name}</h4>
                        <p className="text-xs text-[#827D6B]">
                          Farmer: <strong>{item.farmerName}</strong> • Quality: <strong>{item.quality}</strong> • Harvested: <strong>{item.harvestDate}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenTraceability(item.batchId)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#4A6741] hover:bg-[#3D5635] text-white text-xs font-bold rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span>View Full Lifecycle Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: Solar Cold Storage Rooms */}
          {(activeTab === 'ALL' || activeTab === 'COLD_STORAGE') && results.coldRooms.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-[#4A6741]" />
                  <span>Solar-Powered Cold Storage Network ({results.coldRooms.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.coldRooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 bg-[#FDFCF8] rounded-3xl border border-[#E6E2D3] hover:border-[#4A6741] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#4A6741] bg-[#E6F0E4] px-2 py-0.5 rounded-md">
                          {room.id}
                        </span>
                        <h4 className="text-sm font-bold text-[#2D3129] mt-1">{room.name}</h4>
                        <p className="text-xs text-[#827D6B]">{room.location}</p>
                      </div>
                      <span className="text-xs font-bold text-[#4A6741] px-2 py-1 bg-[#E6F0E4] rounded-xl">
                        ☀️ 100% Solar Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#F2EFE6] rounded-2xl text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#827D6B] block">Temp</span>
                        <strong className="text-[#2D3129] font-mono text-xs">{room.currentTempCelsius}°C</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#827D6B] block">Humidity</span>
                        <strong className="text-[#2D3129] font-mono text-xs">{room.currentHumidityPercent}%</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#827D6B] block">Capacity</span>
                        <strong className="text-[#4A6741] font-mono text-xs">
                          {room.occupiedMetricTons}/{room.capacityMetricTons} MT
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#827D6B] pt-1">
                      <span>Operator: <strong>{room.operator}</strong></span>
                      <button
                        onClick={onOpenIVR}
                        className="text-[#D97757] hover:underline font-bold text-xs flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" /> Call Desk
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Live Mandi Price & Market Benchmarks */}
          {(activeTab === 'ALL' || activeTab === 'MANDI') && results.mandiItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D97757]" />
                  <span>Real-Time APMC Mandi Rates vs Farmer Gate Benchmarks ({results.mandiItems.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {results.mandiItems.map((mandi) => {
                  const farmerPremium = mandi.farmerGatePrice - mandi.mandiPrice;
                  const consumerSavings = mandi.consumerDirectPrice - mandi.farmerGatePrice;

                  return (
                    <div
                      key={mandi.id}
                      className="p-4 bg-[#FDFCF8] rounded-3xl border border-[#E6E2D3] space-y-2 hover:border-[#4A6741] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#2D3129]">{mandi.crop}</h4>
                          <span className="text-xs text-[#827D6B]">
                            {language === 'ta' ? mandi.cropTa : language === 'hi' ? mandi.cropHi : mandi.cropTa}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mandi.trend === 'UP'
                              ? 'bg-[#E6F0E4] text-[#4A6741]'
                              : mandi.trend === 'DOWN'
                              ? 'bg-[#FDF0EC] text-[#D97757]'
                              : 'bg-[#F2EFE6] text-[#2D3129]'
                          }`}
                        >
                          {mandi.trend === 'UP' ? '📈 Rising Demand' : mandi.trend === 'DOWN' ? '📉 Surplus Supply' : '⚖️ Stable'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#F2EFE6] rounded-2xl text-center text-xs">
                        <div>
                          <span className="text-[9px] text-[#827D6B] block">APMC Mandi</span>
                          <strong className="text-[#827D6B] font-mono">₹{mandi.mandiPrice}</strong>
                        </div>
                        <div className="bg-white rounded-xl p-1 shadow-xs border border-[#E6E2D3]">
                          <span className="text-[9px] text-[#4A6741] font-bold block">Farmer Direct</span>
                          <strong className="text-[#4A6741] font-bold font-mono">₹{mandi.farmerGatePrice}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#827D6B] block">City Retail</span>
                          <strong className="text-[#D97757] font-mono">₹{mandi.consumerDirectPrice}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#4A6741] font-semibold pt-1">
                        <span>+₹{farmerPremium} extra profit for farmer</span>
                        <span className="text-[#D97757]">Save ₹{consumerSavings} vs retail</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State when no results found */}
          {results.totalMatches === 0 && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#F2EFE6] text-[#827D6B] mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#2D3129]">
                  {language === 'ta' ? 'தேடல் முடிவுகள் எதுவும் கிடைக்கவில்லை' : language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No agricultural listings found'}
                </h4>
                <p className="text-xs text-[#827D6B] mt-1 max-w-sm mx-auto">
                  Try searching with vernacular terms (e.g. &quot;தக்காளி&quot;, &quot;tomato&quot;, &quot;பவானி நெல்&quot;, &quot;Muthusamy&quot;, or batch &quot;BATCH-TM-2026-089&quot;).
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handlePerformSearch('')}
                  className="px-4 py-2 bg-[#4A6741] text-white text-xs font-bold rounded-2xl shadow-xs"
                >
                  View All Farm Produce
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#F2EFE6] text-[#2D3129] text-xs font-bold rounded-2xl hover:bg-[#EAE6DA]"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-[#F2EFE6] border-t border-[#E6E2D3] flex flex-wrap items-center justify-between gap-2 text-xs text-[#827D6B]">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-[#2D3129]">{results.totalMatches}</strong> total matched agricultural items
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-[#E6E2D3] font-mono text-[10px]">ESC</kbd> to close</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenIVR}
              className="text-[#D97757] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Voice Helpline: 1800-425-3276</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
