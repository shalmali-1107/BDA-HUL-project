import { useState } from 'react';
import {
  Flame,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Retailer, SKU, DailyRecord, VisitRequest, PriorityScoreBreakdown } from '../../types';
import { calculateSalespersonPriority } from '../../services/analytics';

interface Props {
  retailers: Retailer[];
  skus: SKU[];
  dailyRecords: DailyRecord[];
  visitRequests: VisitRequest[];
  onSelectRetailer: (retailerId: string) => void;
  onOpenHowCalculated: () => void;
  overriddenOrder: string[];
  onReorder: (newOrder: string[]) => void;
}

export function SalespersonVisitPlan({
  retailers,
  skus,
  dailyRecords,
  visitRequests,
  onSelectRetailer,
  onOpenHowCalculated,
  overriddenOrder,
  onReorder,
}: Props) {
  const [selectedBreakdown, setSelectedBreakdown] = useState<PriorityScoreBreakdown | null>(null);

  // Compute algorithmic priority scores for all retailers
  const scoredRetailers = retailers.map((ret) =>
    calculateSalespersonPriority(ret, skus, dailyRecords, visitRequests)
  );

  // Apply default descending order by totalScore, unless manual override order is present
  const sortedList = [...scoredRetailers].sort((a, b) => {
    if (overriddenOrder.length > 0) {
      const idxA = overriddenOrder.indexOf(a.retailerId);
      const idxB = overriddenOrder.indexOf(b.retailerId);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
    }
    return b.totalScore - a.totalScore;
  });

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sortedList.length) return;

    const currentIds = sortedList.map((s) => s.retailerId);
    const temp = currentIds[index];
    currentIds[index] = currentIds[newIdx];
    currentIds[newIdx] = temp;

    onReorder(currentIds);
  };

  const isOverridden = overriddenOrder.length > 0;

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Flame className="w-5 h-5 text-amber-700" />
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-[#14202B]">
              Today’s Prioritized Route Plan (10 Stores)
            </h3>
          </div>
          <p className="text-xs text-[#4B5A67] mt-0.5">
            Ranked by multi-factor urgency algorithm (Urgency 40%, Visit Requests 25%, Demand at Risk 20%, Staleness 15%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOverridden && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Manual Route Override Logged
            </span>
          )}
          <button
            onClick={onOpenHowCalculated}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0B6B5F] hover:underline"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Score Logic</span>
          </button>
        </div>
      </div>

      {/* Priority List */}
      <div className="space-y-2.5">
        {sortedList.map((item, idx) => {
          const ret = retailers.find((r) => r.id === item.retailerId);
          const isSharma = item.retailerId === 'ret-1';
          return (
            <div
              key={item.retailerId}
              className={`bg-white rounded-2xl border p-4 shadow-xs transition-all hover:border-[#0B6B5F]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.totalScore >= 75
                  ? 'border-red-300 bg-red-50/20'
                  : item.totalScore >= 50
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Ranking Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    idx === 0
                      ? 'bg-red-600 text-white border-red-700 shadow-xs'
                      : idx <= 2
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  #{idx + 1}
                </div>

                {/* Store Name & Reason Tag */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-[#14202B]">
                      {item.retailerName}
                    </span>
                    <span className="text-xs text-slate-500">({item.area})</span>
                    {/* Primary Reason Tag */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.hasRequestedVisit
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : item.totalScore >= 75
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {item.primaryReasonTag}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Tier {item.tier} Store</span>
                    <span>·</span>
                    <span>Min Cover: <strong className="text-slate-800">{item.urgencyDaysCover} days</strong></span>
                    <span>·</span>
                    <span>At-Risk Demand: <strong className="text-slate-800">₹{item.atRiskDemandValue.toLocaleString()}</strong></span>
                    {item.daysSinceLastLogged > 0 && (
                      <span className="text-amber-700 font-semibold">
                        (Unlogged for {item.daysSinceLastLogged}d)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Score Pill & Breakdown Trigger */}
                <button
                  onClick={() => setSelectedBreakdown(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-[#14202B] transition-colors text-xs font-bold"
                  title="Click to view 4-factor score breakdown"
                >
                  <Flame
                    className={`w-4 h-4 ${
                      item.totalScore >= 75 ? 'text-red-600 fill-red-600' : 'text-amber-600'
                    }`}
                  />
                  <span>Score: {item.totalScore}</span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Move Up/Down Controls for Manual Reordering */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move higher in route"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === sortedList.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border-l border-slate-200"
                    title="Move lower in route"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Open Retailer Detail Button */}
                <button
                  onClick={() => onSelectRetailer(item.retailerId)}
                  className="px-3.5 py-2 bg-[#0B6B5F] hover:bg-[#09574d] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                >
                  <span>Visit Store</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Priority Score Breakdown Modal */}
      {selectedBreakdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-extrabold text-[#14202B] text-base">
                  Priority Score: {selectedBreakdown.totalScore} / 100
                </h4>
                <p className="text-xs text-slate-500">{selectedBreakdown.retailerName} ({selectedBreakdown.area})</p>
              </div>
              <button
                onClick={() => setSelectedBreakdown(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Factor 1: Urgency 40% */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>1. Urgency (40% Weight):</span>
                  <span className="text-[#0B6B5F]">{selectedBreakdown.urgencyScore} / 40 pts</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Lowest Days of Cover: <strong>{selectedBreakdown.urgencyDaysCover} days</strong> vs 1-day depot lead time.
                </p>
              </div>

              {/* Factor 2: Retailer Visit Request 25% */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>2. Retailer Requested Visit (25% Weight):</span>
                  <span className="text-emerald-700">{selectedBreakdown.visitRequestScore} / 25 pts</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {selectedBreakdown.hasRequestedVisit
                    ? 'Active retailer visit request logged in app.'
                    : 'No pending retailer visit request.'}
                </p>
              </div>

              {/* Factor 3: At Risk Demand 20% */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>3. Demand at Risk (20% Weight):</span>
                  <span className="text-amber-700">{selectedBreakdown.atRiskDemandScore} / 20 pts</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Estimated ₹{selectedBreakdown.atRiskDemandValue.toLocaleString()} in sales at risk of stock-out before next delivery.
                </p>
              </div>

              {/* Factor 4: Staleness 15% */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>4. Staleness (15% Weight):</span>
                  <span className="text-purple-700">{selectedBreakdown.stalenessScore} / 15 pts</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {selectedBreakdown.daysSinceLastLogged === 0
                    ? 'Logged today.'
                    : `${selectedBreakdown.daysSinceLastLogged} days since last sales data update.`}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBreakdown(null)}
                className="px-4 py-2 bg-[#0B6B5F] text-white rounded-xl text-xs font-bold"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
