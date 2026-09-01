import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Building2,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  TrendingDown,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { UnsoldStockAlert, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { EligibilityService } from '../../services/eligibilityService';
import { getTranslation } from '../../translations';

interface FarmerStockAlertsProps {
  alerts: UnsoldStockAlert[];
  language: Language;
}

export const FarmerStockAlerts: React.FC<FarmerStockAlertsProps> = ({ alerts, language }) => {
  const t = getTranslation(language);
  const [appliedDiscounts, setAppliedDiscounts] = useState<Record<string, number>>({});
  const [contactedBuyers, setContactedBuyers] = useState<Record<string, boolean>>({});

  const handleApplyDiscount = (alert: UnsoldStockAlert) => {
    storageService.updateProduct(alert.productId, {
      expectedPrice: alert.recommendedTargetPrice,
      status: 'AVAILABLE',
    });
    setAppliedDiscounts({ ...appliedDiscounts, [alert.productId]: alert.recommendedTargetPrice });
  };

  const handleContactBuyer = (alertId: string, buyerName: string) => {
    setContactedBuyers({ ...contactedBuyers, [`${alertId}-${buyerName}`]: true });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#2D3129] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#D97757]" />
          <span>{t.stockAgeTitle}</span>
        </h3>
        <p className="text-xs text-[#827D6B]">
          Automated shelf-life tracking and smart alternative buyer routing to eliminate harvest food waste
        </p>
      </div>

      {/* Overview Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-[#E6F0E4] rounded-2xl border border-[#C5D9C1]">
          <div className="flex items-center gap-2 text-[#4A6741] text-xs font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A6741]"></span>
            <span>{t.freshStatus} (0–3 Days)</span>
          </div>
          <p className="text-xs text-[#827D6B]">Optimal freshness, standard direct marketplace rate.</p>
        </div>

        <div className="p-4 bg-[#F2EFE6] rounded-2xl border border-[#E6E2D3]">
          <div className="flex items-center gap-2 text-[#2D3129] text-xs font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E9C46A]"></span>
            <span>{t.warningStatus} (4–6 Days)</span>
          </div>
          <p className="text-xs text-[#827D6B]">Consider alternative bulk commercial buyers or 10% instant promo.</p>
        </div>

        <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#D97757]/30">
          <div className="flex items-center gap-2 text-[#D97757] text-xs font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]"></span>
            <span>{t.urgentStatus} (7+ Days)</span>
          </div>
          <p className="text-xs text-[#827D6B]">Immediate routing to processing units / central mess kitchens.</p>
        </div>
      </div>

      {/* Active Alerts List */}
      {alerts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-[#E6E2D3] shadow-xs">
          <CheckCircle className="w-10 h-10 text-[#4A6741] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#2D3129]">All produce inventory is healthy and fresh!</p>
          <p className="text-xs text-[#827D6B] mt-1">
            No stock aging or spoilage risks detected across your active batches.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const isGrain = EligibilityService.isGroceryOnlyCategory(alert.category);

            return (
              <div
                key={alert.productId}
                className="p-5 sm:p-6 rounded-3xl border border-[#E6E2D3] bg-white shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E6E2D3]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        alert.urgency === 'URGENT'
                          ? 'bg-[#D97757] text-white'
                          : 'bg-[#E9C46A] text-[#2D3129]'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{alert.urgency === 'URGENT' ? 'Urgent Action Needed' : 'Aging Stock Alert'}</span>
                    </span>
                    <span className="text-sm font-bold text-[#2D3129]">
                      {alert.productName} ({alert.remainingQuantity} {alert.unit} remaining)
                    </span>
                  </div>

                  <span className="text-xs text-[#827D6B] font-medium">
                    Unsold for <strong className="text-[#2D3129]">{alert.daysUnsold} days</strong>
                  </span>
                </div>

                {/* Body Explanation */}
                <div className="my-3 text-xs text-[#2D3129] leading-relaxed">
                  <p>
                    {alert.remainingQuantity} {alert.unit} of {alert.productName} has remained unsold for{' '}
                    {alert.daysUnsold} days. Consider offering a {alert.recommendedDiscountPercent}% clearance discount (₹
                    {alert.recommendedTargetPrice}/{alert.unit}) to move stock before quality degrades.
                  </p>

                  {/* Strict product eligibility note */}
                  {isGrain ? (
                    <div className="mt-2.5 p-3 bg-[#F2EFE6] rounded-2xl border border-[#E6E2D3] text-[11px] font-semibold text-[#2D3129] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#D97757] shrink-0" />
                      <span>
                        Strict Policy Enforced: Raw paddy and wheat recommendations are restricted strictly to individual grocery consumers and direct local families. Bulk commercial buyers are excluded.
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-3 bg-[#E6F0E4] rounded-2xl border border-[#C5D9C1] text-[11px] font-semibold text-[#4A6741] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4A6741] shrink-0" />
                      <span>
                        Commercial Buyer Matching Enabled: Eligible for nearby restaurants, hotels, and food processors.
                      </span>
                    </div>
                  )}
                </div>

                {/* Auto-Matched Alternative Buyers */}
                <div className="mt-3 pt-3 border-t border-[#E6E2D3]">
                  <span className="text-[11px] font-bold text-[#827D6B] uppercase tracking-wider block mb-2">
                    {t.recommendAlternativeBuyers}:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {alert.suggestedBuyers.map((buyer, bIdx) => {
                      const contacted = contactedBuyers[`${alert.productId}-${buyer.name}`];
                      return (
                        <div
                          key={bIdx}
                          className="p-3 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#2D3129]">{buyer.name}</div>
                            <div className="text-[11px] text-[#827D6B]">
                              {buyer.type} • {buyer.distanceKm} km ({buyer.location})
                            </div>
                          </div>

                          <button
                            onClick={() => handleContactBuyer(alert.productId, buyer.name)}
                            disabled={contacted}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0 ${
                              contacted
                                ? 'bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1]'
                                : 'bg-[#2D3129] text-white hover:bg-[#4A6741]'
                            }`}
                          >
                            <Phone className="w-3 h-3" />
                            <span>{contacted ? 'Offer Sent' : 'Send Offer'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Apply Recommended Price Button */}
                <div className="mt-4 pt-3 border-t border-[#E6E2D3] flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-[#827D6B]">
                    Current: <span className="line-through">₹{alert.currentPrice}/{alert.unit}</span> → Target:{' '}
                    <strong className="text-[#4A6741] font-bold text-sm">
                      ₹{alert.recommendedTargetPrice}/{alert.unit}
                    </strong>
                  </div>

                  <button
                    onClick={() => handleApplyDiscount(alert)}
                    className="px-4 py-2 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-xs rounded-2xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>
                      {appliedDiscounts[alert.productId] ? 'Updated to ₹' + alert.recommendedTargetPrice : 'Apply Fast-Clearance Price'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
