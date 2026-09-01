import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Sprout,
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Users,
  Settings,
  Scale,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { ProductListing, Order, UserProfile, ColdRoom, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { EligibilityService } from '../../services/eligibilityService';
import { getTranslation } from '../../translations';

interface AdminDashboardProps {
  language: Language;
  products: ProductListing[];
  orders: Order[];
  users: UserProfile[];
  coldRooms: ColdRoom[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  products,
  orders,
  users,
  coldRooms,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ELIGIBILITY' | 'COLD_CHAIN' | 'USERS'>('OVERVIEW');

  const farmers = users.filter((u) => u.role === 'FARMER');
  const bulkBuyers = users.filter((u) => u.role === 'BULK');
  const groceryBuyers = users.filter((u) => u.role === 'GROCERY');

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Admin Top Header */}
      <div className="bg-[#2D3129] text-[#FDFCF8] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden border border-[#E6E2D3]">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#4A6741] text-[#FDFCF8] uppercase tracking-wider">
                FPO Governance Console
              </span>
              <span className="text-xs text-[#E6E2D3]">
                FarmerConnect Central Operations & Compliance
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration & Verification
            </h2>
            <p className="text-xs sm:text-sm text-[#E6E2D3] max-w-xl mt-1">
              Monitor solar cold chain infrastructure, strict grain eligibility policies, and direct settlement accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => storageService.resetToDefaults()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#FDFCF8] font-bold text-xs rounded-2xl border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#E6E2D3] block font-medium">Registered Farmers</span>
            <span className="text-2xl font-black text-[#FDFCF8] font-mono">{farmers.length}</span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#E6E2D3] block font-medium">Bulk Buyers (Approved)</span>
            <span className="text-2xl font-black text-[#FDFCF8] font-mono">{bulkBuyers.length}</span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#E6E2D3] block font-medium">Total Platform GMV</span>
            <span className="text-2xl font-black text-[#D97757] font-mono">₹{totalGMV.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
            <span className="text-[11px] text-[#E6E2D3] block font-medium">Solar Cold Chain Capacity</span>
            <span className="text-2xl font-black text-[#FDFCF8] font-mono">35 Metric Tons</span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E2D3] pb-3 flex-wrap">
        {[
          { id: 'OVERVIEW', label: 'Platform Summary & Orders' },
          { id: 'ELIGIBILITY', label: '🛡️ Strict Product Rule Inspector' },
          { id: 'COLD_CHAIN', label: '❄️ Solar Cold Rooms IoT' },
          { id: 'USERS', label: '👥 User Verifications' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#4A6741] text-white shadow-xs'
                : 'bg-[#F2EFE6] text-[#2D3129] hover:bg-[#E6E2D3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Strict Rule Inspector */}
      {activeTab === 'ELIGIBILITY' && (
        <div className="space-y-4">
          <div className="p-5 bg-[#F2EFE6] border-2 border-[#D97757] rounded-3xl flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-[#D97757] shrink-0 mt-0.5" />
            <div className="text-xs text-[#2D3129]">
              <strong className="block font-bold text-sm text-[#D97757]">
                Authoritative Rule Policy: Raw Paddy & Wheat Restriction Matrix
              </strong>
              <p className="mt-1 leading-relaxed text-[#2D3129]">
                To prevent commercial hoarding and ensure local household food availability, the system enforces a hardcoded gatekeeper across database queries, search indexing, and UI rendering:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#2D3129] font-medium">
                <li>Grocery/Individual Buyer: Vegetables, Fruits, Paddy, Wheat, Rice, other products. (Allowed: YES)</li>
                <li>Bulk Buyer: CANNOT purchase raw paddy or raw wheat under any circumstance. (Blocked: STRICT)</li>
                <li>Raw paddy and wheat never appear in the Bulk Buyer marketplace, search, or RFQ broadcast.</li>
                <li>Processed Rice can be purchased by both Bulk Buyers and Grocery Buyers.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E2D3] p-5 shadow-xs">
            <h4 className="text-sm font-bold text-[#2D3129] mb-3">Live Active Products Eligibility Audit</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E6E2D3] text-[#827D6B] font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Farmer</th>
                    <th className="pb-2">Grocery Buyer Access</th>
                    <th className="pb-2">Bulk Buyer Access</th>
                    <th className="pb-2">Enforcement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2D3]">
                  {products.map((p) => {
                    const groceryAllowed = EligibilityService.isProductAllowedForBuyer(p, 'GROCERY');
                    const bulkAllowed = EligibilityService.isProductAllowedForBuyer(p, 'BULK');

                    return (
                      <tr key={p.id} className="hover:bg-[#FDFCF8]">
                        <td className="py-2.5 font-bold text-[#2D3129]">{p.name}</td>
                        <td className="py-2.5 font-mono text-[#827D6B]">{p.category}</td>
                        <td className="py-2.5 text-[#2D3129]">{p.farmerName}</td>
                        <td className="py-2.5">
                          <span className="px-2.5 py-0.5 bg-[#E6F0E4] text-[#4A6741] rounded-full font-bold text-[10px] border border-[#C5D9C1]">
                            ✓ Allowed
                          </span>
                        </td>
                        <td className="py-2.5">
                          {bulkAllowed.allowed ? (
                            <span className="px-2.5 py-0.5 bg-[#E6F0E4] text-[#4A6741] rounded-full font-bold text-[10px] border border-[#C5D9C1]">
                              ✓ Allowed
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-[#FDF0EC] text-[#D97757] rounded-full font-bold text-[10px] border border-[#F3C4B6]">
                              ✕ BLOCKED ({bulkAllowed.reason})
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <span className="text-[11px] font-mono text-[#4A6741] font-bold">
                            Policy Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Solar Cold Rooms */}
      {activeTab === 'COLD_CHAIN' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coldRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-3xl border border-[#E6E2D3] p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-[#F2EFE6] text-[#2D3129] px-2.5 py-1 rounded-lg">
                      {room.id}
                    </span>
                    <h4 className="text-base font-bold text-[#2D3129] mt-1">{room.name}</h4>
                    <span className="text-xs text-[#827D6B]">{room.location}</span>
                  </div>

                  <span className="px-3 py-1 bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1] rounded-full text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Solar Power Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] text-center">
                  <div>
                    <span className="text-[10px] text-[#827D6B] block font-semibold">Temperature</span>
                    <span className="text-base font-black text-[#2D3129] font-mono">
                      {room.currentTempCelsius}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#827D6B] block font-semibold">Humidity</span>
                    <span className="text-base font-black text-[#2D3129] font-mono">
                      {room.humidityPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#827D6B] block font-semibold">Free Capacity</span>
                    <span className="text-base font-black text-[#4A6741] font-mono">
                      {room.availableCapacityTons} MT
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#2D3129] block mb-1">
                    Active Storage Crates ({room.crates.length}):
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {room.crates.map((crate) => (
                      <div
                        key={crate.crateId}
                        className="p-2.5 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-[#2D3129] font-mono">{crate.crateId}</strong>
                          <span className="text-[#827D6B] text-[11px] ml-1.5">
                            {crate.productName} ({crate.quantityKg} kg)
                          </span>
                        </div>
                        <span className="text-[#827D6B] text-[10px]">Farmer #{crate.farmerId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Overview & Orders */}
      {activeTab === 'OVERVIEW' && (
        <div className="bg-white rounded-3xl border border-[#E6E2D3] p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-[#2D3129]">Recent Marketplace Transactions ({orders.length})</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E6E2D3] text-[#827D6B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Farmer</th>
                  <th className="pb-2">Buyer</th>
                  <th className="pb-2">Tier</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D3]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FDFCF8]">
                    <td className="py-2.5 font-mono font-bold text-[#2D3129]">#{o.id}</td>
                    <td className="py-2.5 text-[#2D3129]">{o.farmerName}</td>
                    <td className="py-2.5 text-[#2D3129]">{o.buyerName}</td>
                    <td className="py-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2EFE6] text-[#2D3129]">
                        {o.buyerRole}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-[#4A6741]">₹{o.totalAmount}</td>
                    <td className="py-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1]">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: User Verifications */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-[#E6E2D3] p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-[#2D3129]">Registered Platform Profiles ({users.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {users.map((u) => (
              <div key={u.id} className="p-4 bg-white rounded-2xl border border-[#E6E2D3] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#827D6B]">#{u.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F0E4] text-[#4A6741] border border-[#C5D9C1]">
                    {u.role}
                  </span>
                </div>
                <strong className="text-[#2D3129] block text-sm">{u.name}</strong>
                <div className="text-[#827D6B]">Phone: +91 {u.phone}</div>
                <div className="text-[#827D6B]">Location: {u.location || 'Coimbatore'}</div>
                {u.businessName && <div className="text-[#4A6741] font-semibold">Business: {u.businessName}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
