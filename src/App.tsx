import { useState, useEffect } from 'react';
import { appStore, UserRole, AppState } from './services/store';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ReminderBanner } from './components/common/ReminderBanner';
import { AboutModal } from './components/common/AboutModal';
import { HowCalculatedModal } from './components/common/HowCalculatedModal';
import { LoginScreen } from './components/auth/LoginScreen';
import { RetailerDashboard } from './components/retailer/RetailerDashboard';
import { SalespersonDashboard } from './components/salesperson/SalespersonDashboard';
import { DistributorDashboard } from './components/distributor/DistributorDashboard';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => appStore.getState());
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in as Retailer
  const [showAbout, setShowAbout] = useState(false);
  const [showHowCalculated, setShowHowCalculated] = useState(false);
  const [activeToast, setActiveToast] = useState<{ message: string; type: string } | null>(null);

  // Subscribe to central reactive store
  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      const newState = appStore.getState();
      setState({ ...newState });

      // Trigger toast on fresh notification
      if (newState.lastNotification && newState.lastNotification.id !== 'init') {
        setActiveToast({
          message: newState.lastNotification.message,
          type: newState.lastNotification.type,
        });
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, []);

  const handleLoginAs = (role: UserRole) => {
    appStore.setActiveRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Find active retailer (default: Sharma General Store)
  const currentRetailer =
    state.retailers.find((r) => r.id === state.selectedRetailerId) || state.retailers[0];

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#1A1A1A] flex flex-col font-sans">
      {/* If not logged in, render role login screen */}
      {!isLoggedIn ? (
        <>
          <LoginScreen
            onLoginAs={handleLoginAs}
            onOpenAbout={() => setShowAbout(true)}
          />
          <Footer />
        </>
      ) : (
        <>
          {/* Main App Header */}
          <Header
            currentRole={state.activeRole}
            is10pmActive={state.simulationReminder10pmActive}
            onToggle10pm={() => appStore.set10pmReminderSimulation(!state.simulationReminder10pmActive)}
            onOpenAbout={() => setShowAbout(true)}
            onOpenHowCalculated={() => setShowHowCalculated(true)}
            onLogout={handleLogout}
          />

          {/* 10 PM Nightly Reminder Simulation Banner */}
          {state.simulationReminder10pmActive && (
            <ReminderBanner
              retailer={currentRetailer}
              onDismiss={() => appStore.set10pmReminderSimulation(false)}
              onActionClick={() => {
                appStore.setActiveRole('retailer');
              }}
            />
          )}

          {/* Toast Notification Banner for Live Synchronisation */}
          {activeToast && (
            <div className="sticky top-14 z-50 px-4 py-2 bg-[#1F3FB5] text-white text-xs font-semibold shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
                <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="truncate">{activeToast.message}</span>
              </div>
              <button
                onClick={() => setActiveToast(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Dashboard Router */}
          <main className="flex-1 p-3 sm:p-5 lg:p-6">
            {state.activeRole === 'retailer' && (
              <RetailerDashboard
                retailer={currentRetailer}
                skus={state.skus}
                dailyRecords={state.dailyRecords}
                deliverySlots={state.deliverySlots}
                orders={state.orders}
                onSaveSales={(entries, source, corrections) => {
                  appStore.logSalesBatch(currentRetailer.id, entries, source, corrections);
                }}
                onPlaceOrder={(items, slotId) => {
                  appStore.placeOrder({
                    retailerId: currentRetailer.id,
                    items,
                    slotId,
                    placedBy: 'retailer',
                  });
                }}
                onRequestVisit={(date, slot, reason) => {
                  appStore.requestSalespersonVisit(currentRetailer.id, date, slot, reason);
                }}
                onOpenHowCalculated={() => setShowHowCalculated(true)}
              />
            )}

            {state.activeRole === 'salesperson' && (
              <SalespersonDashboard
                retailers={state.retailers}
                skus={state.skus}
                dailyRecords={state.dailyRecords}
                visitRequests={state.visitRequests}
                orders={state.orders}
                deliverySlots={state.deliverySlots}
                overriddenOrder={state.overriddenPriorityOrder}
                onReorder={(order) => appStore.setOverriddenPriorityOrder(order)}
                onSubmitTriangulation={(retailerId, audits, notes) => {
                  appStore.submitTriangulationAudit(retailerId, audits, notes);
                }}
                onPlaceOrderForRetailer={(retailerId, items, slotId) => {
                  appStore.placeOrder({
                    retailerId,
                    items,
                    slotId,
                    placedBy: 'salesperson',
                    salespersonName: 'Rahul (Field Officer)',
                  });
                }}
                onAcceptVisitRequest={(id) => appStore.updateVisitRequestStatus(id, 'ACCEPTED')}
                onOpenHowCalculated={() => setShowHowCalculated(true)}
              />
            )}

            {state.activeRole === 'distributor' && (
              <DistributorDashboard
                retailers={state.retailers}
                skus={state.skus}
                dailyRecords={state.dailyRecords}
                orders={state.orders}
                deliverySlots={state.deliverySlots}
                onUpdateOrderStatus={(orderId, status, isBreached, reason) => {
                  appStore.updateOrderStatus(orderId, status, isBreached, reason);
                }}
                onOpenHowCalculated={() => setShowHowCalculated(true)}
              />
            )}

            {state.activeRole === 'manufacturer' && (
              <ManufacturerDashboard
                retailers={state.retailers}
                skus={state.skus}
                dailyRecords={state.dailyRecords}
                onOpenHowCalculated={() => setShowHowCalculated(true)}
              />
            )}
          </main>

          {/* Global Modals */}
          <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
          <HowCalculatedModal
            isOpen={showHowCalculated}
            onClose={() => setShowHowCalculated(false)}
          />

          {/* Persistent Footer with Sample Data Label */}
          <Footer />
        </>
      )}
    </div>
  );
}
