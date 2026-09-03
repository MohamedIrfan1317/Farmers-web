import {
  ProductListing,
  UserProfile,
  ColdRoom,
  PriceTrend,
  ProductCategory,
  BuyerEligibilityType,
  QualityGrade,
  UserRole,
} from '../types';
import { storageService } from './storageService';

export interface SearchFilterOptions {
  query: string;
  category?: string; // 'ALL' or ProductCategory
  buyerRole?: UserRole;
  buyerEligibility?: 'ALL' | 'GROCERY_ONLY' | 'BULK_ELIGIBLE';
  storageType?: 'ALL' | 'COLD_STORED' | 'DIRECT_FARM';
  isOrganicOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  maxDistanceKm?: number;
  quality?: 'ALL' | QualityGrade;
  sortBy?: 'RELEVANCE' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'FRESHNESS' | 'DISTANCE' | 'QUANTITY_HIGH';
}

export interface MandiSearchItem {
  id: string;
  crop: string;
  cropTa: string;
  cropHi: string;
  mandiPrice: number;
  farmerGatePrice: number;
  consumerDirectPrice: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  marketName: string;
}

export interface SearchResultsSummary {
  products: ProductListing[];
  farmers: UserProfile[];
  coldRooms: ColdRoom[];
  mandiItems: MandiSearchItem[];
  matchedBatches: ProductListing[];
  totalMatches: number;
}

// Sample live Mandi benchmark data for search
export const LIVE_MANDI_SEARCH_BENCHMARKS: MandiSearchItem[] = [
  {
    id: 'mandi_tm',
    crop: 'Country Tomato',
    cropTa: 'நாட்டு தக்காளி',
    cropHi: 'देसी टमाटर',
    mandiPrice: 18,
    farmerGatePrice: 24,
    consumerDirectPrice: 28,
    unit: 'kg',
    trend: 'UP',
    marketName: 'MGR Wholesale Market, Coimbatore',
  },
  {
    id: 'mandi_onn',
    crop: 'Red Bellary Onion',
    cropTa: 'சிவப்பு வெங்காயம்',
    cropHi: 'लाल प्याज',
    mandiPrice: 28,
    farmerGatePrice: 35,
    consumerDirectPrice: 40,
    unit: 'kg',
    trend: 'STABLE',
    marketName: 'Ukkadam Mandi, Coimbatore',
  },
  {
    id: 'mandi_wht',
    crop: 'Processed Sharbati Wheat Flour',
    cropTa: 'பதப்படுத்தப்பட்ட கோதுமை மாவு',
    cropHi: 'प्रोसेस्ड शरबती गेहूं आटा',
    mandiPrice: 36,
    farmerGatePrice: 42,
    consumerDirectPrice: 48,
    unit: 'kg',
    trend: 'UP',
    marketName: 'Aliyar APMC Regulated Market, Pollachi',
  },
  {
    id: 'mandi_ric',
    crop: 'Deluxe Milled Ponni Rice',
    cropTa: 'அரைத்த பொன்னி அரிசி',
    cropHi: 'पॉलिश पोन्नी चावल',
    mandiPrice: 52,
    farmerGatePrice: 58,
    consumerDirectPrice: 65,
    unit: 'kg',
    trend: 'UP',
    marketName: 'Tamil Nadu Civil Supplies / APMC Market',
  },
  {
    id: 'mandi_wht',
    crop: 'Sharbati Raw Golden Wheat',
    cropTa: 'சர்பதி மூல கோதுமை',
    cropHi: 'शरबती कच्चा गेहूं',
    mandiPrice: 1480,
    farmerGatePrice: 1600,
    consumerDirectPrice: 1720,
    unit: '50kg bag',
    trend: 'STABLE',
    marketName: 'Varanasi APMC Grain Market',
  },
  {
    id: 'mandi_brj',
    crop: 'Green Round Brinjal',
    cropTa: 'பச்சை கத்தரிக்காய்',
    cropHi: 'हरा गोल बैंगन',
    mandiPrice: 22,
    farmerGatePrice: 28,
    consumerDirectPrice: 32,
    unit: 'kg',
    trend: 'DOWN',
    marketName: 'Mettupalayam Agro Sub-Junction',
  },
  {
    id: 'mandi_ban',
    crop: 'Grand Naine Robusta Banana',
    cropTa: 'கிராண்ட் நைன் வாழை',
    cropHi: 'रोबस्टा केला',
    mandiPrice: 25,
    farmerGatePrice: 32,
    consumerDirectPrice: 38,
    unit: 'kg',
    trend: 'UP',
    marketName: 'Pollachi Central Fruit Terminal',
  },
];

const RECENT_SEARCHES_KEY = 'fc_recent_search_queries';

export class SearchEngineService {
  // Save search to local history
  static saveRecentSearch(query: string) {
    if (!query || query.trim().length < 2) return;
    try {
      const existing = this.getRecentSearches();
      const updated = [query.trim(), ...existing.filter((q) => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 8);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }

  static getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore storage errors
    }
    return [
      'Country Tomato',
      'Organic Ponni Rice',
      'Solar Cold Storage',
      'Processed Wheat',
      'Muthusamy Gounder',
      'Coimbatore FPO',
    ];
  }

  static clearRecentSearches() {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  }

  // Multi-index query executor
  static search(options: SearchFilterOptions): SearchResultsSummary {
    const rawQuery = (options.query || '').trim().toLowerCase();
    const queryTokens = rawQuery.split(/\s+/).filter((t) => t.length > 0);

    const allProducts = storageService.getProducts();
    const allUsers = storageService.getAllUsers();
    const allColdRooms = storageService.getColdRooms();

    // 1. Filter and Score Products
    let matchedProducts = allProducts.filter((product) => {
      // Category filter
      if (options.category && options.category !== 'ALL' && product.category !== options.category) {
        return false;
      }

      // Organic filter
      if (options.isOrganicOnly && !product.organic) {
        return false;
      }

      // Storage filter
      if (options.storageType === 'COLD_STORED' && !product.storageRequired) {
        return false;
      }
      if (options.storageType === 'DIRECT_FARM' && product.storageRequired) {
        return false;
      }

      // Buyer Eligibility Filter
      if (options.buyerEligibility === 'GROCERY_ONLY' && product.buyerEligibility !== 'GROCERY_ONLY') {
        return false;
      }
      if (options.buyerEligibility === 'BULK_ELIGIBLE' && product.buyerEligibility === 'GROCERY_ONLY') {
        return false;
      }

      // Price filter
      if (options.minPrice !== undefined && product.expectedPrice < options.minPrice) {
        return false;
      }
      if (options.maxPrice !== undefined && product.expectedPrice > options.maxPrice) {
        return false;
      }

      // Quality grade
      if (options.quality && options.quality !== 'ALL' && product.quality !== options.quality) {
        return false;
      }

      // If no query tokens, return all that pass criteria
      if (queryTokens.length === 0) return true;

      // Text search in: name, translations, farmer name, farmer location, batch ID, category
      const searchableText = [
        product.name,
        product.nameTranslations?.ta || '',
        product.nameTranslations?.hi || '',
        product.nameTranslations?.en || '',
        product.farmerName,
        product.farmerLocation,
        product.farmerDistrict,
        product.batchId,
        product.category,
        product.quality,
        product.crateId || '',
        product.coldRoomId || '',
        product.organic ? 'organic இயற்கை जैविक' : '',
        product.storageRequired ? 'cold storage குளிர் அறை' : '',
      ]
        .join(' ')
        .toLowerCase();

      return queryTokens.every((token) => searchableText.includes(token));
    });

    // Sorting products
    if (options.sortBy) {
      matchedProducts = [...matchedProducts].sort((a, b) => {
        switch (options.sortBy) {
          case 'PRICE_LOW_HIGH':
            return a.expectedPrice - b.expectedPrice;
          case 'PRICE_HIGH_LOW':
            return b.expectedPrice - a.expectedPrice;
          case 'FRESHNESS':
            return a.daysInStock - b.daysInStock;
          case 'QUANTITY_HIGH':
            return b.quantity - a.quantity;
          case 'RELEVANCE':
          default:
            return 0;
        }
      });
    }

    // 2. Search Farmers
    const matchedFarmers = allUsers.filter((user) => {
      if (user.role !== 'FARMER') return false;
      if (queryTokens.length === 0) return true;

      const searchableText = [
        user.name,
        user.location,
        user.district || '',
        user.state || '',
        user.fpoAffiliation || '',
        user.phone,
      ]
        .join(' ')
        .toLowerCase();

      return queryTokens.some((token) => searchableText.includes(token));
    });

    // 3. Search Cold Rooms
    const matchedColdRooms = allColdRooms.filter((room) => {
      if (queryTokens.length === 0) return true;

      const searchableText = [
        room.name,
        room.location,
        room.district,
        room.operator,
        room.id,
        'solar cold storage cold room',
      ]
        .join(' ')
        .toLowerCase();

      return queryTokens.some((token) => searchableText.includes(token));
    });

    // 4. Search Mandi Benchmarks
    const matchedMandiItems = LIVE_MANDI_SEARCH_BENCHMARKS.filter((mandi) => {
      if (queryTokens.length === 0) return true;

      const searchableText = [
        mandi.crop,
        mandi.cropTa,
        mandi.cropHi,
        mandi.marketName,
        'mandi market price apmc',
      ]
        .join(' ')
        .toLowerCase();

      return queryTokens.some((token) => searchableText.includes(token));
    });

    // 5. Matched Batches (specifically where batchId matches query)
    const matchedBatches = allProducts.filter((p) => {
      if (!rawQuery) return false;
      return (
        p.batchId.toLowerCase().includes(rawQuery) ||
        p.qrCodeData.toLowerCase().includes(rawQuery) ||
        (rawQuery.includes('batch') && p.batchId.toLowerCase().includes(rawQuery.replace('batch', '').trim()))
      );
    });

    const totalMatches =
      matchedProducts.length +
      matchedFarmers.length +
      matchedColdRooms.length +
      matchedMandiItems.length;

    return {
      products: matchedProducts,
      farmers: matchedFarmers,
      coldRooms: matchedColdRooms,
      mandiItems: matchedMandiItems,
      matchedBatches: matchedBatches,
      totalMatches,
    };
  }
}
