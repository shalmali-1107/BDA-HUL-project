import { useState } from 'react';
import {
  Mic,
  Camera,
  FileSpreadsheet,
  ScanBarcode,
  Keyboard,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { SKU, ExtractedSaleEntry, AppLanguage, RetailerTier } from '../../types';
import { t } from '../../i18n/translations';
import {
  MOCK_POS_TRANSACTION_FEED,
  SAMPLE_VOICE_PROMPTS,
  SAMPLE_NOTEBOOK_PRESETS,
  SAMPLE_CCTV_SCENES,
} from '../../data/mockData';
import { parseVoiceNote, parseNotebookImage, detectCCTVProducts } from '../../services/gemini';
import { ConfirmationReviewTable } from './ConfirmationReviewTable';

import { useStore } from '../../services/store';

interface Props {
  skus: SKU[];
  onSaveSales: (entries: ExtractedSaleEntry[], source: 'pos' | 'camera' | 'voice' | 'notebook' | 'manual', corrections: number) => void;
  defaultTier?: RetailerTier;
  language?: AppLanguage;
  isHindi?: boolean;
  onBackToHome?: () => void;
  onCancel?: () => void;
}

export function RetailerCapture({
  skus,
  onSaveSales,
  defaultTier = 1,
  language,
  onBackToHome,
  onCancel,
}: Props) {
  const { state } = useStore();
  const effectiveLang = language || state.language;
  const handleBack = onCancel || onBackToHome;
  // Method mapping
  type CaptureMethod = 'voice' | 'notebook' | 'manual' | 'pos' | 'camera';

  // Sort methods to put retailer's tier method FIRST
  const getInitialMethod = (): CaptureMethod => {
    if (defaultTier === 3) return 'voice';
    if (defaultTier === 4) return 'notebook';
    if (defaultTier === 2) return 'camera';
    return 'pos';
  };

  const [activeMethod, setActiveMethod] = useState<CaptureMethod | null>(getInitialMethod());

  // Confirmation state
  const [pendingExtraction, setPendingExtraction] = useState<{
    entries: ExtractedSaleEntry[];
    unmatched: string[];
    source: 'pos' | 'camera' | 'voice' | 'notebook' | 'manual';
    sourceLabel: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Tier 1: POS state
  const [posConnected] = useState(true);

  // Tier 2: Camera state
  const [dpdpConsented, setDpdpConsented] = useState(true);
  const [selectedCctvScene, setSelectedCctvScene] = useState(SAMPLE_CCTV_SCENES[0]);

  // Tier 3: Voice state
  const [voiceText, setVoiceText] = useState(SAMPLE_VOICE_PROMPTS[0].transcript);
  const [isRecording, setIsRecording] = useState(false);

  // Tier 4: Notebook state
  const [selectedNotebookPreset, setSelectedNotebookPreset] = useState(SAMPLE_NOTEBOOK_PRESETS[0]);

  // Manual entry state: map of skuId -> { sold, stock }
  const [manualSearch, setManualSearch] = useState('');
  const [manualData, setManualData] = useState<Record<string, { sold: number; stock: number }>>(() => {
    const init: Record<string, { sold: number; stock: number }> = {};
    skus.forEach((s) => {
      init[s.id] = { sold: 4, stock: 12 };
    });
    return init;
  });

  // Browser speech synthesis helper (Read aloud)
  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = effectiveLang === 'mr' ? 'mr-IN' : effectiveLang === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Capture Handlers ---

  const handlePullPosSales = () => {
    setIsLoading(true);
    setStatusMessage(t('pullingBillingData', effectiveLang));

    setTimeout(() => {
      const entries: ExtractedSaleEntry[] = MOCK_POS_TRANSACTION_FEED.map((item) => ({
        sku_id: item.skuId,
        sku_name: item.name,
        units_sold: item.qty,
        closing_stock: Math.max(2, 24 - item.qty),
        confidence: 0.98,
        source_text: `Barcode ${item.barcode}`,
      }));

      setIsLoading(false);
      setPendingExtraction({
        entries,
        unmatched: [],
        source: 'pos',
        sourceLabel: t('captureBillingTitle', effectiveLang),
      });
    }, 600);
  };

  const handleProcessVoice = async (textToUse?: string) => {
    const promptText = textToUse || voiceText;
    setIsLoading(true);
    setStatusMessage(
      effectiveLang === 'mr'
        ? 'आवाजातून विक्री नोंद वाचत आहे...'
        : effectiveLang === 'hi'
        ? 'आवाज़ से बिक्री दर्ज की जा रही है...'
        : 'Reading sales from voice note...'
    );

    try {
      const res = await parseVoiceNote(promptText);
      setIsLoading(false);
      setPendingExtraction({
        entries: res.entries,
        unmatched: res.unmatched_items,
        source: 'voice',
        sourceLabel: t('captureSpeakTitle', effectiveLang),
      });
    } catch {
      setIsLoading(false);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      handleProcessVoice(voiceText);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sample =
          effectiveLang === 'mr'
            ? 'सर्फ एक्सेल दहा रुपयांचे पाकीट वीस विकले, लाइफबॉय पाच उरले आहेत'
            : SAMPLE_VOICE_PROMPTS[1].transcript;
        handleProcessVoice(sample);
      }, 2500);
    }
  };

  const handleProcessNotebook = async () => {
    setIsLoading(true);
    setStatusMessage(t('readingNotebook', effectiveLang));

    try {
      const res = await parseNotebookImage(undefined, undefined, selectedNotebookPreset.previewText);
      setIsLoading(false);
      setPendingExtraction({
        entries: res.entries,
        unmatched: res.unmatched_items,
        source: 'notebook',
        sourceLabel: t('capturePhotoTitle', effectiveLang),
      });
    } catch {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCctv = async () => {
    setIsLoading(true);
    setStatusMessage('Reading products from counter photo...');
    try {
      const res = await detectCCTVProducts();
      setIsLoading(false);
      setPendingExtraction({
        entries: res.entries,
        unmatched: res.unmatched_items,
        source: 'camera',
        sourceLabel: 'CCTV Counter Camera',
      });
    } catch {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = () => {
    const entries: ExtractedSaleEntry[] = [];
    Object.entries(manualData).forEach(([skuId, val]) => {
      if (val.sold > 0 || val.stock > 0) {
        const sku = skus.find((s) => s.id === skuId);
        if (sku) {
          entries.push({
            sku_id: sku.id,
            sku_name: sku.name,
            units_sold: val.sold,
            closing_stock: val.stock,
            confidence: 0.99,
            source_text: 'Manual entry',
          });
        }
      }
    });

    setPendingExtraction({
      entries,
      unmatched: [],
      source: 'manual',
      sourceLabel: t('captureTypeTitle', effectiveLang),
    });
  };

  // If in confirmation step, show ConfirmationReviewTable
  if (pendingExtraction) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t('stepOf', effectiveLang)} 2 of 2: {t('reviewAndConfirm', effectiveLang)}
        </div>
        <ConfirmationReviewTable
          initialEntries={pendingExtraction.entries}
          unmatchedItems={pendingExtraction.unmatched}
          skus={skus}
          sourceName={pendingExtraction.sourceLabel}
          language={effectiveLang}
          onCancel={() => setPendingExtraction(null)}
          onSave={(confirmed, corrections) => {
            onSaveSales(confirmed, pendingExtraction.source, corrections);
            setPendingExtraction(null);
          }}
        />
      </div>
    );
  }

  // Large Picture Cards for 4 Methods
  const methodCards: {
    id: CaptureMethod;
    title: string;
    desc: string;
    icon: any;
    isPrimaryForTier: boolean;
  }[] = [
    {
      id: 'voice',
      title: t('captureSpeakTitle', effectiveLang),
      desc: t('captureSpeakDesc', effectiveLang),
      icon: Mic,
      isPrimaryForTier: defaultTier === 3,
    },
    {
      id: 'notebook',
      title: t('capturePhotoTitle', effectiveLang),
      desc: t('capturePhotoDesc', effectiveLang),
      icon: Camera,
      isPrimaryForTier: defaultTier === 4,
    },
    {
      id: 'manual',
      title: t('captureTypeTitle', effectiveLang),
      desc: t('captureTypeDesc', effectiveLang),
      icon: Keyboard,
      isPrimaryForTier: false,
    },
    {
      id: 'pos',
      title: t('captureBillingTitle', effectiveLang),
      desc: t('captureBillingDesc', effectiveLang),
      icon: ScanBarcode,
      isPrimaryForTier: defaultTier === 1,
    },
  ];

  // Put primary tier method first
  methodCards.sort((a, b) => (b.isPrimaryForTier ? 1 : 0) - (a.isPrimaryForTier ? 1 : 0));

  const filteredSkus = skus.filter(
    (s) =>
      s.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(manualSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Step Banner & Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t('stepOf', effectiveLang)} 1 of 2
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
              {t('howToAddSales', effectiveLang)}
            </h3>
          </div>
        </div>

        {/* Read aloud helper button */}
        <button
          onClick={() =>
            handleReadAloud(
              effectiveLang === 'mr'
                ? 'आजची विक्री कशी नोंदवायची ते निवडा. बोलून सांगा, खतावणीचा फोटो काढा किंवा टाइप करा.'
                : effectiveLang === 'hi'
                ? 'आज की बिक्री दर्ज करने का तरीका चुनें। बोलकर बताएं, बहीखाते का फोटो लें या टाइप करें।'
                : "Choose how to add today's sales. Speak, take a photo of your notebook, or type."
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#1F3FB5]" />
          <span>{t('readAloud', effectiveLang)}</span>
        </button>
      </div>

      {/* Large Picture Cards (>= 56px height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methodCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeMethod === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveMethod(card.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all min-h-[72px] flex items-center gap-3.5 ${
                isSelected
                  ? 'border-[#1F3FB5] bg-blue-50/50 shadow-xs ring-1 ring-[#1F3FB5]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#1F3FB5] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">
                    {card.title}
                  </span>
                  {card.isPrimaryForTier && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#1F3FB5]">
                      Your usual method
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {card.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1F3FB5] mx-auto" />
          <div className="font-extrabold text-base text-[#1A1A1A]">{statusMessage}</div>
        </div>
      )}

      {/* METHOD 1: SPEAK (VOICE) */}
      {activeMethod === 'voice' && !isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 space-y-3">
            <button
              onClick={handleToggleRecord}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-[#1F3FB5] text-white hover:bg-[#183296]'
              }`}
            >
              <Mic className="w-9 h-9" />
            </button>
            <div className="text-center">
              <div className="font-black text-sm text-[#1A1A1A]">
                {isRecording ? t('listening', effectiveLang) : t('tapToRecord', effectiveLang)}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {t('recordingHint', effectiveLang)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('selectAudioSample', effectiveLang)}
            </label>
            <div className="space-y-2">
              {SAMPLE_VOICE_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => {
                    setVoiceText(prompt.transcript);
                    handleProcessVoice(prompt.transcript);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 text-left hover:border-[#1F3FB5] hover:bg-slate-50 transition-all text-xs flex items-center justify-between gap-2"
                >
                  <span className="font-bold text-[#1A1A1A]">"{prompt.transcript}"</span>
                  <span className="text-xs font-bold text-[#1F3FB5] shrink-0">
                    {t('readFromVoice', effectiveLang)} →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* METHOD 2: NOTEBOOK PHOTO */}
      {activeMethod === 'notebook' && !isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('chooseNotebookSample', effectiveLang)}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_NOTEBOOK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedNotebookPreset(preset)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedNotebookPreset.id === preset.id
                      ? 'border-[#1F3FB5] bg-blue-50/40 ring-1 ring-[#1F3FB5]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-extrabold text-[#1A1A1A]">{preset.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Date: {preset.date}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 font-serif text-slate-800 text-xs whitespace-pre-line leading-relaxed">
            {selectedNotebookPreset.previewText.trim()}
          </div>

          <button
            onClick={handleProcessNotebook}
            className="w-full min-h-[56px] py-3.5 px-4 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            <span>{t('readFromPhoto', effectiveLang)}</span>
          </button>
        </div>
      )}

      {/* METHOD 3: TYPE MANUAL (+ / -) */}
      {activeMethod === 'manual' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-[#1A1A1A] text-sm">
                {t('captureTypeTitle', effectiveLang)}
              </h4>
              <p className="text-xs text-slate-500">
                Large touch steppers for direct entry.
              </p>
            </div>
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchProduct', effectiveLang)}
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
            {filteredSkus.map((sku) => {
              const item = manualData[sku.id] || { sold: 0, stock: 10 };
              return (
                <div key={sku.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs sm:text-sm text-[#1A1A1A]">{sku.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {sku.packSize} · ₹{sku.retailPrice || sku.mrp}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                        {t('soldCount', effectiveLang)}
                      </span>
                      <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setManualData((prev) => ({
                              ...prev,
                              [sku.id]: { ...item, sold: Math.max(0, item.sold - 1) },
                            }))
                          }
                          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-xs">{item.sold}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setManualData((prev) => ({
                              ...prev,
                              [sku.id]: { ...item, sold: item.sold + 1 },
                            }))
                          }
                          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                        {t('stockRemaining', effectiveLang)}
                      </span>
                      <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setManualData((prev) => ({
                              ...prev,
                              [sku.id]: { ...item, stock: Math.max(0, item.stock - 1) },
                            }))
                          }
                          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-xs">{item.stock}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setManualData((prev) => ({
                              ...prev,
                              [sku.id]: { ...item, stock: item.stock + 1 },
                            }))
                          }
                          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleManualSubmit}
            className="w-full min-h-[56px] py-3.5 px-4 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t('reviewAndConfirm', effectiveLang)}</span>
          </button>
        </div>
      )}

      {/* METHOD 4: BILLING CONNECTOR */}
      {activeMethod === 'pos' && !isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-[#1A1A1A] text-sm">
                {t('captureBillingTitle', effectiveLang)}
              </h4>
              <p className="text-xs text-slate-500">
                {t('billingConnected', effectiveLang)} (Marg ERP / Vyapar)
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="text-slate-500 font-medium">Pending Scans Ready:</div>
            <div className="font-extrabold text-sm text-[#1A1A1A]">
              10 barcode transactions recorded at shop counter today
            </div>
          </div>

          <button
            onClick={handlePullPosSales}
            className="w-full min-h-[56px] py-3.5 px-4 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{t('pullTodaySales', effectiveLang)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
