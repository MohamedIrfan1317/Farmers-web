import { ProductListing, ProductCategory, BuyerEligibilityType, UserRole } from '../types';

export class EligibilityService {
  /**
   * Evaluates if a given product category must be strictly restricted to Grocery buyers only.
   * Rule: Raw paddy and raw wheat must NEVER be available to Bulk Buyers.
   */
  public static isGroceryOnlyCategory(category: ProductCategory): boolean {
    return category === 'PADDY' || category === 'WHEAT';
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
    if (buyerRole === 'BULK') {
      if (
        product.category === 'PADDY' ||
        product.category === 'WHEAT' ||
        product.buyerEligibility === 'GROCERY_ONLY'
      ) {
        return {
          allowed: false,
          reason: 'This product is currently available only for Grocery Buyers.',
        };
      }
    }
    return { allowed: true };
  }

  /**
   * Strict backend & frontend filtering of product catalog based on buyer role.
   * Completely excludes raw paddy & wheat for Bulk Buyers.
   */
  public static filterCatalogForBuyer(
    products: ProductListing[],
    buyerRole: UserRole
  ): ProductListing[] {
    if (buyerRole === 'BULK') {
      return products.filter(
        (p) =>
          p.category !== 'PADDY' &&
          p.category !== 'WHEAT' &&
          p.buyerEligibility !== 'GROCERY_ONLY'
      );
    }
    // Grocery buyers, farmers, and admins can view all categories
    return products;
  }

  /**
   * Inspects search terms for bulk buyers.
   * If a bulk buyer searches for restricted grains (paddy/wheat), returns an explicit restriction notice.
   */
  public static inspectBulkSearchQuery(query: string): {
    isRestrictedGrainSearch: boolean;
    message?: string;
  } {
    const normalized = query.toLowerCase().trim();
    const restrictedKeywords = [
      'paddy',
      'raw paddy',
      'wheat',
      'raw wheat',
      'nel',
      'nellu',
      'kothumai',
      'dhan',
      'gehu',
      'நெல்',
      'கோதுமை',
      'धान',
      'गेहूं',
    ];

    const matchesRestricted = restrictedKeywords.some((kw) =>
      normalized.includes(kw)
    );

    if (matchesRestricted) {
      return {
        isRestrictedGrainSearch: true,
        message: 'This product is currently available only for Grocery Buyers.',
      };
    }

    return { isRestrictedGrainSearch: false };
  }

  /**
   * Validates an entire order cart before checkout.
   */
  public static validateCartForBuyer(
    items: { productId: string; category: ProductCategory; buyerEligibility?: BuyerEligibilityType }[],
    buyerRole: UserRole
  ): { valid: boolean; errorMessage?: string } {
    if (buyerRole === 'BULK') {
      for (const item of items) {
        if (
          item.category === 'PADDY' ||
          item.category === 'WHEAT' ||
          item.buyerEligibility === 'GROCERY_ONLY'
        ) {
          return {
            valid: false,
            errorMessage:
              'Security Violation: Raw paddy and raw wheat cannot be ordered by Bulk Buyers. This product is currently available only for Grocery Buyers.',
          };
        }
      }
    }
    return { valid: true };
  }

  /**
   * Filters alternative buyers for unsold stock recommendations.
   * For raw paddy and raw wheat, MUST NEVER suggest bulk buyers, hotels, or restaurants.
   */
  public static filterEligibleAlternativeBuyers(
    category: ProductCategory,
    candidateBuyers: { name: string; type: string; location: string; distanceKm: number }[]
  ): { name: string; type: string; location: string; distanceKm: number }[] {
    if (this.isGroceryOnlyCategory(category)) {
      // Only individual households, direct consumers, or local community kitchens
      return candidateBuyers.filter(
        (b) =>
          b.type.toLowerCase().includes('grocery') ||
          b.type.toLowerCase().includes('household') ||
          b.type.toLowerCase().includes('individual')
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
