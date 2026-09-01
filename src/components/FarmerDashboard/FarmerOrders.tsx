import React from 'react';
import {
  PackageCheck,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { getTranslation } from '../../translations';

interface FarmerOrdersProps {
  orders: Order[];
  language: Language;
  onOpenTraceability: (batchId: string) => void;
}

export const FarmerOrders: React.FC<FarmerOrdersProps> = ({
  orders,
  language,
  onOpenTraceability,
}) => {
  const t = getTranslation(language);

  const handleAcceptOrder = (orderId: string) => {
    storageService.updateOrderStatus(
      orderId,
      'FARMER_ACCEPTED',
      'Farmer accepted the order! Harvesting fresh and packing now.'
    );
  };

  const handleRejectOrder = (orderId: string) => {
    storageService.updateOrderStatus(
      orderId,
      'REJECTED',
      'Farmer is currently out of stock or unable to fulfil this order.'
    );
  };

  const handleAdvanceStatus = (order: Order) => {
    const statusFlow: OrderStatus[] = [
      'ORDER_PLACED',
      'FARMER_ACCEPTED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'PICKED_UP',
      'IN_TRANSIT',
      'DELIVERED',
    ];

    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      storageService.updateOrderStatus(
        order.id,
        nextStatus,
        `Status updated to ${nextStatus.replace('_', ' ')}`
      );
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER_PLACED':
        return (
          <span className="px-3 py-1 bg-[#E9C46A]/20 text-[#2D3129] border border-[#E9C46A] rounded-full text-xs font-bold animate-pulse">
            ⚡ Action Needed: New Request
          </span>
        );
      case 'FARMER_ACCEPTED':
        return (
          <span className="px-3 py-1 bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1] rounded-full text-xs font-bold">
            ✓ Accepted by You
          </span>
        );
      case 'PREPARING':
        return (
          <span className="px-3 py-1 bg-[#F2EFE6] text-[#2D3129] border border-[#E6E2D3] rounded-full text-xs font-bold">
            🧺 Packing & Harvesting
          </span>
        );
      case 'READY_FOR_PICKUP':
        return (
          <span className="px-3 py-1 bg-[#A8D5BA]/30 text-[#2D3129] border border-[#8BB99D] rounded-full text-xs font-bold">
            📦 Ready for Pickup
          </span>
        );
      case 'IN_TRANSIT':
      case 'PICKED_UP':
        return (
          <span className="px-3 py-1 bg-[#4A6741] text-white rounded-full text-xs font-bold">
            🚚 On the Way ({orderEta(orders[0])})
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 bg-[#F2EFE6] text-[#827D6B] border border-[#E6E2D3] rounded-full text-xs font-bold">
            🎉 Delivered
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/30 rounded-full text-xs font-bold">
            ✕ Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const orderEta = (order?: Order) => order?.estimatedDeliveryTime || '45 mins';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2D3129]">
            {t.farmerNavOrders} ({orders.length})
          </h3>
          <p className="text-xs text-[#827D6B]">
            Instant matching with verified grocery customers and agreed bulk partners
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E6E2D3] shadow-xs">
          <PackageCheck className="w-12 h-12 text-[#827D6B] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#2D3129]">No active incoming orders.</p>
          <p className="text-xs text-[#827D6B] mt-1">
            When nearby customers order your produce, they will show up here instantly with sound alerts!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#E6E2D3] p-5 sm:p-6 shadow-xs hover:border-[#4A6741]/40 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E6E2D3]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#F2EFE6] text-[#2D3129] border border-[#E6E2D3] px-2.5 py-0.5 rounded-md">
                    #{order.id}
                  </span>
                  <span className="text-xs text-[#827D6B]">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                {/* Left: Buyer info */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-[#827D6B] uppercase tracking-wider block">
                    Buyer Details
                  </span>
                  <div className="font-bold text-[#2D3129] text-base">{order.buyerName}</div>
                  <div className="text-[#827D6B] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#827D6B]" />
                    <span>{order.buyerLocation}</span>
                  </div>
                  <div className="text-[#827D6B] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#827D6B]" />
                    <span>+91 {order.buyerPhone}</span>
                  </div>
                  <div className="pt-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#F2EFE6] text-[#2D3129] border border-[#E6E2D3]">
                      {order.buyerRole === 'BULK' ? 'Commercial Bulk Order' : 'Direct Grocery Household'}
                    </span>
                  </div>
                </div>

                {/* Center: Ordered Items */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-[#827D6B] uppercase tracking-wider block">
                    Produce Items
                  </span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#F2EFE6] rounded-2xl border border-[#E6E2D3]">
                      <div>
                        <span className="font-bold text-[#2D3129] block">{item.productName}</span>
                        <span className="text-[11px] text-[#827D6B]">
                          {item.quantity} {item.unit} @ ₹{item.unitPrice}/{item.unit}
                        </span>
                      </div>
                      <span className="font-bold text-[#2D3129]">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Right: Total Amount & Timeline */}
                <div className="flex flex-col justify-between bg-[#E6F0E4]/60 p-4 rounded-2xl border border-[#C5D9C1]">
                  <div>
                    <span className="text-[10px] font-bold text-[#4A6741] uppercase tracking-wider block">
                      Total Farmer Payout
                    </span>
                    <div className="text-2xl font-black text-[#4A6741] font-mono">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-[#4A6741] font-medium">
                      Direct Bank/UPI Transfer on delivery
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#827D6B]">
                    <strong>Delivery Route:</strong> {order.deliveryType.replace('_', ' ')} (~{order.distanceKm} km)
                  </div>
                </div>
              </div>

              {/* Action Buttons for Farmer */}
              <div className="pt-3 border-t border-[#E6E2D3] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-[#827D6B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ETA: {order.estimatedDeliveryTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'ORDER_PLACED' ? (
                    <>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="px-4 py-2 text-xs font-bold text-[#D97757] bg-white hover:bg-[#D97757]/10 rounded-2xl border border-[#D97757]/30 flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.reject}</span>
                      </button>
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#4A6741] hover:bg-[#384F32] rounded-2xl shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{t.accept} & Pack</span>
                      </button>
                    </>
                  ) : order.status !== 'DELIVERED' && order.status !== 'REJECTED' ? (
                    <button
                      onClick={() => handleAdvanceStatus(order)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#4A6741] hover:bg-[#384F32] rounded-2xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="w-4 h-4" />
                      <span>
                        Advance Status (Next: {order.status === 'FARMER_ACCEPTED' ? 'Preparing' : order.status === 'PREPARING' ? 'Ready for Pickup' : order.status === 'READY_FOR_PICKUP' ? 'In Transit' : 'Delivered'})
                      </span>
                    </button>
                  ) : (
                    <span className="text-xs text-[#827D6B] font-semibold">Completed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
