import { useState, useEffect } from 'react';
import {
  SKU,
  Retailer,
  DailyRecord,
  Order,
  VisitRequest,
  DeliverySlot,
  ExtractedSaleEntry,
  AppLanguage,
  HelpRequest,
} from '../types';
import {
  SKUS,
  RETAILERS,
  INITIAL_DELIVERY_SLOTS,
  INITIAL_ORDERS,
  INITIAL_VISIT_REQUESTS,
  generateHistoricalRecords,
} from '../data/mockData';
import { calculateDataConfidenceScore } from './analytics';

const STORAGE_KEY = 'HUL_KIRANA_DEMAND_PLATFORM_V1';

export type UserRole = 'retailer' | 'salesperson' | 'distributor' | 'manufacturer';

export interface AppState {
  retailers: Retailer[];
  skus: SKU[];
  dailyRecords: DailyRecord[];
  orders: Order[];
  visitRequests: VisitRequest[];
  deliverySlots: DeliverySlot[];
  helpRequests: HelpRequest[];
  language: AppLanguage;
  activeRole: UserRole;
  selectedRetailerId: string;
  overriddenPriorityOrder: string[];
  lastNotification?: {
    id: string;
    message: string;
    timestamp: number;
    type: 'success' | 'alert' | 'info';
  };
  simulationReminder10pmActive: boolean;
  lastSalesBackup?: {
    retailerId: string;
    previousRecords: DailyRecord[];
    previousLastLogged: string;
    previousStreak: number;
  };
}

const INITIAL_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'help-101',
    role: 'retailer',
    userName: 'Ramesh Sharma',
    phone: '+91 98202 11001',
    problemType: 'Order Delivery Delay',
    preferredTime: 'Today 4:00 PM – 5:00 PM',
    note: 'Inquiring about today afternoon van dispatch status.',
    status: 'In progress',
    createdAt: '2026-11-02T09:30:00Z',
  },
];

// Initial state creator
function createInitialState(): AppState {
  return {
    retailers: RETAILERS,
    skus: SKUS,
    dailyRecords: generateHistoricalRecords(),
    orders: INITIAL_ORDERS,
    visitRequests: INITIAL_VISIT_REQUESTS,
    deliverySlots: INITIAL_DELIVERY_SLOTS,
    helpRequests: INITIAL_HELP_REQUESTS,
    language: 'en',
    activeRole: 'retailer',
    selectedRetailerId: 'ret-1', // Default: Sharma General Store
    overriddenPriorityOrder: [],
    simulationReminder10pmActive: false,
    lastNotification: {
      id: 'init',
      message: 'Platform initialized with 60-day historical Kirana demand layer.',
      timestamp: Date.now(),
      type: 'info',
    },
  };
}

// In-memory store + event listeners
class DataStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.retailers && parsed.dailyRecords && parsed.skus) {
          // Migrate missing fields if needed
          if (!parsed.language) parsed.language = 'en';
          if (!parsed.helpRequests) parsed.helpRequests = INITIAL_HELP_REQUESTS;
          // Ensure SKUs have retailPrice and retailerMarginPct
          parsed.skus = parsed.skus.map((s: SKU) => {
            const master = SKUS.find((m) => m.id === s.id);
            return {
              ...s,
              retailPrice: s.retailPrice || (master ? master.retailPrice : s.mrp),
              retailerMarginPct: s.retailerMarginPct || (master ? master.retailerMarginPct : 12),
            };
          });
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored state, initializing fresh', e);
    }
    const fresh = createInitialState();
    this.saveState(fresh);
    return fresh;
  }

  private saveState(state: AppState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist state', e);
    }
  }

  private notify() {
    this.saveState(this.state);
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AppState {
    return this.state;
  }

  public setLanguage(language: AppLanguage) {
    this.state.language = language;
    this.notify();
  }

  public setActiveRole(role: UserRole) {
    this.state.activeRole = role;
    this.notify();
  }

  public setSelectedRetailerId(retailerId: string) {
    this.state.selectedRetailerId = retailerId;
    this.notify();
  }

  public addHelpRequest(req: {
    role: string;
    userName: string;
    phone: string;
    problemType: string;
    preferredTime: string;
    note: string;
  }) {
    const newReq: HelpRequest = {
      id: `help-${Date.now()}`,
      role: req.role,
      userName: req.userName,
      phone: req.phone,
      problemType: req.problemType,
      preferredTime: req.preferredTime,
      note: req.note,
      status: 'Received',
      createdAt: new Date().toISOString(),
    };
    this.state.helpRequests.unshift(newReq);
    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Help request registered (#${newReq.id.slice(-4)}). Our support desk will call you at ${req.preferredTime}.`,
      timestamp: Date.now(),
      type: 'success',
    };
    this.notify();
  }

  public set10pmReminderSimulation(active: boolean) {
    this.state.simulationReminder10pmActive = active;
    if (active) {
      this.state.lastNotification = {
        id: 'notif-' + Date.now(),
        message: '10:00 PM System Reminder: Closing sales pending for 2 kiranas.',
        timestamp: Date.now(),
        type: 'alert',
      };
    }
    this.notify();
  }

  /**
   * Log sales and closing stock for a retailer.
   * This is the CORE TRIGGER that immediately affects:
   * 1. Retailer's current stock & days of cover
   * 2. Salesperson's priority queue & visit urgency
   * 3. Distributor's replenishment recommendations
   * 4. Manufacturer's national SKU sell-through view
   */
  public logSalesBatch(
    retailerId: string,
    entries: ExtractedSaleEntry[],
    source: 'pos' | 'camera' | 'voice' | 'notebook' | 'manual',
    correctionsCount: number = 0
  ) {
    const today = '2026-11-02';
    const retailer = this.state.retailers.find((r) => r.id === retailerId);
    if (!retailer) return;

    // Backup previous state for Undo
    const previousRecords = this.state.dailyRecords
      .filter((r) => r.retailerId === retailerId && r.date === today)
      .map((r) => ({ ...r }));

    this.state.lastSalesBackup = {
      retailerId,
      previousRecords,
      previousLastLogged: retailer.lastLoggedDate,
      previousStreak: retailer.loggingStreakDays,
    };

    // Process each entry
    for (const entry of entries) {
      // Find if there's already a record for today
      const existingIdx = this.state.dailyRecords.findIndex(
        (r) => r.retailerId === retailerId && r.skuId === entry.sku_id && r.date === today
      );

      const record: DailyRecord = {
        id: `rec-${retailerId}-${entry.sku_id}-${today}`,
        date: today,
        retailerId,
        skuId: entry.sku_id,
        unitsSold: Number(entry.units_sold),
        closingStock: Number(entry.closing_stock),
        source,
        confidence: entry.confidence,
        isStockout: Number(entry.closing_stock) === 0,
        reviewedByUser: true,
      };

      if (existingIdx >= 0) {
        this.state.dailyRecords[existingIdx] = record;
      } else {
        this.state.dailyRecords.push(record);
      }
    }

    // Update retailer status
    retailer.lastLoggedDate = today;
    retailer.loggingStreakDays = Math.max(1, retailer.loggingStreakDays + 1);

    // Recalculate confidence
    const confidenceCalc = calculateDataConfidenceScore(retailer, this.state.dailyRecords);
    retailer.dataConfidenceScore = confidenceCalc.score;
    retailer.dataConfidenceRating = confidenceCalc.rating;
    retailer.confidenceReason = confidenceCalc.reason;

    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Live update: ${retailer.name} logged ${entries.length} SKUs via ${source.toUpperCase()} (${correctionsCount} edits confirmed). Live demand layer updated.`,
      timestamp: Date.now(),
      type: 'success',
    };

    this.notify();
  }

  /**
   * Undo the last saved sales log.
   */
  public undoLastSaleLog() {
    if (!this.state.lastSalesBackup) return;
    const { retailerId, previousRecords, previousLastLogged, previousStreak } = this.state.lastSalesBackup;
    const retailer = this.state.retailers.find((r) => r.id === retailerId);
    if (!retailer) return;

    const today = '2026-11-02';
    // Remove today's records for this retailer
    this.state.dailyRecords = this.state.dailyRecords.filter(
      (r) => !(r.retailerId === retailerId && r.date === today)
    );

    // Re-insert previous records if any existed
    if (previousRecords && previousRecords.length > 0) {
      this.state.dailyRecords.push(...previousRecords);
    }

    retailer.lastLoggedDate = previousLastLogged;
    retailer.loggingStreakDays = previousStreak;

    const confidenceCalc = calculateDataConfidenceScore(retailer, this.state.dailyRecords);
    retailer.dataConfidenceScore = confidenceCalc.score;
    retailer.dataConfidenceRating = confidenceCalc.rating;
    retailer.confidenceReason = confidenceCalc.reason;

    this.state.lastSalesBackup = undefined;
    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Last sales log for ${retailer.name} has been undone.`,
      timestamp: Date.now(),
      type: 'info',
    };

    this.notify();
  }

  /**
   * Place an order from Retailer or Salesperson.
   */
  public placeOrder(orderPayload: {
    retailerId: string;
    items: { skuId: string; skuName: string; units: number; cases: number; pricePerUnit: number; totalPrice: number }[];
    slotId: string;
    placedBy: 'retailer' | 'salesperson';
    salespersonName?: string;
  }) {
    const retailer = this.state.retailers.find((r) => r.id === orderPayload.retailerId);
    const slot = this.state.deliverySlots.find((s) => s.id === orderPayload.slotId);

    const totalAmount = orderPayload.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalCases = orderPayload.items.reduce((sum, item) => sum + item.cases, 0);

    const orderNumber = `HUL-ME-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      retailerId: orderPayload.retailerId,
      retailerName: retailer ? retailer.name : 'Unknown Retailer',
      items: orderPayload.items,
      totalAmount,
      totalCases,
      slot: slot ? slot.label : 'Tomorrow Morning',
      slotDate: slot ? slot.date : '2026-11-03',
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      placedBy: orderPayload.placedBy,
      salespersonName: orderPayload.salespersonName,
      confirmedByDistributor: false,
    };

    this.state.orders.unshift(newOrder);

    // Update slot booked capacity
    if (slot) {
      slot.bookedCases = Math.min(slot.maxCases, slot.bookedCases + totalCases);
      if (slot.bookedCases >= slot.maxCases) {
        slot.isAvailable = false;
      }
    }

    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Order #${orderNumber} placed for ${newOrder.retailerName} (₹${totalAmount.toLocaleString()} · ${totalCases} cases).`,
      timestamp: Date.now(),
      type: 'success',
    };

    this.notify();
  }

  /**
   * Update order status by distributor.
   */
  public updateOrderStatus(
    orderId: string,
    newStatus: Order['status'],
    isBreached: boolean = false,
    breachReason?: string
  ) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    if (newStatus === 'ACCEPTED') {
      order.confirmedByDistributor = true;
    }
    if (isBreached) {
      order.isBreached = true;
      order.breachReason = breachReason || 'Van capacity overload during peak window';
      order.creditApplied = 150; // ₹150 goodwill credit applied to next order
    }

    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Order #${order.orderNumber} status changed to ${newStatus}${isBreached ? ' (Slot Rescheduled + ₹150 goodwill credit issued)' : ''}.`,
      timestamp: Date.now(),
      type: isBreached ? 'alert' : 'info',
    };

    this.notify();
  }

  /**
   * Request a visit from the retailer to the salesperson.
   */
  public requestSalespersonVisit(retailerId: string, requestedDate: string, timeSlot: string, reason: string) {
    const retailer = this.state.retailers.find((r) => r.id === retailerId);
    if (!retailer) return;

    const newReq: VisitRequest = {
      id: `vreq-${Date.now()}`,
      retailerId,
      retailerName: retailer.name,
      area: retailer.area,
      requestedDate,
      requestedTimeSlot: timeSlot,
      reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.state.visitRequests.unshift(newReq);

    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Visit requested by ${retailer.name} ("${reason.slice(0, 35)}..."). Salesperson priority queue updated.`,
      timestamp: Date.now(),
      type: 'info',
    };

    this.notify();
  }

  public updateVisitRequestStatus(requestId: string, status: VisitRequest['status']) {
    const req = this.state.visitRequests.find((r) => r.id === requestId);
    if (!req) return;
    req.status = status;
    this.notify();
  }

  /**
   * Triangulation visit mode by salesperson:
   * Counts physical inventory, checks gap against recorded stock, logs the audit,
   * updates the closing stock record, and recalculates the retailer's confidence score.
   */
  public submitTriangulationAudit(
    retailerId: string,
    audits: { skuId: string; skuName: string; recordedStock: number; countedStock: number }[],
    notes: string = ''
  ) {
    const today = '2026-11-02';
    const retailer = this.state.retailers.find((r) => r.id === retailerId);
    if (!retailer) return;

    let totalRecorded = 0;
    let totalCounted = 0;

    for (const audit of audits) {
      totalRecorded += audit.recordedStock;
      totalCounted += audit.countedStock;

      // Update current closing stock to the rep's physical count
      const existingIdx = this.state.dailyRecords.findIndex(
        (r) => r.retailerId === retailerId && r.skuId === audit.skuId && r.date === today
      );

      if (existingIdx >= 0) {
        this.state.dailyRecords[existingIdx].closingStock = audit.countedStock;
        this.state.dailyRecords[existingIdx].source = 'rep-verified';
        this.state.dailyRecords[existingIdx].confidence = 1.0;
      } else {
        this.state.dailyRecords.push({
          id: `rec-${retailerId}-${audit.skuId}-${today}`,
          date: today,
          retailerId,
          skuId: audit.skuId,
          unitsSold: 0,
          closingStock: audit.countedStock,
          source: 'rep-verified',
          confidence: 1.0,
          isStockout: audit.countedStock === 0,
          reviewedByUser: true,
        });
      }
    }

    // Compute accuracy %
    const maxVal = Math.max(totalRecorded, totalCounted, 1);
    const diff = Math.abs(totalRecorded - totalCounted);
    const accuracy = Math.max(70, Math.round(100 - (diff / maxVal) * 100));

    retailer.lastTriangulationDate = today;
    retailer.triangulationAccuracy = accuracy;

    // Recalculate confidence score
    const conf = calculateDataConfidenceScore(retailer, this.state.dailyRecords, accuracy);
    retailer.dataConfidenceScore = conf.score;
    retailer.dataConfidenceRating = conf.rating;
    retailer.confidenceReason = `Rep verified on ${today} with ${accuracy}% inventory match. ` + notes;

    // Close any pending visit request
    const pendingVisit = this.state.visitRequests.find((v) => v.retailerId === retailerId && v.status === 'PENDING');
    if (pendingVisit) {
      pendingVisit.status = 'COMPLETED';
    }

    this.state.lastNotification = {
      id: 'notif-' + Date.now(),
      message: `Triangulation completed for ${retailer.name}. Inventory verified (${accuracy}% agreement). Data confidence score updated to ${conf.score} (${conf.rating}).`,
      timestamp: Date.now(),
      type: 'success',
    };

    this.notify();
  }

  public setOverriddenPriorityOrder(order: string[]) {
    this.state.overriddenPriorityOrder = order;
    this.notify();
  }

  public resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = createInitialState();
    this.notify();
  }
}

export const appStore = new DataStore();

export function useStore() {
  const [state, setState] = useState<AppState>(() => appStore.getState());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
    return unsubscribe;
  }, []);

  return {
    state,
    setLanguage: (lang: AppLanguage) => appStore.setLanguage(lang),
    addHelpRequest: (req: Omit<HelpRequest, 'id' | 'createdAt' | 'status'>) => appStore.addHelpRequest(req),
    undoLastSaleLog: () => appStore.undoLastSaleLog(),
  };
}
