import React, { useState } from 'react';
import {
  Sprout,
  PlusCircle,
  Package,
  ShoppingBag,
  Clock,
  ThermometerSnowflake,
  TrendingUp,
  Wheat,
  PhoneCall,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ProductListing, Order, UnsoldStockAlert, Language, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { getTranslation } from '../../translations';
import { ListProduceModal } from './ListProduceModal';
import { PaddyToRiceModal } from './PaddyToRiceModal';
import { FarmerProductList } from './FarmerProductList';
import { FarmerOrders } from './FarmerOrders';
import { FarmerStockAlerts } from './FarmerStockAlerts';
import { FarmerPriceAssistant } from './FarmerPriceAssistant';

interface FarmerDashboardProps {
  language: Language;
  currentUser: UserProfile | null;
  products: ProductListing[];
  orders: Order[];
  stockAlerts: UnsoldStockAlert[];
  onOpenIVR: () => void;
  onOpenTraceability: (batchId: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  currentUser,
  products,
  orders,
  stockAlerts,
  onOpenIVR,
  onOpenTraceability,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<
    'MY_PRODUCTS' | 'ORDERS' | 'STOCK_ALERTS' | 'PRICES' | 'COLD_STORAGE'
  >('MY_PRODUCTS');

  const [isListProduceOpen, setIsListProduceOpen] = useState<boolean>(false);
  const [isPaddyToRiceOpen, setIsPaddyToRiceOpen] = useState<boolean>(false);

  // Filter products for this farmer (or all if farmer_01)
  const myProducts = products.filter(
    (p) => p.farmerId === currentUser?.id || currentUser?.id === 'farmer_01'
  );
  const paddyProducts = myProducts.filter((p) => p.category === 'PADDY');
  const myOrders = orders.filter((o) => o.farmerId === currentUser?.id || currentUser?.id === 'farmer_01');
  const pendingOrdersCount = myOrders.filter((o) => o.status === 'ORDER_PLACED').length;

  const totalEarnings = myOrders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner with Fast Visual Action Cards for Farmers */}
      <div className="bg-[#4A6741] text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#384F32] relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Sprout className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white uppercase tracking-wider border border-white/20">
                {t.roleFarmer} Dashboard
              </span>
              <span className="text-xs text-[#F2EFE6] font-medium">
                {currentUser?.location || 'Thondamuthur, Coimbatore'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'வணக்கம்' : language === 'hi' ? 'नमस्ते' : 'Welcome'}, {currentUser?.name || 'Muthusamy Gounder'}!
            </h2>
            <p className="text-xs sm:text-sm text-[#F2EFE6]/90 max-w-xl mt-1">
              Direct selling without commission. You keep 100% of your listed produce sales.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsListProduceOpen(true)}
              className="px-5 py-3 bg-white hover:bg-[#F2EFE6] text-[#4A6741] font-bold text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5 text-[#4A6741]" />
              <span>{t.farmerNavSell}</span>
            </button>

            <button
              onClick={() => setIsPaddyToRiceOpen(true)}
              className="px-4 py-3 bg-[#D97757] hover:bg-[#BF5E3E] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Wheat className="w-5 h-5 text-white" />
              <span>{t.btnConvertPaddy}</span>
            </button>

            <button
              onClick={onOpenIVR}
              className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-2xl border border-white/20 flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-5 h-5 text-[#E9C46A]" />
              <span className="hidden sm:inline">Voice IVR</span>
            </button>
          </div>
        </div>

        {/* Farmer Top Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#F2EFE6] block font-medium">Active Crop Listings</span>
            <span className="text-2xl font-black text-white font-mono">{myProducts.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#F2EFE6] block font-medium">Pending Orders</span>
            <span className="text-2xl font-black text-[#E9C46A] font-mono">
              {pendingOrdersCount}{' '}
              {pendingOrdersCount > 0 && <span className="text-xs font-bold text-[#E9C46A] bg-black/20 px-1.5 py-0.5 rounded-md">New!</span>}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#F2EFE6] block font-medium">Total Direct Earnings</span>
            <span className="text-2xl font-black text-white font-mono">₹{totalEarnings.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#F2EFE6] block font-medium">Solar Stored Crates</span>
            <span className="text-2xl font-black text-[#A8D5BA] font-mono">
              {myProducts.filter((p) => p.storageRequired).length}
            </span>
          </div>
        </div>
      </div>

      {/* Large Navigation Tabs for Ease of Use */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveTab('MY_PRODUCTS')}
          className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'MY_PRODUCTS'
              ? 'border-[#4A6741] bg-[#4A6741] text-white shadow-xs'
              : 'border-[#E6E2D3] bg-white text-[#827D6B] hover:bg-[#F2EFE6] hover:text-[#2D3129]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.farmerNavMyProducts}</span>
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`relative p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'ORDERS'
              ? 'border-[#4A6741] bg-[#4A6741] text-white shadow-xs'
              : 'border-[#E6E2D3] bg-white text-[#827D6B] hover:bg-[#F2EFE6] hover:text-[#2D3129]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.farmerNavOrders}</span>
          {pendingOrdersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-[#D97757] text-white rounded-full text-[10px] font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('STOCK_ALERTS')}
          className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'STOCK_ALERTS'
              ? 'border-[#4A6741] bg-[#4A6741] text-white shadow-xs'
              : 'border-[#E6E2D3] bg-white text-[#827D6B] hover:bg-[#F2EFE6] hover:text-[#2D3129]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t.farmerNavStockAlerts}</span>
          {stockAlerts.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-[#E9C46A] text-[#2D3129] font-bold rounded-md text-[10px]">
              {stockAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('PRICES')}
          className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'PRICES'
              ? 'border-[#4A6741] bg-[#4A6741] text-white shadow-xs'
              : 'border-[#E6E2D3] bg-white text-[#827D6B] hover:bg-[#F2EFE6] hover:text-[#2D3129]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t.farmerNavPrices}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="mt-4">
        {activeTab === 'MY_PRODUCTS' && (
          <FarmerProductList
            products={myProducts}
            language={language}
            onOpenListProduce={() => setIsListProduceOpen(true)}
            onOpenPaddyToRice={() => setIsPaddyToRiceOpen(true)}
            onOpenTraceability={onOpenTraceability}
          />
        )}

        {activeTab === 'ORDERS' && (
          <FarmerOrders
            orders={myOrders}
            language={language}
            onOpenTraceability={onOpenTraceability}
          />
        )}

        {activeTab === 'STOCK_ALERTS' && (
          <FarmerStockAlerts alerts={stockAlerts} language={language} />
        )}

        {activeTab === 'PRICES' && (
          <FarmerPriceAssistant language={language} />
        )}
      </div>

      {/* Modal: List Produce Form */}
      <ListProduceModal
        isOpen={isListProduceOpen}
        onClose={() => setIsListProduceOpen(false)}
        language={language}
        onSuccess={(newProd) => {
          setActiveTab('MY_PRODUCTS');
        }}
      />

      {/* Modal: Paddy to Rice Value Addition */}
      <PaddyToRiceModal
        isOpen={isPaddyToRiceOpen}
        onClose={() => setIsPaddyToRiceOpen(false)}
        language={language}
        paddyProducts={paddyProducts}
        onConversionSuccess={(newRice) => {
          setActiveTab('MY_PRODUCTS');
        }}
      />
    </div>
  );
};
