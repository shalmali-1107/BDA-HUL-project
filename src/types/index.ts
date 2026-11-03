export type AppLanguage = 'en' | 'hi' | 'mr';

export type RetailerTier = 1 | 2 | 3 | 4;

export interface SKU {
  id: string;
  name: string;
  category: 'Detergents' | 'Personal Wash' | 'Hair Care' | 'Tea & Coffee' | 'Dishwash' | 'Oral Care' | 'Skin Care';
  packSize: string;
  mrp: number; // in INR
  retailerPrice: number; // buy price for retailer from distributor
  retailPrice: number; // customer selling price in retail shop (MRP or slight shop price)
  retailerMarginPct: number; // e.g. 12 means 12% margin
  caseSize: number; // units per case
  leadTimeDays: number;
  minSafetyDays: number;
  imageUrl?: string;
  aliases: string[]; // nicknames used in voice / colloquial Hindi/English
}

export interface HelpRequest {
  id: string;
  role: string;
  userName: string;
  phone: string;
  problemType: string;
  preferredTime: string;
  note: string;
  status: 'Received' | 'In progress' | 'Closed';
  createdAt: string;
}

export interface Retailer {
  id: string;
  name: string;
  ownerName: string;
  tier: RetailerTier;
  area: string;
  zoneId: string;
  address: string;
  phone: string;
  salespersonId: string;
  lastLoggedDate: string; // YYYY-MM-DD
  loggingStreakDays: number;
  dataConfidenceScore: number; // 0 - 100
  dataConfidenceRating: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  preferredCaptureMethod: 'pos' | 'camera' | 'voice' | 'notebook' | 'manual';
  lastTriangulationDate?: string;
  triangulationAccuracy?: number; // %
  deviceType: string;
}

export interface Zone {
  id: string;
  name: string;
  depotName: string;
  distributorName: string;
  distributorContact: string;
  totalRetailers: number;
  vanCapacityCasesPerSlot: number;
}

export interface DailyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  retailerId: string;
  skuId: string;
  unitsSold: number;
  closingStock: number;
  source: 'pos' | 'camera' | 'voice' | 'notebook' | 'manual' | 'rep-verified';
  confidence: number; // 0 - 1
  isStockout: boolean;
  reviewedByUser: boolean;
}

export interface DeliverySlot {
  id: string;
  label: string; // e.g. "Today 4 PM - 7 PM"
  date: string;
  maxCases: number;
  bookedCases: number;
  isAvailable: boolean;
}

export interface OrderItem {
  skuId: string;
  skuName: string;
  units: number;
  cases: number;
  pricePerUnit: number;
  totalPrice: number;
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface Order {
  id: string;
  orderNumber: string;
  retailerId: string;
  retailerName: string;
  items: OrderItem[];
  totalAmount: number;
  totalCases: number;
  slot: string;
  slotDate: string;
  status: OrderStatus;
  createdAt: string;
  placedBy: 'retailer' | 'salesperson';
  salespersonName?: string;
  confirmedByDistributor?: boolean;
  isBreached?: boolean;
  breachReason?: string;
  creditApplied?: number;
}

export interface VisitRequest {
  id: string;
  retailerId: string;
  retailerName: string;
  area: string;
  requestedDate: string;
  requestedTimeSlot: string;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'RESCHEDULED';
  createdAt: string;
}

export interface SalespersonVisit {
  id: string;
  salespersonId: string;
  retailerId: string;
  retailerName: string;
  visitDate: string;
  notes: string;
  triangulationAudit?: {
    skuId: string;
    skuName: string;
    recordedStock: number;
    countedStock: number;
    difference: number;
  }[];
  orderPlacedId?: string;
}

export interface PriorityScoreBreakdown {
  retailerId: string;
  retailerName: string;
  area: string;
  tier: RetailerTier;
  totalScore: number; // 0 - 100
  urgencyScore: number; // 40%
  visitRequestScore: number; // 25%
  atRiskDemandScore: number; // 20%
  stalenessScore: number; // 15%
  urgencyDaysCover: number;
  hasRequestedVisit: boolean;
  atRiskDemandValue: number;
  daysSinceLastLogged: number;
  primaryReasonTag: string;
  overriddenOrderIndex?: number;
}

export interface SkuForecast {
  skuId: string;
  skuName: string;
  avgDailySales14d: number;
  closingStock: number;
  daysOfCover: number;
  reorderPoint: number;
  forecastNext7d: number;
  forecastNext28d: number;
  recommendedOrderUnits: number;
  recommendedOrderCases: number;
  status: 'REFILL_TODAY' | 'REFILL_2DAYS' | 'HEALTHY';
  stockoutRisk: boolean;
}

export interface ExtractedSaleEntry {
  sku_id: string;
  sku_name: string;
  units_sold: number;
  closing_stock: number;
  confidence: number;
  source_text?: string;
  is_low_confidence?: boolean;
}

export interface ExtractionResult {
  entries: ExtractedSaleEntry[];
  unmatched_items: string[];
  raw_transcript?: string;
  confidence_score: number;
  source: 'voice' | 'notebook' | 'camera' | 'pos';
}
