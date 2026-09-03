import { ProductListing, ProductCategory, BuyerEligibilityType, UserRole } from '../types';

export class EligibilityService {
  /**
   * Evaluates if a given product category must be strictly restricted to Grocery buyers only.
   * Rule: Processed Rice and Processed Wheat are strictly reserved for Grocery buyers only.
   * Bulk buyers can NEVER purchase Rice, Wheat, or raw grains.
   */
  public static isGroceryOnlyCategory(category: ProductCategory): boolean {
    return category === 'RICE' || category === 'WHEAT' || category === 'PADDY';
  }

  /**
   * Checks if a product is raw paddy or raw wheat (which are completely disallowed from the website).
   */
  public static isRawPaddyOrRawWheat(product: { category: ProductCategory; name: string }): boolean {
    if (product.category === 'PADDY') return true;
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes('raw paddy') || nameLower.includes('பச்சை நெல்') || nameLower.includes('கச்சா धान') || nameLower.includes('raw dhan')) {
      return true;
    }
    if (nameLower.includes('raw wheat') || nameLower.includes('மூல கோதுமை') || nameLower.includes('கச்சா गेहूं') || nameLower.includes('raw gehu')) {
      return true;
    }
    return false;
  }

  /**
   * Determines the mandatory buyer eligibility for a product upon creation or update.
   */
  public static determineBuyerEligibility(
    category: ProductCategory,
    userSelectedEligibility?: BuyerEligibilityType
  ): BuyerEligibilityType {
    if (this.isGroceryOnlyCategory(category)) {
      return 'GROCERY_ONLY';
    }
    return userSelectedEligibility || 'ALL';
  }

  /**
   * Checks if a buyer role can view/order a specific product.
   */
  public static canBuyerAccessProduct(product: ProductListing, buyerRole: UserRole): {
    allowed: boolean;
    reason?: string;
  } {
    // 1. Raw paddy and raw wheat are removed for all buyers
    if (this.isRawPaddyOrRawWheat(product)) {
      return {
        allowed: false,
        reason: 'Raw paddy and raw wheat are not available on this platform.',
      };
    }

    // 2. Processed Rice & Processed Wheat are strictly for Grocery Buyers only
    if (buyerRole === 'BULK') {
      if (
        product.category === 'RICE' ||
        product.category === 'WHEAT' ||
        product.category === 'PADDY' ||
        product.buyerEligibility === 'GROCERY_ONLY'
      ) {
        return {
          allowed: false,
          reason: 'Processed rice and processed wheat are reserved exclusively for Grocery Buyers.',
        };
      }
    }
    return { allowed: true };
  }

  /**
   * Strict backend & frontend filtering of product catalog based on buyer role.
   * Completely excludes raw paddy & raw wheat for all buyers.
   * Completely excludes Rice and Wheat for Bulk Buyers.
   */
  public static filterCatalogForBuyer(
    products: ProductListing[],
    buyerRole: UserRole
  ): ProductListing[] {
    // 1. Remove raw paddy and raw wheat for both bulk and grocery buyers
    const withoutRawGrains = products.filter((p) => !this.isRawPaddyOrRawWheat(p));

    // 2. If bulk buyer, also exclude Rice and Wheat entirely
    if (buyerRole === 'BULK') {
      return withoutRawGrains.filter(
        (p) =>
          p.category !== 'RICE' &&
          p.category !== 'WHEAT' &&
          p.category !== 'PADDY' &&
          p.buyerEligibility !== 'GROCERY_ONLY'
      );
    }

    // Grocery buyers can view Vegetables, Fruits, Processed Rice, Processed Wheat, and Other
    return withoutRawGrains;
  }

  /**
   * Inspects search terms for bulk buyers.
   * If a bulk buyer searches for restricted grains (rice/wheat/paddy), returns an explicit restriction notice.
   */
  public static inspectBulkSearchQuery(query: string): {
    isRestrictedGrainSearch: boolean;
    message?: string;
  } {
    const normalized = query.toLowerCase().trim();
    const restrictedKeywords = [
      'rice',
      'processed rice',
      'milled rice',
      'ponni rice',
      'basmati',
      'sona masoori',
      'arisi',
      'chawal',
      'wheat',
      'processed wheat',
      'raw wheat',
      'wheat flour',
      'atta',
      'kothumai',
      'gehu',
      'paddy',
      'raw paddy',
      'nel',
      'nellu',
      'dhan',
      'அரிசி',
      'கோதுமை',
      'நெல்',
      'चावल',
      'गेहूं',
      'धान',
    ];

    const matchesRestricted = restrictedKeywords.some((kw) =>
      normalized.includes(kw)
    );

    if (matchesRestricted) {
      return {
        isRestrictedGrainSearch: true,
        message: 'Processed rice, processed wheat, and raw grains are reserved exclusively for Grocery Buyers. Bulk buyers can procure wholesale vegetables, fruits, and commercial produce.',
      };
    }

    return { isRestrictedGrainSearch: false };
  }

  /**
   * Validates an entire order cart before checkout.
   */
  public static validateCartForBuyer(
    items: { productId: string; productName?: string; category: ProductCategory; buyerEligibility?: BuyerEligibilityType }[],
    buyerRole: UserRole
  ): { valid: boolean; errorMessage?: string } {
    // Disallow raw paddy and raw wheat for any checkout
    for (const item of items) {
      if (
        item.category === 'PADDY' ||
        (item.productName && (item.productName.toLowerCase().includes('raw paddy') || item.productName.toLowerCase().includes('raw wheat')))
      ) {
        return {
          valid: false,
          errorMessage: 'Raw paddy and raw wheat cannot be purchased.',
        };
      }
    }

    if (buyerRole === 'BULK') {
      for (const item of items) {
        if (
          item.category === 'RICE' ||
          item.category === 'WHEAT' ||
          item.category === 'PADDY' ||
          item.buyerEligibility === 'GROCERY_ONLY'
        ) {
          return {
            valid: false,
            errorMessage:
              'Security Violation: Processed rice and processed wheat are strictly reserved for Grocery Buyers only.',
          };
        }
      }
    }
    return { valid: true };
  }

  /**
   * Filters alternative buyers for unsold stock recommendations.
   * For rice, wheat, and raw grains, MUST NEVER suggest bulk buyers, hotels, or restaurants.
   */
  public static filterEligibleAlternativeBuyers(
    category: ProductCategory,
    candidateBuyers: { name: string; type: string; location: string; distanceKm: number }[]
  ): { name: string; type: string; location: string; distanceKm: number }[] {
    if (this.isGroceryOnlyCategory(category)) {
      // Only individual households, direct consumers, or local grocery buyers
      return candidateBuyers.filter(
        (b) =>
          b.type.toLowerCase().includes('grocery') ||
          b.type.toLowerCase().includes('household') ||
          b.type.toLowerCase().includes('individual') ||
          b.type.toLowerCase().includes('consumer')
      );
    }
    return candidateBuyers;
  }

  public static isBlockedSearchKeyword(query: string): boolean {
    return this.inspectBulkSearchQuery(query).isRestrictedGrainSearch;
  }

  public static filterEligibleProducts(
    products: ProductListing[],
    buyerRole: UserRole
  ): ProductListing[] {
    return this.filterCatalogForBuyer(products, buyerRole);
  }

  public static isProductAllowedForBuyer(
    product: ProductListing,
    buyerRole: UserRole
  ): { allowed: boolean; reason?: string } {
    return this.canBuyerAccessProduct(product, buyerRole);
  }
}
