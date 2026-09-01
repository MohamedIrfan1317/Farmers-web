import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  Truck,
  HelpCircle,
  Clock,
  ShieldCheck,
  Fuel,
  Leaf,
  Navigation,
} from 'lucide-react';
import { Language } from '../../types';
import { storageService } from '../../services/storageService';
import { AIService, RouteOptimizationResult } from '../../services/aiService';
import { getTranslation } from '../../translations';

interface FarmerPriceAssistantProps {
  language: Language;
}

export const FarmerPriceAssistant: React.FC<FarmerPriceAssistantProps> = ({ language }) => {
  const t = getTranslation(language);
  const priceTrends = storageService.getPriceTrends();
  const demandForecasts = AIService.getDemandForecasts('Coimbatore Agri-Cluster');
  const [routeResult, setRouteResult] = useState<RouteOptimizationResult>(
    AIService.optimizeDeliveryRoute('Thondamuthur Farm', [])
  );

  return (
    <div className="space-y-6">
      {/* Header & Disclaimer */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D97757]" />
          <h3 className="text-lg sm:text-xl font-bold text-[#2D3129]">
            {t.aiPriceGuidanceTitle} & Mandi Intelligence
          </h3>
        </div>
        <p className="text-xs text-[#827D6B] mt-0.5">
          Real-time market analytics to help farmers negotiate fair prices and bypass intermediaries
        </p>

        <div className="mt-2.5 p-3 bg-[#F2EFE6] border border-[#E6E2D3] rounded-2xl text-[11px] text-[#2D3129] flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-[#827D6B] shrink-0 mt-0.5" />
          <span>{t.aiDisclaimer}</span>
        </div>
      </div>

      {/* 1. Live Mandi vs Direct Platform Price Comparison */}
      <div className="bg-white rounded-3xl border border-[#E6E2D3] p-5 sm:p-6 shadow-xs">
        <h4 className="text-sm font-bold text-[#2D3129] mb-3 flex items-center justify-between">
          <span>Live Commodity Price Comparison</span>
          <span className="text-xs text-[#4A6741] font-semibold">Updated Today 6:00 AM</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6E2D3] text-[#827D6B] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-2">Crop / Commodity</th>
                <th className="pb-2">APMC Mandi Base</th>
                <th className="pb-2">Direct Platform Avg</th>
                <th className="pb-2">Suggested Selling Range</th>
                <th className="pb-2">Farmer Net Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D3]">
              {priceTrends.map((trend, idx) => {
                const gain = Math.round(
                  ((trend.currentAvgPrice - trend.mandiPriceGovt) / trend.mandiPriceGovt) * 100
                );
                return (
                  <tr key={idx} className="hover:bg-[#FDFCF8] transition-colors">
                    <td className="py-3 font-bold text-[#2D3129]">
                      {trend.productName}
                      <span className="block text-[10px] text-[#827D6B] font-normal">
                        Category: {trend.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[#827D6B]">
                      ₹{trend.mandiPriceGovt}/{trend.unit}
                    </td>
                    <td className="py-3 font-mono font-bold text-[#2D3129]">
                      ₹{trend.currentAvgPrice}/{trend.unit}
                    </td>
                    <td className="py-3 font-mono text-[#4A6741] font-semibold">
                      ₹{trend.suggestedSellingRange.min} – ₹{trend.suggestedSellingRange.max}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E6F0E4] text-[#4A6741] rounded-md font-bold text-[11px] border border-[#C5D9C1]">
                        <TrendingUp className="w-3 h-3 text-[#4A6741]" />
                        +{gain}% Higher
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. AI Regional Demand Forecasts */}
      <div className="bg-white rounded-3xl border border-[#E6E2D3] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97757]" />
              <span>{t.aiForecastingTitle}</span>
            </h4>
            <span className="text-xs text-[#827D6B]">Coimbatore & Tiruppur Agricultural Zone</span>
          </div>
          <span className="px-3 py-1 bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1] rounded-full text-xs font-bold">
            94% Model Accuracy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {demandForecasts.map((forecast, fIdx) => (
            <div
              key={fIdx}
              className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] space-y-2 hover:border-[#4A6741] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2D3129] text-xs">{forecast.productName}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    forecast.demandLevel === 'VERY_HIGH'
                      ? 'bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/30'
                      : forecast.demandLevel === 'HIGH'
                      ? 'bg-[#E9C46A]/30 text-[#2D3129] border border-[#E9C46A]'
                      : 'bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1]'
                  }`}
                >
                  Demand: {forecast.demandLevel.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-[#2D3129] leading-relaxed">
                <strong className="text-[#4A6741]">Strategy:</strong> {forecast.recommendedAction}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-[#827D6B]">
                <span>Key Buyers:</span>
                {forecast.primaryBuyerTypes.map((buyer, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2 py-0.5 bg-white border border-[#E6E2D3] rounded-md font-medium text-[#2D3129]"
                  >
                    {buyer}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Delivery Route & Logistics Optimizer */}
      <div className="bg-white rounded-3xl border border-[#E6E2D3] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#4A6741]" />
            <h4 className="text-sm font-bold text-[#2D3129]">{t.aiRouteTitle}</h4>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-[#4A6741] font-bold bg-[#E6F0E4] px-2.5 py-0.5 rounded-full border border-[#C5D9C1]">
              <Fuel className="w-3 h-3" /> Saved 1.8 L Fuel
            </span>
            <span className="flex items-center gap-1 text-[#2D3129] font-bold bg-[#F2EFE6] px-2.5 py-0.5 rounded-full border border-[#E6E2D3]">
              <Clock className="w-3 h-3 text-[#D97757]" /> 38 mins faster
            </span>
          </div>
        </div>

        <p className="text-xs text-[#827D6B] mb-4">
          When delivering multiple orders, our route sequencing bundles nearby drops to minimize travel distance:
        </p>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#4A6741]/40">
          <div className="relative text-xs">
            <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px] font-bold">
              0
            </div>
            <strong className="text-[#2D3129] block">Origin: Muthusamy Farm (Thondamuthur)</strong>
            <span className="text-[11px] text-[#827D6B]">Departure: 3:15 PM</span>
          </div>

          {routeResult.optimizedStops.map((stop, sIdx) => (
            <div key={sIdx} className="relative text-xs bg-[#FDFCF8] p-3 rounded-2xl border border-[#E6E2D3]">
              <div className="absolute -left-[30px] top-3 w-5 h-5 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px] font-bold">
                {stop.stopNumber}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <strong className="text-[#2D3129] block text-xs">{stop.customerName}</strong>
                  <span className="text-[11px] text-[#827D6B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#827D6B]" /> {stop.location} ({stop.distanceFromPreviousKm} km from prev)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#4A6741] font-mono">
                  ETA: {stop.estimatedArrival}
                </span>
              </div>
              <div className="text-[10px] text-[#2D3129] mt-1.5 font-medium bg-[#F2EFE6] px-2.5 py-1 rounded-lg border border-[#E6E2D3] inline-block">
                📦 {stop.itemsSummary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
