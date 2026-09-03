import { ProductCategory, DemandPrediction } from '../types';
import { EligibilityService } from './eligibilityService';

export interface SmartBuyerMatchResult {
  buyerName: string;
  businessName?: string;
  type: string;
  category: string;
  distanceKm: number;
  expectedVolume: string;
  matchScorePercent: number;
  contactPhone: string;
  eligibleForProduct: boolean;
}

export interface RouteStop {
  orderId: string;
  stopNumber: number;
  customerName: string;
  location: string;
  distanceFromPreviousKm: number;
  cumulativeDistanceKm: number;
  estimatedArrival: string;
  itemsSummary: string;
}

export interface RouteOptimizationResult {
  routeId: string;
  farmerOrigin: string;
  totalDistanceKm: number;
  standardDistanceKm: number;
  fuelSavedLiters: number;
  timeSavedMinutes: number;
  co2SavedKg: number;
  optimizedStops: RouteStop[];
}

export class AIService {
  /**
   * 1. AI Regional Demand Forecasting
   */
  public static getDemandForecasts(location: string = 'Coimbatore'): DemandPrediction[] {
    return [
      {
        productName: 'Country Tomatoes (நாட்டு தக்காளி)',
        category: 'VEGETABLE',
        location,
        forecastPeriod: 'Next 7 Days (Festival & Hotel Surge)',
        demandLevel: 'VERY_HIGH',
        confidencePercent: 94,
        recommendedAction: 'Increase harvest by 15-20%. Strong restaurant and direct consumer demand forecasted.',
        primaryBuyerTypes: ['Restaurants', 'Mess Kitchens', 'Household Grocery'],
      },
      {
        productName: 'Milled Ponni Rice (அரிசி)',
        category: 'RICE',
        location,
        forecastPeriod: 'Monthly Regular Demand',
        demandLevel: 'HIGH',
        confidencePercent: 91,
        recommendedAction: 'Direct supply of processed rice to household grocery buyers captures 25-30% higher margin.',
        primaryBuyerTypes: ['Household Grocery Buyers Only'],
      },
      {
        productName: 'Red Onion (வெங்காயம்)',
        category: 'VEGETABLE',
        location,
        forecastPeriod: 'Next 10 Days',
        demandLevel: 'MODERATE',
        confidencePercent: 88,
        recommendedAction: 'Prices stable. Store in well-ventilated crates or solar cold storage to prevent weight loss.',
        primaryBuyerTypes: ['Wholesale Markets', 'Daily Consumers'],
      },
      {
        productName: 'Sharbati Processed Wheat (கோதுமை மாவு)',
        category: 'WHEAT',
        location,
        forecastPeriod: 'Monthly Regular Demand',
        demandLevel: 'HIGH',
        confidencePercent: 92,
        recommendedAction: 'Direct grocery supply in 5kg & 10kg packs for urban families with zero middlemen cuts.',
        primaryBuyerTypes: ['Individual Grocery Buyers Only'],
      },
      {
        productName: 'Green Round Brinjal',
        category: 'VEGETABLE',
        location,
        forecastPeriod: 'Next 5 Days',
        demandLevel: 'HIGH',
        confidencePercent: 85,
        recommendedAction: 'High demand for Grade A. Grade B can be offered to nearby catering buyers.',
        primaryBuyerTypes: ['Catering Services', 'Local Grocery'],
      },
    ];
  }

  /**
   * 2. Smart Buyer Matching with strict Product-Buyer Eligibility Filtering
   */
  public static matchBuyersForProduct(
    productName: string,
    category: ProductCategory,
    farmLocation: string
  ): SmartBuyerMatchResult[] {
    const candidateBuyers: SmartBuyerMatchResult[] = [
      {
        buyerName: 'Kavitha Senthil',
        businessName: 'Residential Consumer',
        type: 'Grocery Household',
        category: 'Direct Consumer',
        distanceKm: 3.5,
        expectedVolume: '5-15 kg weekly',
        matchScorePercent: 98,
        contactPhone: '9443322110',
        eligibleForProduct: true,
      },
      {
        buyerName: 'Rajarathinam Family',
        businessName: 'Residential Group',
        type: 'Grocery Household',
        category: 'Direct Consumer',
        distanceKm: 4.1,
        expectedVolume: '2-4 bags grains',
        matchScorePercent: 95,
        contactPhone: '9842233114',
        eligibleForProduct: true,
      },
      {
        buyerName: 'Anand V',
        businessName: 'Annapoorna Hospitality & Catering',
        type: 'Hotel & Restaurant',
        category: 'Bulk Commercial',
        distanceKm: 5.8,
        expectedVolume: '300-500 kg daily',
        matchScorePercent: 92,
        contactPhone: '9894455667',
        eligibleForProduct: !EligibilityService.isGroceryOnlyCategory(category),
      },
      {
        buyerName: 'Kovai Fresh Daily Mart',
        businessName: 'Kovai Fresh Chain',
        type: 'Retail Chain',
        category: 'Bulk Commercial',
        distanceKm: 4.8,
        expectedVolume: '150-300 kg daily',
        matchScorePercent: 89,
        contactPhone: '9789123456',
        eligibleForProduct: !EligibilityService.isGroceryOnlyCategory(category),
      },
      {
        buyerName: 'Nila Food Processing',
        businessName: 'Nila Agro Agro Processors',
        type: 'Food Processor',
        category: 'Bulk Commercial',
        distanceKm: 7.2,
        expectedVolume: '1-2 Metric Tons',
        matchScorePercent: 86,
        contactPhone: '9655432109',
        eligibleForProduct: !EligibilityService.isGroceryOnlyCategory(category),
      },
    ];

    // Filter out ineligible buyers if product is Raw Paddy or Raw Wheat
    return candidateBuyers.filter((buyer) => {
      if (EligibilityService.isGroceryOnlyCategory(category)) {
        return buyer.type === 'Grocery Household' || buyer.category === 'Direct Consumer';
      }
      return true;
    });
  }

  /**
   * 3. Smart Price Guidance & AI Price Estimator
   */
  public static calculatePriceGuidance(
    category: ProductCategory,
    productName: string,
    quality: string
  ): {
    mandiBaselinePrice: number;
    platformAvgPrice: number;
    suggestedMinPrice: number;
    suggestedMaxPrice: number;
    recommendedSellingPrice: number;
    farmerProfitBenefitPercent: number;
    explanation: string;
  } {
    const isPaddy = category === 'PADDY';
    const isWheat = category === 'WHEAT';
    const isRice = category === 'RICE';

    let mandiBase = 20;
    let platformAvg = 24;
    let suggestedMin = 22;
    let suggestedMax = 26;
    let recommended = 25;

    if (isWheat) {
      mandiBase = 32; // per kg for processed wheat
      platformAvg = 42;
      suggestedMin = 40;
      suggestedMax = 46;
      recommended = 42;
    } else if (isRice) {
      mandiBase = 48; // per kg for processed rice
      platformAvg = 58;
      suggestedMin = 55;
      suggestedMax = 62;
      recommended = 58;
    } else if (productName.toLowerCase().includes('onion')) {
      mandiBase = 26;
      platformAvg = 32;
      suggestedMin = 30;
      suggestedMax = 35;
      recommended = 33;
    } else if (productName.toLowerCase().includes('brinjal')) {
      mandiBase = 22;
      platformAvg = 28;
      suggestedMin = 25;
      suggestedMax = 30;
      recommended = 28;
    }

    const profitPercent = Math.round(((recommended - mandiBase) / mandiBase) * 100);

    return {
      mandiBaselinePrice: mandiBase,
      platformAvgPrice: platformAvg,
      suggestedMinPrice: suggestedMin,
      suggestedMaxPrice: suggestedMax,
      recommendedSellingPrice: recommended,
      farmerProfitBenefitPercent: Math.max(12, profitPercent),
      explanation: `Direct selling on FarmerConnect eliminates middleman cut (normally 20-30%), yielding an estimated +${profitPercent}% higher net realisation for Grade ${quality}.`,
    };
  }

  /**
   * 4. Route Optimization for Multi-Stop Deliveries
   */
  public static optimizeDeliveryRoute(
    farmerLocation: string = 'Thondamuthur Farm',
    orders: { id: string; customerName: string; location: string }[]
  ): RouteOptimizationResult {
    const stops: RouteStop[] = [
      {
        orderId: 'ORD-2026-8812',
        stopNumber: 1,
        customerName: 'Kavitha Senthil',
        location: 'RS Puram East, Coimbatore',
        distanceFromPreviousKm: 3.5,
        cumulativeDistanceKm: 3.5,
        estimatedArrival: '3:45 PM',
        itemsSummary: '10 kg Tomatoes, 25 kg Ponni Rice',
      },
      {
        orderId: 'ORD-2026-8815',
        stopNumber: 2,
        customerName: 'Ramesh Sundaram',
        location: 'Saibaba Colony, Coimbatore',
        distanceFromPreviousKm: 2.1,
        cumulativeDistanceKm: 5.6,
        estimatedArrival: '4:10 PM',
        itemsSummary: '5 kg Brinjal, 10 kg Onions',
      },
      {
        orderId: 'ORD-2026-8819',
        stopNumber: 3,
        customerName: 'Annapoorna Central Receiving',
        location: 'Gandhipuram 7th Cross, Coimbatore',
        distanceFromPreviousKm: 3.2,
        cumulativeDistanceKm: 8.8,
        estimatedArrival: '4:40 PM',
        itemsSummary: '300 kg Bulk Tomatoes',
      },
    ];

    return {
      routeId: `ROUTE-${Date.now().toString().substring(6)}`,
      farmerOrigin: farmerLocation,
      totalDistanceKm: 8.8,
      standardDistanceKm: 14.2, // un-optimized individual trips
      fuelSavedLiters: 1.8,
      timeSavedMinutes: 38,
      co2SavedKg: 4.2,
      optimizedStops: stops,
    };
  }
}
