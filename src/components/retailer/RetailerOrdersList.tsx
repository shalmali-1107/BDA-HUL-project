import { useState } from 'react';
import { Order } from '../../types';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  AlertCircle,
  Gift,
} from 'lucide-react';
import { useStore } from '../../services/store';
import { t, formatRupees, formatDateLocale } from '../../i18n/translations';

interface Props {
  orders: Order[];
  retailerId: string;
}

export function RetailerOrdersList({ orders, retailerId }: Props) {
  const { state } = useStore();
  const lang = state.language;

  const retailerOrders = orders.filter((o) => o.retailerId === retailerId);

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PLACED':
        return lang === 'hi' ? 'ऑर्डर दर्ज' : lang === 'mr' ? 'नोंदवले' : 'Placed';
      case 'ACCEPTED':
        return lang === 'hi' ? 'स्वीकृत / पैकिंग' : lang === 'mr' ? 'स्वीकृत / पॅकिंग' : 'Packing at Depot';
      case 'OUT_FOR_DELIVERY':
        return lang === 'hi' ? 'गाड़ी निकल चुकी है' : lang === 'mr' ? 'वाहन निघाले आहे' : 'Out for Delivery';
      case 'DELIVERED':
        return lang === 'hi' ? 'डिलीवर हो गया' : lang === 'mr' ? 'डिलिव्हर झाले' : 'Delivered';
    }
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'PLACED':
        return 1;
      case 'ACCEPTED':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top rep contact quick banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1F3FB5] font-black flex items-center justify-center text-sm border border-blue-200 shrink-0">
            R
          </div>
          <div>
            <div className="text-sm font-bold text-[#1A1A1A]">
              Rahul (HUL Sales Officer)
            </div>
            <div className="text-xs text-slate-500">
              Wadala East · +91 98200 45678
            </div>
          </div>
        </div>

        <a
          href="tel:+919820045678"
          className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F3FB5] hover:bg-[#162e87] text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>{t('callSalesman', lang)}</span>
        </a>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {retailerOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
            {lang === 'hi' ? 'अभी कोई ऑर्डर नहीं है।' : lang === 'mr' ? 'सध्या कोणतीही ऑर्डर नाही.' : 'No orders placed yet. Tap Order tab to place one.'}
          </div>
        ) : (
          retailerOrders.map((order) => {
            const step = getStatusStep(order.status);
            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs space-y-4 transition-all ${
                  order.isBreached ? 'border-amber-400 bg-amber-50/15' : 'border-slate-200'
                }`}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#1A1A1A]">
                        Order #{order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : order.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatDateLocale(order.slotDate || order.createdAt.split('T')[0], lang)} · {t('delivery', lang)} {order.slot}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black text-[#1A1A1A]">
                      {formatRupees(order.totalAmount)}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {order.items.reduce((acc, i) => acc + i.cases, 0)} {lang === 'hi' ? 'पेटी' : lang === 'mr' ? 'पेट्या' : 'cases'} ({order.items.reduce((acc, i) => acc + i.units, 0)} {lang === 'hi' ? 'पीस' : lang === 'mr' ? 'नग' : 'units'})
                    </span>
                  </div>
                </div>

                {/* Progress Step Bar */}
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-center">
                    <span className={step >= 1 ? 'text-[#1F3FB5]' : 'text-slate-400'}>
                      1. {lang === 'hi' ? 'दर्ज' : lang === 'mr' ? 'नोंदवले' : 'Placed'}
                    </span>
                    <span className={step >= 2 ? 'text-[#1F3FB5]' : 'text-slate-400'}>
                      2. {lang === 'hi' ? 'डिपो पैकिंग' : lang === 'mr' ? 'डिपो पॅकिंग' : 'Depot Packed'}
                    </span>
                    <span className={step >= 3 ? 'text-[#1F3FB5]' : 'text-slate-400'}>
                      3. {lang === 'hi' ? 'रास्ते में' : lang === 'mr' ? 'मार्गावर' : 'On Truck'}
                    </span>
                    <span className={step >= 4 ? 'text-emerald-700' : 'text-slate-400'}>
                      4. {lang === 'hi' ? 'पहुँच गया' : lang === 'mr' ? 'पोहोचले' : 'Delivered'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        step === 4 ? 'bg-emerald-600' : 'bg-[#1F3FB5]'
                      }`}
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Breached SLA compensation banner */}
                {order.isBreached && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>{lang === 'hi' ? '₹100 क्रेडिट लागू:' : lang === 'mr' ? '₹१०० क्रेडिट लागू:' : '₹100 Credit applied:'}</strong>{' '}
                        {order.breachReason || '24-hour delivery window delayed'}
                      </span>
                    </div>
                    <span className="font-extrabold text-amber-800 shrink-0">+₹100 Wallet</span>
                  </div>
                )}

                {/* Item List Summary */}
                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'ऑर्डर किए गए उत्पाद:' : lang === 'mr' ? 'ऑर्डर केलेल्या वस्तू:' : 'Order Items:'}
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>
                        {item.skuName} ({item.cases} {lang === 'hi' ? 'पेटी' : lang === 'mr' ? 'पेट्या' : 'cases'} / {item.units} {lang === 'hi' ? 'पीस' : lang === 'mr' ? 'नग' : 'units'})
                      </span>
                      <span className="font-medium text-[#1A1A1A]">{formatRupees(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
