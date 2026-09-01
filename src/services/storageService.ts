import {
  UserProfile,
  ProductListing,
  Order,
  BulkRequirement,
  ColdRoom,
  NotificationItem,
  PriceTrend,
  DemandPrediction,
  UnsoldStockAlert,
  ProductCategory,
  Language,
  UserRole,
  OrderStatus,
} from '../types';
import { EligibilityService } from './eligibilityService';

const STORAGE_KEYS = {
  CURRENT_USER: 'fc_current_user',
  LANGUAGE: 'fc_selected_language',
  PRODUCTS: 'fc_products_data',
  ORDERS: 'fc_orders_data',
  BULK_RFQS: 'fc_bulk_rfqs',
  COLD_ROOMS: 'fc_cold_rooms',
  NOTIFICATIONS: 'fc_notifications',
  PRICE_DATA: 'fc_price_data',
};

// Initial Seed Users
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'farmer_01',
    phone: '9842156789',
    name: 'Muthusamy Gounder',
    role: 'FARMER',
    language: 'ta',
    location: 'Thondamuthur Village, Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    distanceKm: 3.8,
    landSizeAcres: 5.5,
    fpoAffiliation: 'Thondamuthur Farmers Producer Co.',
    kycVerified: true,
    upiId: 'muthusamy@oksbi',
    avatarUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'farmer_02',
    phone: '9876543210',
    name: 'Ramesh Kumar Patel',
    role: 'FARMER',
    language: 'hi',
    location: 'Sirsi Rural, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    distanceKm: 8.2,
    landSizeAcres: 8.0,
    fpoAffiliation: 'Ganga Valley Agro Producer Group',
    kycVerified: true,
    upiId: 'ramesh.farmer@icici',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'grocery_01',
    phone: '9443322110',
    name: 'Kavitha Senthil',
    role: 'GROCERY',
    language: 'ta',
    location: 'RS Puram, Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    distanceKm: 3.5,
  },
  {
    id: 'bulk_01',
    phone: '9894455667',
    name: 'Anand V (Procurement Head)',
    businessName: 'Annapoorna Hospitality Group',
    businessType: 'Restaurant',
    role: 'BULK',
    language: 'en',
    location: 'Gandhipuram, Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    distanceKm: 6.0,
    gstin: '33AABCA1234F1Z5',
    requiredProducts: ['Tomato', 'Onion', 'Potato', 'Processed Rice', 'Cabbage'],
    requiredMonthlyVolume: '15-20 Metric Tons',
    isApproved: true,
  },
  {
    id: 'admin_01',
    phone: '9000000000',
    name: 'Dr. S. Shanmugam (FPO Lead)',
    role: 'ADMIN',
    language: 'en',
    location: 'Agro Centre, Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
  },
];

// Initial Seed Products
const INITIAL_PRODUCTS: ProductListing[] = [
  {
    id: 'prod_01',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    farmerDistrict: 'Coimbatore',
    batchId: 'BATCH-TM-2026-089',
    category: 'VEGETABLE',
    name: 'Country Tomatoes (நாட்டு தக்காளி)',
    nameTranslations: {
      ta: 'நாட்டு தக்காளி',
      en: 'Country Tomatoes',
      hi: 'देसी टमाटर',
    },
    quantity: 120,
    originalQuantity: 200,
    unit: 'kg',
    quality: 'Grade A',
    harvestDate: '2026-08-30',
    availableFrom: '2026-08-31',
    expectedPrice: 24,
    suggestedPriceMin: 22,
    suggestedPriceMax: 26,
    buyerEligibility: 'ALL',
    storageRequired: true,
    coldRoomId: 'CR_COIMB_01',
    crateId: 'CRT-A-14',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD01-BATCH-TM-2026-089',
    status: 'AVAILABLE',
    daysInStock: 2,
    stockAgeStatus: 'FRESH',
    organic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_02',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    farmerDistrict: 'Coimbatore',
    batchId: 'BATCH-PAD-2026-012',
    category: 'PADDY',
    name: 'Bhavani Ponni Raw Paddy (பவானி பொன்னி பச்சை நெல்)',
    nameTranslations: {
      ta: 'பவானி பொன்னி பச்சை நெல்',
      en: 'Bhavani Ponni Raw Paddy',
      hi: 'भवानी पोन्नी कच्चा धान',
    },
    quantity: 280, // bags
    originalQuantity: 300,
    unit: 'bag',
    quality: 'Grade A',
    harvestDate: '2026-08-25',
    availableFrom: '2026-08-28',
    expectedPrice: 1450, // per 50kg bag
    suggestedPriceMin: 1400,
    suggestedPriceMax: 1500,
    buyerEligibility: 'GROCERY_ONLY', // Strict Rule
    storageRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD02-BATCH-PAD-2026-012-GROCERYONLY',
    status: 'AVAILABLE',
    daysInStock: 6,
    stockAgeStatus: 'FRESH',
    organic: false,
    paddyDetails: {
      totalHarvestBags: 300,
      processedToRiceBags: 20,
      remainingRawPaddyBags: 280,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_03',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    farmerDistrict: 'Coimbatore',
    batchId: 'BATCH-RIC-2026-004',
    category: 'RICE',
    name: 'Deluxe Milled Ponni Rice (அரைத்த பொன்னி அரிசி)',
    nameTranslations: {
      ta: 'அரைத்த பொன்னி அரிசி',
      en: 'Deluxe Milled Ponni Rice',
      hi: 'पॉलिश पोन्नी चावल',
    },
    quantity: 680, // kg (from 20 bags milled)
    originalQuantity: 680,
    unit: 'kg',
    quality: 'Grade A',
    harvestDate: '2026-08-25',
    availableFrom: '2026-08-29',
    expectedPrice: 58,
    suggestedPriceMin: 55,
    suggestedPriceMax: 62,
    buyerEligibility: 'ALL', // Milled rice allowed for Bulk & Grocery
    storageRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD03-BATCH-RIC-2026-004-RICE-ALL',
    status: 'AVAILABLE',
    daysInStock: 3,
    stockAgeStatus: 'FRESH',
    organic: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_04',
    farmerId: 'farmer_02',
    farmerName: 'Ramesh Kumar Patel',
    farmerPhone: '9876543210',
    farmerLocation: 'Sirsi Rural, Varanasi',
    farmerDistrict: 'Varanasi',
    batchId: 'BATCH-WHT-2026-051',
    category: 'WHEAT',
    name: 'Sharbati Raw Golden Wheat (शरबती कच्चा गेहूं)',
    nameTranslations: {
      ta: 'சர்பதி மூல கோதுமை',
      en: 'Sharbati Raw Golden Wheat',
      hi: 'शरबती कच्चा गेहूं',
    },
    quantity: 150,
    originalQuantity: 150,
    unit: 'bag',
    quality: 'Grade A',
    harvestDate: '2026-08-20',
    availableFrom: '2026-08-25',
    expectedPrice: 1600,
    suggestedPriceMin: 1550,
    suggestedPriceMax: 1650,
    buyerEligibility: 'GROCERY_ONLY', // Strict Rule
    storageRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD04-BATCH-WHT-2026-051-GROCERYONLY',
    status: 'AVAILABLE',
    daysInStock: 7,
    stockAgeStatus: 'FRESH',
    organic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_05',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    farmerDistrict: 'Coimbatore',
    batchId: 'BATCH-BRJ-2026-077',
    category: 'VEGETABLE',
    name: 'Green Round Brinjal (பச்சை கத்தரிக்காய்)',
    nameTranslations: {
      ta: 'பச்சை கத்தரிக்காய்',
      en: 'Green Round Brinjal',
      hi: 'हरा गोल बैंगन',
    },
    quantity: 80,
    originalQuantity: 100,
    unit: 'kg',
    quality: 'Grade A',
    harvestDate: '2026-08-29',
    availableFrom: '2026-08-30',
    expectedPrice: 28,
    suggestedPriceMin: 25,
    suggestedPriceMax: 30,
    buyerEligibility: 'ALL',
    storageRequired: true,
    coldRoomId: 'CR_COIMB_01',
    crateId: 'CRT-B-08',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD05-BATCH-BRJ-2026-077',
    status: 'AVAILABLE',
    daysInStock: 3,
    stockAgeStatus: 'FRESH',
    organic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_06',
    farmerId: 'farmer_02',
    farmerName: 'Ramesh Kumar Patel',
    farmerPhone: '9876543210',
    farmerLocation: 'Sirsi Rural, Varanasi',
    farmerDistrict: 'Varanasi',
    batchId: 'BATCH-ONN-2026-042',
    category: 'VEGETABLE',
    name: 'Red Bellary Onion (சிவப்பு வெங்காயம்)',
    nameTranslations: {
      ta: 'சிவப்பு வெங்காயம்',
      en: 'Red Bellary Onion',
      hi: 'लाल प्याज',
    },
    quantity: 450,
    originalQuantity: 500,
    unit: 'kg',
    quality: 'Grade A',
    harvestDate: '2026-08-22',
    availableFrom: '2026-08-26',
    expectedPrice: 32,
    suggestedPriceMin: 30,
    suggestedPriceMax: 35,
    buyerEligibility: 'ALL',
    storageRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD06-BATCH-ONN-2026-042',
    status: 'AVAILABLE',
    daysInStock: 6,
    stockAgeStatus: 'FRESH',
    organic: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_07',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    farmerDistrict: 'Coimbatore',
    batchId: 'BATCH-BAN-2026-019',
    category: 'FRUIT',
    name: 'Grand Naine Cavendish Banana (வாழைப்பழம்)',
    nameTranslations: {
      ta: 'நேந்திரம் வாழைப்பழம்',
      en: 'Grand Naine Banana',
      hi: 'केला (ग्रैंड नैन)',
    },
    quantity: 35,
    originalQuantity: 60,
    unit: 'bag',
    quality: 'Grade A',
    harvestDate: '2026-08-27',
    availableFrom: '2026-08-29',
    expectedPrice: 420,
    suggestedPriceMin: 400,
    suggestedPriceMax: 450,
    buyerEligibility: 'ALL',
    storageRequired: true,
    coldRoomId: 'CR_COIMB_01',
    crateId: 'CRT-C-02',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD07-BATCH-BAN-2026-019',
    status: 'AVAILABLE',
    daysInStock: 5,
    stockAgeStatus: 'WARNING', // Approaching spoilage alert example
    organic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_08',
    farmerId: 'farmer_02',
    farmerName: 'Ramesh Kumar Patel',
    farmerPhone: '9876543210',
    farmerLocation: 'Sirsi Rural, Varanasi',
    farmerDistrict: 'Varanasi',
    batchId: 'BATCH-POT-2026-099',
    category: 'VEGETABLE',
    name: 'Fresh Jyoti Potato (உருளைக்கிழங்கு)',
    nameTranslations: {
      ta: 'உருளைக்கிழங்கு',
      en: 'Fresh Jyoti Potato',
      hi: 'ज्योति आलू',
    },
    quantity: 800,
    originalQuantity: 1000,
    unit: 'kg',
    quality: 'Grade B',
    harvestDate: '2026-08-20',
    availableFrom: '2026-08-24',
    expectedPrice: 18,
    suggestedPriceMin: 16,
    suggestedPriceMax: 20,
    buyerEligibility: 'ALL',
    storageRequired: true,
    coldRoomId: 'CR_VARANASI_01',
    crateId: 'CRT-P-90',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    qrCodeData: 'FC-TRACE-PROD08-BATCH-POT-2026-099',
    status: 'AVAILABLE',
    daysInStock: 8,
    stockAgeStatus: 'FRESH',
    organic: false,
    createdAt: new Date().toISOString(),
  },
];

// Initial Seed Cold Storage Units
const INITIAL_COLD_ROOMS: ColdRoom[] = [
  {
    id: 'CR_COIMB_01',
    name: 'Solar Cold Room #1 (Thondamuthur FPO)',
    operator: 'Thondamuthur Farmers Producer Organisation (FPO)',
    location: 'Pillayarpuram Junction, Thondamuthur',
    district: 'Coimbatore',
    capacityMetricTons: 15.0,
    occupiedMetricTons: 6.4,
    currentTempCelsius: 4.5,
    currentHumidityPercent: 88,
    status: 'OPTIMAL',
    batches: [
      {
        id: 'CRB_01',
        coldRoomId: 'CR_COIMB_01',
        crateId: 'CRT-A-14',
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        batchId: 'BATCH-TM-2026-089',
        productName: 'Country Tomatoes (நாட்டு தக்காளி)',
        category: 'VEGETABLE',
        quantity: 120,
        unit: 'kg',
        quality: 'Grade A',
        storageDate: '2026-08-31',
        expiryDate: '2026-09-14',
        temperature: 4.5,
        pricePerUnit: 24,
        remainingStock: 120,
        qrCode: 'FC-COLD-CR01-CRTA14-BATCH-TM-2026-089',
        status: 'STORED',
      },
      {
        id: 'CRB_02',
        coldRoomId: 'CR_COIMB_01',
        crateId: 'CRT-B-08',
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        batchId: 'BATCH-BRJ-2026-077',
        productName: 'Green Round Brinjal',
        category: 'VEGETABLE',
        quantity: 80,
        unit: 'kg',
        quality: 'Grade A',
        storageDate: '2026-08-30',
        expiryDate: '2026-09-12',
        temperature: 4.5,
        pricePerUnit: 28,
        remainingStock: 80,
        qrCode: 'FC-COLD-CR01-CRTB08-BATCH-BRJ-2026-077',
        status: 'STORED',
      },
      {
        id: 'CRB_03',
        coldRoomId: 'CR_COIMB_01',
        crateId: 'CRT-C-02',
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        batchId: 'BATCH-BAN-2026-019',
        productName: 'Cavendish Banana',
        category: 'FRUIT',
        quantity: 35,
        unit: 'bag',
        quality: 'Grade A',
        storageDate: '2026-08-29',
        expiryDate: '2026-09-06',
        temperature: 12.0,
        pricePerUnit: 420,
        remainingStock: 35,
        qrCode: 'FC-COLD-CR01-CRTC02-BATCH-BAN-2026-019',
        status: 'EXPIRING_SOON',
      },
    ],
  },
  {
    id: 'CR_VARANASI_01',
    name: 'Kashi Agro Solar Cold Chain Hub',
    operator: 'Ganga Valley Agro Cooperative',
    location: 'NH-2 Bypass, Sirsi, Varanasi',
    district: 'Varanasi',
    capacityMetricTons: 25.0,
    occupiedMetricTons: 14.8,
    currentTempCelsius: 3.8,
    currentHumidityPercent: 91,
    status: 'OPTIMAL',
    batches: [
      {
        id: 'CRB_04',
        coldRoomId: 'CR_VARANASI_01',
        crateId: 'CRT-P-90',
        farmerId: 'farmer_02',
        farmerName: 'Ramesh Kumar Patel',
        batchId: 'BATCH-POT-2026-099',
        productName: 'Fresh Jyoti Potato',
        category: 'VEGETABLE',
        quantity: 800,
        unit: 'kg',
        quality: 'Grade B',
        storageDate: '2026-08-24',
        expiryDate: '2026-11-20',
        temperature: 3.8,
        pricePerUnit: 18,
        remainingStock: 800,
        qrCode: 'FC-COLD-CR02-CRTP90-BATCH-POT-2026-099',
        status: 'STORED',
      },
    ],
  },
];

// Initial Seed Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8812',
    buyerId: 'grocery_01',
    buyerName: 'Kavitha Senthil',
    buyerPhone: '9443322110',
    buyerRole: 'GROCERY',
    buyerLocation: 'RS Puram, Coimbatore (3.5 km)',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    items: [
      {
        productId: 'prod_01',
        productName: 'Country Tomatoes (நாட்டு தக்காளி)',
        category: 'VEGETABLE',
        quantity: 10,
        unit: 'kg',
        unitPrice: 24,
        totalPrice: 240,
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        farmerLocation: 'Thondamuthur',
        buyerEligibility: 'ALL',
      },
      {
        productId: 'prod_03',
        productName: 'Deluxe Milled Ponni Rice',
        category: 'RICE',
        quantity: 25,
        unit: 'kg',
        unitPrice: 58,
        totalPrice: 1450,
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        farmerLocation: 'Thondamuthur',
        buyerEligibility: 'ALL',
      },
    ],
    totalAmount: 1690,
    status: 'IN_TRANSIT',
    deliveryType: 'DIRECT_DELIVERY',
    distanceKm: 3.8,
    estimatedDeliveryTime: 'Today by 4:30 PM (45 mins)',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    timeline: [
      {
        status: 'ORDER_PLACED',
        timestamp: '1:15 PM',
        note: 'Order placed by Grocery Buyer Kavitha',
      },
      {
        status: 'FARMER_ACCEPTED',
        timestamp: '1:20 PM',
        note: 'Farmer Muthusamy confirmed order & price lock',
      },
      {
        status: 'PREPARING',
        timestamp: '2:00 PM',
        note: 'Harvested fresh from Thondamuthur farm field & packed in eco-crates (Grade A)',
      },
      {
        status: 'PICKED_UP',
        timestamp: '3:15 PM',
        note: 'Rural logistics eco-van (TN-38-AF-2024) picked up produce with temperature seal',
      },
      {
        status: 'IN_TRANSIT',
        timestamp: '3:30 PM',
        note: 'On route via Thondamuthur - RS Puram Road corridor (ETA: 25 mins)',
      },
    ],
  },
  {
    id: 'ORD-2026-9041',
    buyerId: 'grocery_01',
    buyerName: 'Kavitha Senthil',
    buyerPhone: '9443322110',
    buyerRole: 'GROCERY',
    buyerLocation: 'RS Puram, Coimbatore (3.5 km)',
    farmerId: 'farmer_02',
    farmerName: 'Ramasamy K',
    farmerPhone: '9842233445',
    farmerLocation: 'Kinathukadavu, Coimbatore',
    items: [
      {
        productId: 'prod_02',
        productName: 'Small Shallot Onions (சின்ன வெங்காயம்)',
        category: 'VEGETABLE',
        quantity: 5,
        unit: 'kg',
        unitPrice: 42,
        totalPrice: 210,
        farmerId: 'farmer_02',
        farmerName: 'Ramasamy K',
        farmerLocation: 'Kinathukadavu',
        buyerEligibility: 'ALL',
      },
      {
        productId: 'prod_05',
        productName: 'Fresh Country Spinach (பசலைக் கீரை)',
        category: 'VEGETABLE',
        quantity: 4,
        unit: 'piece',
        unitPrice: 15,
        totalPrice: 60,
        farmerId: 'farmer_02',
        farmerName: 'Ramasamy K',
        farmerLocation: 'Kinathukadavu',
        buyerEligibility: 'ALL',
      },
    ],
    totalAmount: 270,
    status: 'PREPARING',
    deliveryType: 'DIRECT_DELIVERY',
    distanceKm: 6.2,
    estimatedDeliveryTime: 'Today by 5:45 PM',
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    timeline: [
      {
        status: 'ORDER_PLACED',
        timestamp: '3:10 PM',
        note: 'Order placed by Grocery Buyer Kavitha',
      },
      {
        status: 'FARMER_ACCEPTED',
        timestamp: '3:14 PM',
        note: 'Farmer Ramasamy accepted incoming request',
      },
      {
        status: 'PREPARING',
        timestamp: '3:45 PM',
        note: 'Farmer harvested shallots & spinach fresh from plot #3; washing and sorting into crates',
      },
    ],
  },
  {
    id: 'ORD-2026-7734',
    buyerId: 'grocery_01',
    buyerName: 'Kavitha Senthil',
    buyerPhone: '9443322110',
    buyerRole: 'GROCERY',
    buyerLocation: 'RS Puram, Coimbatore (3.5 km)',
    farmerId: 'farmer_01',
    farmerName: 'Muthusamy Gounder',
    farmerPhone: '9842156789',
    farmerLocation: 'Thondamuthur, Coimbatore',
    items: [
      {
        productId: 'prod_04',
        productName: 'Traditional Raw Ponni Paddy (பச்சை நெல் மூட்டை)',
        category: 'PADDY',
        quantity: 2,
        unit: 'bag',
        unitPrice: 1250,
        totalPrice: 2500,
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        farmerLocation: 'Thondamuthur',
        buyerEligibility: 'GROCERY_ONLY',
      },
    ],
    totalAmount: 2500,
    status: 'DELIVERED',
    deliveryType: 'DIRECT_DELIVERY',
    distanceKm: 3.5,
    estimatedDeliveryTime: 'Delivered (Yesterday at 5:10 PM)',
    createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    timeline: [
      {
        status: 'ORDER_PLACED',
        timestamp: 'Yesterday 11:00 AM',
        note: 'Paddy bags order placed by Kavitha',
      },
      {
        status: 'FARMER_ACCEPTED',
        timestamp: 'Yesterday 11:15 AM',
        note: 'Farmer Muthusamy verified farm stock & moisture level',
      },
      {
        status: 'PREPARING',
        timestamp: 'Yesterday 12:30 PM',
        note: 'Jute bags tagged with QR BATCH_COIMB_01 and quality inspected',
      },
      {
        status: 'PICKED_UP',
        timestamp: 'Yesterday 3:00 PM',
        note: 'FPO logistics vehicle loaded with batch',
      },
      {
        status: 'IN_TRANSIT',
        timestamp: 'Yesterday 4:15 PM',
        note: 'Arrived at delivery locality',
      },
      {
        status: 'DELIVERED',
        timestamp: 'Yesterday 5:10 PM',
        note: 'Delivered to buyer doorstep. OTP verified & payment settled to farmer UPI.',
      },
    ],
  },
];

// Initial Seed Bulk RFQs
const INITIAL_BULK_RFQS: BulkRequirement[] = [
  {
    id: 'RFQ-2026-044',
    buyerId: 'bulk_01',
    buyerName: 'Anand V',
    buyerBusinessName: 'Annapoorna Hospitality Group',
    buyerBusinessType: 'Restaurant & Catering',
    buyerLocation: 'Gandhipuram, Coimbatore (6.0 km)',
    buyerPhone: '9894455667',
    category: 'VEGETABLE',
    productName: 'Country Tomatoes (நாட்டு தக்காளி)',
    requiredQuantity: 500,
    unit: 'kg',
    targetPrice: 20,
    requiredDate: 'Tomorrow, 7:00 AM',
    notes: 'Require firm Grade A tomatoes for high-volume central kitchen daily gravy preparation.',
    status: 'OFFER_RECEIVED',
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    offers: [
      {
        id: 'OFFER-01',
        rfqId: 'RFQ-2026-044',
        farmerId: 'farmer_01',
        farmerName: 'Muthusamy Gounder',
        farmerPhone: '9842156789',
        farmerLocation: 'Thondamuthur, Coimbatore (5.8 km)',
        offeredQuantity: 300,
        unit: 'kg',
        offeredPrice: 22,
        availableDate: 'Tomorrow 6:30 AM',
        notes: 'Can supply 300 kg freshly plucked ripe Grade A tomatoes directly from our farm & cold storage.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      },
    ],
  },
  {
    id: 'RFQ-2026-045',
    buyerId: 'bulk_01',
    buyerName: 'Anand V',
    buyerBusinessName: 'Annapoorna Hospitality Group',
    buyerBusinessType: 'Restaurant & Catering',
    buyerLocation: 'Gandhipuram, Coimbatore',
    buyerPhone: '9894455667',
    category: 'RICE',
    productName: 'Milled Sona Masoori / Ponni Rice',
    requiredQuantity: 2000,
    unit: 'kg',
    targetPrice: 52,
    requiredDate: 'Within 3 Days',
    notes: 'Looking for continuous monthly supplier of aged milled rice. Must be stone-free.',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    offers: [],
  },
];

// Initial Seed Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'farmer_01',
    userRole: 'FARMER',
    title: 'New Nearby Grocery Order Received!',
    message: 'Kavitha (3.5 km away, RS Puram) ordered 5 kg Shallots & 4 pcs Country Spinach (₹270). Instant direct settlement locked.',
    type: 'ORDER',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: {
      orderId: 'ORD-2026-9041',
      buyerName: 'Kavitha Senthil',
      status: 'PREPARING',
      amount: 270,
    },
  },
  {
    id: 'notif_02',
    userId: 'farmer_01',
    userRole: 'FARMER',
    title: 'Order Dispatched & In Transit',
    message: 'Order #ORD-2026-9041 picked up by eco-delivery corridor vehicle. Live ETA: 5:45 PM (6.2 km).',
    type: 'ORDER',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata: {
      orderId: 'ORD-2026-9041',
      status: 'IN_TRANSIT',
      eta: '5:45 PM',
    },
  },
  {
    id: 'notif_03',
    userId: 'farmer_01',
    userRole: 'FARMER',
    title: 'New Bulk RFQ: 500 kg Country Tomatoes',
    message: 'Annapoorna Hospitality Group posted an urgent RFQ in Gandhipuram @ target price ₹20/kg for tomorrow morning delivery.',
    type: 'BULK_RFQ',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    metadata: {
      rfqId: 'RFQ-2026-044',
      buyer: 'Annapoorna Hospitality',
      quantity: 500,
      unit: 'kg',
      targetPrice: 20,
    },
  },
  {
    id: 'notif_04',
    userId: 'farmer_01',
    userRole: 'FARMER',
    title: '⚠️ Perishable Stock Aging Alert (Day 5)',
    message: '35 bags of Cavendish Bananas & 45 kg Country Tomatoes in Plot #2 are entering Day 5. Recommended 15% discount for local restaurants.',
    type: 'ALERT',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    metadata: {
      productId: 'prod_01',
      productName: 'Country Tomatoes',
      daysAging: 5,
      suggestedDiscount: 15,
    },
  },
  {
    id: 'notif_05',
    userId: 'grocery_01',
    userRole: 'GROCERY',
    title: 'Order Status Update: In Transit 🚚',
    message: 'Your order #ORD-2026-9041 from Farmer Ramasamy K has departed Kinathukadavu. ETA: Today by 5:45 PM.',
    type: 'ORDER',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    metadata: {
      orderId: 'ORD-2026-9041',
      status: 'IN_TRANSIT',
      batchId: 'BATCH_COIMB_01',
    },
  },
  {
    id: 'notif_06',
    userId: 'grocery_01',
    userRole: 'GROCERY',
    title: 'Order #ORD-2026-7734 Delivered Fresh',
    message: 'Traditional Raw Ponni Paddy (2 bags) successfully delivered to RS Puram with verified QR traceability.',
    type: 'ORDER',
    read: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    metadata: {
      orderId: 'ORD-2026-7734',
      status: 'DELIVERED',
      batchId: 'BATCH_COIMB_01',
    },
  },
  {
    id: 'notif_07',
    userId: 'bulk_01',
    userRole: 'BULK',
    title: 'Farmer Counter-Offer Submitted',
    message: 'Farmer Muthusamy Gounder submitted counter-offer: 300 kg Tomatoes @ ₹22/kg for RFQ-2026-044.',
    type: 'BULK_RFQ',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    metadata: {
      rfqId: 'RFQ-2026-044',
      farmerName: 'Muthusamy Gounder',
      offeredPrice: 22,
      offeredQty: 300,
    },
  },
  {
    id: 'notif_08',
    userId: 'admin_01',
    userRole: 'ADMIN',
    title: 'Solar Cold Room #01 Capacity Alert',
    message: 'Thondamuthur FPO Solar Cold Room is at 88% capacity (44/50 Metric Tons). 6 tons remaining.',
    type: 'ALERT',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    metadata: {
      coldRoomId: 'CR_01',
      occupiedTon: 44,
      capacityTon: 50,
    },
  },
];

// Price Trends
const INITIAL_PRICE_TRENDS: PriceTrend[] = [
  {
    category: 'VEGETABLE',
    productName: 'Country Tomato',
    currentAvgPrice: 24,
    previousWeekAvgPrice: 19,
    unit: 'kg',
    trend: 'UP',
    changePercent: 26.3,
    suggestedSellingRange: { min: 22, max: 26 },
    mandiPriceGovt: 18,
  },
  {
    category: 'VEGETABLE',
    productName: 'Red Onion',
    currentAvgPrice: 32,
    previousWeekAvgPrice: 35,
    unit: 'kg',
    trend: 'DOWN',
    changePercent: -8.5,
    suggestedSellingRange: { min: 30, max: 35 },
    mandiPriceGovt: 26,
  },
  {
    category: 'PADDY',
    productName: 'Ponni Raw Paddy',
    currentAvgPrice: 1450,
    previousWeekAvgPrice: 1420,
    unit: 'bag',
    trend: 'STABLE',
    changePercent: 2.1,
    suggestedSellingRange: { min: 1400, max: 1500 },
    mandiPriceGovt: 1350,
  },
  {
    category: 'RICE',
    productName: 'Milled Ponni Rice',
    currentAvgPrice: 58,
    previousWeekAvgPrice: 56,
    unit: 'kg',
    trend: 'UP',
    changePercent: 3.5,
    suggestedSellingRange: { min: 55, max: 62 },
    mandiPriceGovt: 48,
  },
  {
    category: 'WHEAT',
    productName: 'Sharbati Raw Wheat',
    currentAvgPrice: 1600,
    previousWeekAvgPrice: 1580,
    unit: 'bag',
    trend: 'STABLE',
    changePercent: 1.2,
    suggestedSellingRange: { min: 1550, max: 1650 },
    mandiPriceGovt: 1480,
  },
];

class StorageService {
  private users: UserProfile[] = INITIAL_USERS;
  private currentUser: UserProfile | null = null;
  private language: Language = 'ta';
  private products: ProductListing[] = INITIAL_PRODUCTS;
  private orders: Order[] = INITIAL_ORDERS;
  private bulkRfqs: BulkRequirement[] = INITIAL_BULK_RFQS;
  private coldRooms: ColdRoom[] = INITIAL_COLD_ROOMS;
  private notifications: NotificationItem[] = INITIAL_NOTIFICATIONS;
  private priceTrends: PriceTrend[] = INITIAL_PRICE_TRENDS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      if (savedLang) this.language = savedLang;

      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      } else {
        // Default to farmer on first launch
        this.currentUser = this.users[0];
      }

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) this.products = JSON.parse(savedProducts);

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) this.orders = JSON.parse(savedOrders);

      const savedRfqs = localStorage.getItem(STORAGE_KEYS.BULK_RFQS);
      if (savedRfqs) this.bulkRfqs = JSON.parse(savedRfqs);

      const savedColdRooms = localStorage.getItem(STORAGE_KEYS.COLD_ROOMS);
      if (savedColdRooms) this.coldRooms = JSON.parse(savedColdRooms);

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) this.notifications = JSON.parse(savedNotifs);
    } catch (e) {
      console.error('StorageService init error:', e);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, this.language);
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.BULK_RFQS, JSON.stringify(this.bulkRfqs));
      localStorage.setItem(STORAGE_KEYS.COLD_ROOMS, JSON.stringify(this.coldRooms));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    } catch (e) {
      console.error('StorageService save error:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener notify error:', err);
      }
    });
  }

  // Language management
  public getLanguage(): Language {
    return this.language;
  }

  public setLanguage(lang: Language) {
    this.language = lang;
    if (this.currentUser) {
      this.currentUser.language = lang;
    }
    this.saveToLocalStorage();
  }

  // User & Role management
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public getAllUsers(): UserProfile[] {
    return this.users;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    this.language = user.language;
    this.saveToLocalStorage();
  }

  public logout() {
    this.currentUser = null;
    this.saveToLocalStorage();
  }

  public switchRole(role: UserRole) {
    const matched = this.users.find((u) => u.role === role);
    if (matched) {
      this.currentUser = { ...matched, language: this.language };
    } else {
      this.currentUser = {
        id: `user_${role.toLowerCase()}_demo`,
        phone: '9988776655',
        name: `Demo ${role}`,
        role: role,
        language: this.language,
        location: 'Coimbatore, Tamil Nadu',
      };
    }
    this.saveToLocalStorage();
  }

  public switchUserByRole(role: UserRole) {
    this.switchRole(role);
  }

  // Products
  public getProducts(buyerRole?: UserRole): ProductListing[] {
    if (buyerRole) {
      return EligibilityService.filterCatalogForBuyer(this.products, buyerRole);
    }
    return this.products;
  }

  public getProductById(id: string): ProductListing | undefined {
    return this.products.find((p) => p.id === id);
  }

  public addProduct(product: Omit<ProductListing, 'id' | 'createdAt' | 'qrCodeData' | 'batchId'>): ProductListing {
    const batchId = `BATCH-${product.category.substring(0, 3)}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const id = `prod_${Date.now()}`;
    
    // Strict enforcement of buyer eligibility
    const enforcedEligibility = EligibilityService.determineBuyerEligibility(
      product.category,
      product.buyerEligibility
    );

    const newProduct: ProductListing = {
      ...product,
      id,
      batchId,
      buyerEligibility: enforcedEligibility,
      originalQuantity: product.quantity,
      qrCodeData: `FC-TRACE-${id}-${batchId}-${enforcedEligibility}`,
      daysInStock: 0,
      stockAgeStatus: 'FRESH',
      createdAt: new Date().toISOString(),
    };

    this.products = [newProduct, ...this.products];

    // If cold storage is requested, create batch in cold room
    if (newProduct.storageRequired && newProduct.coldRoomId) {
      this.addBatchToColdRoom(newProduct.coldRoomId, {
        coldRoomId: newProduct.coldRoomId,
        crateId: newProduct.crateId || `CRT-${Math.floor(10 + Math.random() * 90)}`,
        farmerId: newProduct.farmerId,
        farmerName: newProduct.farmerName,
        batchId: newProduct.batchId,
        productName: newProduct.name,
        category: newProduct.category,
        quantity: newProduct.quantity,
        unit: newProduct.unit,
        quality: newProduct.quality,
        storageDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        temperature: 4.0,
        pricePerUnit: newProduct.expectedPrice,
        remainingStock: newProduct.quantity,
        qrCode: `FC-COLD-${newProduct.coldRoomId}-${newProduct.batchId}`,
        status: 'STORED',
      });
    }

    this.addNotification({
      userId: newProduct.farmerId,
      userRole: 'FARMER',
      title: 'Produce Listed Successfully',
      message: `${newProduct.name} (${newProduct.quantity} ${newProduct.unit}) is now visible to eligible buyers. Batch #${batchId}.`,
      type: 'SYSTEM',
    });

    this.saveToLocalStorage();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<ProductListing>) {
    this.products = this.products.map((p) => {
      if (p.id === id) {
        const updatedCategory = updates.category || p.category;
        const enforcedEligibility = EligibilityService.determineBuyerEligibility(
          updatedCategory,
          updates.buyerEligibility || p.buyerEligibility
        );
        return { ...p, ...updates, buyerEligibility: enforcedEligibility };
      }
      return p;
    });
    this.saveToLocalStorage();
  }

  public deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveToLocalStorage();
  }

  // Paddy to Rice Value Addition Wizard
  public convertPaddyToRice(params: {
    paddyProductId: string;
    bagsToProcess: number;
    riceVarietyName: string;
    ricePricePerKg: number;
    enableBulkForRice: boolean;
  }): { success: boolean; riceProduct?: ProductListing; error?: string } {
    const paddy = this.products.find((p) => p.id === params.paddyProductId);
    if (!paddy || paddy.category !== 'PADDY') {
      return { success: false, error: 'Valid raw paddy batch not found.' };
    }

    if (params.bagsToProcess <= 0 || params.bagsToProcess > paddy.quantity) {
      return {
        success: false,
        error: `Cannot process ${params.bagsToProcess} bags. Available quantity is ${paddy.quantity} bags.`,
      };
    }

    // 1 bag of paddy (50 kg) yields approx 34 kg of clean milled rice (~68% milling recovery)
    const milledRiceKg = Math.round(params.bagsToProcess * 50 * 0.68);
    const remainingPaddyBags = paddy.quantity - params.bagsToProcess;

    // 1. Update remaining raw paddy inventory (keeps GROCERY_ONLY status!)
    this.products = this.products.map((p) => {
      if (p.id === paddy.id) {
        return {
          ...p,
          quantity: remainingPaddyBags,
          paddyDetails: {
            totalHarvestBags: (p.paddyDetails?.totalHarvestBags || p.originalQuantity),
            processedToRiceBags: (p.paddyDetails?.processedToRiceBags || 0) + params.bagsToProcess,
            remainingRawPaddyBags: remainingPaddyBags,
          },
        };
      }
      return p;
    });

    // 2. Create brand new separate Rice inventory
    const riceBatchId = `BATCH-RIC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRice: ProductListing = {
      id: `prod_rice_${Date.now()}`,
      farmerId: paddy.farmerId,
      farmerName: paddy.farmerName,
      farmerPhone: paddy.farmerPhone,
      farmerLocation: paddy.farmerLocation,
      farmerDistrict: paddy.farmerDistrict,
      batchId: riceBatchId,
      category: 'RICE',
      name: params.riceVarietyName,
      nameTranslations: {
        ta: `${params.riceVarietyName} (மதிப்புக் கூட்டப்பட்ட அரிசி)`,
        en: `${params.riceVarietyName} (Milled Rice)`,
        hi: `${params.riceVarietyName} (तैयार चावल)`,
      },
      quantity: milledRiceKg,
      originalQuantity: milledRiceKg,
      unit: 'kg',
      quality: 'Grade A',
      harvestDate: paddy.harvestDate,
      availableFrom: new Date().toISOString().split('T')[0],
      expectedPrice: params.ricePricePerKg,
      suggestedPriceMin: Math.max(40, params.ricePricePerKg - 5),
      suggestedPriceMax: params.ricePricePerKg + 8,
      buyerEligibility: params.enableBulkForRice ? 'ALL' : 'GROCERY_ONLY',
      storageRequired: false,
      imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80',
      qrCodeData: `FC-TRACE-RICE-${riceBatchId}-PARENT-${paddy.batchId}`,
      status: 'AVAILABLE',
      daysInStock: 0,
      stockAgeStatus: 'FRESH',
      organic: paddy.organic,
      createdAt: new Date().toISOString(),
    };

    this.products = [newRice, ...this.products];

    this.addNotification({
      userId: paddy.farmerId,
      userRole: 'FARMER',
      title: 'Paddy Milling Complete!',
      message: `Processed ${params.bagsToProcess} bags of paddy into ${milledRiceKg} kg of ${params.riceVarietyName}. Separate rice inventory is now live.`,
      type: 'SYSTEM',
    });

    this.saveToLocalStorage();
    return { success: true, riceProduct: newRice };
  }

  // Orders
  public getOrders(userId?: string, role?: UserRole): Order[] {
    if (!userId && !role) return this.orders;
    return this.orders.filter((ord) => {
      if (role === 'FARMER' || ord.farmerId === userId) return ord.farmerId === userId || role === 'FARMER';
      if (role === 'GROCERY' || role === 'BULK' || ord.buyerId === userId) return ord.buyerId === userId || role === ord.buyerRole;
      return true;
    });
  }

  public placeOrder(orderData: {
    buyer: UserProfile;
    items: { product: ProductListing; quantity: number }[];
    deliveryType?: 'DIRECT_DELIVERY' | 'FARM_PICKUP' | 'COLD_ROOM_PICKUP';
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Strict Eligibility check
    const validation = EligibilityService.validateCartForBuyer(
      orderData.items.map((i) => ({
        productId: i.product.id,
        category: i.product.category,
        buyerEligibility: i.product.buyerEligibility,
      })),
      orderData.buyer.role
    );

    if (!validation.valid) {
      return { success: false, error: validation.errorMessage };
    }

    if (orderData.items.length === 0) {
      return { success: false, error: 'Basket is empty.' };
    }

    const firstProduct = orderData.items[0].product;
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.product.expectedPrice * item.quantity,
      0
    );

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      buyerId: orderData.buyer.id,
      buyerName: orderData.buyer.name,
      buyerPhone: orderData.buyer.phone,
      buyerRole: orderData.buyer.role === 'BULK' ? 'BULK' : 'GROCERY',
      buyerLocation: `${orderData.buyer.location || 'Local Buyer'} (${orderData.buyer.distanceKm || 3.2} km)`,
      farmerId: firstProduct.farmerId,
      farmerName: firstProduct.farmerName,
      farmerPhone: firstProduct.farmerPhone,
      farmerLocation: firstProduct.farmerLocation,
      items: orderData.items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        category: i.product.category,
        quantity: i.quantity,
        unit: i.product.unit,
        unitPrice: i.product.expectedPrice,
        totalPrice: i.product.expectedPrice * i.quantity,
        farmerId: i.product.farmerId,
        farmerName: i.product.farmerName,
        farmerLocation: i.product.farmerLocation,
        buyerEligibility: i.product.buyerEligibility,
      })),
      totalAmount,
      status: 'ORDER_PLACED',
      deliveryType: orderData.deliveryType || 'DIRECT_DELIVERY',
      distanceKm: orderData.buyer.distanceKm || 3.5,
      estimatedDeliveryTime: 'Within 2 hours',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'ORDER_PLACED',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Order placed by ${orderData.buyer.name}`,
        },
      ],
    };

    // Deduct stock
    orderData.items.forEach((item) => {
      this.products = this.products.map((p) => {
        if (p.id === item.product.id) {
          const newQty = Math.max(0, p.quantity - item.quantity);
          return {
            ...p,
            quantity: newQty,
            status: newQty === 0 ? 'SOLD_OUT' : newQty < 10 ? 'LOW_STOCK' : 'AVAILABLE',
          };
        }
        return p;
      });
    });

    this.orders = [newOrder, ...this.orders];

    // Notify farmer instantly
    this.addNotification({
      userId: firstProduct.farmerId,
      userRole: 'FARMER',
      title: 'New Nearby Order Received!',
      message: `Buyer ${orderData.buyer.name} (${orderData.buyer.distanceKm || 3.2} km) ordered ₹${totalAmount} worth of produce. Tap to Accept/Reject.`,
      type: 'ORDER',
      actionLink: `/orders/${orderId}`,
    });

    // Notify buyer
    this.addNotification({
      userId: orderData.buyer.id,
      userRole: orderData.buyer.role,
      title: 'Order Sent to Farmer',
      message: `Your order #${orderId} has been transmitted to ${firstProduct.farmerName}. You will receive confirmation shortly.`,
      type: 'ORDER',
    });

    this.saveToLocalStorage();
    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string) {
    this.orders = this.orders.map((ord) => {
      if (ord.id === orderId) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = [
          ...ord.timeline,
          {
            status: newStatus,
            timestamp: timeStr,
            note: note || `Order updated to ${newStatus}`,
          },
        ];

        // Notify Buyer
        this.addNotification({
          userId: ord.buyerId,
          userRole: ord.buyerRole,
          title: `Order Status: ${newStatus.replace('_', ' ')}`,
          message: `Order #${ord.id}: ${note || `Your order status is now ${newStatus.replace('_', ' ')}`}`,
          type: 'ORDER',
        });

        return {
          ...ord,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          timeline: updatedTimeline,
        };
      }
      return ord;
    });

    this.saveToLocalStorage();
  }

  // Bulk RFQs & Farmer Negotiations
  public getBulkRequirements(): BulkRequirement[] {
    return this.bulkRfqs;
  }

  public createBulkRequirement(data: Omit<BulkRequirement, 'id' | 'createdAt' | 'offers' | 'status'>): {
    success: boolean;
    rfq?: BulkRequirement;
    error?: string;
  } {
    // STRICT VALIDATION: Bulk Buyer CANNOT post RFQ for raw paddy or raw wheat
    if (EligibilityService.isGroceryOnlyCategory(data.category)) {
      return {
        success: false,
        error: 'Restriction: Raw paddy and raw wheat cannot be procured by Bulk Buyers. This product is currently available only for Grocery Buyers.',
      };
    }

    const rfqId = `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRfq: BulkRequirement = {
      ...data,
      id: rfqId,
      status: 'OPEN',
      offers: [],
      createdAt: new Date().toISOString(),
    };

    this.bulkRfqs = [newRfq, ...this.bulkRfqs];

    // Notify farmers
    this.users
      .filter((u) => u.role === 'FARMER')
      .forEach((farmer) => {
        this.addNotification({
          userId: farmer.id,
          userRole: 'FARMER',
          title: 'New Bulk Buyer RFQ in your area!',
          message: `${newRfq.buyerBusinessName} requested ${newRfq.requiredQuantity} ${newRfq.unit} of ${newRfq.productName} @ target price ₹${newRfq.targetPrice}/${newRfq.unit}.`,
          type: 'BULK_RFQ',
        });
      });

    this.saveToLocalStorage();
    return { success: true, rfq: newRfq };
  }

  public getRFQs(): BulkRequirement[] {
    return this.bulkRfqs;
  }

  public createRFQ(data: any) {
    return this.createBulkRequirement({
      buyerId: data.buyerId,
      buyerName: data.buyerName,
      buyerBusinessName: data.buyerBusinessName || data.buyerName,
      buyerBusinessType: data.buyerBusinessType || 'Commercial Buyer',
      buyerLocation: data.buyerLocation,
      buyerPhone: data.buyerPhone,
      category: data.category,
      productName: data.productName,
      requiredQuantity: data.quantityRequired || data.requiredQuantity,
      unit: data.unit,
      targetPrice: data.targetPricePerUnit || data.targetPrice,
      requiredDate: data.requiredByDate || data.requiredDate || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
    });
  }

  public submitFarmerOffer(rfqId: string, offerData: {
    farmer: UserProfile;
    offeredQuantity: number;
    offeredPrice: number;
    availableDate: string;
    notes: string;
  }) {
    const offerId = `OFFER-${Math.floor(100 + Math.random() * 900)}`;
    this.bulkRfqs = this.bulkRfqs.map((rfq) => {
      if (rfq.id === rfqId) {
        const newOffer = {
          id: offerId,
          rfqId,
          farmerId: offerData.farmer.id,
          farmerName: offerData.farmer.name,
          farmerPhone: offerData.farmer.phone,
          farmerLocation: `${offerData.farmer.location || 'Local Farm'} (${offerData.farmer.distanceKm || 4.2} km)`,
          offeredQuantity: offerData.offeredQuantity,
          unit: rfq.unit,
          offeredPrice: offerData.offeredPrice,
          availableDate: offerData.availableDate,
          notes: offerData.notes,
          status: 'PENDING' as const,
          createdAt: new Date().toISOString(),
        };

        // Notify bulk buyer
        this.addNotification({
          userId: rfq.buyerId,
          userRole: 'BULK',
          title: 'New Offer for your Bulk RFQ!',
          message: `Farmer ${offerData.farmer.name} offered ${offerData.offeredQuantity} ${rfq.unit} @ ₹${offerData.offeredPrice}/${rfq.unit}.`,
          type: 'BULK_RFQ',
        });

        return {
          ...rfq,
          status: 'OFFER_RECEIVED' as const,
          offers: [...rfq.offers, newOffer],
        };
      }
      return rfq;
    });

    this.saveToLocalStorage();
  }

  public acceptBulkOffer(rfqId: string, offerId: string) {
    let acceptedOffer: any = null;
    let targetRfq: any = null;

    this.bulkRfqs = this.bulkRfqs.map((rfq) => {
      if (rfq.id === rfqId) {
        targetRfq = rfq;
        const updatedOffers = rfq.offers.map((off) => {
          if (off.id === offerId) {
            acceptedOffer = off;
            return { ...off, status: 'ACCEPTED' as const };
          }
          return { ...off, status: 'REJECTED' as const };
        });
        return {
          ...rfq,
          status: 'ACCEPTED' as const,
          offers: updatedOffers,
        };
      }
      return rfq;
    });

    if (acceptedOffer && targetRfq) {
      // Create confirmed order
      const orderId = `ORD-BULK-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = acceptedOffer.offeredPrice * acceptedOffer.offeredQuantity;

      const newOrder: Order = {
        id: orderId,
        buyerId: targetRfq.buyerId,
        buyerName: `${targetRfq.buyerBusinessName} (${targetRfq.buyerName})`,
        buyerPhone: targetRfq.buyerPhone,
        buyerRole: 'BULK',
        buyerLocation: targetRfq.buyerLocation,
        farmerId: acceptedOffer.farmerId,
        farmerName: acceptedOffer.farmerName,
        farmerPhone: acceptedOffer.farmerPhone,
        farmerLocation: acceptedOffer.farmerLocation,
        items: [
          {
            productId: `bulk_item_${rfqId}`,
            productName: `${targetRfq.productName} (Bulk Procurement)`,
            category: targetRfq.category,
            quantity: acceptedOffer.offeredQuantity,
            unit: acceptedOffer.unit,
            unitPrice: acceptedOffer.offeredPrice,
            totalPrice: totalAmount,
            farmerId: acceptedOffer.farmerId,
            farmerName: acceptedOffer.farmerName,
            farmerLocation: acceptedOffer.farmerLocation,
            buyerEligibility: 'ALL',
          },
        ],
        totalAmount,
        status: 'FARMER_ACCEPTED',
        deliveryType: 'DIRECT_DELIVERY',
        distanceKm: 6.0,
        estimatedDeliveryTime: acceptedOffer.availableDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            status: 'ORDER_PLACED',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: 'Bulk negotiation accepted and deal locked.',
          },
          {
            status: 'FARMER_ACCEPTED',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: 'Contract created. Agreed quantity locked.',
          },
        ],
      };

      this.orders = [newOrder, ...this.orders];

      // Notify farmer
      this.addNotification({
        userId: acceptedOffer.farmerId,
        userRole: 'FARMER',
        title: 'Bulk Deal Accepted & Quantity Locked!',
        message: `${targetRfq.buyerBusinessName} accepted your offer for ${acceptedOffer.offeredQuantity} ${acceptedOffer.unit} @ ₹${acceptedOffer.offeredPrice}/${acceptedOffer.unit}. Order #${orderId} generated.`,
        type: 'ORDER',
      });
    }

    this.saveToLocalStorage();
  }

  public createOrder(orderData: {
    buyer: UserProfile;
    items: { product: ProductListing; quantity: number }[];
    deliveryType?: 'DIRECT_DELIVERY' | 'FARM_PICKUP' | 'COLD_ROOM_PICKUP';
  }) {
    return this.placeOrder(orderData);
  }

  public addRFQOffer(rfqId: string, offer: any) {
    return this.submitFarmerOffer(rfqId, {
      farmer: {
        id: offer.farmerId,
        name: offer.farmerName,
        phone: offer.farmerPhone,
        role: 'FARMER',
        language: 'ta',
        location: offer.farmerLocation || 'Coimbatore',
      },
      offeredQuantity: offer.offeredQuantity,
      offeredPrice: offer.offeredPrice,
      availableDate: offer.availableDate || new Date().toISOString().split('T')[0],
      notes: offer.message || offer.notes || '',
    });
  }

  public acceptRFQOffer(rfqId: string, offerId: string) {
    return this.acceptBulkOffer(rfqId, offerId);
  }

  // Cold Storage
  public getColdRooms(): ColdRoom[] {
    return this.coldRooms;
  }

  public addBatchToColdRoom(coldRoomId: string, batchData: Omit<ColdRoom['batches'][0], 'id'>) {
    const id = `CRB_${Date.now()}`;
    this.coldRooms = this.coldRooms.map((cr) => {
      if (cr.id === coldRoomId) {
        return {
          ...cr,
          occupiedMetricTons: Math.min(
            cr.capacityMetricTons,
            cr.occupiedMetricTons + (batchData.unit === 'ton' ? batchData.quantity : batchData.quantity / 1000)
          ),
          batches: [
            {
              ...batchData,
              id,
            },
            ...cr.batches,
          ],
        };
      }
      return cr;
    });
    this.saveToLocalStorage();
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    if (!userId) return this.notifications;
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'ALL');
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveToLocalStorage();
  }

  public markNotificationAsUnread(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: false } : n));
    this.saveToLocalStorage();
  }

  public markAllNotificationsAsRead(userId?: string) {
    this.notifications = this.notifications.map((n) => {
      if (!userId || n.userId === userId || n.userId === 'ALL') {
        return { ...n, read: true };
      }
      return n;
    });
    this.saveToLocalStorage();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveToLocalStorage();
  }

  public clearAllNotifications(userId?: string) {
    if (!userId) {
      this.notifications = [];
    } else {
      this.notifications = this.notifications.filter((n) => n.userId !== userId && n.userId !== 'ALL');
    }
    this.saveToLocalStorage();
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications = [newNotif, ...this.notifications];
    this.saveToLocalStorage();
    return newNotif;
  }

  // Activity Simulators
  public simulateOrderUpdateNotification(orderId = 'ORD-2026-9041'): NotificationItem {
    const statuses = ['IN_TRANSIT', 'PICKED_UP', 'PREPARING', 'DELIVERED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return this.addNotification({
      userId: this.currentUser?.id || 'farmer_01',
      userRole: this.currentUser?.role || 'FARMER',
      title: `⚡ Live Dispatch: Order #${orderId} ${randomStatus.replace('_', ' ')}`,
      message: `Order #${orderId} updated at ${timeStr}. Delivery corridor transit telemetry active. Verified QR batch attached.`,
      type: 'ORDER',
      metadata: {
        orderId,
        status: randomStatus,
        batchId: 'BATCH_COIMB_01',
      },
    });
  }

  public simulateBulkRFQNotification(): NotificationItem {
    const crops = [
      { name: 'Grade A Country Tomatoes', qty: '800 kg', price: 21, buyer: 'Taj Gateway Coimbatore' },
      { name: 'Milled Sona Masoori Rice', qty: '3,000 kg', price: 54, buyer: 'PSG College Central Kitchen' },
      { name: 'Fresh Small Shallot Onions', qty: '400 kg', price: 44, buyer: 'Anand Bhavan Canteen' },
    ];
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const rfqId = `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`;

    return this.addNotification({
      userId: this.currentUser?.id || 'farmer_01',
      userRole: this.currentUser?.role || 'FARMER',
      title: `🏢 New Commercial RFQ: ${crop.qty} ${crop.name}`,
      message: `${crop.buyer} posted requirement @ target price ₹${crop.price}/kg. Tap to review specs and submit instant farmer offer.`,
      type: 'BULK_RFQ',
      metadata: {
        rfqId,
        buyer: crop.buyer,
        productName: crop.name,
      },
    });
  }

  public simulateStockAlertNotification(): NotificationItem {
    const alerts = [
      { crop: 'Country Tomatoes (Plot #2)', days: 5, action: 'Recommended 15% discount for commercial kitchens.' },
      { crop: 'Cavendish Bananas (Solar Cold Room #01)', days: 6, action: 'Reaching peak ripeness. Priority direct consumer dispatch advised.' },
      { crop: 'Organic Country Spinach', days: 3, action: 'Perishable leaf stock alert. Move to immediate express delivery.' },
    ];
    const item = alerts[Math.floor(Math.random() * alerts.length)];

    return this.addNotification({
      userId: this.currentUser?.id || 'farmer_01',
      userRole: this.currentUser?.role || 'FARMER',
      title: `⚠️ Stock Aging Threshold Alert: ${item.crop}`,
      message: `Stock has been stored for ${item.days} days. ${item.action}`,
      type: 'ALERT',
      metadata: {
        crop: item.crop,
        days: item.days,
      },
    });
  }

  // Price trends
  public getPriceTrends(): PriceTrend[] {
    return this.priceTrends;
  }

  // Unsold produce alerts generator
  public getUnsoldStockAlerts(farmerId?: string): UnsoldStockAlert[] {
    const candidateProducts = this.products.filter((p) => {
      const isFarmerMatch = !farmerId || p.farmerId === farmerId;
      return isFarmerMatch && p.status !== 'SOLD_OUT' && (p.daysInStock >= 4 || p.stockAgeStatus === 'WARNING');
    });

    return candidateProducts.map((p) => {
      const isUrgent = p.daysInStock >= 6;
      const discountPercent = isUrgent ? 25 : 12;
      const targetPrice = Math.round(p.expectedPrice * (1 - discountPercent / 100));

      const rawAlternativeBuyers = [
        { name: 'Kovai Fresh Local Mart', type: 'Retailer', location: 'Saibaba Colony, Coimbatore', distanceKm: 4.5 },
        { name: 'Sree Annapoorna Central Mess', type: 'Commercial Kitchen', location: 'Gandhipuram', distanceKm: 5.2 },
        { name: 'Nila Food Processing & Pickles', type: 'Food Processor', location: 'Singanallur', distanceKm: 7.8 },
        { name: 'Direct Grocery Community WhatsApp Group', type: 'Grocery Group', location: 'RS Puram', distanceKm: 3.5 },
      ];

      // Strict enforcement: For Paddy and Wheat, NEVER suggest commercial/bulk buyers
      const eligibleBuyers = EligibilityService.filterEligibleAlternativeBuyers(p.category, rawAlternativeBuyers);

      return {
        productId: p.id,
        farmerId: p.farmerId,
        productName: p.name,
        category: p.category,
        remainingQuantity: p.quantity,
        unit: p.unit,
        daysUnsold: p.daysInStock,
        currentPrice: p.expectedPrice,
        urgency: isUrgent ? 'URGENT' : 'WARNING',
        eligibleBuyerTypes: EligibilityService.isGroceryOnlyCategory(p.category)
          ? ['Individual Households', 'Direct Consumers']
          : ['Hotels', 'Restaurants', 'Retailers', 'Food Processors', 'Direct Consumers'],
        recommendedDiscountPercent: discountPercent,
        recommendedTargetPrice: targetPrice,
        suggestedBuyers: eligibleBuyers,
      };
    });
  }

  public getStockAlerts(farmerId?: string): UnsoldStockAlert[] {
    return this.getUnsoldStockAlerts(farmerId);
  }

  // Reset demo data
  public resetToDefaults() {
    this.products = INITIAL_PRODUCTS;
    this.orders = INITIAL_ORDERS;
    this.bulkRfqs = INITIAL_BULK_RFQS;
    this.coldRooms = INITIAL_COLD_ROOMS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.currentUser = this.users[0];
    this.saveToLocalStorage();
  }
}

export const storageService = new StorageService();
