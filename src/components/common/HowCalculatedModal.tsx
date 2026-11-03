import { X, Calculator, ShieldCheck, Flame, TrendingUp, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: 'cover' | 'forecast' | 'priority' | 'confidence' | 'mape';
}

export function HowCalculatedModal({ isOpen, onClose, defaultTopic = 'priority' }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0B6B5F]/10 rounded-lg text-[#0B6B5F]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#14202B] text-lg">Statistical & Demand Logic</h3>
              <p className="text-xs text-[#4B5A67]">Documented mathematical formulas behind the platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#14202B]">
          {/* Days of Cover */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-[#0B6B5F] mb-1">
              <TrendingUp className="w-4 h-4" />
              1. Days of Cover
            </div>
            <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 mb-2">
              Days of Cover = Current Closing Stock ÷ 14-Day Average Daily Sales
            </div>
            <p className="text-xs text-slate-600">
              Measures how many days of consumer demand the retailer can fulfill before running completely out of stock. A Days of Cover &lt; 1.5 indicates an imminent stock-out risk given a 24-hour replenishment lead time.
            </p>
          </div>

          {/* Salesperson Priority Score */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-amber-700 mb-1">
              <Flame className="w-4 h-4" />
              2. Salesperson Priority Score (0 – 100)
            </div>
            <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 mb-2">
              Score = (40% × Urgency) + (25% × Retailer Request) + (20% × At-Risk Demand Value) + (15% × Staleness)
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li><strong>40% Urgency:</strong> Inversely proportional to lowest days of cover among all SKUs versus delivery lead time.</li>
              <li><strong>25% Retailer Visit Request:</strong> Full 25 points if the store logged a visit request in their app.</li>
              <li><strong>20% At-Risk Demand:</strong> Estimated rupee loss from projected stock-outs before the next distributor truck.</li>
              <li><strong>15% Staleness:</strong> Days elapsed since the last salesperson visit or last daily sales data submission.</li>
            </ul>
          </div>

          {/* Demand Forecasting & Reorder Point */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
              <Calculator className="w-4 h-4" />
              3. Demand Forecast & Reorder Point
            </div>
            <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 mb-2">
              Demand Forecast = 14-Day Moving Average × Day-of-Week Factor × Festive Uplift Multiplier<br/>
              Reorder Point = (Avg Daily Sales × Lead Time) + Safety Stock
            </div>
            <p className="text-xs text-slate-600">
              When closing stock drops below the reorder point, the system suggests a refill basket bringing on-shelf inventory to a target of 7 days of cover.
            </p>
          </div>

          {/* Data Confidence Score */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 mb-1">
              <ShieldCheck className="w-4 h-4" />
              4. Retailer Data Confidence Score (High / Medium / Low)
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Assesses data reliability based on four measurable pillars:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-slate-200">
                <strong>Capture Method Weight:</strong> Scanner (95) &gt; Camera (88) &gt; Voice/Photo (82) &gt; Manual (75).
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <strong>Logging Consistency:</strong> Proportion of the past 14 days with submitted daily stock.
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <strong>Human Review:</strong> Active retailer verification and manual corrections of AI proposals.
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <strong>Triangulation Audit:</strong> Agreement % during physical sales rep stock counts.
              </div>
            </div>
          </div>

          {/* Forecast Error MAPE */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-purple-700 mb-1">
              <Info className="w-4 h-4" />
              5. Forecast Error (MAPE)
            </div>
            <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 mb-2">
              MAPE = (1 ÷ n) × Σ (|Actual Sales − Forecasted Demand| ÷ Actual Sales) × 100%
            </div>
            <p className="text-xs text-slate-600">
              Evaluated on the trailing 7 days across seeded distributor records. Honest transparency: this is a simple, explainable statistical model, not an opaque deep neural network.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0B6B5F] hover:bg-[#09574d] text-white rounded-lg font-medium text-xs transition-colors shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
