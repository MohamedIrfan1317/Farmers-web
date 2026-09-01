import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wheat, CheckCircle, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { ProductListing, Language } from '../../types';
import { storageService } from '../../services/storageService';
import { getTranslation } from '../../translations';

interface PaddyToRiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  paddyProducts: ProductListing[];
  onConversionSuccess: (newRice: ProductListing) => void;
}

export const PaddyToRiceModal: React.FC<PaddyToRiceModalProps> = ({
  isOpen,
  onClose,
  language,
  paddyProducts,
  onConversionSuccess,
}) => {
  const t = getTranslation(language);
  const [selectedPaddyId, setSelectedPaddyId] = useState<string>(
    paddyProducts[0]?.id || ''
  );
  const [bagsToProcess, setBagsToProcess] = useState<number>(10);
  const [riceVarietyName, setRiceVarietyName] = useState<string>('Bhavani Ponni Boiled Rice');
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(58);
  const [enableBulkForRice, setEnableBulkForRice] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentPaddy = paddyProducts.find((p) => p.id === selectedPaddyId) || paddyProducts[0];
  const availablePaddyBags = currentPaddy ? currentPaddy.quantity : 0;
  
  // 1 bag (50 kg) of paddy produces ~34 kg of rice (68% milling recovery) + bran/husk byproduct
  const calculatedRiceKg = Math.round(bagsToProcess * 50 * 0.68);
  const remainingPaddyBags = Math.max(0, availablePaddyBags - bagsToProcess);

  // Revenue estimation
  const rawPaddyRevenue = (bagsToProcess * (currentPaddy?.expectedPrice || 1450));
  const processedRiceRevenue = calculatedRiceKg * ricePricePerKg;
  const estimatedProfitBoost = processedRiceRevenue - rawPaddyRevenue;

  const handleProcessPaddy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPaddy) {
      setErrorMsg('No paddy batch selected.');
      return;
    }
    if (bagsToProcess <= 0 || bagsToProcess > availablePaddyBags) {
      setErrorMsg(`Please enter between 1 and ${availablePaddyBags} bags.`);
      return;
    }

    const result = storageService.convertPaddyToRice({
      paddyProductId: currentPaddy.id,
      bagsToProcess,
      riceVarietyName,
      ricePricePerKg,
      enableBulkForRice,
    });

    if (result.success && result.riceProduct) {
      onConversionSuccess(result.riceProduct);
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to process paddy.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Wheat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              {t.paddyConversionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {t.paddyConversionSubtitle}
            </p>
          </div>
        </div>

        {/* Core Value-Addition Explainer Note */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5 mb-6">
          <span className="text-base">💡</span>
          <div>
            <strong>Smart Farmer Strategy:</strong> You do not need to mill your entire paddy harvest. Mill only a selected batch (e.g. 10–25 bags) to supply local grocery and bulk customers at retail rates, while keeping the rest in safe storage.
          </div>
        </div>

        <form onSubmit={handleProcessPaddy} className="space-y-4 text-left">
          {/* Select Paddy Batch */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Select Raw Paddy Batch in Hand
            </label>
            <select
              value={selectedPaddyId}
              onChange={(e) => {
                setSelectedPaddyId(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900"
            >
              {paddyProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.quantity} {p.unit} available (Batch: {p.batchId})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity to Process Slider / Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.paddyToProcess}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={availablePaddyBags}
                  value={bagsToProcess}
                  onChange={(e) => setBagsToProcess(Math.min(availablePaddyBags, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-24 px-3 py-2 bg-white border border-stone-300 rounded-xl text-center font-bold text-lg text-emerald-800"
                />
                <span className="text-xs font-semibold text-stone-600">Bags (50 kg each)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Out of {availablePaddyBags} total bags in inventory
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-stone-700 mb-1">{t.expectedRiceYield}</div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {calculatedRiceKg} <span className="text-sm font-bold text-stone-600">kg Milled Rice</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Plus ~160 kg organic cattle bran & husk byproduct
              </p>
            </div>
          </div>

          {/* Rice Listing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.riceVarietyName}
              </label>
              <input
                type="text"
                value={riceVarietyName}
                onChange={(e) => setRiceVarietyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                placeholder="e.g. Deluxe Ponni Boiled Rice"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.riceSellingPrice}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min={20}
                  max={200}
                  value={ricePricePerKg}
                  onChange={(e) => setRicePricePerKg(parseInt(e.target.value) || 58)}
                  className="w-full pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bulk Buyer Eligibility Toggle for Rice */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="enableBulkRice"
              checked={enableBulkForRice}
              onChange={(e) => setEnableBulkForRice(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-emerald-600 rounded-lg focus:ring-emerald-500"
            />
            <label htmlFor="enableBulkRice" className="text-xs text-emerald-950 font-medium cursor-pointer">
              <strong className="block text-emerald-900 font-bold">
                {t.enableBulkForRice}
              </strong>
              Processed rice is approved for both grocery households and bulk commercial buyers (Hotels, Mess, Retailers). Raw paddy remains strictly Grocery Only.
            </label>
          </div>

          {/* Revenue Breakdown */}
          <div className="p-3 bg-stone-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-500 block">Remaining Raw Paddy:</span>
              <strong className="text-stone-900">{remainingPaddyBags} Bags (Grocery Only)</strong>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">Estimated Profit Gain:</span>
              <strong className="text-emerald-700 text-sm font-bold">
                +₹{estimatedProfitBoost.toLocaleString('en-IN')} extra
              </strong>
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.btnProcessPaddy}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
