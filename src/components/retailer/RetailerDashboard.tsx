import { useState, useEffect } from 'react';
import {
  Home,
  Package,
  ShoppingBag,
  HelpCircle,
  Download,
  Volume2,
  Undo2,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  History,
} from 'lucide-react';
import { Retailer, SKU, DailyRecord, DeliverySlot, Order, ExtractedSaleEntry } from '../../types';
import { RetailerCapture } from './RetailerCapture';
import { RetailerStock } from './RetailerStock';
import { RetailerOrder } from './RetailerOrder';
import { RetailerOrdersList } from './RetailerOrdersList';
import { TodaysSalesCard } from './TodaysSalesCard';
import { CsvDownloadModal } from '../common/CsvDownloadModal';
import { HelpPanel } from '../common/HelpPanel';
import { FirstTimeGuide } from '../common/FirstTimeGuide';
import { calculateDaysOfCover, getAvgDailySales14d } from '../../services/analytics';
import { useStore } from '../../services/store';
import { t, formatRupees } from '../../i18n/translations';

interface Props {
  retailer: Retailer;
  skus: SKU[];
  dailyRecords: DailyRecord[];
  deliverySlots: DeliverySlot[];
  orders: Order[];
  onSaveSales: (entries: ExtractedSaleEntry[], source: any, corrections: number) => void;
  onPlaceOrder: (items: any[], slotId: string) => void;
  onRequestVisit: (date: string, slot: string, reason: string) => void;
  onOpenHowCalculated: () => void;
}

export function RetailerDashboard({
  retailer,
  skus,
  dailyRecords,
  deliverySlots,
  orders,
  onSaveSales,
  onPlaceOrder,
  onRequestVisit,
  onOpenHowCalculated,
}: Props) {
  const { state, undoLastSaleLog } = useStore();
  const lang = state.language;

  // 4 main navigation tabs: 'home' | 'stock' | 'order' | 'help'
  const [activeTab, setActiveTab] = useState<'home' | 'stock' | 'order' | 'help'>('home');
  // Secondary views: capture mode or orders tracking
  const [isCapturing, setIsCapturing] = useState(false);
  const [orderSubTab, setOrderSubTab] = useState<'create' | 'tracking'>('create');
  
  // CSV Download Modal
  const [showCsvModal, setShowCsvModal] = useState(false);
  // First-time guide modal
  const [showGuide, setShowGuide] = useState(() => {
    return !localStorage.getItem('hul_guide_seen');
  });

  // Undo notification banner (10-second timer)
  const [undoBanner, setUndoBanner] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Urgent stock items (< 1.5 days cover)
  const lowStockAlerts = skus
    .map((sku) => {
      const avg = getAvgDailySales14d(retailer.id, sku.id, dailyRecords);
      const latest = dailyRecords
        .filter((r) => r.retailerId === retailer.id && r.skuId === sku.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const stock = latest ? latest.closingStock : 10;
      const cover = calculateDaysOfCover(stock, avg);
      return { sku, stock, avg, cover };
    })
    .filter((i) => i.cover <= 1.5 || i.stock <= 3)
    .sort((a, b) => a.cover - b.cover);

  // Next expected delivery
  const pendingOrder = orders.find(
    (o) => o.retailerId === retailer.id && (o.status === 'OUT_FOR_DELIVERY' || o.status === 'ACCEPTED')
  );

  // Read aloud summary handler
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();

    let textToSpeak = '';
    if (lang === 'hi') {
      textToSpeak = `नमस्ते ${retailer.ownerName}. आपकी दुकान ${retailer.name} में ${lowStockAlerts.length} उत्पादों का स्टॉक कम है। आज की बिक्री दर्ज करने के लिए नीचे दिए गए बटन पर टैप करें।`;
    } else if (lang === 'mr') {
      textToSpeak = `नमस्कार ${retailer.ownerName}. तुमच्या दुकानात ${lowStockAlerts.length} वस्तूंचा साठा कमी आहे. आजची विक्री नोंदवण्यासाठी खालील बटणावर टॅप करा.`;
    } else {
      textToSpeak = `Hello ${retailer.ownerName}. In your store ${retailer.name}, ${lowStockAlerts.length} items are running low on stock. Tap the button below to log today's sales.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveAndTriggerUndo = (entries: ExtractedSaleEntry[], source: any, corrections: number) => {
    onSaveSales(entries, source, corrections);
    setIsCapturing(false);
    setActiveTab('home');

    setUndoBanner({
      show: true,
      message: lang === 'hi' ? 'बिक्री सुरक्षित रूप से दर्ज हो गई!' : lang === 'mr' ? 'विक्री यशस्वीपणे सेव्ह झाली!' : 'Sales saved successfully!',
    });

    setTimeout(() => {
      setUndoBanner((prev) => ({ ...prev, show: false }));
    }, 10000);
  };

  const handleUndo = () => {
    undoLastSaleLog();
    setUndoBanner({ show: false, message: '' });
  };

  const handleGuideClose = () => {
    localStorage.setItem('hul_guide_seen', 'true');
    setShowGuide(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24">
      {/* Undo Notification Banner (10s duration) */}
      {undoBanner.show && (
        <div className="bg-[#1A1A1A] text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{undoBanner.message} {lang === 'hi' ? 'गलती हो गई?' : lang === 'mr' ? 'चूक झाली का?' : 'Made a mistake?'}</span>
          </div>
          <button
            onClick={handleUndo}
            className="min-h-[44px] px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पूर्ववत करें (Undo)' : lang === 'mr' ? 'पूर्ववत करा (Undo)' : 'Undo'}</span>
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500">
            {lang === 'hi' ? 'किराना स्टोर पार्टनर' : lang === 'mr' ? 'किराणा भागीदार' : 'Kirana Retail Partner'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
            {lang === 'hi' ? `नमस्ते, ${retailer.ownerName}` : lang === 'mr' ? `नमस्कार, ${retailer.ownerName}` : `Namaste, ${retailer.ownerName}`}
          </h2>
          <div className="text-xs text-slate-600 mt-0.5">
            {retailer.name} · {retailer.area}
          </div>
        </div>

        {/* Header Action Buttons (Download CSV, Read Aloud, Guide) */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className="min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title={lang === 'hi' ? 'बोलकर सुनें' : lang === 'mr' ? 'ऐका' : 'Read aloud'}
          >
            <Volume2 className="w-4 h-4 text-[#1F3FB5]" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'बोलकर सुनें' : lang === 'mr' ? 'ऐका' : 'Read aloud'}</span>
          </button>

          {/* Download CSV Button */}
          <button
            onClick={() => setShowCsvModal(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#1F3FB5]" />
            <span>{t('download', lang)} CSV</span>
          </button>

          {/* Help / Guide Icon */}
          <button
            onClick={() => setShowGuide(true)}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-blue-50 text-[#1F3FB5] hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
            title="How to use this app"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'मदद गाइड' : lang === 'mr' ? 'मदत' : 'Guide'}</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      {isCapturing ? (
        <RetailerCapture
          skus={skus}
          defaultTier={retailer.tier}
          onSaveSales={handleSaveAndTriggerUndo}
          onCancel={() => setIsCapturing(false)}
        />
      ) : (
        <>
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Today's Sales Card */}
              <TodaysSalesCard
                retailer={retailer}
                skus={skus}
                dailyRecords={dailyRecords}
                onLogSalesClick={() => setIsCapturing(true)}
              />

              {/* Big "Record Sales" Primary Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-black text-[#1A1A1A]">
                    {lang === 'hi' ? 'आज की बिक्री और बचा हुआ स्टॉक दर्ज करें' : lang === 'mr' ? 'आजची विक्री आणि शिल्लक साठा नोंदवा' : 'Record Today’s Sales & Closing Stock'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md">
                    {lang === 'hi'
                      ? 'अपनी सुविधानुसार बोलकर, डायरी का फोटो लेकर, टाइप करके या बिलिंग मशीन से 30 सेकंड में दर्ज करें।'
                      : lang === 'mr'
                      ? 'तुमच्या सोयीनुसार बोलून, वहीचा फोटो काढून, टाईप करून किंवा बिलिंग मशीनद्वारे ३० सेकंदात नोंदवा.'
                      : 'Fast and easy: speak, take a photo of your notebook, type, or pull from billing machine.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsCapturing(true)}
                  className="w-full sm:w-auto min-h-[56px] px-8 py-3 rounded-lg bg-[#1F3FB5] hover:bg-[#162e87] text-white font-extrabold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>{lang === 'hi' ? 'बिक्री दर्ज करें' : lang === 'mr' ? 'विक्री नोंदवा' : 'Record Sales Now'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery & Urgent Restock Quick Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Expected Delivery */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {lang === 'hi' ? 'अगली डिलीवरी' : lang === 'mr' ? 'पुढील डिलिव्हरी' : 'Next Delivery'}
                    </span>
                    <Clock className="w-4 h-4 text-[#1F3FB5]" />
                  </div>
                  <div className="text-base font-extrabold text-[#1A1A1A]">
                    {pendingOrder ? pendingOrder.slot : (lang === 'hi' ? 'कल सुबह 8:00 - 11:00 AM' : lang === 'mr' ? 'उद्या सकाळी ८:०० - ११:०० AM' : 'Tomorrow 8:00 - 11:00 AM')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{pendingOrder ? `Order #${pendingOrder.orderNumber}` : (lang === 'hi' ? 'नियमित 24 घंटे डिलीवरी स्लॉट' : lang === 'mr' ? 'नियमित २४ तास डिलिव्हरी स्लॉट' : 'Standard 24-hr slot')}</span>
                    <button
                      onClick={() => {
                        setActiveTab('order');
                        setOrderSubTab('tracking');
                      }}
                      className="text-[#1F3FB5] font-bold hover:underline"
                    >
                      {lang === 'hi' ? 'विवरण →' : lang === 'mr' ? 'तपशील →' : 'View →'}
                    </button>
                  </div>
                </div>

                {/* Items Running Low */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t('lowStock', lang)}
                    </span>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-base font-extrabold text-red-600">
                    {lowStockAlerts.length} {lang === 'hi' ? 'सामान कम हैं' : lang === 'mr' ? 'वस्तू कमी आहेत' : 'items need restocking'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{lang === 'hi' ? 'स्टॉक खत्म होने का जोखिम' : lang === 'mr' ? 'साठा संपण्याचा धोका' : 'Risk of running out'}</span>
                    <button
                      onClick={() => setActiveTab('order')}
                      className="text-[#1F3FB5] font-bold hover:underline"
                    >
                      {t('placeOrder', lang)} →
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Running Low List */}
              {lowStockAlerts.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">
                      {lang === 'hi' ? 'ये सामान जल्द खत्म होने वाले हैं' : lang === 'mr' ? 'या वस्तू लवकरच संपणार आहेत' : 'Items Running Low Soon'}
                    </h4>
                    <button
                      onClick={() => setActiveTab('stock')}
                      className="text-xs font-bold text-[#1F3FB5] hover:underline"
                    >
                      {lang === 'hi' ? 'पूरा स्टॉक देखें →' : lang === 'mr' ? 'सर्व साठा पहा →' : 'See all stock →'}
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {lowStockAlerts.slice(0, 4).map((alert) => (
                      <div key={alert.sku.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm text-[#1A1A1A]">{alert.sku.name}</div>
                          <div className="text-xs text-slate-500">
                            {lang === 'hi' ? `${alert.stock} पीस बचे हैं` : lang === 'mr' ? `${alert.stock} नग शिल्लक आहेत` : `${alert.stock} units left`}
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-300">
                          {t('willLastDays', lang, { days: alert.cover <= 1 ? (alert.cover === 0 ? '0' : '< 1') : Math.round(alert.cover) })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY STOCK */}
          {activeTab === 'stock' && (
            <RetailerStock
              retailerId={retailer.id}
              skus={skus}
              dailyRecords={dailyRecords}
              onOpenHowCalculated={onOpenHowCalculated}
            />
          )}

          {/* TAB 3: ORDER (with create / tracking toggle) */}
          {activeTab === 'order' && (
            <div className="space-y-4">
              {/* Sub-tab toggle */}
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 w-fit">
                <button
                  onClick={() => setOrderSubTab('create')}
                  className={`min-h-[44px] px-4 py-2 rounded-md font-bold text-xs transition-colors ${
                    orderSubTab === 'create'
                      ? 'bg-[#1F3FB5] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t('placeOrder', lang)}
                </button>
                <button
                  onClick={() => setOrderSubTab('tracking')}
                  className={`min-h-[44px] px-4 py-2 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors ${
                    orderSubTab === 'tracking'
                      ? 'bg-[#1F3FB5] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'ऑर्डर की स्थिति' : lang === 'mr' ? 'ऑर्डर स्थिती' : 'Track Orders'}</span>
                </button>
              </div>

              {orderSubTab === 'create' ? (
                <RetailerOrder
                  retailer={retailer}
                  skus={skus}
                  dailyRecords={dailyRecords}
                  deliverySlots={deliverySlots}
                  onPlaceOrder={(items, slotId) => {
                    onPlaceOrder(items, slotId);
                    setOrderSubTab('tracking');
                  }}
                  onRequestVisit={(date, slot, reason) => {
                    onRequestVisit(date, slot, reason);
                  }}
                />
              ) : (
                <RetailerOrdersList
                  orders={orders}
                  retailerId={retailer.id}
                />
              )}
            </div>
          )}

          {/* TAB 4: HELP & SUPPORT */}
          {activeTab === 'help' && (
            <HelpPanel
              userRole="retailer"
              userName={retailer.ownerName}
              userPhone={retailer.phone}
              salesmanName="Rahul (TSO)"
              salesmanPhone="+91 98200 45678"
            />
          )}
        </>
      )}

      {/* 4-ITEM BOTTOM NAVIGATION BAR - Minimum 56px height per item */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40">
        <div className="max-w-4xl mx-auto grid grid-cols-4 px-2 py-1.5">
          <button
            onClick={() => {
              setIsCapturing(false);
              setActiveTab('home');
            }}
            className={`min-h-[56px] rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'home' && !isCapturing
                ? 'text-[#1F3FB5] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">{lang === 'hi' ? 'होम' : lang === 'mr' ? 'होम' : 'Home'}</span>
          </button>

          <button
            onClick={() => {
              setIsCapturing(false);
              setActiveTab('stock');
            }}
            className={`min-h-[56px] rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'stock'
                ? 'text-[#1F3FB5] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs">{t('myStock', lang)}</span>
          </button>

          <button
            onClick={() => {
              setIsCapturing(false);
              setActiveTab('order');
            }}
            className={`min-h-[56px] rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'order'
                ? 'text-[#1F3FB5] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-1" />
            <span className="text-xs">{t('placeOrder', lang)}</span>
          </button>

          <button
            onClick={() => {
              setIsCapturing(false);
              setActiveTab('help');
            }}
            className={`min-h-[56px] rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'help'
                ? 'text-[#1F3FB5] font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">{t('helpline', lang)}</span>
          </button>
        </div>
      </nav>

      {/* CSV Download Modal */}
      {showCsvModal && (
        <CsvDownloadModal
          role="retailer"
          retailerId={retailer.id}
          onClose={() => setShowCsvModal(false)}
        />
      )}

      {/* First-time Guide Walkthrough */}
      {showGuide && (
        <FirstTimeGuide onClose={handleGuideClose} />
      )}
    </div>
  );
}
