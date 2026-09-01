export type Language = 'ta' | 'en' | 'hi';

export type UserRole = 'FARMER' | 'GROCERY' | 'BULK' | 'ADMIN';

export type ProductCategory =
  | 'VEGETABLE'
  | 'FRUIT'
  | 'PADDY'
  | 'WHEAT'
  | 'RICE'
  | 'OTHER';

export type BuyerEligibilityType = 'GROCERY_ONLY' | 'ALL';

export type QuantityUnit = 'kg' | 'quintal' | 'ton' | 'bag' | 'piece';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Standard';

export type StockAgeStatus = 'FRESH' | 'WARNING' | 'URGENT';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'FARMER_ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export type RFQStatus =
  | 'OPEN'
  | 'OFFER_RECEIVED'
  | 'NEGOTIATING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'FULFILLED';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  language: Language;
  location: string;
  villageOrCity?: string;
  district?: string;
  state?: string;
  distanceKm?: number;
  avatarUrl?: string;
  // Farmer specific
  landSizeAcres?: number;
  fpoAffiliation?: string;
  kycVerified?: boolean;
  upiId?: string;
  // Bulk Buyer specific
  businessName?: string;
  businessType?: 'Hotel' | 'Restaurant' | 'Retailer' | 'Food Processor' | 'Commercial Buyer';
  gstin?: string;
  requiredProducts?: string[];
  requiredMonthlyVolume?: string;
  isApproved?: boolean;
}

export interface ProductListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  farmerDistrict: string;
  batchId: string;
  category: ProductCategory;
  name: string;
  nameTranslations?: {
    ta: string;
    en: string;
    hi: string;
  };
  quantity: number;
  originalQuantity: number;
  unit: QuantityUnit;
  quality: QualityGrade;
  harvestDate: string;
  availableFrom: string;
  expectedPrice: number; // in INR
  suggestedPriceMin?: number;
  suggestedPriceMax?: number;
  buyerEligibility: BuyerEligibilityType; // 'GROCERY_ONLY' for Raw Paddy & Raw Wheat
  storageRequired: boolean;
  coldRoomId?: string;
  crateId?: string;
  imageUrl: string;
  qrCodeData: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'SOLD_OUT' | 'UNSOLD_AGING';
  daysInStock: number;
  stockAgeStatus: StockAgeStatus;
  organic: boolean;
  paddyDetails?: {
    totalHarvestBags?: number;
    processedToRiceBags?: number;
    remainingRawPaddyBags?: number;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: QuantityUnit;
  unitPrice: number;
  totalPrice: number;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  buyerEligibility: BuyerEligibilityType;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerRole: 'GROCERY' | 'BULK';
  buyerLocation: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryType: 'DIRECT_DELIVERY' | 'FARM_PICKUP' | 'COLD_ROOM_PICKUP';
  distanceKm: number;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface BulkRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerBusinessName: string;
  buyerBusinessType: string;
  buyerLocation: string;
  buyerPhone: string;
  category: ProductCategory;
  productName: string;
  requiredQuantity: number;
  unit: QuantityUnit;
  targetPrice: number;
  requiredDate: string;
  notes: string;
  status: RFQStatus;
  createdAt: string;
  offers: BulkOffer[];
}

export interface BulkOffer {
  id: string;
  rfqId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  offeredQuantity: number;
  unit: QuantityUnit;
  offeredPrice: number;
  availableDate: string;
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  counterPrice?: number;
  counterQuantity?: number;
  createdAt: string;
}

export interface ColdRoomBatch {
  id: string;
  coldRoomId: string;
  crateId: string;
  farmerId: string;
  farmerName: string;
  batchId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: QuantityUnit;
  quality: QualityGrade;
  storageDate: string;
  expiryDate: string;
  temperature: number; // Celsius
  pricePerUnit: number;
  remainingStock: number;
  qrCode: string;
  status: 'STORED' | 'PARTIALLY_DISPATCHED' | 'EXPIRING_SOON' | 'DISPATCHED';
}

export interface ColdRoom {
  id: string;
  name: string;
  operator: string; // e.g. "Thondamuthur Farmers Producer Org"
  location: string;
  district: string;
  capacityMetricTons: number;
  occupiedMetricTons: number;
  currentTempCelsius: number;
  currentHumidityPercent: number;
  status: 'OPTIMAL' | 'NEAR_CAPACITY' | 'MAINTENANCE';
  batches: ColdRoomBatch[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  userRole: UserRole;
  title: string;
  message: string;
  type: 'ORDER' | 'ALERT' | 'BULK_RFQ' | 'PRICE' | 'COLD_STORAGE' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  actionLink?: string;
  metadata?: Record<string, any>;
}

export interface PriceTrend {
  category: ProductCategory;
  productName: string;
  currentAvgPrice: number;
  previousWeekAvgPrice: number;
  unit: QuantityUnit;
  trend: 'UP' | 'DOWN' | 'STABLE';
  changePercent: number;
  suggestedSellingRange: {
    min: number;
    max: number;
  };
  mandiPriceGovt: number;
}

export interface DemandPrediction {
  productName: string;
  category: ProductCategory;
  location: string;
  forecastPeriod: string;
  demandLevel: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  confidencePercent: number;
  recommendedAction: string;
  primaryBuyerTypes: string[];
}

export interface UnsoldStockAlert {
  productId: string;
  farmerId: string;
  productName: string;
  category: ProductCategory;
  remainingQuantity: number;
  unit: QuantityUnit;
  daysUnsold: number;
  currentPrice: number;
  urgency: 'WARNING' | 'URGENT';
  eligibleBuyerTypes: string[];
  recommendedDiscountPercent: number;
  recommendedTargetPrice: number;
  suggestedBuyers: {
    name: string;
    type: string;
    location: string;
    distanceKm: number;
  }[];
}

export type BulkRFQ = BulkRequirement;
export type NegotiationOffer = BulkOffer;

