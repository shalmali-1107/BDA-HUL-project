import { useState } from 'react';
import { ExtractedSaleEntry, SKU, AppLanguage } from '../../types';
import { Check, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { t } from '../../i18n/translations';

interface Props {
  initialEntries: ExtractedSaleEntry[];
  unmatchedItems?: string[];
  skus: SKU[];
  sourceName: string;
  language: AppLanguage;
  onSave: (confirmedEntries: ExtractedSaleEntry[], correctionsCount: number) => void;
  onCancel: () => void;
}

export function ConfirmationReviewTable({
  initialEntries,
  unmatchedItems = [],
  skus,
  sourceName,
  language,
  onSave,
  onCancel,
}: Props) {
  const [entries, setEntries] = useState<ExtractedSaleEntry[]>(
    initialEntries.map((e) => ({
      ...e,
      is_low_confidence: e.confidence < 0.75,
    }))
  );
  const [correctionsCount, setCorrectionsCount] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkuId, setNewSkuId] = useState(skus[0]?.id || '');
  const [newSold, setNewSold] = useState(1);
  const [newStock, setNewStock] = useState(10);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateEntry = (index: number, field: 'units_sold' | 'closing_stock', val: number) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: Math.max(0, val) };
      return copy;
    });
    setCorrectionsCount((c) => c + 1);
  };

  const handleDelete = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
    setCorrectionsCount((c) => c + 1);
  };

  const handleAddRow = () => {
    const targetSku = skus.find((s) => s.id === newSkuId);
    if (!targetSku) return;

    setEntries((prev) => [
      ...prev,
      {
        sku_id: targetSku.id,
        sku_name: targetSku.name,
        units_sold: newSold,
        closing_stock: newStock,
        confidence: 1.0,
        source_text: 'Added by storekeeper',
        is_low_confidence: false,
      },
    ]);
    setShowAddModal(false);
    setCorrectionsCount((c) => c + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {sourceName}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
            {t('reviewAndConfirm', language)}
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            {t('reviewInstructions', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {correctionsCount > 0 && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#1F3FB5] border border-blue-200 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" />
              {correctionsCount} {t('correctionsLogged', language)}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addProduct', language)}</span>
          </button>
        </div>
      </div>

      {/* Unmatched / Non-HUL items detected */}
      {unmatchedItems.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950">
          <strong>Non-HUL or Unmatched items:</strong> {unmatchedItems.join(', ')}. These will not be added to stock.
        </div>
      )}

      {/* Editable List / Table */}
      <div className="divide-y divide-slate-200">
        {entries.map((entry, idx) => {
          const isCheckNeeded = entry.confidence < 0.75;
          return (
            <div
              key={entry.sku_id + idx}
              className={`py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl transition-colors ${
                isCheckNeeded ? 'bg-amber-50/50 border border-amber-200' : 'hover:bg-slate-50'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">
                  {entry.sku_name}
                </div>
                {entry.source_text && (
                  <div className="text-xs text-slate-500 italic mt-0.5">
                    "{entry.source_text}"
                  </div>
                )}
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      isCheckNeeded
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {isCheckNeeded ? t('pleaseCheck', language) : t('looksRight', language)}
                  </span>
                </div>
              </div>

              {/* Steppers: Sold & Stock */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Sold Today */}
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
                    {t('soldCount', language)}
                  </span>
                  <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleUpdateEntry(idx, 'units_sold', entry.units_sold - 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={entry.units_sold}
                      onChange={(e) => handleUpdateEntry(idx, 'units_sold', parseInt(e.target.value) || 0)}
                      className="w-12 text-center font-black text-sm py-1 border-x border-slate-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateEntry(idx, 'units_sold', entry.units_sold + 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Stock Left */}
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
                    {t('stockRemaining', language)}
                  </span>
                  <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleUpdateEntry(idx, 'closing_stock', entry.closing_stock - 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={entry.closing_stock}
                      onChange={(e) => handleUpdateEntry(idx, 'closing_stock', parseInt(e.target.value) || 0)}
                      className="w-12 text-center font-black text-sm py-1 border-x border-slate-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateEntry(idx, 'closing_stock', entry.closing_stock + 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete row */}
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  title={t('deleteRow', language)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent "Is this correct?" Decision Card with minimum 56px tall buttons */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="text-center">
          <span className="text-base sm:text-lg font-black text-[#1A1A1A]">
            {t('isThisCorrect', language)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[56px] py-3.5 px-4 rounded-xl border-2 border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('change', language)}</span>
          </button>

          <button
            type="button"
            onClick={() => onSave(entries, correctionsCount)}
            disabled={entries.length === 0}
            className="min-h-[56px] py-3.5 px-4 rounded-xl bg-[#1F3FB5] hover:bg-[#183296] text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{t('yesCorrect', language)}</span>
          </button>
        </div>
      </div>

      {/* Add SKU Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-base text-[#1A1A1A]">
              {t('addProduct', language)}
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  {t('productName', language)}:
                </label>
                <select
                  value={newSkuId}
                  onChange={(e) => setNewSkuId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  {skus.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.packSize})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    {t('soldCount', language)}:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newSold}
                    onChange={(e) => setNewSold(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    {t('stockRemaining', language)}:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-black text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
              >
                {t('cancel', language)}
              </button>
              <button
                type="button"
                onClick={handleAddRow}
                className="px-5 py-2 rounded-lg bg-[#1F3FB5] text-white text-xs font-bold"
              >
                {t('save', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
