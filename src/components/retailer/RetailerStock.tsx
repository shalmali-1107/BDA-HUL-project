import { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, TrendingDown, HelpCircle, Package, ArrowUpDown } from 'lucide-react';
import { SKU, DailyRecord } from '../../types';
import { calculateDaysOfCover, getAvgDailySales14d } from '../../services/analytics';
import { useStore } from '../../services/store';
import { t, formatRupees } from '../../i18n/translations';

interface Props {
  retailerId: string;
  skus: SKU[];
  dailyRecords: DailyRecord[];
  onOpenHowCalculated: () => void;
}

export function RetailerStock({
  retailerId,
  skus,
  dailyRecords,
  onOpenHowCalculated,
}: Props) {
  const { state } = useStore();
  const lang = state.language;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'urgency' | 'stock' | 'name'>('urgency');

  const categories = [
    'All',
    'Detergents',
    'Personal Wash',
    'Hair Care',
    'Tea & Coffee',
    'Dishwash',
    'Oral Care',
    'Skin Care',
  ];

  // Map each SKU with its latest record
  const stockItems = skus.map((sku) => {
    const storeRecords = dailyRecords
      .filter((r) => r.retailerId === retailerId && r.skuId === sku.id)
      .sort((a, b) => b.date.localeCompare(a.date));

    const latest = storeRecords[0];
    const avgDailySales = getAvgDailySales14d(retailerId, sku.id, dailyRecords);
    const closingStock = latest ? latest.closingStock : 8;
    const daysCover = calculateDaysOfCover(closingStock, avgDailySales);
    const source = latest ? latest.source : 'manual';
    const lastDate = latest ? latest.date : '2026-11-02';

    return {
      sku,
      closingStock,
      avgDailySales,
      daysCover,
      source,
      lastDate,
      isLowStock: daysCover <= 1.5 || closingStock <= 3,
      isCritical: daysCover <= 0.8 || closingStock <= 1,
    };
  });

  const filtered = stockItems
    .filter((item) => {
      const matchesSearch =
        item.sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.sku.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'urgency') return a.daysCover - b.daysCover;
      if (sortBy === 'stock') return a.closingStock - b.closingStock;
      return a.sku.name.localeCompare(b.sku.name);
    });

  // Source badges with plain language (no AI jargon)
  const sourceLabel = (src: string) => {
    switch (src) {
      case 'pos':
        return { text: lang === 'hi' ? 'बिलिंग मशीन' : lang === 'mr' ? 'बिलिंग मशीन' : 'Billing machine', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'camera':
        return { text: lang === 'hi' ? 'कैमरा फोटो' : lang === 'mr' ? 'कॅमेरा फोटो' : 'Camera photo', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'voice':
        return { text: lang === 'hi' ? 'बोलकर दर्ज' : lang === 'mr' ? 'बोलून नोंदवले' : 'Voice note', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'notebook':
        return { text: lang === 'hi' ? 'खाता-बही फोटो' : lang === 'mr' ? 'नोंदवही फोटो' : 'Notebook photo', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'rep-verified':
        return { text: t('salesmanChecked', lang), color: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { text: lang === 'hi' ? 'हाथ से लिखा' : lang === 'mr' ? 'हाताने नोंदवले' : 'Typed entry', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const formatDaysCover = (days: number) => {
    const formattedNum = days <= 1 ? (days === 0 ? '0' : '< 1') : Math.round(days);
    return t('willLastDays', lang, { days: formattedNum });
  };

  return (
    <div className="space-y-4">
      {/* Search & Category Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'hi' ? 'सामान खोजें...' : lang === 'mr' ? 'वस्तू शोधा...' : 'Search items...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#1F3FB5] focus:ring-1 focus:ring-[#1F3FB5]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'urgency' ? 'stock' : sortBy === 'stock' ? 'name' : 'urgency')}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
              title="Change sort order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>
                {sortBy === 'urgency' ? (lang === 'hi' ? 'क्रम: कम स्टॉक पहले' : lang === 'mr' ? 'क्रम: कमी साठा आधी' : 'Sort: Low stock first') : sortBy === 'stock' ? (lang === 'hi' ? 'क्रम: पीस अनुसार' : lang === 'mr' ? 'क्रम: नगांनुसार' : 'Sort: Quantity') : (lang === 'hi' ? 'क्रम: नाम' : lang === 'mr' ? 'क्रम: नाव' : 'Sort: Name')}
              </span>
            </button>

            <button
              onClick={onOpenHowCalculated}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1F3FB5] hover:underline shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'हिसाब कैसे होता है?' : lang === 'mr' ? 'हिशोब कसा होतो?' : 'How is this calculated?'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1F3FB5] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'All' ? (lang === 'hi' ? 'सभी सामान' : lang === 'mr' ? 'सर्व वस्तू' : 'All Items') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Cards Grid (Large, readable, clean) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const badge = sourceLabel(item.source);
          return (
            <div
              key={item.sku.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                item.isCritical
                  ? 'border-red-400 bg-red-50/20'
                  : item.isLowStock
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {item.sku.category}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>

                <h4 className="font-bold text-base text-[#1A1A1A] leading-snug mb-1">
                  {item.sku.name}
                </h4>
                <div className="text-xs text-slate-600 mb-3 flex flex-wrap gap-x-2">
                  <span>{item.sku.packSize}</span>
                  <span>·</span>
                  <span>MRP {formatRupees(item.sku.mrp)}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold">{t('estimatedProfit', lang)}: ~{item.sku.retailerMarginPct}%</span>
                </div>

                {/* Stock & Duration Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      {t('myStock', lang)}
                    </span>
                    <span className="text-xl font-black text-[#1A1A1A]">
                      {item.closingStock}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        {lang === 'hi' ? 'पीस' : lang === 'mr' ? 'नग' : 'units'}
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      {lang === 'hi' ? 'कब तक चलेगा' : lang === 'mr' ? 'कधीपर्यंत पुरेल' : 'Estimated duration'}
                    </span>
                    <span
                      className={`text-sm font-black flex items-center gap-1 ${
                        item.isCritical
                          ? 'text-red-600'
                          : item.isLowStock
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {formatDaysCover(item.daysCover)}
                      {item.isCritical && <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{lang === 'hi' ? `बिक्री: ~${item.avgDailySales} पीस/दिन` : lang === 'mr' ? `विक्री: ~${item.avgDailySales} नग/दिवस` : `Avg: ~${item.avgDailySales} units/day`}</span>
                {item.isLowStock ? (
                  <span className="font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {t('lowStock', lang)}
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'hi' ? 'पर्याप्त स्टॉक' : lang === 'mr' ? 'पुरेसा साठा' : 'Stock OK'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
