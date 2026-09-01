import React, { useState } from 'react';
import {
  ShoppingBasket,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Eye,
  X,
  CreditCard,
  Truck,
  Check,
  Filter,
  Navigation,
  ExternalLink,
  ChevronRight,
  Sprout,
} from 'lucide-react';
import { ProductListing, Order, Language, UserProfile, ProductCategory } from '../../types';
import { storageService } from '../../services/storageService';
import { EligibilityService } from '../../services/eligibilityService';
import { getTranslation } from '../../translations';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { OrderTrackingModal } from './OrderTrackingModal';

interface GroceryMarketplaceProps {
  language: Language;
  currentUser: UserProfile | null;
  products: ProductListing[];
  orders: Order[];
  onOpenTraceability: (batchId: string) => void;
}

export const GroceryMarketplace: React.FC<GroceryMarketplaceProps> = ({
  language,
  currentUser,
  products,
  orders,
  onOpenTraceability,
}) => {
  const t = getTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_ORDERS'>('MARKET');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');

  // Tracking Modal State
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<{ product: ProductListing; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.location || 'R.S. Puram, Coimbatore');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD' | 'CARD'>('UPI');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string>('');

  // Grocery buyers are eligible for all products (including Raw Paddy and Raw Wheat)
  const eligibleProducts = EligibilityService.filterEligibleProducts(products, 'GROCERY');

  // Filter by category and search query
  const filteredProducts = eligibleProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL'
        ? true
        : selectedCategory === 'NEARBY'
        ? true
        : p.category === selectedCategory;

    const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matchesSearch =
      queryTokens.length === 0
        ? true
        : queryTokens.every((token) =>
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

    return matchesCategory && matchesSearch;
  });

  const myGroceryOrders = orders.filter(
    (o) => o.buyerId === currentUser?.id || o.buyerRole === 'GROCERY'
  );

  // Filtered orders for tab
  const filteredOrders = myGroceryOrders.filter((ord) => {
    if (orderFilter === 'ACTIVE') return ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED';
    if (orderFilter === 'DELIVERED') return ord.status === 'DELIVERED';
    return true;
  });

  // Active in-flight order for quick tracker banner
  const activeInTransitOrder = myGroceryOrders.find(
    (o) => o.status === 'IN_TRANSIT' || o.status === 'PREPARING' || o.status === 'PICKED_UP'
  );

  const openOrderTracker = (order: Order) => {
    setSelectedTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  const addToCart = (product: ProductListing, qty = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: Math.min(product.quantity, item.qty + qty) }
            : item
        )
      );
    } else {
      setCart([...cart, { product, qty }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.expectedPrice * item.qty, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Group items by farmer if multiple
    const firstItem = cart[0];
    const orderItems = cart.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      quantity: i.qty,
      unitPrice: i.product.expectedPrice,
      totalPrice: i.product.expectedPrice * i.qty,
      unit: i.product.unit,
      batchId: i.product.batchId,
    }));

    const buyerProfile: UserProfile = currentUser || {
      id: 'buyer_grocery_01',
      name: 'Kavitha Senthil',
      phone: '9443322110',
      role: 'GROCERY',
      language: language,
      location: deliveryAddress,
    };

    const result = storageService.placeOrder({
      buyer: buyerProfile,
      items: cart.map((i) => ({ product: i.product, quantity: i.qty })),
      deliveryType: 'DIRECT_DELIVERY',
    });

    if (result.success && result.order) {
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setOrderSuccessMsg(`Order #${result.order.id} placed directly with ${firstItem.product.farmerName}!`);
      setActiveTab('MY_ORDERS');
    } else {
      alert(result.error || 'Failed to place order.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Grocery Marketplace Hero Banner */}
      <div className="bg-[#4A6741] text-[#FDFCF8] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden border border-[#384F32]">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#384F32] text-[#FDFCF8] uppercase tracking-wider">
                100% Direct Farm Store
              </span>
              <span className="text-xs text-[#E6F0E4]">
                Fresh Harvest • Zero Chemical Wax • Direct Fair Pricing
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.groceryMarketTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#E6F0E4] max-w-xl mt-1">
              {t.groceryMarketSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-5 py-3 bg-[#FDFCF8] hover:bg-[#F2EFE6] text-[#2D3129] font-bold text-sm rounded-2xl shadow-xs flex items-center gap-2 transition-all"
            >
              <ShoppingBasket className="w-5 h-5 text-[#4A6741]" />
              <span>Cart ({cart.reduce((s, i) => s + i.qty, 0)})</span>
              {cart.length > 0 && (
                <span className="text-xs font-black font-mono text-[#4A6741] ml-1">
                  ₹{cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search & Category Pills Bar */}
        <div className="mt-6 pt-5 border-t border-[#384F32] flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#827D6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tomatoes, paddy, rice, village..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/95 text-[#2D3129] placeholder-[#827D6B] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D97757]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: t.tabAllProduce },
              { id: 'VEGETABLE', label: t.catVegetable },
              { id: 'FRUIT', label: t.catFruit },
              { id: 'PADDY', label: `${t.catPaddy} (Direct)` },
              { id: 'WHEAT', label: `${t.catWheat} (Direct)` },
              { id: 'RICE', label: t.catRice },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('MARKET');
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id && activeTab === 'MARKET'
                    ? 'bg-[#FDFCF8] text-[#2D3129] shadow-xs'
                    : 'bg-[#384F32]/60 text-[#FDFCF8] hover:bg-[#384F32]'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <button
              onClick={() => setActiveTab('MY_ORDERS')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeTab === 'MY_ORDERS'
                  ? 'bg-[#FDFCF8] text-[#2D3129] shadow-xs'
                  : 'bg-[#384F32]/60 text-[#FDFCF8] hover:bg-[#384F32]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.tabMyOrders} ({myGroceryOrders.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {orderSuccessMsg && (
        <div className="p-4 bg-[#E6F0E4] border border-[#C5D9C1] rounded-2xl flex items-center justify-between text-xs text-[#2D3129] font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#4A6741]" />
            <span>{orderSuccessMsg}</span>
          </div>
          <button
            onClick={() => setOrderSuccessMsg('')}
            className="text-[#827D6B] hover:text-[#2D3129]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active In-Transit Order Notification Strip */}
      {activeInTransitOrder && activeTab === 'MARKET' && (
        <div className="bg-[#FDF2ED] border border-[#F2C0B0] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97757] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#D97757] uppercase tracking-wide">
                  {language === 'ta'
                    ? 'செயலில் உள்ள நேரடி ஆர்டர் பயணம்'
                    : language === 'hi'
                    ? 'लाइव ऑर्डर डिलीवरी यात्रा'
                    : 'Live Active Order in Progress'}
                </span>
                <span className="font-mono text-xs font-bold text-[#2D3129] bg-white px-2 py-0.5 rounded-md border border-[#F2C0B0]">
                  #{activeInTransitOrder.id}
                </span>
              </div>
              <p className="text-xs text-[#2D3129] mt-0.5">
                {activeInTransitOrder.items.map((i) => i.productName).join(', ')} •{' '}
                <strong className="text-[#4A6741]">ETA: {activeInTransitOrder.estimatedDeliveryTime}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('MY_ORDERS');
              }}
              className="px-4 py-2 bg-[#D97757] hover:bg-[#C26243] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{t.trackOrderTimeline || 'Track Live Lifecycle'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      {activeTab === 'MARKET' ? (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#2D3129]">
                Fresh Harvest from Local Verified Farmers ({filteredProducts.length})
              </h3>
              <p className="text-xs text-[#827D6B]">
                Direct farm gate dispatch to your home • Full traceability with farmer details
              </p>
            </div>
            <span className="text-xs text-[#4A6741] font-bold bg-[#E6F0E4] px-3 py-1 rounded-full border border-[#C5D9C1]">
              ✓ Grocery Household Eligible
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E2D3] shadow-xs">
              <ShoppingBasket className="w-12 h-12 text-[#827D6B] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#2D3129]">No produce matching your search.</p>
              <p className="text-xs text-[#827D6B] mt-1">
                Try searching for another category or clearing filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#E6E2D3] overflow-hidden shadow-xs hover:border-[#4A6741] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Produce Photo */}
                    <div className="relative h-44 w-full bg-[#F2EFE6] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4A6741] text-white shadow-xs">
                          {product.quality}
                        </span>
                        {product.organic && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97757] text-white shadow-xs">
                            🌿 Natural / Organic
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-2xl shadow-xs border border-[#E6E2D3] text-right">
                        <span className="text-sm font-black text-[#4A6741] font-mono">
                          ₹{product.expectedPrice}
                        </span>
                        <span className="text-[10px] text-[#827D6B] font-medium">/{product.unit}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#2D3129] leading-snug line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-[#827D6B] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#827D6B]" />
                          <span>{product.farmerLocation}</span>
                        </div>
                      </div>

                      {/* Farmer info snippet */}
                      <div className="p-2.5 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] text-xs text-[#2D3129] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#827D6B] block font-semibold">Farmer</span>
                          <strong className="text-[#2D3129] font-semibold">{product.farmerName}</strong>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#4A6741] bg-[#E6F0E4] px-2 py-0.5 rounded-lg border border-[#C5D9C1]">
                          {product.quantity} {product.unit} left
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#827D6B] pt-1">
                        <span>Harvest: {product.harvestDate}</span>
                        <button
                          onClick={() => onOpenTraceability(product.batchId)}
                          className="text-[#4A6741] font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Eye className="w-3 h-3" /> Trace
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-3.5 bg-[#FDFCF8] border-t border-[#E6E2D3]">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full py-2.5 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* My Grocery Orders Tab with Visual Timeline */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[#2D3129] flex items-center gap-2">
                <span>{t.tabMyOrders}</span>
                <span className="text-xs bg-[#E6F0E4] text-[#4A6741] font-mono px-2.5 py-0.5 rounded-full font-bold">
                  {myGroceryOrders.length}
                </span>
              </h3>
              <p className="text-xs text-[#827D6B]">
                {language === 'ta'
                  ? 'விவசாயி அறுவடை முதல் உங்கள் வீடு வரை நேரடி கண்காணிப்பு'
                  : language === 'hi'
                  ? 'खेत की कटाई से लेकर आपके पते तक लाइव ऑर्डर स्थिति'
                  : 'Track your order lifecycle from farmer harvest to doorstep delivery'}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#F2EFE6] p-1 rounded-2xl border border-[#E6E2D3]">
              {[
                { id: 'ALL', label: 'All Orders' },
                { id: 'ACTIVE', label: 'In-Progress / Transit' },
                { id: 'DELIVERED', label: 'Delivered' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setOrderFilter(filter.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === filter.id
                      ? 'bg-white text-[#2D3129] shadow-xs'
                      : 'text-[#827D6B] hover:text-[#2D3129]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E2D3] shadow-xs">
              <ShoppingBag className="w-12 h-12 text-[#827D6B] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#2D3129]">
                {orderFilter === 'ALL'
                  ? 'No orders placed yet.'
                  : `No ${orderFilter.toLowerCase()} orders found.`}
              </p>
              <button
                onClick={() => setActiveTab('MARKET')}
                className="mt-3 px-4 py-2 bg-[#4A6741] hover:bg-[#384F32] text-white text-xs font-bold rounded-2xl"
              >
                Browse Fresh Farm Produce
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#E6E2D3] overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Order Overview Header Strip */}
                  <div className="bg-[#F2EFE6] p-4 sm:p-5 border-b border-[#E6E2D3] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold bg-white px-3 py-1 rounded-xl text-[#2D3129] border border-[#E6E2D3] shadow-2xs">
                        #{order.id}
                      </span>
                      <div className="text-xs text-[#2D3129]">
                        <span className="text-[#827D6B]">Harvested by: </span>
                        <strong className="text-[#4A6741] font-bold">{order.farmerName}</strong>{' '}
                        <span className="text-[#827D6B]">({order.farmerLocation})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openOrderTracker(order)}
                        className="px-3 py-1.5 bg-white hover:bg-[#FDFCF8] text-[#4A6741] border border-[#C5D9C1] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{t.trackOrderTimeline || 'Full Tracker Modal'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items & Quick Details Grid */}
                  <div className="p-4 sm:p-5 border-b border-[#F2EFE6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#827D6B] block font-semibold text-[10px] uppercase">
                        Farm Harvest Items
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="font-semibold text-[#2D3129]">
                            • {i.productName} ({i.quantity} {i.unit})
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#827D6B] block font-semibold text-[10px] uppercase">
                        Delivery Destination & ETA
                      </span>
                      <div className="font-medium text-[#2D3129] mt-1">{order.buyerLocation}</div>
                      <div className="text-[#4A6741] font-bold mt-1">
                        ETA: {order.estimatedDeliveryTime}
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[#827D6B] block font-semibold text-[10px] uppercase">
                        Total Amount
                      </span>
                      <div className="text-xl font-black text-[#4A6741] font-mono mt-0.5">
                        ₹{order.totalAmount}
                      </div>
                      <span className="text-[10px] text-[#827D6B] block">
                        Direct Farm Settlement (Zero Commission)
                      </span>
                    </div>
                  </div>

                  {/* Embedded Visual Order Status Timeline */}
                  <div className="p-4 sm:p-5">
                    <OrderStatusTimeline
                      order={order}
                      language={language}
                      onOpenTraceability={onOpenTraceability}
                      isCompact={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Screen Order Tracking Modal */}
      {isTrackingModalOpen && selectedTrackingOrder && (
        <OrderTrackingModal
          order={selectedTrackingOrder}
          isOpen={isTrackingModalOpen}
          onClose={() => {
            setIsTrackingModalOpen(false);
            setSelectedTrackingOrder(null);
          }}
          language={language}
          onOpenTraceability={onOpenTraceability}
        />
      )}

      {/* Shopping Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D3]">
                <div className="flex items-center gap-2">
                  <ShoppingBasket className="w-5 h-5 text-[#4A6741]" />
                  <h3 className="text-lg font-bold text-[#2D3129]">Your Fresh Basket</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-[#827D6B] hover:text-[#2D3129]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center text-[#827D6B] text-xs">
                  Your cart is empty. Add farm fresh produce to proceed!
                </div>
              ) : (
                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 text-xs">
                        <h4 className="font-bold text-[#2D3129]">{item.product.name}</h4>
                        <span className="text-[#827D6B] block">
                          ₹{item.product.expectedPrice}/{item.product.unit} • {item.product.farmerName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-[#E6E2D3] rounded-xl p-1">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                          className="p-1 text-[#827D6B] hover:text-[#2D3129]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1 text-[#2D3129]">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                          className="p-1 text-[#827D6B] hover:text-[#2D3129]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#E6E2D3] space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-[#827D6B]">Subtotal (Direct to Farmer)</span>
                  <span className="text-xl font-black text-[#4A6741] font-mono">₹{cartTotal}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Direct Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E6E2D3] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D3] mb-4">
              <h3 className="text-lg font-bold text-[#2D3129]">Direct Farm Checkout</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-[#827D6B] hover:text-[#2D3129]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs text-[#2D3129] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3129] mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / GPay' },
                    { id: 'COD', label: 'Cash on Delivery' },
                    { id: 'CARD', label: 'Card / NetBank' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2.5 text-xs font-bold rounded-2xl border text-center transition-all ${
                        paymentMethod === p.id
                          ? 'border-[#4A6741] bg-[#E6F0E4] text-[#4A6741] font-bold'
                          : 'border-[#E6E2D3] text-[#2D3129] hover:bg-[#FDFCF8]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#E6F0E4] border border-[#C5D9C1] rounded-2xl text-xs text-[#2D3129] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#827D6B]">Farm Items Total:</span>
                  <span className="font-bold text-[#2D3129]">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#827D6B]">Direct Delivery Fee:</span>
                  <span className="font-bold text-[#4A6741]">FREE (Farm Cluster Route)</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-1.5 border-t border-[#C5D9C1]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#4A6741] text-base">₹{cartTotal}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-3 text-xs font-bold text-[#2D3129] bg-[#F2EFE6] hover:bg-[#E6E2D3] rounded-2xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-sm rounded-2xl shadow-xs transition-colors"
                >
                  Place Order with Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
