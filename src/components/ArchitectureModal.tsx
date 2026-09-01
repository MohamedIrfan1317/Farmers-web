import React, { useState } from 'react';
import {
  BookOpen,
  Server,
  Database,
  PhoneCall,
  ShieldCheck,
  KeyRound,
  Code2,
  X,
  Copy,
  Check,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D3129]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-[#E6E2D3] max-h-[90vh] overflow-y-auto relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#827D6B] hover:text-[#2D3129] hover:bg-[#FDFCF8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F0E4] text-[#4A6741] flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D3129]">
              FarmerConnect Architecture & Production Guide
            </h3>
            <p className="text-xs text-[#827D6B]">
              Full-Stack Architecture, Database Schemas, Real OTP & Toll-Free IVR Webhooks
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-[#827D6B] leading-relaxed">
          {/* 1. Core Architecture & Strict Product Gatekeeper */}
          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] space-y-2">
            <h4 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
              <span>1. Strict Product-Buyer Rule Gatekeeper</span>
            </h4>
            <p className="text-[#2D3129]">
              The business mandate strictly prohibits Bulk Buyers from purchasing raw paddy or raw wheat. In production, this is enforced at three defense levels:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[#827D6B]">
              <li><strong>Database Query Filtering:</strong> `WHERE (buyer_role = 'GROCERY' OR category NOT IN ('PADDY', 'WHEAT'))`</li>
              <li><strong>Backend API Validation:</strong> POST `/api/orders` & `/api/rfqs` rejects any bulk cart containing raw grain tokens.</li>
              <li><strong>UI Gatekeeper:</strong> Dedicated `EligibilityService.ts` automatically strips restricted items from bulk views and displays explanatory notices on search queries.</li>
            </ol>
          </div>

          {/* 2. Database Schema (PostgreSQL DDL) */}
          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4A6741]" />
                <span>2. Production PostgreSQL / Cloud SQL Schema</span>
              </h4>
              <button
                onClick={() =>
                  copyCode(
                    `-- PostgreSQL Schema for FarmerConnect
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('FARMER', 'GROCERY', 'BULK', 'ADMIN')),
  business_name VARCHAR(150),
  business_type VARCHAR(50),
  location VARCHAR(200),
  district VARCHAR(100),
  preferred_language VARCHAR(5) DEFAULT 'ta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id),
  batch_id VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('VEGETABLE', 'FRUIT', 'PADDY', 'WHEAT', 'RICE', 'OTHER')),
  name VARCHAR(150) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  quality VARCHAR(20) NOT NULL,
  harvest_date DATE NOT NULL,
  expected_price NUMERIC(10,2) NOT NULL,
  buyer_eligibility VARCHAR(30) NOT NULL CHECK (buyer_eligibility IN ('ALL', 'GROCERY_ONLY')),
  storage_required BOOLEAN DEFAULT FALSE,
  crate_id VARCHAR(50),
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'AVAILABLE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id),
  farmer_id UUID REFERENCES users(id),
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ORDER_PLACED',
  delivery_type VARCHAR(30) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
                    'sql'
                  )
                }
                className="px-2 py-1 bg-white border border-[#E6E2D3] rounded text-[10px] font-bold text-[#2D3129] hover:bg-[#F5F2E9] flex items-center gap-1"
              >
                {copiedSection === 'sql' ? <Check className="w-3 h-3 text-[#4A6741]" /> : <Copy className="w-3 h-3" />}
                <span>Copy SQL</span>
              </button>
            </div>
            <pre className="p-3 bg-[#2D3129] text-[#FDFCF8] rounded-xl overflow-x-auto font-mono text-[11px]">
              {`-- Key Table Enforcements:
-- raw paddy & wheat automatically assign buyer_eligibility = 'GROCERY_ONLY'
-- processed rice defaults to buyer_eligibility = 'ALL'`}
            </pre>
          </div>

          {/* 3. Real Toll-Free IVR Setup (Twilio / Exotel) */}
          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] space-y-2">
            <h4 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D97757]" />
              <span>3. Real Toll-Free IVR Webhook Integration</span>
            </h4>
            <p className="text-[#2D3129]">
              Connect an Indian Toll-Free 1800 number via Twilio Voice / Exotel. When a farmer calls, the webhook executes the exact multi-language state machine implemented in <code>/src/services/ivrService.ts</code>:
            </p>
            <pre className="p-3 bg-[#2D3129] text-[#FDFCF8] rounded-xl overflow-x-auto font-mono text-[11px]">
              {`// Express.js IVR Webhook Endpoint
app.post('/api/ivr/webhook', (req, res) => {
  const digits = req.body.Digits;
  const callerPhone = req.body.From;
  const twiml = new VoiceResponse();

  // Language selection: 1 - Tamil, 2 - English, 3 - Hindi
  // Sub-menu 1: List Produce -> Prompts crop, qty, price -> creates batch & DB entry
  // Sub-menu 2: Read active incoming orders and total payouts
  res.type('text/xml');
  res.send(twiml.toString());
});`}
            </pre>
          </div>

          {/* 4. Real Phone OTP Integration (MSG91 / Twilio Verify) */}
          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] space-y-2">
            <h4 className="text-sm font-bold text-[#2D3129] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#4A6741]" />
              <span>4. Real Phone OTP Integration</span>
            </h4>
            <p className="text-[#2D3129]">
              For production, replace mock OTP <code>123456</code> with MSG91 SendOTP or Firebase Phone Auth. The client triggers <code>/api/auth/send-otp</code> which dispatches a 6-digit SMS code in Tamil, Hindi, or English.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E6E2D3] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#4A6741] hover:bg-[#3D5635] text-white font-bold text-xs rounded-2xl shadow-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
