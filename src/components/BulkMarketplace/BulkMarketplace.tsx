import React, { useState } from 'react';
import {
  Building2,
  Search,
  PlusCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Send,
  X,
  Eye,
} from 'lucide-react';
import {
  ProductListing,
  BulkRFQ,
  Language,
  UserProfile,
  ProductCategory,
  QuantityUnit,
  NegotiationOffer,
} from '../../types';
import { storageService } from '../../services/storageService';
import { EligibilityService } from '../../services/eligibilityService';
import { getTranslation } from '../../translations';

interface BulkMarketplaceProps {
  language: Language;
  currentUser: UserProfile | null;
  products: ProductListing[];
  rfqs: BulkRFQ[];
  onOpenTraceability: (batchId: string) => void;
}

export const BulkMarketplace: React.FC<BulkMarketplaceProps> = ({
  language,
  currentUser,
  products,
  rfqs,
  onOpenTraceability,
}) => {
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_RFQS' | 'NEGOTIATIONS'>('MARKET');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateRfqOpen, setIsCreateRfqOpen] = useState(false);

  // RFQ Form State
  const [rfqCategory, setRfqCategory] = useState<ProductCategory>('VEGETABLE');
  const [rfqProductName, setRfqProductName] = useState('Fresh Tomatoes (High Volume)');
  const [rfqQuantity, setRfqQuantity] = useState<number>(500);
  const [rfqUnit, setRfqUnit] = useState<QuantityUnit>('kg');
  const [rfqTargetPrice, setRfqTargetPrice] = useState<number>(22);
  const [rfqRequiredBy, setRfqRequiredBy] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [rfqLocation, setRfqLocation] = useState(
    currentUser?.location || 'Gandhipuram Central Kitchen, Coimbatore'
  );
  const [rfqNotes, setRfqNotes] = useState('Grade A quality required. Payment net 2 days upon receipt.');

  // Counter Offer Modal state
  const [activeNegotiationRfq, setActiveNegotiationRfq] = useState<BulkRFQ | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(23);
  const [counterNote, setCounterNote] = useState<string>('Can commit to weekly recurring volume at this rate.');

  // STRICT RULE ENFORCEMENT:
  // Filter products strictly for BULK role - raw paddy & raw wheat are filtered out!
  const bulkEligibleProducts = EligibilityService.filterEligibleProducts(products, 'BULK');

  // Check if search query mentions prohibited raw grains
  const searchBlockedGrain = EligibilityService.isBlockedSearchKeyword(searchQuery);

  // Filtered listing
  const filteredProducts = bulkEligibleProducts.filter((p) => {
    const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (queryTokens.length === 0) return true;
    return queryTokens.every((token) =>
      [
        p.name,
        p.nameTranslations?.ta || '',
        p.nameTranslations?.hi || '',
        p.nameTranslations?.en || '',
        p.farmerName,
        p.farmerLocation,
        p.farmerDistrict,
        p.batchId,
        p.category,
        p.organic ? 'organic இயற்கை जैविक' : '',
        p.storageRequired ? 'cold solar குளிர்' : '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(token)
    );
  });

  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT CHECK: Raw paddy or raw wheat cannot be submitted as RFQ
    if (EligibilityService.isGroceryOnlyCategory(rfqCategory)) {
      alert(
        'Strict Policy: Raw paddy and raw wheat are reserved exclusively for Grocery individual buyers and cannot be requested by commercial bulk buyers.'
      );
      return;
    }

    storageService.createRFQ({
      buyerId: currentUser?.id || 'bulk_buyer_01',
      buyerName: currentUser?.name || 'Annapoorna Hospitality Group',
      buyerBusinessName: currentUser?.businessName || 'Annapoorna Hotels Ltd.',
      buyerLocation: rfqLocation,
      buyerPhone: currentUser?.phone || '9894455667',
      category: rfqCategory,
      productName: rfqProductName,
      quantityRequired: rfqQuantity,
      unit: rfqUnit,
      targetPricePerUnit: rfqTargetPrice,
      requiredByDate: rfqRequiredBy,
      notes: rfqNotes,
      status: 'OPEN',
      offers: [],
    });

    setIsCreateRfqOpen(false);
    setActiveTab('MY_RFQS');
  };

  const handleAcceptOffer = (rfqId: string, offerId: string) => {
    storageService.acceptRFQOffer(rfqId, offerId);
  };

  const handleCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNegotiationRfq) return;

    storageService.addRFQOffer(activeNegotiationRfq.id, {
      farmerId: currentUser?.id || 'bulk_buyer_01',
      farmerName: currentUser?.businessName || currentUser?.name || 'Bulk Procurement Team',
      farmerPhone: currentUser?.phone || '9894455667',
      offeredPrice: counterPrice,
      offeredQuantity: activeNegotiationRfq.quantityRequired,
      message: `Buyer counter offer: ₹${counterPrice}/${activeNegotiationRfq.unit}. ${counterNote}`,
      status: 'COUNTERED',
    });

    setActiveNegotiationRfq(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Hero Header */}
      <div className="bg-[#2D3129] text-[#FDFCF8] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden border border-[#E6E2D3]">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#4A6741] text-[#FDFCF8] uppercase tracking-wider">
                {t.roleBulk} Portal
              </span>
              <span className="text-xs text-[#E6E2D3]">
                Direct Farm Sourcing for Hotels, Restaurants, Retailers & Processors
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.bulkMarketTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#E6E2D3] max-w-xl mt-1">
              {t.bulkMarketSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateRfqOpen(true)}
              className="px-5 py-3 bg-[#D97757] hover:bg-[#C26243] text-white font-bold text-sm rounded-2xl shadow-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t.postBulkRfq}</span>
            </button>
          </div>
        </div>

        {/* Search & Navigation Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#827D6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wholesale vegetables, fruits, rice..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/95 text-[#2D3129] placeholder-[#827D6B] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D97757]"
            />
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('MARKET')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'MARKET'
                  ? 'bg-[#FDFCF8] text-[#2D3129] shadow-xs'
                  : 'bg-white/10 text-[#FDFCF8] hover:bg-white/20'
              }`}
            >
              {t.bulkAvailableLots} ({bulkEligibleProducts.length})
            </button>

            <button
              onClick={() => setActiveTab('MY_RFQS')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'MY_RFQS'
                  ? 'bg-[#FDFCF8] text-[#2D3129] shadow-xs'
                  : 'bg-white/10 text-[#FDFCF8] hover:bg-white/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.activeRfqs} ({rfqs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* STRICT RULE SEARCH BLOCKED WARNING (If user searched paddy/wheat) */}
      {searchBlockedGrain && (
        <div className="p-5 bg-[#F2EFE6] border-2 border-[#D97757] rounded-3xl flex items-start gap-3.5 text-xs text-[#2D3129] animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-2xl bg-[#D97757] text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#D97757]">
              Notice: {t.groceryOnlyNotice}
            </h4>
            <p className="mt-1 leading-relaxed text-[#2D3129]">
              Raw paddy and raw wheat cannot be purchased by commercial bulk buyers to protect local food security and household availability.
              <strong className="block mt-1 text-[#4A6741]">
                ✓ Available Alternative: Processed Rice (Ponni, Basmati, Sona Masoori) and other wholesale farm produce are fully open for bulk procurement.
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* Main Content Views */}
      {activeTab === 'MARKET' ? (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#2D3129]">
                Wholesale Commercial Farm Lots ({filteredProducts.length})
              </h3>
              <p className="text-xs text-[#827D6B]">
                Direct bulk purchase with locked quantity and batch QR traceability
              </p>
            </div>
            <span className="text-xs text-[#2D3129] font-bold bg-[#F2EFE6] px-3 py-1 rounded-full border border-[#E6E2D3]">
              Commercial Bulk Tier
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E2D3] shadow-xs">
              <Building2 className="w-12 h-12 text-[#827D6B] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#2D3129]">No wholesale lots found.</p>
              <p className="text-xs text-[#827D6B] mt-1">
                Post an RFQ requirement so nearby farming clusters can submit custom supply quotes!
              </p>
              <button
                onClick={() => setIsCreateRfqOpen(true)}
                className="mt-3 px-4 py-2 bg-[#4A6741] hover:bg-[#384F32] text-white text-xs font-bold rounded-2xl"
              >
                + Post Purchase Requirement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#E6E2D3] overflow-hidden shadow-xs hover:border-[#4A6741] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-[#F2EFE6]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4A6741] text-white shadow-xs">
                          {product.quality} • {product.category}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-2xl shadow-xs border border-[#E6E2D3] text-right">
                        <span className="text-xs text-[#827D6B] block font-medium">Wholesale Rate</span>
                        <span className="text-base font-black text-[#4A6741] font-mono">
                          ₹{product.expectedPrice}/{product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-[#2D3129] leading-snug">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-[#827D6B]">
                        <MapPin className="w-3.5 h-3.5 text-[#827D6B]" />
                        <span>{product.farmerLocation} • Farmer: {product.farmerName}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6E2D3] text-xs">
                        <div>
                          <span className="text-[#827D6B] text-[10px] block font-semibold">Available Lot</span>
                          <strong className="text-[#2D3129] text-sm font-mono">
                            {product.quantity} {product.unit}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#827D6B] text-[10px] block font-semibold">Est. Lot Value</span>
                          <strong className="text-[#4A6741] text-sm font-mono">
                            ₹{(product.quantity * product.expectedPrice).toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FDFCF8] border-t border-[#E6E2D3] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenTraceability(product.batchId)}
                      className="px-3 py-2 text-xs font-bold text-[#2D3129] bg-white border border-[#E6E2D3] rounded-2xl hover:bg-[#F2EFE6] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Trace</span>
                    </button>

                    <button
                      onClick={() => {
                        setRfqCategory(product.category);
                        setRfqProductName(product.name);
                        setRfqTargetPrice(product.expectedPrice);
                        setIsCreateRfqOpen(true);
                      }}
                      className="flex-1 py-2 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Negotiate / Request Lot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active RFQs and Offers Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-[#2D3129]">
              Procurement Inquiries & RFQs ({rfqs.length})
            </h3>
            <button
              onClick={() => setIsCreateRfqOpen(true)}
              className="px-4 py-2 bg-[#4A6741] hover:bg-[#384F32] text-white text-xs font-bold rounded-2xl shadow-xs"
            >
              + Post New RFQ
            </button>
          </div>

          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white rounded-3xl border border-[#E6E2D3] p-5 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E6E2D3]">
                  <div>
                    <span className="font-mono text-xs font-bold bg-[#F2EFE6] text-[#2D3129] px-2.5 py-1 rounded-lg">
                      RFQ #{rfq.id}
                    </span>
                    <span className="text-sm font-bold text-[#2D3129] ml-2">
                      {rfq.productName} ({rfq.quantityRequired} {rfq.unit})
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1]">
                    Status: {rfq.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3 text-xs">
                  <div>
                    <span className="text-[#827D6B] block font-semibold text-[10px] uppercase">
                      Target Budget
                    </span>
                    <strong className="text-[#2D3129] text-sm font-mono">
                      ₹{rfq.targetPricePerUnit}/{rfq.unit}
                    </strong>
                    <span className="text-[11px] text-[#827D6B] block">
                      Total: ₹{(rfq.quantityRequired * rfq.targetPricePerUnit).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#827D6B] block font-semibold text-[10px] uppercase">
                      Delivery Location & Deadline
                    </span>
                    <div className="text-[#2D3129] font-medium">{rfq.buyerLocation}</div>
                    <div className="text-[#827D6B] text-[11px] mt-0.5">Required By: {rfq.requiredByDate}</div>
                  </div>

                  <div>
                    <span className="text-[#827D6B] block font-semibold text-[10px] uppercase">
                      Offers Received
                    </span>
                    <strong className="text-[#4A6741] text-sm font-bold">
                      {rfq.offers.length} Farmers Quoted
                    </strong>
                  </div>
                </div>

                {/* Farmer Quotes List & Action */}
                {rfq.offers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E6E2D3]">
                    <span className="text-[10px] font-bold text-[#827D6B] uppercase tracking-wider block mb-2">
                      Farmer Offers & Negotiation History:
                    </span>

                    <div className="space-y-2">
                      {rfq.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="p-3.5 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <strong className="text-[#2D3129] block font-bold">
                              {offer.farmerName} (+91 {offer.farmerPhone})
                            </strong>
                            <span className="text-[#827D6B]">{offer.message}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right font-mono">
                              <span className="text-[#827D6B] text-[10px] block">Offered Rate</span>
                              <strong className="text-sm font-bold text-[#4A6741]">
                                ₹{offer.offeredPrice}/{rfq.unit}
                              </strong>
                            </div>

                            {rfq.status !== 'CONFIRMED' && offer.status !== 'ACCEPTED' ? (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => {
                                    setActiveNegotiationRfq(rfq);
                                    setCounterPrice(offer.offeredPrice - 1);
                                  }}
                                  className="px-3 py-1.5 bg-[#F2EFE6] hover:bg-[#E6E2D3] text-[#2D3129] font-bold rounded-2xl text-xs"
                                >
                                  Counter
                                </button>
                                <button
                                  onClick={() => handleAcceptOffer(rfq.id, offer.id)}
                                  className="px-3.5 py-1.5 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold rounded-2xl text-xs shadow-xs"
                                >
                                  Accept & Lock Deal
                                </button>
                              </div>
                            ) : (
                              <span className="px-3 py-1 bg-[#E6F0E4] text-[#4A6741] rounded-2xl font-bold text-xs border border-[#C5D9C1]">
                                ✓ Deal Confirmed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create RFQ Modal */}
      {isCreateRfqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E6E2D3] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D3] mb-4">
              <h3 className="text-lg font-bold text-[#2D3129]">{t.postBulkRfq}</h3>
              <button onClick={() => setIsCreateRfqOpen(false)} className="text-[#827D6B] hover:text-[#2D3129]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">
                  Crop Category
                </label>
                <select
                  value={rfqCategory}
                  onChange={(e) => setRfqCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs font-semibold text-[#2D3129] focus:ring-2 focus:ring-[#4A6741]"
                >
                  <option value="VEGETABLE">Vegetables</option>
                  <option value="FRUIT">Fruits</option>
                  <option value="RICE">Processed Rice</option>
                  <option value="OTHER">Other Approved Produce</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">
                  Product Description
                </label>
                <input
                  type="text"
                  value={rfqProductName}
                  onChange={(e) => setRfqProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129] focus:ring-2 focus:ring-[#4A6741]"
                  placeholder="e.g. Round Country Tomatoes"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#2D3129] mb-1">
                    Volume Required
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(parseInt(e.target.value) || 100)}
                    className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs font-bold text-[#2D3129]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D3129] mb-1">Unit</label>
                  <select
                    value={rfqUnit}
                    onChange={(e) => setRfqUnit(e.target.value as QuantityUnit)}
                    className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129]"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#2D3129] mb-1">
                    Target Budget (₹/{rfqUnit})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rfqTargetPrice}
                    onChange={(e) => setRfqTargetPrice(parseInt(e.target.value) || 20)}
                    className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs font-bold text-[#4A6741]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D3129] mb-1">
                    Required By Date
                  </label>
                  <input
                    type="date"
                    value={rfqRequiredBy}
                    onChange={(e) => setRfqRequiredBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Delivery Destination</label>
                <input
                  type="text"
                  value={rfqLocation}
                  onChange={(e) => setRfqLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Procurement Notes</label>
                <textarea
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129]"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRfqOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#2D3129] bg-[#F2EFE6] hover:bg-[#E6E2D3] rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors"
                >
                  Broadcast RFQ to Farmers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counter Offer Modal */}
      {activeNegotiationRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E6E2D3] text-left">
            <h3 className="text-base font-bold text-[#2D3129]">
              Submit Counter Offer for RFQ #{activeNegotiationRfq.id}
            </h3>
            <p className="text-xs text-[#827D6B] mt-0.5">
              {activeNegotiationRfq.productName} ({activeNegotiationRfq.quantityRequired} {activeNegotiationRfq.unit})
            </p>

            <form onSubmit={handleCounterOffer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">
                  Proposed Counter Price (₹/{activeNegotiationRfq.unit})
                </label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(parseInt(e.target.value) || 20)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-sm font-bold text-[#4A6741]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">Note to Farmer</label>
                <textarea
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129]"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNegotiationRfq(null)}
                  className="px-4 py-2 text-xs font-bold text-[#2D3129] bg-[#F2EFE6] hover:bg-[#E6E2D3] rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors"
                >
                  Send Counter Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
