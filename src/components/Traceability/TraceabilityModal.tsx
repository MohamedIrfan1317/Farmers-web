import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  ThermometerSnowflake,
  User,
  ShieldCheck,
  Truck,
  Leaf,
  X,
  ExternalLink,
} from 'lucide-react';
import { ProductListing, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { QRCodeCanvas } from '../Common/QRCodeCanvas';

interface TraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBatchId?: string;
  language: Language;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  isOpen,
  onClose,
  initialBatchId = 'BATCH_COIMB_01',
  language,
}) => {
  const [searchBatch, setSearchBatch] = useState(initialBatchId);
  const products = storageService.getProducts();

  if (!isOpen) return null;

  const matchedProduct =
    products.find((p) => p.batchId.toLowerCase() === searchBatch.toLowerCase()) ||
    products.find((p) => p.batchId === 'BATCH_COIMB_01') ||
    products[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-[#E6E2D3] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#827D6B] hover:text-[#2D3129] hover:bg-[#FDFCF8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D3129]">Farm-to-Fork QR Traceability</h3>
            <p className="text-xs text-[#827D6B]">
              Verified supply chain timeline from farmer harvest to customer doorstep
            </p>
          </div>
        </div>

        {/* Search Batch Bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#827D6B]" />
            <input
              type="text"
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              placeholder="Enter Batch ID (e.g. BATCH_COIMB_01, BATCH_PADDY_01)"
              className="w-full pl-9 pr-3 py-2 bg-[#FDFCF8] border border-[#E6E2D3] rounded-2xl text-xs font-mono font-bold uppercase text-[#2D3129] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
            />
          </div>
          <div className="flex gap-1">
            {products.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => setSearchBatch(p.batchId)}
                className="px-2.5 py-2 text-[10px] font-mono font-bold bg-[#F5F2E9] text-[#2D3129] rounded-xl hover:bg-[#E6E2D3]"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {matchedProduct ? (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="p-4 bg-[#E6F0E4]/60 border border-[#E6E2D3] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-left w-full sm:w-auto">
                <span className="text-[10px] font-bold text-[#4A6741] uppercase tracking-wider block">
                  Verified Authentic Farm Lot
                </span>
                <h4 className="text-base font-extrabold text-[#2D3129]">{matchedProduct.name}</h4>
                <div className="text-xs text-[#827D6B] font-medium">
                  Batch: <strong className="font-mono text-[#4A6741]">{matchedProduct.batchId}</strong> • Quality: <strong className="text-[#2D3129]">{matchedProduct.quality}</strong>
                </div>
                <div className="text-xs text-[#827D6B]">
                  Farmer: <strong className="text-[#2D3129]">{matchedProduct.farmerName}</strong> ({matchedProduct.farmerLocation})
                </div>
              </div>

              <div className="shrink-0 text-center bg-white p-2 rounded-2xl border border-[#E6E2D3]">
                <QRCodeCanvas
                  value={`https://farmerconnect.org/trace/${matchedProduct.batchId}?farmer=${matchedProduct.farmerId}&crop=${encodeURIComponent(matchedProduct.name)}`}
                  size={120}
                />
              </div>
            </div>

            {/* Traceability Timeline */}
            <div>
              <h4 className="text-xs font-bold text-[#827D6B] uppercase tracking-wider mb-4">
                Full Lifecycle History:
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#4A6741]/30 text-xs">
                {/* Stage 1 */}
                <div className="relative bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E6E2D3]">
                  <div className="absolute -left-[31px] top-3.5 w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px]">
                    🌱
                  </div>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#2D3129] text-xs font-bold">1. Harvested at Farm</strong>
                    <span className="text-[10px] font-mono text-[#827D6B]">{matchedProduct.harvestDate}</span>
                  </div>
                  <p className="text-[#827D6B] mt-1">
                    Harvested fresh at {matchedProduct.farmerLocation} by farmer {matchedProduct.farmerName}. Zero chemical wax applied. Verified organic grading: {matchedProduct.quality}.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="relative bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E6E2D3]">
                  <div className="absolute -left-[31px] top-3.5 w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px]">
                    ❄️
                  </div>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#2D3129] text-xs font-bold">2. Solar Cold Storage Pre-Cooling</strong>
                    <span className="text-[10px] font-mono text-[#827D6B]">
                      {matchedProduct.storageRequired ? 'Active' : 'Direct Dispatch'}
                    </span>
                  </div>
                  <p className="text-[#827D6B] mt-1">
                    {matchedProduct.storageRequired
                      ? `Stored at Thondamuthur FPO Solar Cold Room (Crate: ${matchedProduct.crateId || 'CRT-V-42'}) at steady 4.2°C / 88% humidity powered 100% by rooftop solar panels.`
                      : 'Direct farm gate dispatch to local customer community.'}
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="relative bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E6E2D3]">
                  <div className="absolute -left-[31px] top-3.5 w-6 h-6 rounded-full bg-[#D97757] text-white flex items-center justify-center text-[10px]">
                    📦
                  </div>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#2D3129] text-xs font-bold">3. Packaged & QR Coded</strong>
                    <span className="text-[10px] font-mono text-[#827D6B]">Batch #{matchedProduct.batchId}</span>
                  </div>
                  <p className="text-[#827D6B] mt-1">
                    Eco-friendly aerated crates sealed with tamper-evident batch identification sticker and farmer direct contact.
                  </p>
                </div>

                {/* Stage 4 */}
                <div className="relative bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E6E2D3]">
                  <div className="absolute -left-[31px] top-3.5 w-6 h-6 rounded-full bg-[#2D3129] text-white flex items-center justify-center text-[10px]">
                    🚚
                  </div>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#2D3129] text-xs font-bold">4. Clustered Farm Transit</strong>
                    <span className="text-[10px] font-mono text-[#827D6B]">AI Route Optimized</span>
                  </div>
                  <p className="text-[#827D6B] mt-1">
                    Low-emission cluster delivery direct from farm to neighborhood distribution hub with zero intermediate commission agents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#827D6B]">Batch not found.</div>
        )}
      </div>
    </div>
  );
};
