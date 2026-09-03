import React, { useState, useMemo } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Package,
  Truck,
  Building2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { NotificationItem, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { getTranslation } from '../../translations';

interface NotificationOverlayPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUserId?: string;
  onSelectNotification?: (item: NotificationItem) => void;
}

type FilterTab = 'ALL' | 'ORDER' | 'BULK_RFQ' | 'ALERT';

export const NotificationOverlayPanel: React.FC<NotificationOverlayPanelProps> = ({
  isOpen,
  onClose,
  language,
  currentUserId,
  onSelectNotification,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch notifications directly from storageService for reactivity
  const allNotifications = storageService.getNotifications(currentUserId);

  const unreadCount = allNotifications.filter((n) => !n.read).length;
  const orderCount = allNotifications.filter((n) => n.type === 'ORDER').length;
  const rfqCount = allNotifications.filter((n) => n.type === 'BULK_RFQ').length;
  const alertCount = allNotifications.filter((n) => n.type === 'ALERT').length;

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((item) => {
      // Tab filter
      if (activeTab !== 'ALL' && item.type !== activeTab) return false;

      // Unread only toggle
      if (unreadOnly && item.read) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchMsg = item.message.toLowerCase().includes(query);
        const matchMeta = item.metadata
          ? JSON.stringify(item.metadata).toLowerCase().includes(query)
          : false;
        return matchTitle || matchMsg || matchMeta;
      }

      return true;
    });
  }, [allNotifications, activeTab, unreadOnly, searchQuery]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsAsRead(currentUserId);
  };

  const handleClearAll = () => {
    storageService.clearAllNotifications(currentUserId);
  };

  const handleToggleRead = (id: string, currentlyRead: boolean) => {
    if (currentlyRead) {
      storageService.markNotificationAsUnread(id);
    } else {
      storageService.markNotificationAsRead(id);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteNotification(id);
  };

  // Activity Simulators for live interactive testing
  const handleSimulateOrderUpdate = () => {
    setIsSimulating(true);
    storageService.simulateOrderUpdateNotification();
    setTimeout(() => setIsSimulating(false), 500);
  };

  const handleSimulateBulkRFQ = () => {
    setIsSimulating(true);
    storageService.simulateBulkRFQNotification();
    setTimeout(() => setIsSimulating(false), 500);
  };

  const handleSimulateStockAlert = () => {
    setIsSimulating(true);
    storageService.simulateStockAlertNotification();
    setTimeout(() => setIsSimulating(false), 500);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return language === 'ta' ? 'இப்போது' : language === 'hi' ? 'अभी' : 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return language === 'ta' ? 'நேற்று' : language === 'hi' ? 'कल' : 'Yesterday';
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ORDER':
        return {
          icon: <Truck className="w-3.5 h-3.5" />,
          label: language === 'ta' ? 'ஆர்டர் நிலை' : language === 'hi' ? 'ऑर्डर अपडेट' : 'Order Update',
          bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
          iconBg: 'bg-blue-100 text-blue-700',
        };
      case 'BULK_RFQ':
        return {
          icon: <Building2 className="w-3.5 h-3.5" />,
          label: language === 'ta' ? 'மொத்த RFQ' : language === 'hi' ? 'थोक मांग (RFQ)' : 'Bulk RFQ',
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-100 text-emerald-700',
        };
      case 'ALERT':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: language === 'ta' ? 'கையிருப்பு எச்சரிக்கை' : language === 'hi' ? 'स्टॉक अलर्ट' : 'Stock Alert',
          bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconBg: 'bg-amber-100 text-amber-800',
        };
      default:
        return {
          icon: <Package className="w-3.5 h-3.5" />,
          label: 'Activity',
          bgColor: 'bg-stone-50 text-stone-700 border-stone-200',
          iconBg: 'bg-stone-100 text-stone-700',
        };
    }
  };

  return (
    <div
      id="notification-overlay-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="notification-overlay-panel"
        className="relative w-full max-w-lg sm:max-w-xl h-full bg-[#FDFCF8] shadow-2xl border-l border-[#E6E2D3] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E6E2D3] shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#4A6741] text-white flex items-center justify-center shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#2D3129] tracking-tight">
                    {language === 'ta'
                      ? 'செயல்பாட்டு அறிவிப்புகள்'
                      : language === 'hi'
                      ? 'गतिविधि और सूचनाएं'
                      : 'Activity & Notifications'}
                  </h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#D97757] text-white text-[11px] font-black rounded-full shadow-xs">
                      {unreadCount} {language === 'ta' ? 'புதியது' : language === 'hi' ? 'नए' : 'new'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#827D6B] mt-0.5">
                  Live tracking: Order status updates, Bulk RFQs & Stock alerts
                </p>
              </div>
            </div>

            <button
              id="notification-overlay-close-btn"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-[#F2EFE6] rounded-full transition-colors"
              aria-label="Close activity overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-time Tracking Status Bar */}
          <div className="mt-3.5 px-3 py-2 bg-[#F2EFE6] rounded-2xl border border-[#E6E2D3] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#2D3129] font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A6741] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4A6741]"></span>
              </span>
              <span className="text-[11px] sm:text-xs">
                {language === 'ta'
                  ? 'நேரடி கண்காணிப்பு: ஆணை நிலை • மொத்த RFQ • இருப்பு எச்சரிக்கை'
                  : language === 'hi'
                  ? 'सक्रिय ट्रैकिंग: ऑर्डर स्थिति • थोक RFQ • स्टॉक अलर्ट'
                  : 'Live Activity Stream: Orders • Bulk RFQs • Stock Alerts'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#4A6741] hover:text-[#385031] hover:underline flex items-center gap-1 transition-colors px-1"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {language === 'ta' ? 'அனைத்தும் படித்ததாக' : language === 'hi' ? 'सभी पढ़ा' : 'Mark all read'}
                  </span>
                </button>
              )}

              {allNotifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[11px] font-medium text-stone-500 hover:text-rose-600 transition-colors p-1"
                  title="Clear all activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'ALL'
                  ? 'bg-[#2D3129] text-white shadow-xs'
                  : 'bg-[#F2EFE6] text-[#827D6B] hover:text-[#2D3129] hover:bg-[#EAE6DA]'
              }`}
            >
              <span>{language === 'ta' ? 'அனைத்தும்' : language === 'hi' ? 'सभी' : 'All'}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">
                {allNotifications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ORDER')}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'ORDER'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-[#F2EFE6] text-[#827D6B] hover:text-[#2D3129] hover:bg-[#EAE6DA]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'ஆர்டர்கள்' : language === 'hi' ? 'ऑर्डर' : 'Orders'}</span>
              {orderCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">{orderCount}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('BULK_RFQ')}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'BULK_RFQ'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#F2EFE6] text-[#827D6B] hover:text-[#2D3129] hover:bg-[#EAE6DA]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'மொத்த RFQ' : language === 'hi' ? 'थोक RFQ' : 'Bulk RFQs'}</span>
              {rfqCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">{rfqCount}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ALERT')}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'ALERT'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-[#F2EFE6] text-[#827D6B] hover:text-[#2D3129] hover:bg-[#EAE6DA]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'இருப்பு எச்சரிக்கை' : language === 'hi' ? 'स्टॉक अलर्ट' : 'Stock Alerts'}</span>
              {alertCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">{alertCount}</span>
              )}
            </button>
          </div>

          {/* Search & Unread Toggle Bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#827D6B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'செயல்பாடுகளை தேடுக...'
                    : language === 'hi'
                    ? 'गतिविधि खोजें...'
                    : 'Search orders, RFQs, alerts...'
                }
                className="w-full pl-8 pr-3 py-1.5 bg-[#F2EFE6] border border-[#E6E2D3] rounded-xl text-xs text-[#2D3129] placeholder-[#827D6B] focus:outline-none focus:border-[#4A6741]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[#827D6B] hover:text-[#2D3129] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors shrink-0 ${
                unreadOnly
                  ? 'bg-[#D97757] text-white border-[#D97757]'
                  : 'bg-white text-[#827D6B] border-[#E6E2D3] hover:text-[#2D3129]'
              }`}
            >
              {language === 'ta' ? 'படிக்காதவை மட்டும்' : language === 'hi' ? 'केवल अपठित' : 'Unread only'}
            </button>
          </div>
        </div>

        {/* Interactive Real-Time Simulators Quick Bar */}
        <div className="px-4 py-2 bg-[#F6F4EB] border-b border-[#E6E2D3] flex items-center justify-between text-[11px] shrink-0">
          <span className="font-bold text-[#827D6B] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D97757]" />
            <span>{language === 'ta' ? 'நேரடி மாதிரி:' : language === 'hi' ? 'लाइव सिमुलेशन:' : 'Simulate Feed:'}</span>
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={handleSimulateOrderUpdate}
              disabled={isSimulating}
              className="px-2 py-0.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold text-[10px] transition-colors whitespace-nowrap"
              title="Simulate a live order status update"
            >
              + Order Update
            </button>

            <button
              onClick={handleSimulateBulkRFQ}
              disabled={isSimulating}
              className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[10px] transition-colors whitespace-nowrap"
              title="Simulate a new bulk wholesale requirement"
            >
              + Bulk RFQ
            </button>

            <button
              onClick={handleSimulateStockAlert}
              disabled={isSimulating}
              className="px-2 py-0.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold text-[10px] transition-colors whitespace-nowrap"
              title="Simulate a perishable stock aging alert"
            >
              + Stock Alert
            </button>
          </div>
        </div>

        {/* Notification Activity List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F2EFE6] text-[#827D6B] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-[#2D3129]">
                {language === 'ta'
                  ? 'அறிவிப்புகள் எதுவும் இல்லை'
                  : language === 'hi'
                  ? 'कोई सूचना नहीं मिली'
                  : 'No activity found'}
              </h3>
              <p className="text-xs text-[#827D6B] max-w-xs mx-auto mt-1">
                {searchQuery || unreadOnly
                  ? 'Try changing your filter criteria or search keyword.'
                  : 'Recent order status updates, commercial bulk RFQs, and stock spoilage warnings will appear here in real-time.'}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleSimulateOrderUpdate}
                  className="px-3 py-1.5 bg-white border border-[#E6E2D3] hover:border-[#4A6741] text-[#2D3129] text-xs font-semibold rounded-xl transition-colors"
                >
                  Generate Test Order Update
                </button>
                <button
                  onClick={handleSimulateBulkRFQ}
                  className="px-3 py-1.5 bg-white border border-[#E6E2D3] hover:border-[#4A6741] text-[#2D3129] text-xs font-semibold rounded-xl transition-colors"
                >
                  Generate Test Bulk RFQ
                </button>
              </div>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const badge = getTypeBadge(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    handleToggleRead(item.id, item.read);
                    if (onSelectNotification) onSelectNotification(item);
                  }}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                    !item.read
                      ? 'bg-white border-[#4A6741]/40 shadow-xs ring-1 ring-[#4A6741]/20'
                      : 'bg-[#F9F8F3] border-[#E6E2D3] hover:bg-white text-stone-700'
                  }`}
                >
                  {/* Unread Indicator Pill */}
                  {!item.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#D97757] ring-4 ring-[#D97757]/20" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon Badge */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badge.iconBg}`}>
                      {badge.icon}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      {/* Category Tag & Timestamp */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider flex items-center gap-1 ${badge.bgColor}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        <span className="text-[11px] text-[#827D6B] font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(item.createdAt)}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xs sm:text-sm ${
                          !item.read ? 'font-bold text-[#2D3129]' : 'font-semibold text-stone-700'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Message Body */}
                      <p className="text-xs text-[#827D6B] mt-1 leading-relaxed">{item.message}</p>

                      {/* Metadata Chips if present */}
                      {item.metadata && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                          {item.metadata.orderId && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-mono font-bold">
                              Order #{item.metadata.orderId}
                            </span>
                          )}
                          {item.metadata.status && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-md font-bold uppercase">
                              Status: {String(item.metadata.status).replace('_', ' ')}
                            </span>
                          )}
                          {item.metadata.rfqId && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono font-bold">
                              RFQ #{item.metadata.rfqId}
                            </span>
                          )}
                          {item.metadata.buyer && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                              Buyer: {item.metadata.buyer}
                            </span>
                          )}
                          {item.metadata.daysAging && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-bold">
                              Stored {item.metadata.daysAging} Days
                            </span>
                          )}
                          {item.metadata.suggestedDiscount && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-bold">
                              Clearance Discount: {item.metadata.suggestedDiscount}% OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-[#E6E2D3]/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#827D6B]">
                      {!item.read ? 'Click to mark read' : 'Read'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(item.id, item.read);
                        }}
                        className="text-[11px] font-bold text-[#4A6741] hover:underline px-1.5 py-0.5 rounded"
                      >
                        {!item.read ? 'Mark read' : 'Mark unread'}
                      </button>

                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors rounded"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 bg-white border-t border-[#E6E2D3] shrink-0 flex items-center justify-between text-xs">
          <div className="text-[11px] text-[#827D6B]">
            Showing <strong className="text-[#2D3129]">{filteredNotifications.length}</strong> of{' '}
            <strong className="text-[#2D3129]">{allNotifications.length}</strong> notifications
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2D3129] hover:bg-[#1E211B] text-white font-bold rounded-xl transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
