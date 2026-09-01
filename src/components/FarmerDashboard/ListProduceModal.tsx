import React, { useState } from 'react';
import {
  Sprout,
  Upload,
  QrCode,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ThermometerSnowflake,
  Sparkles,
  X,
  Camera,
} from 'lucide-react';
import {
  ProductCategory,
  QuantityUnit,
  QualityGrade,
  BuyerEligibilityType,
  Language,
  ProductListing,
} from '../../types';
import { storageService } from '../../services/storageService';
import { AIService } from '../../services/aiService';
import { EligibilityService } from '../../services/eligibilityService';
import { getTranslation } from '../../translations';

interface ListProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccess: (newProduct: ProductListing) => void;
}

const PRODUCE_PRESETS = [
  { name: 'Country Tomatoes (நாட்டு தக்காளி)', category: 'VEGETABLE' as ProductCategory, unit: 'kg' as QuantityUnit, price: 24, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
  { name: 'Bhavani Ponni Raw Paddy (பவானி பொன்னி நெல்)', category: 'PADDY' as ProductCategory, unit: 'bag' as QuantityUnit, price: 1450, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80' },
  { name: 'Sharbati Raw Wheat (கோதுமை)', category: 'WHEAT' as ProductCategory, unit: 'bag' as QuantityUnit, price: 1600, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80' },
  { name: 'Red Bellary Onion (வெங்காயம்)', category: 'VEGETABLE' as ProductCategory, unit: 'kg' as QuantityUnit, price: 32, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80' },
  { name: 'Green Round Brinjal (கத்தரிக்காய்)', category: 'VEGETABLE' as ProductCategory, unit: 'kg' as QuantityUnit, price: 28, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80' },
  { name: 'Fresh Cavendish Banana (வாழைப்பழம்)', category: 'FRUIT' as ProductCategory, unit: 'bag' as QuantityUnit, price: 420, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Fresh Jyoti Potato (உருளைக்கிழங்கு)', category: 'VEGETABLE' as ProductCategory, unit: 'kg' as QuantityUnit, price: 18, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80' },
];

export const ListProduceModal: React.FC<ListProduceModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccess,
}) => {
  const t = getTranslation(language);
  const currentUser = storageService.getCurrentUser();

  const [category, setCategory] = useState<ProductCategory>('VEGETABLE');
  const [name, setName] = useState('Country Tomatoes (நாட்டு தக்காளி)');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<QuantityUnit>('kg');
  const [quality, setQuality] = useState<QualityGrade>('Grade A');
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [availableFrom, setAvailableFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expectedPrice, setExpectedPrice] = useState<number>(24);
  const [location, setLocation] = useState<string>(currentUser?.location || 'Thondamuthur, Coimbatore');
  const [storageRequired, setStorageRequired] = useState<boolean>(false);
  const [selectedColdRoomId, setSelectedColdRoomId] = useState<string>('CR_COIMB_01');
  const [imageUrl, setImageUrl] = useState<string>(PRODUCE_PRESETS[0].img);
  const [isOrganic, setIsOrganic] = useState<boolean>(true);

  if (!isOpen) return null;

  // AI Price guidance for current selection
  const priceGuidance = AIService.calculatePriceGuidance(category, name, quality);

  // Strict Buyer Eligibility calculation
  const isGrainStrict = EligibilityService.isGroceryOnlyCategory(category);
  const buyerEligibility: BuyerEligibilityType = isGrainStrict ? 'GROCERY_ONLY' : 'ALL';

  const handleApplyPreset = (preset: typeof PRODUCE_PRESETS[0]) => {
    setCategory(preset.category);
    setName(preset.name);
    setUnit(preset.unit);
    setExpectedPrice(preset.price);
    setImageUrl(preset.img);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = storageService.addProduct({
      farmerId: currentUser?.id || 'farmer_01',
      farmerName: currentUser?.name || 'Muthusamy Gounder',
      farmerPhone: currentUser?.phone || '9842156789',
      farmerLocation: location,
      farmerDistrict: currentUser?.district || 'Coimbatore',
      category,
      name,
      nameTranslations: {
        ta: name,
        en: name,
        hi: name,
      },
      quantity,
      unit,
      quality,
      harvestDate,
      availableFrom,
      expectedPrice,
      suggestedPriceMin: priceGuidance.suggestedMinPrice,
      suggestedPriceMax: priceGuidance.suggestedMaxPrice,
      buyerEligibility,
      storageRequired,
      coldRoomId: storageRequired ? selectedColdRoomId : undefined,
      crateId: storageRequired ? `CRT-${category.substring(0, 1)}-${Math.floor(10 + Math.random() * 90)}` : undefined,
      imageUrl,
      status: 'AVAILABLE',
      originalQuantity: quantity,
      daysInStock: 0,
      stockAgeStatus: 'FRESH',
      organic: isOrganic,
      paddyDetails: category === 'PADDY' ? {
        totalHarvestBags: quantity,
        processedToRiceBags: 0,
        remainingRawPaddyBags: quantity,
      } : undefined,
    });

    onSuccess(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              {t.listProduceTitle}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {t.listProduceSubtitle}
            </p>
          </div>
        </div>

        {/* Quick Produce Preset Buttons */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
            Quick Fill Popular Crops:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRODUCE_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`px-2.5 py-1 text-xs rounded-xl border transition-all font-medium ${
                  name === p.name
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {p.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.productCategory}
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ProductCategory;
                  setCategory(cat);
                  if (cat === 'PADDY' || cat === 'WHEAT') {
                    setUnit('bag');
                  } else {
                    setUnit('kg');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold"
              >
                <option value="VEGETABLE">{t.catVegetable}</option>
                <option value="FRUIT">{t.catFruit}</option>
                <option value="PADDY">{t.catPaddy}</option>
                <option value="WHEAT">{t.catWheat}</option>
                <option value="RICE">{t.catRice}</option>
                <option value="OTHER">{t.catOther}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.productName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.productNamePlaceholder}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Strict Eligibility Badge Notification */}
          {isGrainStrict && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
              <span className="text-base">🛡️</span>
              <div>
                <strong className="font-bold text-amber-900">
                  Strict Rule: Automatically Assigned to “{t.groceryOnlyBadge}”
                </strong>
                <p className="mt-0.5 text-stone-600">
                  Raw paddy and raw wheat are reserved exclusively for individual grocery customers and cannot be accessed by commercial bulk buyers.
                </p>
              </div>
            </div>
          )}

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="col-span-1 sm:col-span-1">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.quantityAvailable}
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900"
                required
              />
            </div>

            <div className="col-span-1 sm:col-span-1">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.unit}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as QuantityUnit)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold"
              >
                <option value="kg">{t.unitKg}</option>
                <option value="quintal">{t.unitQuintal}</option>
                <option value="ton">{t.unitTon}</option>
                <option value="bag">{t.unitBag}</option>
                <option value="piece">{t.unitPiece}</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.quality}
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as QualityGrade)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold"
              >
                <option value="Grade A">{t.gradeA}</option>
                <option value="Grade B">{t.gradeB}</option>
                <option value="Standard">{t.gradeStd}</option>
              </select>
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.harvestDate}
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.availableFromDate}
              </label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.farmLocation}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                required
              />
            </div>
          </div>

          {/* Expected Price with AI Smart Price Guide */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {t.expectedPricePerUnit}
              </label>
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Price Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-40">
                <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-base">₹</span>
                <input
                  type="number"
                  min={1}
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-emerald-300 rounded-xl text-lg font-black text-emerald-900"
                  required
                />
              </div>

              <div className="text-xs text-emerald-900 leading-tight">
                <div>
                  Suggested Range: <strong>₹{priceGuidance.suggestedMinPrice} – ₹{priceGuidance.suggestedMaxPrice}</strong> /{unit}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Platform Avg: ₹{priceGuidance.platformAvgPrice} | Mandi Base: ₹{priceGuidance.mandiBaselinePrice} (+{priceGuidance.farmerProfitBenefitPercent}% gain)
                </div>
              </div>
            </div>
          </div>

          {/* Solar Cold Storage Option */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ThermometerSnowflake className="w-5 h-5 text-sky-600" />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">{t.coldStorageRequired}</span>
                  <span className="text-[11px] text-stone-500">Prevent spoilage with FPO-managed solar cold rooms</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStorageRequired(false)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-colors ${
                    !storageRequired ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  Direct Farm Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => setStorageRequired(true)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-colors ${
                    storageRequired ? 'bg-sky-600 text-white shadow-xs' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  Reserve Solar Cold Slot
                </button>
              </div>
            </div>

            {storageRequired && (
              <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-600">Select Solar Cold Room Hub:</span>
                <select
                  value={selectedColdRoomId}
                  onChange={(e) => setSelectedColdRoomId(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-medium"
                >
                  <option value="CR_COIMB_01">Thondamuthur FPO Solar Hub (4.5°C, 8.6 MT free)</option>
                  <option value="CR_VARANASI_01">Kashi Agro Solar Cold Chain Hub (3.8°C, 10.2 MT free)</option>
                </select>
              </div>
            )}
          </div>

          {/* Photo selection / upload mock */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-3">
              <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-stone-300" />
              <div>
                <span className="font-bold text-stone-900 block">{t.uploadPhoto}</span>
                <span className="text-[11px] text-stone-500">Camera snap or crop library</span>
              </div>
            </div>
            <label className="cursor-pointer px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onload = () => setImageUrl(reader.result as string);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Actions */}
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
              <QrCode className="w-4 h-4" />
              <span>{t.btnListProduce}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
