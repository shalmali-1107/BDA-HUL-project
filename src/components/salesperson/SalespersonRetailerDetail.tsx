import { useState } from 'react';
import {
  ArrowLeft,
  Store,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  ShoppingBag,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Retailer, SKU, DailyRecord, Order, DeliverySlot } from '../../types';
import { calculateDaysOfCover, getAvgDailySales14d, calculateSkuForecast } from '../../services/analytics';
import { explainForecastWithGemini } from '../../services/gemini';

interface Props {
  retailer: Retailer;
  skus: SKU[];
  dailyRecords: DailyRecord[];
  orders: Order[];
  deliverySlots: DeliverySlot[];
  onBack: () => void;
  onSubmitTriangulation: (audits: { skuId: string; skuName: string; recordedStock: number; countedStock: number }[], notes: string) => void;
  onPlaceOrderForRetailer: (items: any[], slotId: string) => void;
}

export function SalespersonRetailerDetail({
  retailer,
  skus,
  dailyRecords,
  orders,
  deliverySlots,
  onBack,
  onSubmitTriangulation,
  onPlaceOrderForRetailer,
}: Props) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'triangulate' | 'order'>('inventory');

  // Triangulation state: pre-select 5 fast-moving SKUs
  const auditSkus = skus.slice(0, 5);
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    auditSkus.forEach((s) => {
      const latest = dailyRecords
        .filter((r) => r.retailerId === retailer.id && r.skuId === s.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const stock = latest ? latest.closingStock : 6;
      // Pre-fill with a realistic minor 1-unit deviation
      init[s.id] = Math.max(0, stock + (s.id === 'sku-surf-500g' ? -1 : 0));
    });
    return init;
  });
  const [auditNotes, setAuditNotes] = useState('Physical shelf count matched within 96% tolerance. Display placement verified.');

  // Forecast AI explanation state
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Order state
  const [orderBasket, setOrderBasket] = useState(() => {
    return skus.slice(0, 6).map((sku) => {
      const forecast = calculateSkuForecast(retailer.id, sku, dailyRecords, 7);
      const cases = forecast.recommendedOrderCases > 0 ? forecast.recommendedOrderCases : 1;
      return {
        skuId: sku.id,
        skuName: sku.name,
        cases,
        units: cases * sku.caseSize,
        pricePerUnit: sku.retailerPrice,
        caseSize: sku.caseSize,
      };
    });
  });
  const [selectedSlotId, setSelectedSlotId] = useState(deliverySlots[0]?.id || '');

  // AI explanation trigger
  const handleExplainUrgency = async (skuName: string, daysCover: number, avg: number, stock: number) => {
    setLoadingAi(true);
    const expl = await explainForecastWithGemini(skuName, daysCover, avg, stock, retailer.name);
    setAiExplanation(expl);
    setLoadingAi(false);
  };

  const handleTriangulationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const audits = auditSkus.map((s) => {
      const latest = dailyRecords
        .filter((r) => r.retailerId === retailer.id && r.skuId === s.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const recorded = latest ? latest.closingStock : 6;
      return {
        skuId: s.id,
        skuName: s.name,
        recordedStock: recorded,
        countedStock: counts[s.id] ?? recorded,
      };
    });

    onSubmitTriangulation(audits, auditNotes);
    setActiveTab('inventory');
  };

  const handleOrderSubmit = () => {
    const validItems = orderBasket.filter((i) => i.cases > 0).map((i) => ({
      skuId: i.skuId,
      skuName: i.skuName,
      units: i.units,
      cases: i.cases,
      pricePerUnit: i.pricePerUnit,
      totalPrice: i.units * i.pricePerUnit,
    }));
    onPlaceOrderForRetailer(validItems, selectedSlotId);
    setActiveTab('inventory');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Back button & Retailer Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Visit Plan"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#14202B]">{retailer.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Tier {retailer.tier}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {retailer.ownerName} · {retailer.area} · Phone: {retailer.phone}
            </p>
          </div>
        </div>

        {/* Quick Retailer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Data Confidence</span>
            <span className="font-extrabold text-emerald-800">
              {retailer.dataConfidenceScore}% ({retailer.dataConfidenceRating})
            </span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Last Sales Update</span>
            <span className="font-extrabold text-slate-800">{retailer.lastLoggedDate}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Triangulation Match</span>
            <span className="font-extrabold text-slate-800">{retailer.triangulationAccuracy || 96}% accuracy</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Preferred Capture</span>
            <span className="font-extrabold text-slate-800 uppercase">{retailer.preferredCaptureMethod}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#0B6B5F] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Live Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('triangulate')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'triangulate'
              ? 'bg-[#0B6B5F] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Triangulation Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('order')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'order'
              ? 'bg-[#0B6B5F] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Place Order</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY & STOCK-OUT RISKS */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-[#14202B]">
              On-Shelf Inventory & Burn Rate (14-Day Average)
            </h3>
            <span className="text-xs text-slate-500">Live kirana data feed</span>
          </div>

          {/* AI Explanation Banner */}
          {aiExplanation && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong>Gemini Demand Reasoner:</strong>
                <p className="leading-relaxed">{aiExplanation}</p>
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {skus.map((sku) => {
              const latest = dailyRecords
                .filter((r) => r.retailerId === retailer.id && r.skuId === sku.id)
                .sort((a, b) => b.date.localeCompare(a.date))[0];
              const avg = getAvgDailySales14d(retailer.id, sku.id, dailyRecords);
              const stock = latest ? latest.closingStock : 8;
              const cover = calculateDaysOfCover(stock, avg);
              const isUrgent = cover <= 1.5;

              return (
                <div key={sku.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#14202B] truncate">
                        {sku.name}
                      </span>
                      {isUrgent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-300">
                          Stockout Risk ({cover}d)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Closing Stock: <strong className="text-slate-800">{stock} units</strong> · Burn Rate: {avg} units/day
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full ${
                        cover <= 1.0
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : cover <= 2.0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cover}d cover
                    </span>

                    {isUrgent && (
                      <button
                        onClick={() => handleExplainUrgency(sku.name, cover, avg, stock)}
                        disabled={loadingAi}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold flex items-center gap-1"
                        title="Explain forecast with Gemini"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="hidden sm:inline">Explain</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TRIANGULATION AUDIT MODE */}
      {activeTab === 'triangulate' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#14202B] text-base">
                Physical Stock Triangulation Audit
              </h3>
              <p className="text-xs text-[#4B5A67]">
                Physically count high-velocity SKUs to calibrate recorded kirana inventory against reality.
              </p>
            </div>
          </div>

          <form onSubmit={handleTriangulationSubmit} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="py-2.5 px-3 font-bold">Audited SKU</th>
                    <th className="py-2.5 px-3 font-bold text-center w-28">App Recorded</th>
                    <th className="py-2.5 px-3 font-bold text-center w-36">Physical Count</th>
                    <th className="py-2.5 px-3 font-bold text-center w-24">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditSkus.map((sku) => {
                    const latest = dailyRecords
                      .filter((r) => r.retailerId === retailer.id && r.skuId === sku.id)
                      .sort((a, b) => b.date.localeCompare(a.date))[0];
                    const recorded = latest ? latest.closingStock : 6;
                    const physical = counts[sku.id] ?? recorded;
                    const diff = physical - recorded;

                    return (
                      <tr key={sku.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#14202B]">{sku.name}</div>
                          <div className="text-[10px] text-slate-500">{sku.packSize}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">
                          {recorded} units
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() =>
                                setCounts((prev) => ({
                                  ...prev,
                                  [sku.id]: Math.max(0, physical - 1),
                                }))
                              }
                              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={physical}
                              onChange={(e) =>
                                setCounts((prev) => ({
                                  ...prev,
                                  [sku.id]: Math.max(0, parseInt(e.target.value) || 0),
                                }))
                              }
                              className="w-12 text-center font-bold text-xs py-1 border-x border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setCounts((prev) => ({
                                  ...prev,
                                  [sku.id]: physical + 1,
                                }))
                              }
                              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block font-extrabold px-2 py-0.5 rounded-full text-[11px] ${
                              diff === 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : diff < 0
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field Officer Triangulation Notes:
              </label>
              <textarea
                rows={2}
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 px-4 bg-[#0B6B5F] hover:bg-[#09574d] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct Inventory Records & Update Data Confidence</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PLACE ORDER ON RETAILER'S BEHALF */}
      {activeTab === 'order' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#14202B] text-base">
                Place Restock Order for {retailer.name}
              </h3>
              <p className="text-xs text-[#4B5A67]">
                Pre-filled from demand sensing forecast. Adjust quantities during store visit.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {orderBasket.map((item, idx) => (
              <div key={item.skuId} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs sm:text-sm text-[#14202B] truncate">{item.skuName}</div>
                  <div className="text-[11px] text-slate-500">₹{item.pricePerUnit} / unit · Case of {item.caseSize}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-800">
                    ₹{(item.units * item.pricePerUnit).toLocaleString()}
                  </span>
                  <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...orderBasket];
                        const cs = Math.max(0, copy[idx].cases - 1);
                        copy[idx].cases = cs;
                        copy[idx].units = cs * copy[idx].caseSize;
                        setOrderBasket(copy);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-xs">{item.cases} cs</span>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...orderBasket];
                        const cs = copy[idx].cases + 1;
                        copy[idx].cases = cs;
                        copy[idx].units = cs * copy[idx].caseSize;
                        setOrderBasket(copy);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Delivery Window for Retailer:
            </label>
            <select
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium"
            >
              {deliverySlots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.bookedCases}/{s.maxCases} cases booked)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOrderSubmit}
            className="w-full min-h-[48px] py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Submit Order to Depot on Retailer’s Behalf</span>
          </button>
        </div>
      )}
    </div>
  );
}
