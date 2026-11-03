import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';
import { DailyRecord, SKU, Retailer, AppLanguage } from '../../types';
import { t, formatRupees, formatDateLocale } from '../../i18n/translations';

import { useStore } from '../../services/store';

interface Props {
  retailer: Retailer;
  skus: SKU[];
  dailyRecords: DailyRecord[];
  language?: AppLanguage;
  onAddSalesClick?: () => void;
  onLogSalesClick?: () => void;
}

export function TodaysSalesCard({
  retailer,
  skus,
  dailyRecords,
  language,
  onAddSalesClick,
  onLogSalesClick,
}: Props) {
  const { state } = useStore();
  const effectiveLang = language || state.language;
  const triggerAddSales = onLogSalesClick || onAddSalesClick || (() => {});

  const [selectedDate, setSelectedDate] = useState<string>('2026-11-02');
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const isTodaySelected = selectedDate === '2026-11-02';
  const isLoggedToday = retailer.lastLoggedDate === '2026-11-02';

  // Records for selected date
  const recordsForDate = dailyRecords.filter(
    (r) => r.retailerId === retailer.id && r.date === selectedDate
  );

  // Compute metrics for selected date
  const totalUnits = recordsForDate.reduce((sum, r) => sum + r.unitsSold, 0);

  let totalSalesValue = 0;
  let totalEstimatedProfit = 0;

  const itemBreakdown = recordsForDate
    .filter((r) => r.unitsSold > 0)
    .map((r) => {
      const sku = skus.find((s) => s.id === r.skuId);
      const unitPrice = sku ? sku.retailPrice || sku.mrp : 60;
      const marginPct = sku ? sku.retailerMarginPct || 12 : 12;
      const val = r.unitsSold * unitPrice;
      const profit = Math.round(val * (marginPct / 100));

      totalSalesValue += val;
      totalEstimatedProfit += profit;

      return {
        skuName: sku ? sku.name : r.skuId,
        packSize: sku ? sku.packSize : '',
        unitsSold: r.unitsSold,
        unitPrice,
        val,
        profit,
      };
    });

  // Calculate yesterday's sales value for comparison
  const yesterdayStr = '2026-11-01';
  const yesterdayRecords = dailyRecords.filter(
    (r) => r.retailerId === retailer.id && r.date === yesterdayStr
  );
  const yesterdayTotalVal = yesterdayRecords.reduce((sum, r) => {
    const sku = skus.find((s) => s.id === r.skuId);
    const unitPrice = sku ? sku.retailPrice || sku.mrp : 60;
    return sum + r.unitsSold * unitPrice;
  }, 0);

  const diffFromYesterday = totalSalesValue - yesterdayTotalVal;

  // Mini 7-day bar chart data
  const past7Dates = [
    '2026-10-27',
    '2026-10-28',
    '2026-10-29',
    '2026-10-30',
    '2026-10-31',
    '2026-11-01',
    '2026-11-02',
  ];

  const past7DaysData = past7Dates.map((dStr) => {
    const dayRecs = dailyRecords.filter(
      (r) => r.retailerId === retailer.id && r.date === dStr
    );
    const dayVal = dayRecs.reduce((sum, r) => {
      const sku = skus.find((s) => s.id === r.skuId);
      return sum + r.unitsSold * (sku ? sku.retailPrice || sku.mrp : 60);
    }, 0);
    const dObj = new Date(dStr + 'T00:00:00Z');
    const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dObj.getUTCDay()];
    return { date: dStr, dayShort, val: dayVal, isSelected: dStr === selectedDate };
  });

  const max7DayVal = Math.max(...past7DaysData.map((d) => d.val), 1000);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs transition-all space-y-4">
        {/* Card Header & Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {retailer.name}
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#1A1A1A] leading-tight">
              {isTodaySelected
                ? t('todaysSales', language)
                : `${t('todaysSales', language)} (${formatDateLocale(selectedDate, language)})`}
            </h3>
          </div>

          {/* Quick Date Pills: Today, Yesterday, Earlier */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setSelectedDate('2026-11-02')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedDate === '2026-11-02'
                  ? 'bg-[#1F3FB5] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('today', language)}
            </button>
            <button
              onClick={() => setSelectedDate('2026-11-01')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedDate === '2026-11-01'
                  ? 'bg-[#1F3FB5] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('yesterday', effectiveLang)}
            </button>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full"
                title={t('viewPastDays', effectiveLang)}
              />
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg border border-slate-300 transition-all flex items-center gap-1 ${
                  selectedDate !== '2026-11-02' && selectedDate !== '2026-11-01'
                    ? 'bg-[#1F3FB5] text-white border-transparent'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('earlier', effectiveLang)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* If Today and Not Logged Yet: Show "Not Added Yet" State */}
        {isTodaySelected && !isLoggedToday ? (
          <div className="p-5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                <h4 className="font-extrabold text-base text-amber-950">
                  {t('notAddedYet', effectiveLang)}
                </h4>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed pl-7">
                Take 30 seconds to speak or snap your notebook before closing your shop.
              </p>
            </div>

            <button
              onClick={triggerAddSales}
              className="min-h-[50px] w-full sm:w-auto px-6 py-3 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addTodaysSales', effectiveLang)}</span>
            </button>
          </div>
        ) : (
          /* Logged State: 2 Large Numbers + Comparison + 7-Day Bar Chart */
          <div
            onClick={() => setShowBreakdownModal(true)}
            className="cursor-pointer group p-3 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition-all"
            title="Tap to see product-wise breakdown"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left: Units & Sales Value */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">
                      {t('unitsSold', effectiveLang)}
                    </span>
                    <span className="text-3xl font-black text-[#1A1A1A]">
                      {totalUnits}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        {t('units', effectiveLang)}
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">
                      {t('moneyEarned', effectiveLang)}
                    </span>
                    <span className="text-3xl font-black text-emerald-700">
                      {formatRupees(totalSalesValue)}
                    </span>
                  </div>
                </div>

                {/* Estimated Profit & Yesterday Comparison */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="font-semibold">{t('estimatedProfit', effectiveLang)}:</span>
                    <strong className="text-emerald-800 font-bold">
                      {formatRupees(totalEstimatedProfit)}
                    </strong>
                    <span className="text-[10px] text-slate-400 italic">
                      ({t('estimatedProfitLabel', effectiveLang)})
                    </span>
                  </div>

                  {isTodaySelected && (
                    <div
                      className={`inline-flex items-center gap-1 font-bold text-xs ${
                        diffFromYesterday >= 0 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {diffFromYesterday >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {formatRupees(Math.abs(diffFromYesterday))}{' '}
                        {diffFromYesterday >= 0
                          ? t('moreThanYesterday', effectiveLang)
                          : t('lessThanYesterday', effectiveLang)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: 7-Day Mini Bar Chart */}
              <div className="space-y-1.5 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-4">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                  <span>{t('salesLast7Days', effectiveLang)}</span>
                  <span className="text-[#1F3FB5] group-hover:underline flex items-center gap-0.5">
                    <span>{t('itemsSoldToday', effectiveLang)}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Bars */}
                <div className="h-16 flex items-end gap-1.5 pt-2">
                  {past7DaysData.map((d) => {
                    const pct = Math.max(8, Math.round((d.val / max7DayVal) * 100));
                    return (
                      <div
                        key={d.date}
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(d.date);
                        }}
                      >
                        <div
                          className={`w-full rounded-t-sm transition-all ${
                            d.isSelected
                              ? 'bg-[#1F3FB5]'
                              : 'bg-blue-200 hover:bg-blue-300'
                          }`}
                          style={{ height: `${pct}%` }}
                        />
                        <span className="text-[9px] text-slate-400 font-mono">
                          {d.dayShort[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product-Wise Sold Today Breakdown Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-extrabold text-[#1A1A1A] text-base">
                  {t('itemsSoldToday', effectiveLang)} ({formatDateLocale(selectedDate, effectiveLang)})
                </h4>
                <p className="text-xs text-slate-500">
                  Total: {totalUnits} {t('units', effectiveLang)} · {formatRupees(totalSalesValue)}
                </p>
              </div>
              <button
                onClick={() => setShowBreakdownModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1 text-xs">
              {itemBreakdown.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No individual items logged for this date.
                </div>
              ) : (
                itemBreakdown.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#1A1A1A]">{item.skuName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.packSize} · ₹{item.unitPrice} per unit
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm text-[#1A1A1A] block">
                        {formatRupees(item.val)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.unitsSold} units · profit ~{formatRupees(item.profit)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowBreakdownModal(false)}
                className="px-4 py-2 bg-[#1F3FB5] text-white rounded-lg font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
