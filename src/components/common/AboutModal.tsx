import { X, ShieldAlert, BookOpen, Layers, CheckCircle2, Globe, FileSpreadsheet } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1F3FB5] rounded-xl text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1A1A1A] text-lg">About HUL Kirana Demand-Sensing Platform</h3>
              <p className="text-xs text-slate-500">MBA Case Study Prototype · Architecture & Regulatory Notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#1A1A1A]">
          {/* Section 1: Business Context */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1F3FB5] flex items-center gap-1.5 text-base">
              <Layers className="w-4 h-4" /> 1. The FMCG Distribution Challenge
            </h4>
            <p className="text-xs leading-relaxed text-slate-700">
              India has over 12 million neighbourhood kirana stores driving ~85% of FMCG sales. Traditionally, Hindustan Unilever (HUL) and its Redistribution Stockists (RS) operate on a blind push model: field sales officers visit stores weekly with paper order pads, distributors restock reactively, and fast-moving SKUs like Surf Excel, Rin, and Lifebuoy suffer frequent stock-outs. While apps attempt direct ordering, millions of kirana owners resist tech overhead or removing their trusted human sales rep.
            </p>
            <p className="text-xs leading-relaxed text-slate-800 font-medium bg-blue-50/70 p-3 rounded-lg border border-blue-200">
              <strong>Our Solution:</strong> Meet the retailer at their technology comfort level (Tier 1 Barcode POS, Tier 2 CCTV camera, Tier 3 Voice notes, Tier 4 handwritten notebooks). Convert diverse inputs into one live demand layer with the human sales rep kept in the loop for relationship and high-priority stock triangulation.
            </p>
          </div>

          {/* Section 2: Localization & Language Note */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#1F3FB5] font-bold text-sm">
              <Globe className="w-4 h-4 text-[#1F3FB5]" />
              Multilingual Design (English, हिन्दी, मराठी)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Language system assumption:</strong> All customer-facing screens for Retailers, Sales Reps, and Distributors support English, Hindi (हिन्दी), and Marathi (मराठी). Common loanwords used daily in Indian retail (e.g. <em>स्टॉक</em>, <em>ऑर्डर</em>, <em>बिल</em>, <em>डिलिव्हरी</em>) are written phonetically in Devanagari. All rupee amounts use Indian grouping (e.g., ₹1,25,000) and dates follow DD-MM-YYYY.
            </p>
            <p className="text-xs text-slate-500 italic">
              Note: The Hindi and Marathi strings in this prototype represent practical starter translations; in a live commercial deployment, linguistic review with regional retailer focus groups is recommended.
            </p>
          </div>

          {/* Section 3: Privacy and DPDP Act Compliance Notice */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
              Privacy & Legal Compliance (India DPDP Act 2023)
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              Tier 2 features an AI camera layer analyzing counter transactions. In a commercial deployment:
            </p>
            <ul className="text-xs text-amber-900 list-disc pl-5 space-y-1">
              <li><strong>Notice & Signage:</strong> Prominent bilingual in-store signage informing shoppers of automated product counting.</li>
              <li><strong>Edge Processing & Face Redaction:</strong> Customer faces and personally identifiable features are redacted on-device before any frame leaves the counter. Only packaged goods bounding boxes are analyzed.</li>
              <li><strong>Zero Biometric Storage:</strong> No customer biometric, audio profiling, or financial transaction data is collected or retained.</li>
              <li><strong>Consent Verification:</strong> Retailers execute a Data Processing Agreement acknowledging camera placement strictly over the checkout counter.</li>
            </ul>
          </div>

          {/* Section 4: Key Prototype Assumptions */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1A1A1A] text-sm">2. Key Prototype Assumptions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-slate-900 block mb-1">24-Hour Delivery Slot Guarantee</strong>
                Distributor depot fulfills orders placed before cutoff times the following morning with 3-wheeler delivery vans. Delays trigger an automatic ₹100 account credit.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-slate-900 block mb-1">Human-in-the-Loop Confirmation</strong>
                No sales data is committed silently; retailers review an editable confirmation table before saving into the live demand layer, with a 10-second Undo window.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-slate-900 block mb-1">Statistical Demand Model</strong>
                Demand forecasting uses 14-day rolling moving averages with weekend (1.25x) and festive season multipliers (1.35x), not unexplainable black-box models.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-slate-900 block mb-1">CSV Downloads with Excel UTF-8 BOM</strong>
                All CSV exports for retailers and distributors include the \uFEFF Byte Order Mark for clean rendering in Microsoft Excel without character corruption.
              </div>
            </div>
          </div>

          {/* Section 5: Live Data Synchronisation Guarantee */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1.5 text-blue-950">
            <div className="font-semibold flex items-center gap-1.5 text-[#1F3FB5]">
              <CheckCircle2 className="w-4 h-4 text-[#1F3FB5]" />
              Live Cross-Role Reaction
            </div>
            <p>
              When <strong>Sharma General Store</strong> logs sales or submits a stock count, you can switch immediately to <strong>Salesperson (Rahul)</strong>, <strong>Distributor (Mumbai East)</strong>, or <strong>Manufacturer Planner</strong>. The priority score, refill recommendations, and sell-through charts update instantly without a browser reload.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>HUL FMCG MBA Strategy Case Study</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1F3FB5] hover:bg-[#162e87] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
