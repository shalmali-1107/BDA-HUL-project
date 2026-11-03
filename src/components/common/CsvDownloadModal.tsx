import { useState } from 'react';
import { X, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppLanguage, Retailer, SKU, DailyRecord, Order, VisitRequest } from '../../types';
import { t } from '../../i18n/translations';
import {
  exportRetailerSalesCsv,
  exportRetailerStockCsv,
  exportRetailerOrdersCsv,
  exportDistributorSalesZoneCsv,
  exportDistributorStockZoneCsv,
  exportDistributorOrdersCsv,
  exportDistributorRefillRecsCsv,
  exportDistributorVisitsCsv,
  CsvExportResult,
} from '../../services/csvExport';

import { useStore } from '../../services/store';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  role: 'retailer' | 'distributor';
  language?: AppLanguage;
  retailer?: Retailer;
  retailerId?: string;
  retailers?: Retailer[];
  skus?: SKU[];
  dailyRecords?: DailyRecord[];
  orders?: Order[];
  visitRequests?: VisitRequest[];
}

export function CsvDownloadModal({
  isOpen = true,
  onClose,
  role,
  language,
  retailer,
  retailerId,
  retailers,
  skus,
  dailyRecords,
  orders,
  visitRequests,
}: Props) {
  const { state } = useStore();

  if (isOpen === false) return null;

  const effectiveLang = language || state.language;
  const effectiveSkus = skus || state.skus;
  const effectiveRecords = dailyRecords || state.dailyRecords;
  const effectiveOrders = orders || state.orders;
  const effectiveRetailers = retailers || state.retailers;
  const effectiveRetailer =
    retailer || (retailerId ? state.retailers.find((r) => r.id === retailerId) : state.retailers[0]);
  const effectiveVisits = visitRequests || state.visitRequests;

  // Selected data type
  const [dataType, setDataType] = useState<string>(
    role === 'retailer' ? 'sales' : 'dist_sales'
  );

  // Period
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [customFrom, setCustomFrom] = useState('2026-10-26');
  const [customTo, setCustomTo] = useState('2026-11-02');

  const [downloadResult, setDownloadResult] = useState<CsvExportResult | null>(null);

  const getDateRange = () => {
    const todayStr = '2026-11-02';
    if (period === 'today') return { from: todayStr, to: todayStr };
    if (period === '7days') return { from: '2026-10-26', to: todayStr };
    if (period === '30days') return { from: '2026-10-03', to: todayStr };
    return { from: customFrom, to: customTo };
  };

  const handleDownload = () => {
    const { from, to } = getDateRange();
    let res: CsvExportResult;

    if (role === 'retailer' && effectiveRetailer) {
      if (dataType === 'sales') {
        res = exportRetailerSalesCsv(effectiveRetailer, effectiveSkus, effectiveRecords, from, to);
      } else if (dataType === 'stock') {
        res = exportRetailerStockCsv(effectiveRetailer, effectiveSkus, effectiveRecords);
      } else {
        res = exportRetailerOrdersCsv(effectiveRetailer, effectiveOrders, from, to);
      }
    } else {
      // Distributor
      if (dataType === 'dist_sales') {
        res = exportDistributorSalesZoneCsv(effectiveRetailers, effectiveSkus, effectiveRecords, from, to);
      } else if (dataType === 'dist_stock') {
        res = exportDistributorStockZoneCsv(effectiveRetailers, effectiveSkus, effectiveRecords);
      } else if (dataType === 'dist_orders') {
        res = exportDistributorOrdersCsv(effectiveOrders, from, to);
      } else if (dataType === 'dist_refill') {
        res = exportDistributorRefillRecsCsv(effectiveRetailers, effectiveSkus, effectiveRecords);
      } else {
        res = exportDistributorVisitsCsv(effectiveVisits, from, to);
      }
    }

    setDownloadResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-[#1F3FB5] rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-[#1A1A1A] text-base sm:text-lg">
                {t('downloadDataTitle', effectiveLang)}
              </h3>
              <p className="text-xs text-slate-500">Excel CSV · UTF-8 BOM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Choose Data Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            {t('chooseDataType', language || effectiveLang)}
          </label>
          <div className="space-y-1.5">
            {role === 'retailer' ? (
              <>
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="retailerDataType"
                    value="sales"
                    checked={dataType === 'sales'}
                    onChange={() => setDataType('sales')}
                    className="w-4 h-4 text-[#1F3FB5] focus:ring-0"
                  />
                  <span>1. {t('salesByDayProduct', language || effectiveLang)}</span>
                </label>
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="retailerDataType"
                    value="stock"
                    checked={dataType === 'stock'}
                    onChange={() => setDataType('stock')}
                    className="w-4 h-4 text-[#1F3FB5] focus:ring-0"
                  />
                  <span>2. {t('currentStockList', language || effectiveLang)}</span>
                </label>
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="retailerDataType"
                    value="orders"
                    checked={dataType === 'orders'}
                    onChange={() => setDataType('orders')}
                    className="w-4 h-4 text-[#1F3FB5] focus:ring-0"
                  />
                  <span>3. {t('ordersList', language || effectiveLang)}</span>
                </label>
              </>
            ) : (
              <>
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="distDataType"
                    value="dist_sales"
                    checked={dataType === 'dist_sales'}
                    onChange={() => setDataType('dist_sales')}
                    className="w-4 h-4 text-[#1F3FB5]"
                  />
                  <span>1. {t('distSalesZone', language || effectiveLang)}</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="distDataType"
                    value="dist_stock"
                    checked={dataType === 'dist_stock'}
                    onChange={() => setDataType('dist_stock')}
                    className="w-4 h-4 text-[#1F3FB5]"
                  />
                  <span>2. {t('distStockZone', language || effectiveLang)}</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="distDataType"
                    value="dist_orders"
                    checked={dataType === 'dist_orders'}
                    onChange={() => setDataType('dist_orders')}
                    className="w-4 h-4 text-[#1F3FB5]"
                  />
                  <span>3. {t('distOrdersZone', language || effectiveLang)}</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="distDataType"
                    value="dist_refill"
                    checked={dataType === 'dist_refill'}
                    onChange={() => setDataType('dist_refill')}
                    className="w-4 h-4 text-[#1F3FB5]"
                  />
                  <span>4. {t('distRestockRecs', language || effectiveLang)}</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="distDataType"
                    value="dist_visits"
                    checked={dataType === 'dist_visits'}
                    onChange={() => setDataType('dist_visits')}
                    className="w-4 h-4 text-[#1F3FB5]"
                  />
                  <span>5. {t('distVisitsLog', language || effectiveLang)}</span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Period Chooser */}
        {dataType !== 'stock' && dataType !== 'dist_stock' && dataType !== 'dist_refill' && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              {t('choosePeriod', language || effectiveLang)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setPeriod('today')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  period === 'today'
                    ? 'bg-[#1F3FB5] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t('periodToday', language || effectiveLang)}
              </button>
              <button
                type="button"
                onClick={() => setPeriod('7days')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  period === '7days'
                    ? 'bg-[#1F3FB5] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t('period7Days', language || effectiveLang)}
              </button>
              <button
                type="button"
                onClick={() => setPeriod('30days')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  period === '30days'
                    ? 'bg-[#1F3FB5] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t('period30Days', language || effectiveLang)}
              </button>
              <button
                type="button"
                onClick={() => setPeriod('custom')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  period === 'custom'
                    ? 'bg-[#1F3FB5] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t('periodCustom', language || effectiveLang)}
              </button>
            </div>

            {period === 'custom' && (
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <label className="block text-slate-500 mb-0.5">{t('fromDate', language || effectiveLang)}</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-0.5">{t('toDate', language || effectiveLang)}</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback / Result */}
        {downloadResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              downloadResult.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {downloadResult.success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {t('downloadSuccess', language || effectiveLang)} <strong>{downloadResult.fileName}</strong> ({downloadResult.rowCount} rows)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{downloadResult.message || t('downloadNoData', language || effectiveLang)}</span>
              </>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700"
          >
            {t('cancel', language || effectiveLang)}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-lg bg-[#1F3FB5] hover:bg-[#183296] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadCsvBtn', language || effectiveLang)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
