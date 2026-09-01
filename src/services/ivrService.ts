import { Language, ProductCategory } from '../types';
import { storageService } from './storageService';

export type IVRState =
  | 'IDLE'
  | 'CALLING'
  | 'LANGUAGE_SELECT'
  | 'MAIN_MENU'
  | 'LIST_PRODUCE_CATEGORY'
  | 'LIST_PRODUCE_QUANTITY'
  | 'LIST_PRODUCE_PRICE'
  | 'LIST_PRODUCE_CONFIRM'
  | 'CHECK_ORDERS'
  | 'CHECK_STOCK'
  | 'HEAR_PRICES'
  | 'SUPPORT_CONNECT'
  | 'CALL_ENDED';

export interface IVRResponse {
  state: IVRState;
  promptText: {
    ta: string;
    en: string;
    hi: string;
  };
  options: {
    key: string;
    label: {
      ta: string;
      en: string;
      hi: string;
    };
  }[];
  actionResult?: string;
}

export class IVRService {
  private currentState: IVRState = 'IDLE';
  private selectedLanguage: Language = 'ta';
  private tempProduceDraft: {
    category?: ProductCategory;
    name?: string;
    quantity?: number;
    expectedPrice?: number;
  } = {};

  public startCall(): IVRResponse {
    this.currentState = 'LANGUAGE_SELECT';
    this.tempProduceDraft = {};

    return {
      state: 'LANGUAGE_SELECT',
      promptText: {
        ta: 'பார்மர்கனெக்ட் இலவச தொலைபேசி சேவைக்கு நல்வரவு. தமிழுக்கு 1, ஆங்கிலத்திற்கு 2, இந்திக்கு 3 ஐ அழுத்தவும்.',
        en: 'Welcome to FarmerConnect Toll-Free Voice Service. Press 1 for Tamil, Press 2 for English, Press 3 for Hindi.',
        hi: 'फार्मरकनेक्ट टोल-फ्री वॉयस सेवा में आपका स्वागत है। तमिल के लिए 1, अंग्रेजी के लिए 2, हिंदी के लिए 3 दबाएं।',
      },
      options: [
        { key: '1', label: { ta: 'தமிழ்', en: 'Tamil', hi: 'तमिल' } },
        { key: '2', label: { ta: 'ஆங்கிலம்', en: 'English', hi: 'अंग्रेजी' } },
        { key: '3', label: { ta: 'இந்தி', en: 'Hindi', hi: 'हिंदी' } },
      ],
    };
  }

  public handleKeyPress(key: string): IVRResponse {
    switch (this.currentState) {
      case 'LANGUAGE_SELECT': {
        if (key === '1') this.selectedLanguage = 'ta';
        else if (key === '2') this.selectedLanguage = 'en';
        else if (key === '3') this.selectedLanguage = 'hi';
        else this.selectedLanguage = 'ta';

        storageService.setLanguage(this.selectedLanguage);
        this.currentState = 'MAIN_MENU';

        return {
          state: 'MAIN_MENU',
          promptText: {
            ta: 'முதன்மை மெனு: விளைபொருளை விற்க 1, உங்கள் ஆர்டர்களை அறிய 2, இருப்பை அறிய 3, சந்தை விலையை கேட்க 4, வாடிக்கையாளர் உதவிக்கு 5 ஐ அழுத்தவும்.',
            en: 'Main Menu: Press 1 to List Produce, Press 2 to Check Orders, Press 3 to Check Stock, Press 4 to Hear Mandi Prices, Press 5 for Customer Support.',
            hi: 'मुख्य मेनू: फसल दर्ज करने के लिए 1 दबाएं, अपने ऑर्डर जानने के लिए 2 दबाएं, स्टॉक जानने के लिए 3 दबाएं, मंडी भाव सुनने के लिए 4 दबाएं, कस्टमर केयर के लिए 5 दबाएं।',
          },
          options: [
            { key: '1', label: { ta: '1: விளைபொருளை விற்க', en: '1: List Produce', hi: '1: फसल बेचें' } },
            { key: '2', label: { ta: '2: ஆர்டர்களை அறிய', en: '2: Check Orders', hi: '2: ऑर्डर जांचें' } },
            { key: '3', label: { ta: '3: இருப்பை அறிய', en: '3: Check Stock', hi: '3: स्टॉक जानें' } },
            { key: '4', label: { ta: '4: சந்தை விலை கேட்க', en: '4: Hear Prices', hi: '4: मंडी भाव' } },
            { key: '5', label: { ta: '5: வாடிக்கையாளர் உதவி', en: '5: Support Desk', hi: '5: सहायता' } },
          ],
        };
      }

      case 'MAIN_MENU': {
        if (key === '1') {
          this.currentState = 'LIST_PRODUCE_CATEGORY';
          return {
            state: 'LIST_PRODUCE_CATEGORY',
            promptText: {
              ta: 'பொருள் வகையை தேர்வு செய்க: தக்காளியிற்கு 1, பச்சை நெல்லிற்கு 2, கத்தரிக்காயிற்கு 3, வெங்காயத்திற்கு 4 ஐ அழுத்தவும்.',
              en: 'Select Product Category: Press 1 for Tomato, Press 2 for Raw Paddy, Press 3 for Brinjal, Press 4 for Onion.',
              hi: 'फसल चुनें: टमाटर के लिए 1 दबाएं, कच्चे धान के लिए 2 दबाएं, बैंगन के लिए 3 दबाएं, प्याज के लिए 4 दबाएं।',
            },
            options: [
              { key: '1', label: { ta: '1: தக்காளி (Tomato)', en: '1: Tomato', hi: '1: टमाटर' } },
              { key: '2', label: { ta: '2: பச்சை நெல் (Raw Paddy)', en: '2: Raw Paddy', hi: '2: कच्चा धान' } },
              { key: '3', label: { ta: '3: கத்தரிக்காய் (Brinjal)', en: '3: Brinjal', hi: '3: बैंगन' } },
              { key: '4', label: { ta: '4: வெங்காயம் (Onion)', en: '4: Onion', hi: '4: प्याज' } },
            ],
          };
        } else if (key === '2') {
          this.currentState = 'CHECK_ORDERS';
          const orders = storageService.getOrders();
          const activeOrders = orders.filter((o) => o.status !== 'DELIVERED');
          const count = activeOrders.length;

          return {
            state: 'CHECK_ORDERS',
            promptText: {
              ta: `உங்களிடம் ${count} செயலில் உள்ள ஆர்டர்கள் உள்ளன. சமீபத்திய ஆர்டர்: ${activeOrders[0]?.items[0]?.productName || 'தக்காளி'} - தொகை ₹${activeOrders[0]?.totalAmount || '240'}. முதன்மை மெனுவுக்கு செல்ல * அழுத்தவும்.`,
              en: `You have ${count} active orders. Latest order: ${activeOrders[0]?.items[0]?.productName || 'Tomatoes'} for ₹${activeOrders[0]?.totalAmount || '240'}. Press * for main menu.`,
              hi: `आपके पास ${count} सक्रिय ऑर्डर हैं। नवीनतम ऑर्डर: ${activeOrders[0]?.items[0]?.productName || 'टमाटर'} - ₹${activeOrders[0]?.totalAmount || '240'}। मुख्य मेनू के लिए * दबाएं।`,
            },
            options: [
              { key: '*', label: { ta: '* முதன்மை மெனு', en: '* Main Menu', hi: '* मुख्य मेनू' } },
              { key: '#', label: { ta: '# அழைப்பை முடி', en: '# End Call', hi: '# कॉल समाप्त' } },
            ],
          };
        } else if (key === '3') {
          this.currentState = 'CHECK_STOCK';
          const products = storageService.getProducts();
          const stockSummary = products.slice(0, 3).map((p) => `${p.name}: ${p.quantity} ${p.unit}`).join(', ');

          return {
            state: 'CHECK_STOCK',
            promptText: {
              ta: `உங்கள் பண்ணை இருப்பு விபரம்: ${stockSummary}. அனைத்து பொருட்களும் சந்தையில் பார்வைக்கு உள்ளன. முதன்மை மெனுவுக்கு செல்ல * அழுத்தவும்.`,
              en: `Your stock status: ${stockSummary}. All items are live on the direct marketplace. Press * for main menu.`,
              hi: `आपकी फसल स्टॉक जानकारी: ${stockSummary}। सभी फसलें बाजार में लाइव हैं। मुख्य मेनू के लिए * दबाएं।`,
            },
            options: [
              { key: '*', label: { ta: '* முதன்மை மெனு', en: '* Main Menu', hi: '* मुख्य मेनू' } },
            ],
          };
        } else if (key === '4') {
          this.currentState = 'HEAR_PRICES';
          const trends = storageService.getPriceTrends();
          const priceText = trends.slice(0, 3).map((t) => `${t.productName}: ₹${t.currentAvgPrice}/${t.unit}`).join(', ');

          return {
            state: 'HEAR_PRICES',
            promptText: {
              ta: `இன்றைய சராசரி நேரடி சந்தை விலை நிலவரம்: ${priceText}. இடைத்தரகர் இல்லாததால் 20% அதிக லாபம் கிடைக்கிறது. முதன்மை மெனுவுக்கு செல்ல * அழுத்தவும்.`,
              en: `Today's average direct market prices: ${priceText}. Direct farmer connection yields +20% higher return. Press * for main menu.`,
              hi: `आज का औसत बाजार भाव: ${priceText}। बिचौलिए न होने से 20% अधिक लाभ। मुख्य मेनू के लिए * दबाएं।`,
            },
            options: [
              { key: '*', label: { ta: '* முதன்மை மெனு', en: '* Main Menu', hi: '* मुख्य मेनू' } },
            ],
          };
        } else if (key === '5') {
          this.currentState = 'SUPPORT_CONNECT';
          return {
            state: 'SUPPORT_CONNECT',
            promptText: {
              ta: 'பார்மர்கனெக்ட் வேளாண் உதவி மைய அதிகாரிக்கு உங்கள் அழைப்பு இணைக்கப்படுகிறது. கட்டணமில்லா உதவி எண்: 1800-425-3276. காத்திருக்கவும்.',
              en: 'Connecting your call to FarmerConnect Agricultural Support Executive at Coimbatore Hub (Toll-Free 1800-425-3276). Please stay on line.',
              hi: 'आपकी कॉल फार्मरकनेक्ट कृषि सहायता अधिकारी से जोड़ी जा रही है (टोल-फ्री 1800-425-3276)। कृपया प्रतीक्षा करें।',
            },
            options: [
              { key: '*', label: { ta: '* முதன்மை மெனு', en: '* Main Menu', hi: '* मुख्य मेनू' } },
            ],
          };
        }
        break;
      }

      case 'LIST_PRODUCE_CATEGORY': {
        if (key === '1') {
          this.tempProduceDraft.category = 'VEGETABLE';
          this.tempProduceDraft.name = 'Country Tomatoes (நாட்டு தக்காளி)';
        } else if (key === '2') {
          this.tempProduceDraft.category = 'PADDY';
          this.tempProduceDraft.name = 'Bhavani Ponni Raw Paddy (பவானி பொன்னி பச்சை நெல்)';
        } else if (key === '3') {
          this.tempProduceDraft.category = 'VEGETABLE';
          this.tempProduceDraft.name = 'Green Round Brinjal (பச்சை கத்தரிக்காய்)';
        } else {
          this.tempProduceDraft.category = 'VEGETABLE';
          this.tempProduceDraft.name = 'Red Bellary Onion (சிவப்பு வெங்காயம்)';
        }

        this.currentState = 'LIST_PRODUCE_QUANTITY';
        return {
          state: 'LIST_PRODUCE_QUANTITY',
          promptText: {
            ta: `${this.tempProduceDraft.name} தேர்வு செய்யப்பட்டது. அளவை தேர்வு செய்யவும்: 50 கிலோவிற்கு 1, 100 கிலோவிற்கு 2, 250 கிலோவிற்கு 3, 500 கிலோவிற்கு 4 ஐ அழுத்தவும்.`,
            en: `${this.tempProduceDraft.name} selected. Select quantity: Press 1 for 50 kg, Press 2 for 100 kg, Press 3 for 250 kg, Press 4 for 500 kg.`,
            hi: `${this.tempProduceDraft.name} चुना गया। मात्रा चुनें: 50 किलो के लिए 1, 100 किलो के लिए 2, 250 किलो के लिए 3, 500 किलो के लिए 4 दबाएं।`,
          },
          options: [
            { key: '1', label: { ta: '1: 50 kg', en: '1: 50 kg', hi: '1: 50 किलो' } },
            { key: '2', label: { ta: '2: 100 kg', en: '2: 100 kg', hi: '2: 100 किलो' } },
            { key: '3', label: { ta: '3: 250 kg', en: '3: 250 kg', hi: '3: 250 किलो' } },
            { key: '4', label: { ta: '4: 500 kg', en: '4: 500 kg', hi: '4: 500 किलो' } },
          ],
        };
      }

      case 'LIST_PRODUCE_QUANTITY': {
        const qtyMap: Record<string, number> = { '1': 50, '2': 100, '3': 250, '4': 500 };
        this.tempProduceDraft.quantity = qtyMap[key] || 100;

        this.currentState = 'LIST_PRODUCE_PRICE';
        return {
          state: 'LIST_PRODUCE_PRICE',
          promptText: {
            ta: 'விலையை தேர்வு செய்க: சந்தை பரிந்துரை விலைக்கு (₹24/கிலோ) 1, சொந்த விலை ₹28/கிலோவிற்கு 2 ஐ அழுத்தவும்.',
            en: 'Select Price: Press 1 for Recommended Market Price (₹24/unit), Press 2 for Custom Premium Price (₹28/unit).',
            hi: 'मूल्य चुनें: अनुशंसित बाजार मूल्य (₹24/इकाई) के लिए 1 दबाएं, प्रीमियम मूल्य (₹28/इकाई) के लिए 2 दबाएं।',
          },
          options: [
            { key: '1', label: { ta: '1: ₹24/kg (பரிந்துரை விலை)', en: '1: ₹24/unit (Recommended)', hi: '1: ₹24/इकाई (अनुशंसित)' } },
            { key: '2', label: { ta: '2: ₹28/kg (பிரீமியம் விலை)', en: '2: ₹28/unit (Premium)', hi: '2: ₹28/इकाई (प्रीमियम)' } },
          ],
        };
      }

      case 'LIST_PRODUCE_PRICE': {
        this.tempProduceDraft.expectedPrice = key === '2' ? 28 : 24;
        this.currentState = 'LIST_PRODUCE_CONFIRM';

        return {
          state: 'LIST_PRODUCE_CONFIRM',
          promptText: {
            ta: `விவரங்களை உறுதிப்படுத்தவும்: ${this.tempProduceDraft.name}, அளவு ${this.tempProduceDraft.quantity} கிலோ, விலை ₹${this.tempProduceDraft.expectedPrice}/கிலோ. பட்டியலிட 1 ஐ அழுத்தவும், ரத்து செய்ய 2 ஐ அழுத்தவும்.`,
            en: `Confirm details: ${this.tempProduceDraft.name}, Quantity ${this.tempProduceDraft.quantity} kg, Expected Price ₹${this.tempProduceDraft.expectedPrice}/kg. Press 1 to confirm & publish, Press 2 to cancel.`,
            hi: `विवरण की पुष्टि करें: ${this.tempProduceDraft.name}, मात्रा ${this.tempProduceDraft.quantity} किलो, मूल्य ₹${this.tempProduceDraft.expectedPrice}/किलो। पुष्टि के लिए 1 दबाएं, रद्द करने के लिए 2 दबाएं।`,
          },
          options: [
            { key: '1', label: { ta: '1: உறுதி செய் (Confirm)', en: '1: Confirm & Publish', hi: '1: पुष्टि करें' } },
            { key: '2', label: { ta: '2: ரத்து செய் (Cancel)', en: '2: Cancel', hi: '2: रद्द करें' } },
          ],
        };
      }

      case 'LIST_PRODUCE_CONFIRM': {
        if (key === '1') {
          const user = storageService.getCurrentUser();
          const newProduct = storageService.addProduct({
            farmerId: user?.id || 'farmer_01',
            farmerName: user?.name || 'Muthusamy Gounder',
            farmerPhone: user?.phone || '9842156789',
            farmerLocation: user?.location || 'Thondamuthur, Coimbatore',
            farmerDistrict: user?.district || 'Coimbatore',
            category: this.tempProduceDraft.category || 'VEGETABLE',
            name: this.tempProduceDraft.name || 'Country Tomatoes',
            quantity: this.tempProduceDraft.quantity || 100,
            originalQuantity: this.tempProduceDraft.quantity || 100,
            unit: this.tempProduceDraft.category === 'PADDY' ? 'bag' : 'kg',
            quality: 'Grade A',
            harvestDate: new Date().toISOString().split('T')[0],
            availableFrom: new Date().toISOString().split('T')[0],
            expectedPrice: this.tempProduceDraft.expectedPrice || 24,
            buyerEligibility: this.tempProduceDraft.category === 'PADDY' ? 'GROCERY_ONLY' : 'ALL',
            storageRequired: false,
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
            status: 'AVAILABLE',
            daysInStock: 0,
            stockAgeStatus: 'FRESH',
            organic: true,
          });

          this.currentState = 'MAIN_MENU';
          return {
            state: 'MAIN_MENU',
            actionResult: `Produce listed successfully via IVR! Batch #${newProduct.batchId} created.`,
            promptText: {
              ta: `உங்கள் விளைபொருள் வெற்றிகரமாக பதிவு செய்யப்பட்டது! பேட்ச் எண்: ${newProduct.batchId}. வாடிக்கையாளர்கள் உடனடியாக ஆர்டர் செய்யலாம். முதன்மை மெனுவுக்கு செல்ல * அழுத்தவும்.`,
              en: `Your produce was listed successfully via voice! Batch #${newProduct.batchId}. Nearby buyers can now place orders. Press * for main menu.`,
              hi: `आपकी फसल वॉयस द्वारा सफलतापूर्वक दर्ज हो गई! बैच #${newProduct.batchId}। खरीदार अब ऑर्डर कर सकते हैं। मुख्य मेनू के लिए * दबाएं।`,
            },
            options: [
              { key: '*', label: { ta: '* முதன்மை மெனு', en: '* Main Menu', hi: '* मुख्य मेनू' } },
              { key: '#', label: { ta: '# அழைப்பை முடி', en: '# End Call', hi: '# कॉल समाप्त' } },
            ],
          };
        } else {
          this.currentState = 'MAIN_MENU';
          return {
            state: 'MAIN_MENU',
            promptText: {
              ta: 'பதிவு ரத்து செய்யப்பட்டது. முதன்மை மெனுவிற்கு திரும்புகிறீர்கள். முதன்மை மெனுவுக்கு * அழுத்தவும்.',
              en: 'Listing cancelled. Returning to main menu. Press * to hear options.',
              hi: 'दर्ज करना रद्द किया गया। मुख्य मेनू पर लौट रहे हैं। विकल्पों के लिए * दबाएं।',
            },
            options: [
              { key: '*', label: { ta: '* முதன்மை மெனு', en: '* Main Menu', hi: '* मुख्य मेनू' } },
            ],
          };
        }
      }

      default: {
        if (key === '*') {
          this.currentState = 'MAIN_MENU';
          return {
            state: 'MAIN_MENU',
            promptText: {
              ta: 'முதன்மை மெனு: விளைபொருளை விற்க 1, உங்கள் ஆர்டர்களை அறிய 2, இருப்பை அறிய 3, சந்தை விலையை கேட்க 4, வாடிக்கையாளர் உதவிக்கு 5 ஐ அழுத்தவும்.',
              en: 'Main Menu: Press 1 to List Produce, Press 2 to Check Orders, Press 3 to Check Stock, Press 4 to Hear Prices, Press 5 for Support.',
              hi: 'मुख्य मेनू: फसल दर्ज करने के लिए 1, ऑर्डर के लिए 2, स्टॉक के लिए 3, भाव के लिए 4, सहायता के लिए 5 दबाएं।',
            },
            options: [
              { key: '1', label: { ta: '1: விளைபொருளை விற்க', en: '1: List Produce', hi: '1: फसल बेचें' } },
              { key: '2', label: { ta: '2: ஆர்டர்களை அறிய', en: '2: Check Orders', hi: '2: ऑर्डर जांचें' } },
              { key: '3', label: { ta: '3: இருப்பை அறிய', en: '3: Check Stock', hi: '3: स्टॉक जानें' } },
              { key: '4', label: { ta: '4: சந்தை விலை கேட்க', en: '4: Hear Prices', hi: '4: भाव सुनें' } },
              { key: '5', label: { ta: '5: வாடிக்கையாளர் உதவி', en: '5: Support Desk', hi: '5: सहायता' } },
            ],
          };
        }
        return this.startCall();
      }
    }
  }

  public endCall(): IVRResponse {
    this.currentState = 'CALL_ENDED';
    return {
      state: 'CALL_ENDED',
      promptText: {
        ta: 'பார்மர்கனெக்ட் இலவச தொலைபேசி சேவையை பயன்படுத்தியமைக்கு நன்றி. மீண்டும் அழைக்கவும். வணக்கம்!',
        en: 'Thank you for calling FarmerConnect Toll-Free Voice Service. Have a fruitful harvest!',
        hi: 'फार्मरकनेक्ट टोल-फ्री वॉयस सेवा का उपयोग करने के लिए धन्यवाद। फिर कॉल करें!',
      },
      options: [],
    };
  }
}

export const ivrService = new IVRService();
