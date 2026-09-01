import React, { useState } from 'react';
import {
  Package,
  QrCode,
  Sparkles,
  Wheat,
  ShieldCheck,
  ThermometerSnowflake,
  Trash2,
  Edit,
  CheckCircle,
  Eye,
  Plus,
  Clock,
} from 'lucide-react';
import { ProductListing, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { EligibilityService } from '../../services/eligibilityService';
import { getTranslation } from '../../translations';
import { QRCodeCanvas } from '../Common/QRCodeCanvas';

interface FarmerProductListProps {
  products: ProductListing[];
  language: Language;
  onOpenListProduce: () => void;
  onOpenPaddyToRice: () => void;
  onOpenTraceability: (batchId: string) => void;
}

export const FarmerProductList: React.FC<FarmerProductListProps> = ({
  products,
  language,
  onOpenListProduce,
  onOpenPaddyToRice,
  onOpenTraceability,
}) => {
  const t = getTranslation(language);
  const [activeQrModal, setActiveQrModal] = useState<ProductListing | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product listing?')) {
      storageService.deleteProduct(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2D3129]">
            {t.farmerNavMyProducts} ({products.length})
          </h3>
          <p className="text-xs text-[#827D6B]">
            Manage your live crop batches, solar cold chain slots, and QR traceability stamps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPaddyToRice}
            className="px-4 py-2 text-xs font-bold text-[#2D3129] bg-[#F2EFE6] hover:bg-[#EAE6DA] border border-[#E6E2D3] rounded-2xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Wheat className="w-4 h-4 text-[#D97757]" />
            <span>{t.btnConvertPaddy}</span>
          </button>
          <button
            onClick={onOpenListProduce}
            className="px-4 py-2 text-xs font-bold text-white bg-[#4A6741] hover:bg-[#384F32] rounded-2xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnListProduce}</span>
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E6E2D3] shadow-xs">
          <Package className="w-12 h-12 text-[#827D6B] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#2D3129]">No active produce listed yet.</p>
          <p className="text-xs text-[#827D6B] mt-1 mb-4">
            List your harvest in seconds with our simple visual form or via toll-free voice call!
          </p>
          <button
            onClick={onOpenListProduce}
            className="px-5 py-2.5 bg-[#4A6741] text-white font-bold text-xs rounded-2xl"
          >
            + List Produce Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const isGrain = EligibilityService.isGroceryOnlyCategory(product.category);

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#E6E2D3] overflow-hidden shadow-xs hover:border-[#4A6741]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-44 w-full bg-[#F2EFE6]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Eligibility Badge */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {isGrain ? (
                        <span className="px-2.5 py-1 bg-[#F2EFE6] text-[#827D6B] border border-[#E6E2D3] text-[10px] font-bold rounded-full backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 text-[#D97757]" />
                          <span>{t.groceryOnlyBadge}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1] text-[10px] font-bold rounded-full backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <CheckCircle className="w-3 h-3 text-[#4A6741]" />
                          <span>All Buyers (Bulk + Grocery)</span>
                        </span>
                      )}

                      {product.storageRequired && (
                        <span className="px-2.5 py-1 bg-[#A8D5BA] text-[#2D3129] border border-[#8BB99D] text-[10px] font-bold rounded-full backdrop-blur-xs flex items-center gap-1">
                          <ThermometerSnowflake className="w-3 h-3 text-[#2D3129]" />
                          <span>Solar Stored: {product.crateId}</span>
                        </span>
                      )}
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-sm border border-[#E6E2D3] text-right">
                      <span className="text-[10px] text-[#827D6B] block font-medium">Selling Price</span>
                      <span className="text-base font-black text-[#D97757] font-mono">
                        ₹{product.expectedPrice}/{product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="text-base font-bold text-[#2D3129] leading-tight">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-[#827D6B] font-mono block">
                          Batch: {product.batchId} • Grade: {product.quality}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F2EFE6] text-[#827D6B] border border-[#E6E2D3]">
                        {product.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6E2D3] text-xs">
                      <div>
                        <span className="text-[#827D6B] text-[10px] block font-semibold">Available Stock</span>
                        <strong className="text-[#2D3129] text-sm font-mono">
                          {product.quantity} {product.unit}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#827D6B] text-[10px] block font-semibold">Stock Freshness</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            product.stockAgeStatus === 'FRESH'
                              ? 'bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1]'
                              : product.stockAgeStatus === 'WARNING'
                              ? 'bg-[#E9C46A] text-[#2D3129] border border-[#D9B45A]'
                              : 'bg-[#D97757]/20 text-[#D97757] border border-[#D97757]/30'
                          }`}
                        >
                          {product.daysInStock} Days ({product.stockAgeStatus})
                        </span>
                      </div>
                    </div>

                    {/* Paddy processing reminder if category is Paddy */}
                    {product.category === 'PADDY' && (
                      <div className="p-3 bg-[#F2EFE6] rounded-2xl border border-[#E6E2D3] text-[11px] text-[#2D3129] flex items-center justify-between">
                        <div>
                          <strong className="block font-bold text-[#4A6741]">Value Addition Available:</strong>
                          <span className="text-[#827D6B]">Milling 10 bags yields ~340 kg rice</span>
                        </div>
                        <button
                          onClick={onOpenPaddyToRice}
                          className="px-2.5 py-1 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold rounded-xl text-[10px] shrink-0"
                        >
                          Mill to Rice
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-[#FDFCF8] border-t border-[#E6E2D3] flex items-center justify-between gap-1">
                  <button
                    onClick={() => setActiveQrModal(product)}
                    className="p-2 text-[#2D3129] hover:bg-[#F2EFE6] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="View QR Code for Packaging & Crates"
                  >
                    <QrCode className="w-4 h-4 text-[#4A6741]" />
                    <span>QR Matrix</span>
                  </button>

                  <button
                    onClick={() => onOpenTraceability(product.batchId)}
                    className="p-2 text-[#2D3129] hover:bg-[#F2EFE6] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="View Full Supply Chain Traceability"
                  >
                    <Eye className="w-4 h-4 text-[#D97757]" />
                    <span>Trace</span>
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-[#D97757] hover:bg-[#D97757]/10 rounded-xl text-xs transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal Popup */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-xl border border-[#E6E2D3]">
            <h4 className="text-base font-bold text-[#2D3129]">{activeQrModal.name}</h4>
            <p className="text-xs text-[#827D6B] mt-0.5">
              Batch #{activeQrModal.batchId} • Farmer #{activeQrModal.farmerId}
            </p>

            <div className="my-5 flex justify-center p-3 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3]">
              <QRCodeCanvas
                value={`https://farmerconnect.org/trace/${activeQrModal.batchId}?farmer=${activeQrModal.farmerId}&crop=${encodeURIComponent(activeQrModal.name)}&harvest=${activeQrModal.harvestDate}`}
                size={180}
              />
            </div>

            <div className="text-xs text-[#2D3129] bg-[#F2EFE6] p-3.5 rounded-2xl border border-[#E6E2D3] text-left space-y-1.5">
              <div><strong className="text-[#4A6741]">Farmer:</strong> {activeQrModal.farmerName}</div>
              <div><strong className="text-[#4A6741]">Location:</strong> {activeQrModal.farmerLocation}</div>
              <div><strong className="text-[#4A6741]">Harvest Date:</strong> {activeQrModal.harvestDate}</div>
              <div><strong className="text-[#4A6741]">Status:</strong> {activeQrModal.status}</div>
              {activeQrModal.crateId && <div><strong className="text-[#4A6741]">Cold Crate:</strong> {activeQrModal.crateId}</div>}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setActiveQrModal(null)}
                className="flex-1 py-2.5 bg-[#F2EFE6] hover:bg-[#EAE6DA] text-[#2D3129] font-bold text-xs rounded-2xl border border-[#E6E2D3]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onOpenTraceability(activeQrModal.batchId);
                  setActiveQrModal(null);
                }}
                className="flex-1 py-2.5 bg-[#4A6741] hover:bg-[#384F32] text-white font-bold text-xs rounded-2xl shadow-xs"
              >
                View Full Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
