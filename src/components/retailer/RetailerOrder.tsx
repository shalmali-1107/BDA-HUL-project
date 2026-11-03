import { useState } from 'react';
import {
  ShoppingBag,
  Calendar,
  Clock,
  Phone,
  Check,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { SKU, DailyRecord, DeliverySlot, Retailer } from '../../types';
import { calculateSkuForecast } from '../../services/analytics';
import { useStore } from '../../services/store';
import { t, formatRupees } from '../../i18n/translations';

interface Props {
  retailer: Retailer;
  skus: SKU[];
  dailyRecords: DailyRecord[];
  deliverySlots: DeliverySlot[];
  onPlaceOrder: (items: any[], slotId: string) => void;
  onRequestVisit: (date: string, slot: string, reason: string) => void;
}

export function RetailerOrder({
  retailer,
  skus,
  dailyRecords,
  deliverySlots,
  onPlaceOrder,
  onRequestVisit,
}: Props) {
  const { state } = useStore();
  const lang = state.language;

  const [activeMode, setActiveMode] = useState<'self' | 'rep'>('self');

  // Pre-fill suggested basket from demand forecast
  const [basket, setBasket] = useState(() => {
    return skus
      .map((sku) => {
        const forecast = calculateSkuForecast(retailer.id, sku, dailyRecords, 7);
        const cases = forecast.recommendedOrderCases > 0 ? forecast.recommendedOrderCases : forecast.status === 'REFILL_TODAY' ? 1 : 0;
        return {
          skuId: sku.id,
          skuName: sku.name,
          cases,
          units: cases * sku.caseSize,
          pricePerUnit: sku.retailerPrice,
          caseSize: sku.caseSize,
          urgency: forecast.status,
          daysOfCover: forecast.daysOfCover,
        };
      })
      .filter((item) => item.cases > 0 || item.urgency === 'REFILL_TODAY');
  });

  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    deliverySlots.find((s) => s.isAvailable)?.id || deliverySlots[0]?.id || ''
  );

  // Visit Request Form state
  const [visitDate, setVisitDate] = useState('2026-11-03');
  const [visitSlot, setVisitSlot] = useState('11:00 AM – 1:00 PM');
  const [visitReason, setVisitReason] = useState(
    lang === 'hi' ? 'दिवाली स्कीम और सर्फ एक्सेल 1kg के मार्जिन पर बात करनी है।' : lang === 'mr' ? 'दिवाळी स्कीम आणि सर्फ एक्सेल मार्जिनवर चर्चा करायची आहे.' : 'Clarification needed on upcoming festival discount schemes.'
  );
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  // Update basket cases
  const updateCases = (index: number, newCases: number) => {
    setBasket((prev) => {
      const copy = [...prev];
      const safe = Math.max(0, newCases);
      copy[index] = {
        ...copy[index],
        cases: safe,
        units: safe * copy[index].caseSize,
      };
      return copy;
    });
  };

  const removeBasketItem = (index: number) => {
    setBasket((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCases = basket.reduce((acc, item) => acc + item.cases, 0);
  const totalAmount = basket.reduce((acc, item) => acc + item.units * item.pricePerUnit, 0);

  const selectedSlot = deliverySlots.find((s) => s.id === selectedSlotId);

  const handleOrderSubmit = () => {
    if (basket.length === 0 || totalCases === 0) {
      alert(lang === 'hi' ? 'कृपया ऑर्डर करने के लिए कम से कम 1 पेटी चुनें।' : lang === 'mr' ? 'कृपया ऑर्डर करण्यासाठी किमान १ पेटी निवडा.' : 'Please select at least 1 case before placing order.');
      return;
    }
    const orderItems = basket
      .filter((b) => b.cases > 0)
      .map((b) => ({
        skuId: b.skuId,
        skuName: b.skuName,
        cases: b.cases,
        units: b.units,
        pricePerUnit: b.pricePerUnit,
        totalPrice: b.units * b.pricePerUnit,
      }));

    onPlaceOrder(orderItems, selectedSlotId);
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitReason.trim()) return;
    onRequestVisit(visitDate, visitSlot, visitReason);
    setVisitSubmitted(true);
    setTimeout(() => setVisitSubmitted(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* 2 Clear Options Toggle - 56px minimum height */}
      <div className="grid grid-cols-2 gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveMode('self')}
          className={`min-h-[56px] p-3 rounded-lg text-left flex items-center gap-3 transition-all ${
            activeMode === 'self'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="p-2 rounded-md bg-white/10 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">
              {lang === 'hi' ? '1. स्वयं ऑर्डर दें' : lang === 'mr' ? '१. स्वतः ऑर्डर द्या' : '1. Order Myself'}
            </div>
            <div className="text-xs opacity-85 hidden sm:block">
              {lang === 'hi' ? 'सुझाए गए सामान की लिस्ट से' : lang === 'mr' ? 'सुचवलेल्या वस्तूंच्या यादीतून' : 'Suggested refill basket'}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveMode('rep')}
          className={`min-h-[56px] p-3 rounded-lg text-left flex items-center gap-3 transition-all ${
            activeMode === 'rep'
              ? 'bg-[#1F3FB5] text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="p-2 rounded-md bg-white/10 shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">
              {lang === 'hi' ? '2. सेल्समैन को बुलाएँ' : lang === 'mr' ? '२. सेल्समनला बोलवा' : '2. Call My Salesman'}
            </div>
            <div className="text-xs opacity-85 hidden sm:block">
              {lang === 'hi' ? 'दुकान पर विज़िट का अनुरोध करें' : lang === 'mr' ? 'दुकानात भेटीची विनंती करा' : 'Request shop visit'}
            </div>
          </div>
        </button>
      </div>

      {/* MODE 1: SELF ORDER */}
      {activeMode === 'self' && (
        <div className="space-y-4">
          {/* Suggested Refill Basket */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-[#1A1A1A] flex items-center gap-2">
                  <span>{lang === 'hi' ? 'सुझाई गई रीफिल लिस्ट' : lang === 'mr' ? 'सुचवलेली साठा यादी' : 'Suggested Refill Basket'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'hi'
                    ? 'आपकी हालिया बिक्री के आधार पर तैयार किया गया'
                    : lang === 'mr'
                    ? 'तुमच्या अलीकडील विक्रीवर आधारित तयार केलेली'
                    : 'Generated based on your recent sales rate'}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs text-slate-500 block">{t('totalUnits', lang)}</span>
                <span className="text-sm font-black text-[#1F3FB5]">
                  {totalCases} {lang === 'hi' ? 'पेटी' : lang === 'mr' ? 'पेट्या' : 'cases'} ({basket.reduce((a, b) => a + b.units, 0)} {lang === 'hi' ? 'पीस' : lang === 'mr' ? 'नग' : 'units'})
                </span>
              </div>
            </div>

            {/* Basket Items List */}
            {basket.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {lang === 'hi' ? 'बास्केट खाली है।' : lang === 'mr' ? 'बास्केट रिकामी आहे.' : 'Your refill basket is empty.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {basket.map((item, idx) => (
                  <div key={item.skuId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]">{item.skuName}</span>
                        {item.urgency === 'REFILL_TODAY' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">
                            {t('lowStock', lang)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.caseSize} {lang === 'hi' ? 'पीस प्रति पेटी' : lang === 'mr' ? 'नग प्रति पेटी' : 'units/case'} · {formatRupees(item.pricePerUnit)}/{lang === 'hi' ? 'पीस' : lang === 'mr' ? 'नग' : 'unit'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Case Quantity Stepper - Minimum 44px tap targets */}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateCases(idx, item.cases - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-12 text-center text-sm font-black text-[#1A1A1A] bg-white h-10 flex items-center justify-center border-x border-slate-300">
                          {item.cases}
                        </div>
                        <button
                          onClick={() => updateCases(idx, item.cases + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <div className="text-sm font-black text-[#1A1A1A]">
                          {formatRupees(item.units * item.pricePerUnit)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.units} {lang === 'hi' ? 'पीस' : lang === 'mr' ? 'नग' : 'units'}
                        </div>
                      </div>

                      <button
                        onClick={() => removeBasketItem(idx)}
                        className="text-slate-400 hover:text-red-600 p-2"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total and Delivery Slot Selector */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {lang === 'hi' ? 'डिलीवरी का समय चुनें (24 घंटे गारंटी)' : lang === 'mr' ? 'डिलिव्हरी वेळ निवडा (२४ तास हमी)' : 'Choose Delivery Slot (24-Hour Guarantee)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {deliverySlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`min-h-[56px] p-3 rounded-lg border text-left transition-all ${
                        selectedSlotId === slot.id
                          ? 'border-[#1F3FB5] bg-blue-50/50 ring-1 ring-[#1F3FB5]'
                          : !slot.isAvailable
                          ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={selectedSlotId === slot.id ? 'text-[#1F3FB5]' : 'text-slate-700'}>
                          {slot.label}
                        </span>
                        {selectedSlotId === slot.id && <Check className="w-4 h-4 text-[#1F3FB5]" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {slot.date} · {slot.bookedCases}/{slot.maxCases} cases booked
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* HUL 24-Hour Guarantee Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? '24 घंटे डिलीवरी गारंटी: समय पर डिलीवरी न होने पर ₹100 का क्रेडिट मिलेगा।'
                    : lang === 'mr'
                    ? '२४ तास डिलिव्हरी हमी: वेळेवर डिलिव्हरी न मिळाल्यास ₹१०० चे क्रेडिट मिळेल.'
                    : '24-hour delivery guarantee: ₹100 credit if not delivered within selected slot.'}
                </span>
              </div>

              {/* Order Summary & Submit Button - Minimum 56px height */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div>
                  <div className="text-xs text-slate-500">{t('totalAmount', lang)}</div>
                  <div className="text-2xl font-black text-[#1A1A1A]">{formatRupees(totalAmount)}</div>
                </div>

                <button
                  onClick={handleOrderSubmit}
                  className="w-full sm:w-auto min-h-[56px] px-8 py-3 rounded-lg bg-[#1F3FB5] hover:bg-[#162e87] text-white font-extrabold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('placeOrder', lang)} ({formatRupees(totalAmount)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CALL / REQUEST VISIT */}
      {activeMode === 'rep' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          {/* Salesperson Card */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1F3FB5] font-black text-lg flex items-center justify-center border border-blue-200 shrink-0">
                R
              </div>
              <div>
                <h4 className="font-bold text-base text-[#1A1A1A]">
                  Rahul (Territory Sales Officer)
                </h4>
                <p className="text-xs text-slate-500">
                  Wadala East Zone · +91 98200 45678
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{lang === 'hi' ? 'आज इस इलाके में उपलब्ध' : lang === 'mr' ? 'आज या भागात उपलब्ध' : 'Available in your area today'}</span>
                </div>
              </div>
            </div>

            <a
              href="tel:+919820045678"
              className="w-full sm:w-auto min-h-[56px] px-6 py-3 rounded-lg bg-[#1F3FB5] hover:bg-[#162e87] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t('callSalesman', lang)}</span>
            </a>
          </div>

          {/* Request Visit Form */}
          <form onSubmit={handleVisitSubmit} className="space-y-4">
            <h4 className="font-extrabold text-sm text-[#1A1A1A]">
              {lang === 'hi' ? 'दुकान पर विज़िट का अनुरोध भेजें' : lang === 'mr' ? 'दुकानात भेटीची विनंती पाठवा' : 'Schedule Shop Visit'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'पसंदीदा तारीख' : lang === 'mr' ? 'पसंतीची तारीख' : 'Preferred Date'}
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'समय' : lang === 'mr' ? 'वेळ' : 'Time Window'}
                </label>
                <select
                  value={visitSlot}
                  onChange={(e) => setVisitSlot(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
                >
                  <option>9:00 AM – 11:00 AM</option>
                  <option>11:00 AM – 1:00 PM</option>
                  <option>2:00 PM – 4:00 PM</option>
                  <option>4:00 PM – 6:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'मुद्दा / क्या बात करनी है?' : lang === 'mr' ? 'मुद्दा / काय चर्चा करायची आहे?' : 'Reason for Visit'}
              </label>
              <textarea
                rows={3}
                value={visitReason}
                onChange={(e) => setVisitReason(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे स्कीम, डिस्काउंट या नए प्रोडक्ट की जानकारी...' : lang === 'mr' ? 'जसे की योजना, सूट किंवा नवीन वस्तूंची माहिती...' : 'e.g., questions about schemes, damaged stock replacement, margin...'}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {visitSubmitted ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  {lang === 'hi'
                    ? 'अनुरोध भेज दिया गया है! राहुल को नोटिफिकेशन मिल गया है।'
                    : lang === 'mr'
                    ? 'विनंती पाठवली गेली आहे! राहुलला सूचना मिळाली आहे.'
                    : 'Visit request submitted! Rahul has been notified.'}
                </span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[56px] px-8 py-3 rounded-lg bg-[#1F3FB5] hover:bg-[#162e87] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{lang === 'hi' ? 'विज़िट अनुरोध सबमिट करें' : lang === 'mr' ? 'भेट विनंती सबमिट करा' : 'Send Visit Request'}</span>
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
