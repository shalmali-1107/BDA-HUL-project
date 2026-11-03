import { useState } from 'react';
import {
  Briefcase,
  Route,
  Inbox,
  HelpCircle,
  X,
} from 'lucide-react';
import { Retailer, SKU, DailyRecord, VisitRequest, Order, DeliverySlot } from '../../types';
import { SalespersonVisitPlan } from './SalespersonVisitPlan';
import { SalespersonRetailerDetail } from './SalespersonRetailerDetail';
import { SalespersonVisitInbox } from './SalespersonVisitInbox';
import { HelpPanel } from '../common/HelpPanel';
import { useStore } from '../../services/store';
import { t } from '../../i18n/translations';

interface Props {
  retailers: Retailer[];
  skus: SKU[];
  dailyRecords: DailyRecord[];
  visitRequests: VisitRequest[];
  orders: Order[];
  deliverySlots: DeliverySlot[];
  onSubmitTriangulation: (retailerId: string, audits: any[], notes: string) => void;
  onPlaceOrderForRetailer: (retailerId: string, items: any[], slotId: string) => void;
  onAcceptVisitRequest: (requestId: string) => void;
  onOpenHowCalculated: () => void;
  overriddenOrder: string[];
  onReorder: (newOrder: string[]) => void;
}

export function SalespersonDashboard({
  retailers,
  skus,
  dailyRecords,
  visitRequests,
  orders,
  deliverySlots,
  onSubmitTriangulation,
  onPlaceOrderForRetailer,
  onAcceptVisitRequest,
  onOpenHowCalculated,
  overriddenOrder,
  onReorder,
}: Props) {
  const { state } = useStore();
  const lang = state.language;

  const [activeTab, setActiveTab] = useState<'plan' | 'inbox'>('plan');
  const [selectedRetailerId, setSelectedRetailerId] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const pendingRequestsCount = visitRequests.filter((v) => v.status === 'PENDING').length;
  const selectedRetailer = retailers.find((r) => r.id === selectedRetailerId);

  // If a retailer is selected for visit/triangulation, show their detail screen
  if (selectedRetailer) {
    return (
      <SalespersonRetailerDetail
        retailer={selectedRetailer}
        skus={skus}
        dailyRecords={dailyRecords}
        orders={orders}
        deliverySlots={deliverySlots}
        onBack={() => setSelectedRetailerId(null)}
        onSubmitTriangulation={(audits, notes) => {
          onSubmitTriangulation(selectedRetailer.id, audits, notes);
        }}
        onPlaceOrderForRetailer={(items, slotId) => {
          onPlaceOrderForRetailer(selectedRetailer.id, items, slotId);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Sales Officer Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#1F3FB5] text-white flex items-center justify-center font-extrabold shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'hi' ? 'एचयूएल फील्ड टेरिटरी ऑफिसर' : lang === 'mr' ? 'एचयूएल फील्ड टेरिटरी ऑफिसर' : 'HUL Field Territory Officer'}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#1A1A1A]">
              {lang === 'hi' ? 'राहुल का फील्ड डैशबोर्ड' : lang === 'mr' ? 'राहुलचे फील्ड डॅशबोर्ड' : 'Rahul’s Field Dashboard'}
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'hi' ? 'मुंबई ईस्ट जोन · 10 किराना स्टोर्स' : lang === 'mr' ? 'मुंबई ईस्ट झोन · १० किराणा दुकाने' : 'Mumbai East Sub-Territory · 10 Active Kirana Accounts'}
            </p>
          </div>
        </div>

        {/* Tab switch pills & Help button */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('plan')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'plan'
                  ? 'bg-white text-[#1F3FB5] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'दुकान विज़िट प्लान' : lang === 'mr' ? 'दुकान भेट नियोजन' : 'Visit Plan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'inbox'
                  ? 'bg-white text-[#1F3FB5] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'दुकानों से अनुरोध' : lang === 'mr' ? 'दुकानांच्या विनंत्या' : 'Store Requests'}</span>
              {pendingRequestsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Helpline & Support"
          >
            <HelpCircle className="w-4 h-4 text-[#1F3FB5]" />
            <span className="hidden sm:inline">{t('helpline', lang)}</span>
          </button>
        </div>
      </div>

      {/* Plan Tab */}
      {activeTab === 'plan' && (
        <SalespersonVisitPlan
          retailers={retailers}
          skus={skus}
          dailyRecords={dailyRecords}
          visitRequests={visitRequests}
          onSelectRetailer={(id) => setSelectedRetailerId(id)}
          onOpenHowCalculated={onOpenHowCalculated}
          overriddenOrder={overriddenOrder}
          onReorder={onReorder}
        />
      )}

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <SalespersonVisitInbox
          requests={visitRequests}
          onAccept={onAcceptVisitRequest}
          onReschedule={(id) => alert(`Reschedule notice sent to retailer for request #${id}`)}
        />
      )}

      {/* Support Modal */}
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
              userRole="salesperson"
              userName="Rahul (TSO)"
              userPhone="+91 98200 45678"
            />
          </div>
        </div>
      )}
    </div>
  );
}
