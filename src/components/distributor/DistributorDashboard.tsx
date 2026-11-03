import { useState } from 'react';
import {
  Truck,
  TrendingUp,
  AlertTriangle,
  Store,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Download,
  HelpCircle,
  BarChart2,
  Table as TableIcon,
  X,
} from 'lucide-react';
import { Retailer, SKU, DailyRecord, Order, DeliverySlot } from '../../types';
import { calculateDaysOfCover, getAvgDailySales14d, calculateSkuForecast } from '../../services/analytics';
import { ForecastLineChart, DaysCoverBarChart, ActualVsForecastChart } from '../common/DemandCharts';
import { CsvDownloadModal } from '../common/CsvDownloadModal';
import { HelpPanel } from '../common/HelpPanel';
import { useStore } from '../../services/store';
import { t, formatRupees, formatDateLocale } from '../../i18n/translations';

interface Props {
  retailers: Retailer[];
  skus: SKU[];
  dailyRecords: DailyRecord[];
  orders: Order[];
  deliverySlots: DeliverySlot[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], isBreached?: boolean, breachReason?: string) => void;
  onOpenHowCalculated: () => void;
}

export function DistributorDashboard({
  retailers,
  skus,
  dailyRecords,
  orders,
  deliverySlots,
  onUpdateOrderStatus,
  onOpenHowCalculated,
}: Props) {
  const { state } = useStore();
  const lang = state.language;

  const [activeTab, setActiveTab] = useState<'planner' | 'charts' | 'orders' | 'retailers' | 'skus'>('planner');
  const [viewMode, setViewMode] = useState<'both' | 'charts' | 'table'>('both');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Selected SKU for deep dive charts
  const [selectedChartSkuId, setSelectedChartSkuId] = useState<string>(skus[0]?.id || 'sku-surf-1kg');

  // Filters for Retailer Table
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [searchRetailer, setSearchRetailer] = useState('');

  // SKU View filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Compute Zone KPIs
  const today = '2026-11-02';
  const activeTodayCount = retailers.filter((r) => r.lastLoggedDate === today).length;
  const todayRecords = dailyRecords.filter((r) => r.date === today);
  const unitsSoldToday = todayRecords.reduce((sum, r) => sum + r.unitsSold, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PLACED').length;

  // Replenishment Planner Computations
  const plannerItems: {
    retailer: Retailer;
    sku: SKU;
    avgDaily: number;
    closingStock: number;
    daysCover: number;
    recommendedCases: number;
    recommendedUnits: number;
    status: 'REFILL_TODAY' | 'REFILL_2DAYS' | 'HEALTHY';
  }[] = [];

  retailers.forEach((ret) => {
    skus.forEach((sku) => {
      const avg = getAvgDailySales14d(ret.id, sku.id, dailyRecords);
      const latest = dailyRecords
        .filter((r) => r.retailerId === ret.id && r.skuId === sku.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const stock = latest ? latest.closingStock : 10;
      const cover = calculateDaysOfCover(stock, avg);
      const forecast = calculateSkuForecast(ret.id, sku, dailyRecords, 7);

      let status: 'REFILL_TODAY' | 'REFILL_2DAYS' | 'HEALTHY' = 'HEALTHY';
      if (cover <= 1.0 || stock === 0) status = 'REFILL_TODAY';
      else if (cover <= 2.2) status = 'REFILL_2DAYS';

      if (status !== 'HEALTHY' || forecast.recommendedOrderCases > 0) {
        plannerItems.push({
          retailer: ret,
          sku,
          avgDaily: avg,
          closingStock: stock,
          daysCover: cover,
          recommendedCases: Math.max(1, forecast.recommendedOrderCases),
          recommendedUnits: Math.max(sku.caseSize, forecast.recommendedOrderCases * sku.caseSize),
          status,
        });
      }
    });
  });

  const refillTodayItems = plannerItems.filter((i) => i.status === 'REFILL_TODAY');
  const refill2DaysItems = plannerItems.filter((i) => i.status === 'REFILL_2DAYS');

  // Depot-level purchase suggestion to HUL: Aggregate recommended cases per SKU
  const depotOrderSuggestion: Record<string, { sku: SKU; cases: number; units: number; totalCost: number }> = {};
  plannerItems.forEach((item) => {
    if (!depotOrderSuggestion[item.sku.id]) {
      depotOrderSuggestion[item.sku.id] = {
        sku: item.sku,
        cases: 0,
        units: 0,
        totalCost: 0,
      };
    }
    depotOrderSuggestion[item.sku.id].cases += item.recommendedCases;
    depotOrderSuggestion[item.sku.id].units += item.recommendedUnits;
    depotOrderSuggestion[item.sku.id].totalCost += item.recommendedUnits * item.sku.retailerPrice * 0.94;
  });

  const totalDepotCases = Object.values(depotOrderSuggestion).reduce((a, b) => a + b.cases, 0);
  const totalDepotCost = Object.values(depotOrderSuggestion).reduce((a, b) => a + b.totalCost, 0);

  // Distinct areas for filter
  const areas = ['All', ...Array.from(new Set(retailers.map((r) => r.area)))];

  // Filtered Retailers
  const filteredRetailers = retailers.filter((r) => {
    const matchesTier = tierFilter === 'All' || r.tier === parseInt(tierFilter);
    const matchesArea = areaFilter === 'All' || r.area === areaFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchRetailer.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchRetailer.toLowerCase());
    return matchesTier && matchesArea && matchesSearch;
  });

  const currentChartSku = skus.find((s) => s.id === selectedChartSkuId) || skus[0];

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16">
      {/* Depot Header & Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-[#1F3FB5] text-white flex items-center justify-center font-black shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'hi' ? 'एचयूएल पुनर्वितरण डिपो पोर्टल' : lang === 'mr' ? 'एचयूएल पुनर्वितरण डेपो पोर्टल' : 'HUL Redistribution Stockist (Depot Portal)'}
            </div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">
              Vijay Logistics · Mumbai East Depot
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'hi' ? 'कुर्ला ईस्ट डिपो · 12 किराना दुकानें · 2 वैन सक्रिय' : lang === 'mr' ? 'कुर्ला पूर्व डेपो · १२ किराणा दुकाने · २ वाहने सक्रिय' : 'Depot: Kurla East · Territory: 12 Kiranas · 2 Delivery Vans Active'}
            </p>
          </div>
        </div>

        {/* Action Buttons: CSV Download & Help */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCsvModal(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#1F3FB5] hover:bg-[#162e87] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{t('download', lang)} CSV</span>
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#1F3FB5]" />
            <span>{t('helpline', lang)}</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] text-slate-500 block font-semibold">Active Stores Today</span>
          <strong className="text-base text-emerald-800 font-black">
            {activeTodayCount} / {retailers.length} Stores
          </strong>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] text-slate-500 block font-semibold">Zone Units Sold</span>
          <strong className="text-base text-slate-800 font-black">
            {unitsSoldToday} units
          </strong>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] text-slate-500 block font-semibold">Low Stock Warnings</span>
          <strong className="text-base text-red-600 font-black">
            {refillTodayItems.length} alerts
          </strong>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] text-slate-500 block font-semibold">On-Time Fulfilment</span>
          <strong className="text-base text-[#1F3FB5] font-black">98.4%</strong>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('planner')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'planner'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Replenishment Planner</span>
          {refillTodayItems.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">
              {refillTodayItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'charts'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Visual Demand Forecasts (Charts)</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Incoming Orders & Van Slots</span>
          {pendingOrdersCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('retailers')}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'retailers'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Retailer Zone Table (12 Stores)</span>
        </button>
      </div>

      {/* TAB 1: REPLENISHMENT PLANNER */}
      {activeTab === 'planner' && (
        <div className="space-y-5">
          {/* Depot Purchase Order Suggestion to HUL Factory */}
          <div className="bg-[#1F3FB5] text-white rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  Automated Depot-Level Aggregation
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-1">
                  Suggested Factory Refill Order to HUL
                </h3>
                <p className="text-xs text-blue-100 max-w-2xl mt-0.5">
                  Synthesized directly from live on-shelf depletion across 12 Kiranas in Mumbai East. Fulfills 7 days of projected safety cover.
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl font-black">{totalDepotCases} Cases</div>
                <div className="text-xs text-blue-200">
                  Est. Depot Value: {formatRupees(totalDepotCost)}
                </div>
              </div>
            </div>

            {/* Top Recommended SKUs Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-400/30 text-xs">
              {Object.values(depotOrderSuggestion).slice(0, 4).map((d) => (
                <div key={d.sku.id} className="p-2.5 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-[10px] text-blue-100 block truncate">{d.sku.name}</span>
                  <strong className="text-sm font-black">{d.cases} cases</strong>
                  <span className="text-[10px] text-blue-200 block">({d.units} units)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group 1: Refill Today (<1.0 Days Cover) */}
          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-[#1A1A1A] text-base">
                    Group 1: Refill Today (Critical Stock-Out Risk)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Inventory below 1 day of cover. Dispatch in today's evening van slot.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs border border-red-300">
                {refillTodayItems.length} Urgent Items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-red-50 text-red-950 border-b border-red-200">
                    <th className="py-2.5 px-3 font-bold">Store</th>
                    <th className="py-2.5 px-3 font-bold">Product</th>
                    <th className="py-2.5 px-3 font-bold text-center">Closing Stock</th>
                    <th className="py-2.5 px-3 font-bold text-center">14d Burn Rate</th>
                    <th className="py-2.5 px-3 font-bold text-center">Duration</th>
                    <th className="py-2.5 px-3 font-bold text-center">Suggested Refill</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {refillTodayItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-red-50/40">
                      <td className="py-3 px-3 font-bold text-[#1A1A1A]">
                        {item.retailer.name}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {item.retailer.area} · Tier {item.retailer.tier}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {item.sku.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{item.sku.packSize}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-red-700">
                        {item.closingStock} units
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {item.avgDaily} / day
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full font-black text-[11px] bg-red-100 text-red-800 border border-red-300">
                          {t('willLastDays', lang, { days: item.daysCover })}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {item.recommendedCases} cases ({item.recommendedUnits} units)
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => alert(`Express dispatch ticket generated for ${item.retailer.name} (${item.recommendedCases} cases of ${item.sku.name.split(' ')[0]})`)}
                          className="px-3 py-1.5 bg-[#1F3FB5] hover:bg-[#162e87] text-white rounded-lg font-bold text-xs shadow-xs"
                        >
                          Queue Van Refill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Group 2: Refill Within 2 Days */}
          <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-[#1A1A1A] text-base">
                    Group 2: Refill Within 2 Days (Watchlist)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Cover between 1.0 and 2.2 days. Include in tomorrow morning standard delivery schedule.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                {refill2DaysItems.length} Items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                    <th className="py-2.5 px-3 font-bold">Store</th>
                    <th className="py-2.5 px-3 font-bold">Product</th>
                    <th className="py-2.5 px-3 font-bold text-center">Closing Stock</th>
                    <th className="py-2.5 px-3 font-bold text-center">Duration</th>
                    <th className="py-2.5 px-3 font-bold text-center">Recommended Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {refill2DaysItems.slice(0, 8).map((item, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/30">
                      <td className="py-2.5 px-3 font-semibold text-[#1A1A1A]">
                        {item.retailer.name}
                        <span className="block text-[10px] text-slate-500 font-normal">{item.retailer.area}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">{item.sku.name}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.closingStock}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800">
                          {t('willLastDays', lang, { days: item.daysCover })}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                        {item.recommendedCases} cs ({item.recommendedUnits} units)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL DEMAND FORECASTS (CHARTS) */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* SKU Picker for Forecast Line Chart & Days Cover */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[#1A1A1A] text-base">
                Visual Demand Sensing & Accuracy Metrics
              </h3>
              <p className="text-xs text-slate-600">
                Interactive charts illustrating 30-day historical actuals, 14-day forecasts with confidence bands, store cover, and error tracking.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Select Product:</label>
              <select
                value={selectedChartSkuId}
                onChange={(e) => setSelectedChartSkuId(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1F3FB5]"
              >
                {skus.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.packSize})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid of visual charts */}
          <div className="grid grid-cols-1 gap-6">
            {/* Chart 1: Forecast Line Chart (30d actual + 14d forecast + confidence band) */}
            <ForecastLineChart
              sku={currentChartSku}
              records={dailyRecords}
              language={lang}
            />

            {/* Chart 2: Days of Cover by Retailer with 1.5d threshold line */}
            <DaysCoverBarChart
              sku={currentChartSku}
              retailers={retailers}
              records={dailyRecords}
              language={lang}
            />

            {/* Chart 3: Actual vs Forecast Error Tracking (Past 7 days) */}
            <ActualVsForecastChart
              records={dailyRecords}
              language={lang}
            />
          </div>
        </div>
      )}

      {/* TAB 3: INCOMING ORDERS & VAN CAPACITY */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* Van Capacity Monitor */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-[#1A1A1A] text-base">
              Delivery Slot & Van Capacity Controller
            </h3>
            <p className="text-xs text-slate-600">
              Each slot is served by a delivery van (max 80 cases). High capacity blocks auto-confirming new orders without rescheduling.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {deliverySlots.map((slot) => {
                const percent = Math.round((slot.bookedCases / slot.maxCases) * 100);
                const isOverload = percent >= 85;
                return (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-xl border ${
                      isOverload ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#1A1A1A] mb-2">
                      <span>{slot.label}</span>
                      <span className={isOverload ? 'text-amber-700 font-black' : 'text-slate-600'}>
                        {percent}% Booked
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverload ? 'bg-amber-600' : 'bg-[#1F3FB5]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Booked: {slot.bookedCases} cases</span>
                      <span>Max: {slot.maxCases} cases</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders Management Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#1A1A1A] text-base">
                Incoming Kirana Orders Queue
              </h4>
              <span className="text-xs text-slate-500">Live order management</span>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1A1A1A]">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-700">· {order.retailerName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : order.status === 'OUT_FOR_DELIVERY'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Slot: <strong>{order.slot}</strong> · Placed by: {order.placedBy === 'retailer' ? 'Store Owner' : order.salespersonName || 'Sales Rep'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#1A1A1A]">
                        {formatRupees(order.totalAmount)}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        {order.totalCases} cases ({order.items.reduce((a, b) => a + b.units, 0)} units)
                      </span>
                    </div>
                  </div>

                  {/* Actions for Depot Dispatcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span>Items:</span>
                      {order.items.map((i, idx) => (
                        <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          {i.skuName.split(' ')[0]} ({i.cases}cs)
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'PLACED' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'ACCEPTED')}
                          className="px-3.5 py-1.5 bg-[#1F3FB5] hover:bg-[#162e87] text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Accept & Confirm Slot
                        </button>
                      )}

                      {order.status === 'ACCEPTED' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                          className="px-3.5 py-1.5 bg-[#1F3FB5] hover:bg-[#162e87] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch in Van</span>
                        </button>
                      )}

                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'DELIVERED')}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RETAILERS ZONE TABLE */}
      {activeTab === 'retailers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[#1A1A1A] text-base">
                Mumbai East Kirana Network (12 Retailers)
              </h3>
              <p className="text-xs text-slate-600">
                Filter by capture tier, local area, and inspect real-time data status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter store..."
                  value={searchRetailer}
                  onChange={(e) => setSearchRetailer(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                <option value="All">All Tiers</option>
                <option value="1">Tier 1 (POS)</option>
                <option value="2">Tier 2 (CCTV)</option>
                <option value="3">Tier 3 (Voice)</option>
                <option value="4">Tier 4 (Paper)</option>
              </select>

              {/* Area Filter */}
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'All' ? 'All Areas' : a}
                  </option>
                ))}
              </select>

              {/* Download CSV button for table */}
              <button
                onClick={() => setShowCsvModal(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-[#1F3FB5]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold">Store & Owner</th>
                  <th className="py-2.5 px-3 font-bold">Area</th>
                  <th className="py-2.5 px-3 font-bold">Tier & Method</th>
                  <th className="py-2.5 px-3 font-bold text-center">Last Logged</th>
                  <th className="py-2.5 px-3 font-bold text-center">Streak</th>
                  <th className="py-2.5 px-3 font-bold text-center">Data Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRetailers.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-bold text-[#1A1A1A]">
                      {ret.name}
                      <span className="block text-[11px] text-slate-500 font-normal">
                        {ret.ownerName} · {ret.phone}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{ret.area}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">Tier {ret.tier}</span>
                      <span className="block text-[10px] text-slate-500">
                        {ret.tier === 1 ? 'POS Connector' : ret.tier === 2 ? 'Camera Vision' : ret.tier === 3 ? 'Voice Note' : 'Notebook Photo'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {ret.lastLoggedDate}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {ret.loggingStreakDays} days
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Download Modal */}
      {showCsvModal && (
        <CsvDownloadModal
          role="distributor"
          onClose={() => setShowCsvModal(false)}
        />
      )}

      {/* Helpline Support Modal */}
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
              userRole="distributor"
              userName="Vijay Logistics (Depot Mgr)"
              userPhone="+91 98330 12345"
            />
          </div>
        </div>
      )}
    </div>
  );
}
