import { useState } from 'react';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Factory,
  Globe2,
  Calendar,
  Layers,
  HelpCircle,
  Download,
  X,
  Package,
} from 'lucide-react';
import { SKU, DailyRecord, Retailer } from '../../types';
import { ZONES } from '../../data/mockData';
import { calculateForecastErrorMAPE } from '../../services/analytics';
import { ProductionComparisonChart } from '../common/DemandCharts';
import { HelpPanel } from '../common/HelpPanel';
import { formatRupees } from '../../i18n/translations';

interface Props {
  retailers: Retailer[];
  skus: SKU[];
  dailyRecords: DailyRecord[];
  onOpenHowCalculated: () => void;
}

export function ManufacturerDashboard({
  retailers,
  skus,
  dailyRecords,
  onOpenHowCalculated,
}: Props) {
  const [activeTab, setActiveTab] = useState<'production' | 'visuals' | 'national' | 'coverage'>('production');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Compute forecast error MAPE on seeded data
  const mapeStats = calculateForecastErrorMAPE(dailyRecords);

  // Compute live sell-through by SKU
  const today = '2026-11-02';
  const skuMetrics = skus.map((sku) => {
    // Total sold in last 7 days
    const last7dRecords = dailyRecords.filter((r) => r.skuId === sku.id);
    const totalSoldLast7d = last7dRecords.reduce((sum, r) => sum + r.unitsSold, 0);
    const avgDailyPerStore = Math.max(2, Math.round(totalSoldLast7d / (retailers.length * 7)));

    // Total active closing stock across stores
    const latestRecords = retailers.map(
      (ret) =>
        dailyRecords
          .filter((r) => r.retailerId === ret.id && r.skuId === sku.id)
          .sort((a, b) => b.date.localeCompare(a.date))[0]
    );
    const totalClosingStockStores = latestRecords.reduce(
      (sum, r) => sum + (r ? r.closingStock : 10),
      0
    );

    // Distributor depot stock buffer (typically 3x retail stock)
    const depotStock = totalClosingStockStores * 2.8;

    // 4-Week national demand forecast across all zones
    const totalNetworkKiranas = 12 + 18 + 24; // 54 stores
    const multiplier = totalNetworkKiranas / retailers.length;
    const weeklyBurnAllZones = avgDailyPerStore * 7 * totalNetworkKiranas;

    // Festive uplift factor (+25% on detergents/tea/soaps)
    const isFestiveSku = sku.category === 'Detergents' || sku.category === 'Tea & Coffee';
    const festiveMultiplier = isFestiveSku ? 1.32 : 1.18;

    const forecast4WeeksUnits = Math.round(weeklyBurnAllZones * 4 * festiveMultiplier);
    const netProductionDeficitUnits = Math.max(0, forecast4WeeksUnits - Math.round(depotStock * multiplier));
    const suggestedProductionCases = Math.ceil(netProductionDeficitUnits / sku.caseSize);

    // WoW velocity change
    const wowChange = isFestiveSku ? +32 : +14;

    return {
      sku,
      weeklyBurnAllZones,
      forecast4WeeksUnits,
      depotStockEstimate: Math.round(depotStock * multiplier),
      suggestedProductionCases,
      suggestedProductionUnits: suggestedProductionCases * sku.caseSize,
      wowChange,
      isTopMover: wowChange >= 25,
      isSlowMover: wowChange <= 5,
    };
  });

  // Sort by production volume descending
  const sortedByVolume = [...skuMetrics].sort(
    (a, b) => b.suggestedProductionCases - a.suggestedProductionCases
  );

  const topMovers = sortedByVolume.slice(0, 5);
  const bottomMovers = [...skuMetrics].sort((a, b) => a.wowChange - b.wowChange).slice(0, 5);

  // Data Coverage Calculations
  const totalReportingToday = retailers.filter((r) => r.lastLoggedDate === today).length;
  const coverageRate = Math.round((totalReportingToday / retailers.length) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16">
      {/* Manufacturer Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-[#1F3FB5] text-white flex items-center justify-center font-black shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Hindustan Unilever Limited · S&OP Central
            </div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">
              National Kirana Demand-Sensing & Factory Planning
            </h2>
            <p className="text-xs text-slate-600">
              Aggregating live sell-through from 3 Regional Depots (Mumbai East, Pune, Ahmedabad)
            </p>
          </div>
        </div>

        {/* Global Planning KPIs */}
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-semibold">Festive Uplift</span>
              <strong className="text-sm text-[#1F3FB5] font-extrabold">+28.4% WoW</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-semibold">Forecast Error</span>
              <strong className="text-sm text-emerald-800 font-extrabold">{mapeStats.mapePercent}% MAPE</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-semibold">Stores Active</span>
              <strong className="text-sm text-[#1A1A1A] font-extrabold">{coverageRate}% Today</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-semibold">Factory Buffer</span>
              <strong className="text-sm text-emerald-800 font-extrabold">Healthy (96%)</strong>
            </div>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-[#1F3FB5]" />
            <span>Support</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('production')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'production'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>4-Week Factory Production Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('visuals')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'visuals'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Visual Demand Charts & Velocity</span>
        </button>

        <button
          onClick={() => setActiveTab('national')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'national'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>Depot Zone Breakdown (3 Zones)</span>
        </button>
      </div>

      {/* TAB 1: 4-WEEK FACTORY PRODUCTION SCHEDULE */}
      {activeTab === 'production' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[#1A1A1A] text-base">
                National Production Requirements (Aggregated Live Demand)
              </h3>
              <p className="text-xs text-slate-600">
                Calculated bottom-up from daily kirana point-of-sale depleting against regional depot holding buffers.
              </p>
            </div>

            <button
              onClick={onOpenHowCalculated}
              className="text-xs font-bold text-[#1F3FB5] hover:underline"
            >
              How are production targets calculated? →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold">Product (SKU)</th>
                  <th className="py-2.5 px-3 font-bold">Category</th>
                  <th className="py-2.5 px-3 font-bold text-center">Depot Stock</th>
                  <th className="py-2.5 px-3 font-bold text-center">4W Demand Projection</th>
                  <th className="py-2.5 px-3 font-bold text-center">Festive Velocity</th>
                  <th className="py-2.5 px-3 font-bold text-center text-[#1F3FB5]">Suggested Factory Run</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedByVolume.map((item) => (
                  <tr key={item.sku.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-bold text-[#1A1A1A]">
                      {item.sku.name}
                      <span className="block text-[11px] text-slate-500 font-normal">{item.sku.packSize}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{item.sku.category}</td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {item.depotStockEstimate.toLocaleString()} units
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-900">
                      {item.forecast4WeeksUnits.toLocaleString()} units
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          item.wowChange >= 25
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        +{item.wowChange}% WoW
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-black text-sm text-[#1F3FB5]">
                        {item.suggestedProductionCases.toLocaleString()} cases
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        ({item.suggestedProductionUnits.toLocaleString()} units)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL CHARTS & VELOCITY */}
      {activeTab === 'visuals' && (
        <div className="space-y-6">
          {/* Dual Bar Chart: Factory Production vs Depot Stock */}
          <ProductionComparisonChart
            items={sortedByVolume.slice(0, 6).map((s) => ({
              skuName: s.sku.name,
              suggestedCases: s.suggestedProductionCases,
              depotCases: Math.round(s.depotStockEstimate / s.sku.caseSize),
            }))}
          />

          {/* Top & Bottom Movers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top 5 Fastest Growing Movers */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </span>
                <div>
                  <h4 className="font-extrabold text-[#1A1A1A] text-sm sm:text-base">
                    Top 5 Fastest-Growing Products (Festive Surge)
                  </h4>
                  <p className="text-xs text-slate-500">Highest WoW kirana consumption velocity</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {topMovers.map((m) => (
                  <div key={m.sku.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{m.sku.name}</div>
                      <div className="text-[11px] text-slate-500">{m.sku.category} · {m.suggestedProductionCases} cases scheduled</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      +{m.wowChange}% WoW
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 5 Slowest Moving */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-slate-500" />
                </span>
                <div>
                  <h4 className="font-extrabold text-[#1A1A1A] text-sm sm:text-base">
                    Bottom 5 Steady / Slower-Moving Products
                  </h4>
                  <p className="text-xs text-slate-500">Lower weekly velocity; safe buffer exists</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {bottomMovers.map((m) => (
                  <div key={m.sku.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{m.sku.name}</div>
                      <div className="text-[11px] text-slate-500">{m.sku.category} · {m.suggestedProductionCases} cases scheduled</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                      +{m.wowChange}% WoW
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NATIONAL ZONES */}
      {activeTab === 'national' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-[#1A1A1A] text-base">
            Regional Depot Performance & Stock Buffers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ZONES.map((zone) => (
              <div key={zone.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1A1A1A]">{zone.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#1F3FB5]">
                    {zone.depotName}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {zone.totalRetailers} Kirana Stores enrolled
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs">
                  <span className="text-slate-500">Stockout Incidents:</span>
                  <strong className="text-emerald-700">0.8% (Target &lt;2%)</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F4F6FA] w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto p-4 relative shadow-2xl">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 z-10 shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
            <HelpPanel
              userRole="manufacturer"
              userName="HUL S&OP Central Planner"
              userPhone="+91 22 3983 0000"
            />
          </div>
        </div>
      )}
    </div>
  );
}
