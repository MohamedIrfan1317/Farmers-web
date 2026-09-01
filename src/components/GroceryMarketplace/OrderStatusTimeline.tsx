import React, { useState, useEffect } from 'react';
import {
  Package,
  UserCheck,
  Sprout,
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  QrCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus, Language } from '../../types';
import { getTranslation } from '../../translations';
import { storageService } from '../../services/storageService';

interface OrderStatusTimelineProps {
  order: Order;
  language: Language;
  onOpenTraceability: (batchId: string) => void;
  isCompact?: boolean;
}

interface TimelineStage {
  id: OrderStatus;
  titleKey: string;
  descKey: string;
  defaultTitle: string;
  defaultDesc: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  order,
  language,
  onOpenTraceability,
  isCompact = false,
}) => {
  const t = getTranslation(language);
  const [isExpanded, setIsExpanded] = useState(!isCompact);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  const STAGES: TimelineStage[] = [
    {
      id: 'ORDER_PLACED',
      titleKey: 'stageOrderPlaced',
      descKey: 'stageDescOrderPlaced',
      defaultTitle: 'Order Placed',
      defaultDesc: 'Order confirmed and routed to local farmer',
      icon: Package,
      accentColor: 'text-[#4A6741]',
      badgeBg: 'bg-[#E6F0E4]',
    },
    {
      id: 'FARMER_ACCEPTED',
      titleKey: 'stageFarmerAccepted',
      descKey: 'stageDescFarmerAccepted',
      defaultTitle: 'Farmer Accepted',
      defaultDesc: 'Farmer confirmed availability & locked direct price',
      icon: UserCheck,
      accentColor: 'text-[#4A6741]',
      badgeBg: 'bg-[#E6F0E4]',
    },
    {
      id: 'PREPARING',
      titleKey: 'stageHarvested',
      descKey: 'stageDescHarvested',
      defaultTitle: 'Farmer Harvested & Packed',
      defaultDesc: 'Harvested fresh from farm field & sorted into eco-crates',
      icon: Sprout,
      accentColor: 'text-[#4A6741]',
      badgeBg: 'bg-[#E6F0E4]',
    },
    {
      id: 'PICKED_UP',
      titleKey: 'stagePickedUp',
      descKey: 'stageDescPickedUp',
      defaultTitle: 'Picked Up & Dispatched',
      defaultDesc: 'Loaded into local temperature-monitored EV logistics',
      icon: Truck,
      accentColor: 'text-[#D97757]',
      badgeBg: 'bg-[#FDF2ED]',
    },
    {
      id: 'IN_TRANSIT',
      titleKey: 'stageInTransit',
      descKey: 'stageDescInTransit',
      defaultTitle: 'Out for Delivery / In Transit',
      defaultDesc: 'Vehicle en route via local delivery corridor',
      icon: Navigation,
      accentColor: 'text-[#D97757]',
      badgeBg: 'bg-[#FDF2ED]',
    },
    {
      id: 'DELIVERED',
      titleKey: 'stageDelivered',
      descKey: 'stageDescDelivered',
      defaultTitle: 'Delivered Fresh',
      defaultDesc: 'Delivered to buyer doorstep with verified receipt',
      icon: CheckCircle2,
      accentColor: 'text-[#4A6741]',
      badgeBg: 'bg-[#E6F0E4]',
    },
  ];

  const getStageIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'ORDER_PLACED':
        return 0;
      case 'FARMER_ACCEPTED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY_FOR_PICKUP':
      case 'PICKED_UP':
        return 3;
      case 'IN_TRANSIT':
        return 4;
      case 'DELIVERED':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(order.status);
  const isDelivered = order.status === 'DELIVERED';
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / STAGES.length) * 100));

  // Get localized title for a stage
  const getStageTitle = (stage: TimelineStage) => {
    if (stage.id === 'ORDER_PLACED') return t.stageOrderPlaced || stage.defaultTitle;
    if (stage.id === 'FARMER_ACCEPTED') return t.stageFarmerAccepted || stage.defaultTitle;
    if (stage.id === 'PREPARING') return t.stageHarvested || stage.defaultTitle;
    if (stage.id === 'PICKED_UP') return t.stagePickedUp || stage.defaultTitle;
    if (stage.id === 'IN_TRANSIT') return t.stageInTransit || stage.defaultTitle;
    if (stage.id === 'DELIVERED') return t.stageDelivered || stage.defaultTitle;
    return stage.defaultTitle;
  };

  const getStageDesc = (stage: TimelineStage) => {
    if (stage.id === 'ORDER_PLACED') return t.stageDescOrderPlaced || stage.defaultDesc;
    if (stage.id === 'FARMER_ACCEPTED') return t.stageDescFarmerAccepted || stage.defaultDesc;
    if (stage.id === 'PREPARING') return t.stageDescHarvested || stage.defaultDesc;
    if (stage.id === 'PICKED_UP') return t.stageDescPickedUp || stage.defaultDesc;
    if (stage.id === 'IN_TRANSIT') return t.stageDescInTransit || stage.defaultDesc;
    if (stage.id === 'DELIVERED') return t.stageDescDelivered || stage.defaultDesc;
    return stage.defaultDesc;
  };

  // Find timeline log for specific stage if available
  const getTimelineLogForStage = (stageId: OrderStatus) => {
    return order.timeline?.find((item) => {
      if (stageId === 'PICKED_UP' && (item.status === 'READY_FOR_PICKUP' || item.status === 'PICKED_UP')) {
        return true;
      }
      return item.status === stageId;
    });
  };

  // Advance Order Lifecycle (for interactive demonstration)
  const advanceToNextStage = () => {
    const nextStatuses: OrderStatus[] = [
      'ORDER_PLACED',
      'FARMER_ACCEPTED',
      'PREPARING',
      'PICKED_UP',
      'IN_TRANSIT',
      'DELIVERED',
    ];
    if (currentIndex < nextStatuses.length - 1) {
      const nextStatus = nextStatuses[currentIndex + 1];
      const defaultNotes: Record<OrderStatus, string> = {
        ORDER_PLACED: 'Order registered in FarmerConnect network',
        FARMER_ACCEPTED: `Farmer ${order.farmerName} confirmed batch readiness and direct pricing`,
        PREPARING: `Harvested fresh from ${order.farmerLocation} field; graded and packed in eco-crates`,
        READY_FOR_PICKUP: 'Packaged and awaiting EV logistics pickup',
        PICKED_UP: 'Loaded into temperature-monitored EV transport (TN-38-AF-2024)',
        IN_TRANSIT: 'Vehicle dispatched via rural bypass corridor toward delivery destination',
        DELIVERED: 'Delivered directly to doorstep. Digital receipt verified & payment settled.',
        REJECTED: 'Order declined by farmer',
        CANCELLED: 'Order cancelled by buyer',
      };
      storageService.updateOrderStatus(order.id, nextStatus, defaultNotes[nextStatus]);
    }
  };

  // Reset Order Lifecycle
  const resetLifecycle = () => {
    storageService.updateOrderStatus(order.id, 'ORDER_PLACED', 'Reset lifecycle for testing');
    setIsAutoPlaying(false);
  };

  // Auto-play journey simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      if (currentIndex < STAGES.length - 1) {
        timer = setTimeout(() => {
          advanceToNextStage();
        }, 1800);
      } else {
        setIsAutoPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentIndex]);

  const activeBatchId = order.items[0]?.batchId || 'BATCH_COIMB_01';

  return (
    <div className="bg-[#FDFCF8] rounded-3xl border border-[#E6E2D3] p-4 sm:p-6 space-y-5 transition-all shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E2D3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center border border-[#C5D9C1] shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-[#2D3129]">
                {t.orderTimelineTitle || 'Order Lifecycle Tracking'}
              </h4>
              <span className="font-mono text-[11px] font-bold bg-[#F2EFE6] px-2 py-0.5 rounded-md text-[#2D3129]">
                #{order.id}
              </span>
            </div>
            <p className="text-xs text-[#827D6B]">
              {t.orderTimelineSubtitle || 'Direct farm-to-table real-time status and cold-chain dispatch journey'}
            </p>
          </div>
        </div>

        {/* Current Status Pill & Progress Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
              isDelivered
                ? 'bg-[#E6F0E4] text-[#4A6741] border-[#C5D9C1]'
                : 'bg-[#FDF2ED] text-[#D97757] border-[#F2C0B0] animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDelivered ? 'bg-[#4A6741]' : 'bg-[#D97757]'
              }`}
            ></span>
            <span>{getStageTitle(STAGES[currentIndex])}</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl border border-[#E6E2D3] bg-white text-[#827D6B] hover:text-[#2D3129] transition-colors"
            title={isExpanded ? 'Collapse timeline' : 'Expand full timeline'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar with Percentage */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#827D6B]">
          <span>
            {language === 'ta'
              ? 'பயண முன்னேற்றம்'
              : language === 'hi'
              ? 'यात्रा प्रगति'
              : 'Lifecycle Completion'}
          </span>
          <span className="font-mono font-bold text-[#4A6741]">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#E6E2D3] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#4A6741] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Horizontal Visual Pipeline (Desktop & Tablet) */}
      <div className="hidden lg:grid grid-cols-6 gap-2 pt-2">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const StageIcon = stage.icon;
          const log = getTimelineLogForStage(stage.id);

          return (
            <div key={stage.id} className="relative flex flex-col items-center text-center group">
              {/* Connector line */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors duration-300 ${
                    idx < currentIndex ? 'bg-[#4A6741]' : 'bg-[#E6E2D3]'
                  }`}
                />
              )}

              {/* Node Circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all duration-200 border-2 ${
                  isDone
                    ? 'bg-[#4A6741] border-[#4A6741] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-white border-[#D97757] text-[#D97757] ring-4 ring-[#D97757]/20 shadow-md scale-110'
                    : 'bg-white border-[#D0CBB8] text-[#827D6B]'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <StageIcon className="w-4 h-4" />
                )}
              </div>

              {/* Stage Title */}
              <div className="mt-2.5 px-1">
                <p
                  className={`text-xs font-bold line-clamp-2 leading-tight ${
                    isCurrent
                      ? 'text-[#D97757]'
                      : isDone
                      ? 'text-[#2D3129]'
                      : 'text-[#827D6B]'
                  }`}
                >
                  {getStageTitle(stage)}
                </p>
                {log?.timestamp && (
                  <span className="inline-block mt-0.5 text-[10px] font-mono text-[#827D6B] bg-[#F2EFE6] px-1.5 py-0.2 rounded">
                    {log.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Content: Active Milestone Card, Vertical Stepper, and Simulation Toolbar */}
      {isExpanded && (
        <div className="space-y-5 pt-2 animate-in fade-in duration-200">
          {/* Active Highlight Banner */}
          <div className="bg-white rounded-2xl border border-[#E6E2D3] p-4 sm:p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#827D6B] uppercase tracking-wider">
                    {t.currentStatusLabel || 'Current Stage'}
                  </span>
                  {!isDelivered && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97757] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97757]"></span>
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#2D3129] flex items-center gap-2">
                  <span>{getStageTitle(STAGES[currentIndex])}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#827D6B] leading-relaxed">
                  {getStageDesc(STAGES[currentIndex])}
                </p>
              </div>

              {/* ETA / Delivery Time */}
              <div className="text-left sm:text-right bg-[#F2EFE6] sm:bg-transparent p-3 sm:p-0 rounded-xl">
                <div className="text-[10px] font-bold text-[#827D6B] uppercase tracking-wider flex items-center sm:justify-end gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#4A6741]" />
                  <span>{t.estimatedArrival || 'Estimated Arrival'}</span>
                </div>
                <div className="text-sm font-bold text-[#4A6741] font-mono mt-0.5">
                  {order.estimatedDeliveryTime}
                </div>
                <div className="text-[11px] text-[#827D6B] mt-0.5">
                  📍 {order.distanceKm} km direct farm corridor
                </div>
              </div>
            </div>

            {/* Farm Origin & Vehicle Dispatch Specs Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#F2EFE6] text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center shrink-0 mt-0.5">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#827D6B] uppercase block">
                    {t.farmOriginLabel || 'Harvest Farm'}
                  </span>
                  <span className="font-bold text-[#2D3129]">{order.farmerName}</span>
                  <span className="text-[11px] text-[#827D6B] block">📍 {order.farmerLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FDF2ED] text-[#D97757] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#827D6B] uppercase block">
                    {t.dispatchVehicleLabel || 'Logistics Mode'}
                  </span>
                  <span className="font-bold text-[#2D3129]">
                    {order.deliveryType === 'DIRECT_DELIVERY'
                      ? 'Local Eco-EV Van (Solar Cool)'
                      : 'Farm Direct Pickup'}
                  </span>
                  <span className="text-[11px] text-[#827D6B] block">Vehicle: TN-38-AF-2024</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#F2EFE6] text-[#2D3129] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#827D6B] uppercase block">
                    {t.deliveryDestination || 'Delivery Address'}
                  </span>
                  <span className="font-bold text-[#2D3129] truncate block max-w-[180px]">
                    {order.buyerLocation}
                  </span>
                  <span className="text-[11px] text-[#4A6741] font-semibold block">
                    Recipient: {order.buyerName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Step-by-Step Timeline (Detailed Mobile & Desktop View) */}
          <div className="bg-white rounded-2xl border border-[#E6E2D3] p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#827D6B] uppercase tracking-wider">
              {language === 'ta'
                ? 'முழுமையான நிகழ்வு வரலாறு'
                : language === 'hi'
                ? 'विस्तृत टाइमलाइन लॉग'
                : 'Detailed Timeline Event History'}
            </h4>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E6E2D3] before:h-full">
              {STAGES.map((stage, idx) => {
                const isDone = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isPending = idx > currentIndex;
                const StageIcon = stage.icon;
                const log = getTimelineLogForStage(stage.id);

                return (
                  <div key={stage.id} className="relative flex items-start gap-3 pl-1">
                    {/* Stepper Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isDone
                          ? 'bg-[#4A6741] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#D97757] text-white ring-4 ring-[#D97757]/20 shadow-xs'
                          : 'bg-white border-2 border-[#D0CBB8] text-[#827D6B]'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <StageIcon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-[#FDFCF8] rounded-xl p-3 border border-[#F2EFE6] space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-[#D97757]'
                                : isDone
                                ? 'text-[#2D3129]'
                                : 'text-[#827D6B]'
                            }`}
                          >
                            {getStageTitle(stage)}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2ED] text-[#D97757] border border-[#F2C0B0]">
                              In Progress
                            </span>
                          )}
                        </div>

                        {log?.timestamp && (
                          <span className="text-[11px] font-mono text-[#827D6B] bg-[#F2EFE6] px-2 py-0.5 rounded">
                            {log.timestamp}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#827D6B] leading-relaxed">
                        {log?.note || getStageDesc(stage)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulation & Actions Toolbar */}
          <div className="bg-[#F2EFE6] rounded-2xl p-4 border border-[#E6E2D3] flex flex-wrap items-center justify-between gap-3">
            {/* Left Action: Advance Lifecycle (for testing/demo) */}
            <div className="flex flex-wrap items-center gap-2">
              {!isDelivered ? (
                <>
                  <button
                    onClick={advanceToNextStage}
                    className="px-4 py-2 bg-[#4A6741] hover:bg-[#3D5635] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 hover:scale-102"
                  >
                    <span>{t.simulateNextStep || 'Advance Stage (Demo)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                      isAutoPlaying
                        ? 'bg-[#D97757] text-white border-[#D97757]'
                        : 'bg-white text-[#2D3129] border-[#E6E2D3] hover:bg-[#FDFCF8]'
                    }`}
                  >
                    <Play className={`w-3.5 h-3.5 ${isAutoPlaying ? 'animate-spin' : ''}`} />
                    <span>
                      {isAutoPlaying
                        ? language === 'ta'
                          ? 'நடைபெறுகிறது...'
                          : 'Simulating...'
                        : t.autoSimulateDelivery || 'Auto-Play Journey'}
                    </span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-[#E6F0E4] text-[#4A6741] text-xs font-bold rounded-xl border border-[#C5D9C1] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />
                    <span>
                      {language === 'ta'
                        ? 'ஆர்டர் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது!'
                        : language === 'hi'
                        ? 'ऑर्डर सफलतापूर्वक डिलीवर हुआ!'
                        : 'Order successfully delivered to your doorstep!'}
                    </span>
                  </span>
                  <button
                    onClick={resetLifecycle}
                    className="px-3 py-1.5 bg-white text-[#827D6B] hover:text-[#2D3129] border border-[#E6E2D3] text-xs font-semibold rounded-xl flex items-center gap-1"
                    title="Reset lifecycle to test again"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.resetOrderStatus || 'Reset'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Action: QR Traceability & Direct Contact */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenTraceability(activeBatchId)}
                className="px-3 py-2 bg-white hover:bg-[#FDFCF8] text-[#2D3129] border border-[#E6E2D3] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5 text-[#4A6741]" />
                <span>{t.viewTraceabilityReport || 'Batch QR Traceability'}</span>
              </button>

              <a
                href={`tel:${order.farmerPhone || '9842156789'}`}
                className="px-3 py-2 bg-white hover:bg-[#FDFCF8] text-[#2D3129] border border-[#E6E2D3] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#D97757]" />
                <span className="hidden sm:inline">{t.callFarmerAction || 'Call Farmer'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
