import React from 'react';
import {
  X,
  Package,
  Sprout,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Phone,
  ArrowRight,
  ExternalLink,
  Navigation,
  FileText,
  CreditCard,
} from 'lucide-react';
import { Order, Language } from '../../types';
import { getTranslation } from '../../translations';
import { OrderStatusTimeline } from './OrderStatusTimeline';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenTraceability: (batchId: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  language,
  onOpenTraceability,
}) => {
  const t = getTranslation(language);

  if (!isOpen || !order) return null;

  const firstBatchId = order.items[0]?.batchId || 'BATCH_COIMB_01';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D3129]/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E6E2D3] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#4A6741] text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {t.orderTrackingModalTitle || 'Farm-to-Fork Order Lifecycle'}
                </h3>
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  #{order.id}
                </span>
              </div>
              <p className="text-xs text-[#E6F0E4]">
                {order.items.map((i) => i.productName).join(', ')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Order Summary Specs Bar */}
          <div className="bg-[#F2EFE6] rounded-2xl p-4 border border-[#E6E2D3] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#827D6B] block text-[10px] uppercase font-bold">
                {t.farmerDetails}
              </span>
              <span className="font-bold text-[#2D3129] block">{order.farmerName}</span>
              <span className="text-[11px] text-[#827D6B]">📍 {order.farmerLocation}</span>
            </div>

            <div>
              <span className="text-[#827D6B] block text-[10px] uppercase font-bold">
                {t.expectedDelivery}
              </span>
              <span className="font-bold text-[#4A6741] block">{order.estimatedDeliveryTime}</span>
              <span className="text-[11px] text-[#827D6B]">Corridor: ~{order.distanceKm} km</span>
            </div>

            <div>
              <span className="text-[#827D6B] block text-[10px] uppercase font-bold">
                {language === 'ta' ? 'மொத்த தொகை' : language === 'hi' ? 'कुल राशि' : 'Total Amount'}
              </span>
              <span className="font-extrabold text-[#4A6741] font-mono text-sm block">
                ₹{order.totalAmount}
              </span>
              <span className="text-[10px] text-[#827D6B]">Direct Zero Commission</span>
            </div>

            <div>
              <span className="text-[#827D6B] block text-[10px] uppercase font-bold">
                {t.batchNo}
              </span>
              <span className="font-mono font-bold text-[#2D3129] block truncate">
                {firstBatchId}
              </span>
              <button
                onClick={() => onOpenTraceability(firstBatchId)}
                className="text-[11px] text-[#4A6741] font-bold hover:underline flex items-center gap-0.5 mt-0.5"
              >
                <QrCode className="w-3 h-3" /> Audit Batch
              </button>
            </div>
          </div>

          {/* Interactive Order Status Timeline */}
          <div>
            <OrderStatusTimeline
              order={order}
              language={language}
              onOpenTraceability={onOpenTraceability}
              isCompact={false}
            />
          </div>

          {/* Items In This Order Card */}
          <div className="bg-white rounded-2xl border border-[#E6E2D3] p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-[#827D6B] uppercase tracking-wider">
              {language === 'ta'
                ? 'ஆர்டர் செய்யப்பட்ட பொருட்கள்'
                : language === 'hi'
                ? 'ऑर्डर की गई फसलें'
                : 'Items In This Order'}
            </h4>

            <div className="divide-y divide-[#F2EFE6]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-[#2D3129]">{item.productName}</div>
                      <div className="text-[11px] text-[#827D6B]">
                        Category: {item.category} • Farmer: {item.farmerName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-[#2D3129] font-mono">
                      {item.quantity} {item.unit} × ₹{item.unitPrice}
                    </div>
                    <div className="font-extrabold text-[#4A6741] font-mono">
                      ₹{item.totalPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EFE6] border-t border-[#E6E2D3] flex items-center justify-between rounded-b-3xl">
          <div className="text-xs text-[#827D6B] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
            <span>
              {language === 'ta'
                ? '100% பண்ணை உத்தரவாதம் & நேரடி கொடுப்பனவு'
                : language === 'hi'
                ? '100% प्रत्यक्ष खेत गारंटी'
                : '100% Farm Fresh Guarantee & Direct Settlement'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2D3129] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
