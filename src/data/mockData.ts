import { SKU, Retailer, Zone, DeliverySlot, Order, VisitRequest, DailyRecord } from '../types';

export const ZONES: Zone[] = [
  {
    id: 'zone-mumbai-east',
    name: 'Mumbai East Zone',
    depotName: 'Mumbai East Depot (Kurla)',
    distributorName: 'Vijay Logistics & Distribution',
    distributorContact: '+91 98201 54321',
    totalRetailers: 12,
    vanCapacityCasesPerSlot: 180,
  },
  {
    id: 'zone-pune-central',
    name: 'Pune Central Zone',
    depotName: 'Pune Hadapsar Depot',
    distributorName: 'Sahyadri FMCG Distributors',
    distributorContact: '+91 98500 12345',
    totalRetailers: 18,
    vanCapacityCasesPerSlot: 220,
  },
  {
    id: 'zone-ahmedabad-west',
    name: 'Ahmedabad West Zone',
    depotName: 'Ahmedabad Sarkhej Depot',
    distributorName: 'Gujarat Kirana Supplies Pvt Ltd',
    distributorContact: '+91 98791 67890',
    totalRetailers: 24,
    vanCapacityCasesPerSlot: 250,
  },
];

export const SKUS: SKU[] = [
  {
    id: 'sku-surf-500g',
    name: 'Surf Excel Easy Wash Detergent 500g',
    category: 'Detergents',
    packSize: '500g Pouch',
    mrp: 75,
    retailerPrice: 66,
    retailPrice: 75,
    retailerMarginPct: 12.0,
    caseSize: 24,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['surf', 'surf excel', 'surf 500', 'surf packet', 'surf powder', 'surf excel 500g', 'surf packet aadha kilo'],
  },
  {
    id: 'sku-surf-10rs',
    name: 'Surf Excel Quick Wash ₹10 Sachet (Pack of 12)',
    category: 'Detergents',
    packSize: '12 Sachets Pack',
    mrp: 120,
    retailerPrice: 104,
    retailPrice: 120,
    retailerMarginPct: 13.3,
    caseSize: 30,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['surf 10', 'surf sachet', 'surf ten rupee', 'surf excel 10 rupaye', 'surf excel sachet packet'],
  },
  {
    id: 'sku-rin-bar',
    name: 'Rin Detergent Bar 250g (Pack of 4)',
    category: 'Detergents',
    packSize: '4 x 250g Bars',
    mrp: 80,
    retailerPrice: 71,
    retailPrice: 80,
    retailerMarginPct: 11.25,
    caseSize: 20,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['rin', 'rin bar', 'rin sabun', 'rin cake', 'rin 4 pack', 'rin detergent'],
  },
  {
    id: 'sku-wheel-1kg',
    name: 'Active Wheel 2-in-1 Detergent Powder 1kg',
    category: 'Detergents',
    packSize: '1kg Poly Pack',
    mrp: 68,
    retailerPrice: 60,
    retailPrice: 68,
    retailerMarginPct: 11.8,
    caseSize: 20,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['wheel', 'active wheel', 'wheel powder', 'wheel 1kg', 'wheel detergent', 'wheel packet ek kilo'],
  },
  {
    id: 'sku-lifebuoy-125g',
    name: 'Lifebuoy Total Germ Protection Soap 125g',
    category: 'Personal Wash',
    packSize: '125g Single Bar',
    mrp: 40,
    retailerPrice: 34,
    retailPrice: 40,
    retailerMarginPct: 15.0,
    caseSize: 48,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['lifebuoy', 'lifebuoy soap', 'lifebuoy sabun', 'lifebuoy red', 'lifebuoy total'],
  },
  {
    id: 'sku-lux-100g',
    name: 'Lux Velvet Touch Rose Soap 100g (Pack of 3)',
    category: 'Personal Wash',
    packSize: '3 x 100g Multipack',
    mrp: 135,
    retailerPrice: 118,
    retailPrice: 135,
    retailerMarginPct: 12.6,
    caseSize: 24,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['lux', 'lux soap', 'lux rose', 'lux teen wala', 'lux 3 pack', 'lux sabun'],
  },
  {
    id: 'sku-dove-75g',
    name: 'Dove Cream Beauty Bathing Bar 75g',
    category: 'Personal Wash',
    packSize: '75g Single Bar',
    mrp: 65,
    retailerPrice: 56,
    retailPrice: 65,
    retailerMarginPct: 13.8,
    caseSize: 36,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['dove', 'dove soap', 'dove bar', 'dove sabun', 'dove white'],
  },
  {
    id: 'sku-pears-75g',
    name: 'Pears Pure & Gentle Glycerin Soap 75g',
    category: 'Personal Wash',
    packSize: '75g Single Bar',
    mrp: 62,
    retailerPrice: 54,
    retailPrice: 62,
    retailerMarginPct: 12.9,
    caseSize: 36,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['pears', 'pears soap', 'pears sabun', 'pears pure and gentle', 'glycerin soap'],
  },
  {
    id: 'sku-clinic-sachet',
    name: 'Clinic Plus Strong & Long ₹1 Sachet (Jar of 192)',
    category: 'Hair Care',
    packSize: '192 Sachet Jar',
    mrp: 192,
    retailerPrice: 168,
    retailPrice: 192,
    retailerMarginPct: 12.5,
    caseSize: 10,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['clinic plus', 'clinic plus sachet', 'clinic shampoo', 'clinic sachet', 'clinic ek rupaye sachet jar'],
  },
  {
    id: 'sku-clinic-plus-340ml',
    name: 'Clinic Plus Strong & Long Shampoo 340ml',
    category: 'Hair Care',
    packSize: '340ml Bottle',
    mrp: 215,
    retailerPrice: 188,
    retailPrice: 215,
    retailerMarginPct: 12.55,
    caseSize: 18,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['clinic plus bottle', 'clinic plus 340', 'clinic plus shampoo bottle'],
  },
  {
    id: 'sku-sunsilk-180ml',
    name: 'Sunsilk Lusciously Thick & Long Shampoo 180ml',
    category: 'Hair Care',
    packSize: '180ml Bottle',
    mrp: 160,
    retailerPrice: 140,
    retailPrice: 160,
    retailerMarginPct: 12.5,
    caseSize: 24,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['sunsilk', 'sunsilk black', 'sunsilk bottle', 'sunsilk shampoo', 'sunsilk pink'],
  },
  {
    id: 'sku-taj-mahal-250g',
    name: 'Brooke Bond Taj Mahal Tea 250g',
    category: 'Tea & Coffee',
    packSize: '250g Carton',
    mrp: 175,
    retailerPrice: 154,
    retailPrice: 175,
    retailerMarginPct: 12.0,
    caseSize: 24,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['taj mahal', 'taj mahal tea', 'taj chai', 'taj mahal 250', 'taj tea carton'],
  },
  {
    id: 'sku-red-label-500g',
    name: 'Brooke Bond Red Label Tea 500g',
    category: 'Tea & Coffee',
    packSize: '500g Poly Pack',
    mrp: 290,
    retailerPrice: 255,
    retailPrice: 290,
    retailerMarginPct: 12.06,
    caseSize: 16,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['red label', 'red label chai', 'red label 500', 'brooke bond red label', 'red label packet'],
  },
  {
    id: 'sku-bru-50g',
    name: 'Bru Instant Coffee 50g Glass Jar',
    category: 'Tea & Coffee',
    packSize: '50g Jar',
    mrp: 145,
    retailerPrice: 126,
    retailPrice: 145,
    retailerMarginPct: 13.1,
    caseSize: 30,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['bru', 'bru coffee', 'bru instant', 'coffee jar', 'bru 50g'],
  },
  {
    id: 'sku-vim-bar-300g',
    name: 'Vim Dishwash Bar 300g with Pudina',
    category: 'Dishwash',
    packSize: '300g Bar with Tub',
    mrp: 25,
    retailerPrice: 21.5,
    retailPrice: 25,
    retailerMarginPct: 14.0,
    caseSize: 48,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['vim', 'vim bar', 'vim sabun', 'bartan sabun', 'vim bar 300', 'vim tub'],
  },
  {
    id: 'sku-vim-liquid-500ml',
    name: 'Vim Lemon Dishwash Gel 500ml Bottle',
    category: 'Dishwash',
    packSize: '500ml Squeeze Bottle',
    mrp: 125,
    retailerPrice: 108,
    retailPrice: 125,
    retailerMarginPct: 13.6,
    caseSize: 20,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['vim gel', 'vim liquid', 'vim 500ml', 'vim lemon gel', 'bartan liquid'],
  },
  {
    id: 'sku-pepsodent-150g',
    name: 'Pepsodent 2-in-1 Germicheck Toothpaste 150g',
    category: 'Oral Care',
    packSize: '150g Tube Carton',
    mrp: 85,
    retailerPrice: 73,
    retailPrice: 85,
    retailerMarginPct: 14.1,
    caseSize: 36,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['pepsodent', 'pepsodent toothpaste', 'pepsodent 150', 'toothpaste pepsodent'],
  },
  {
    id: 'sku-close-up-150g',
    name: 'Close Up Everfresh Red Hot Gel Toothpaste 150g',
    category: 'Oral Care',
    packSize: '150g Tube Carton',
    mrp: 110,
    retailerPrice: 95,
    retailPrice: 110,
    retailerMarginPct: 13.6,
    caseSize: 36,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['close up', 'closeup', 'close up red', 'close up toothpaste', 'closeup gel'],
  },
  {
    id: 'sku-ponds-cream-50g',
    name: "Pond's Cold Cream Moisturizer 50g",
    category: 'Skin Care',
    packSize: '50g Tub',
    mrp: 95,
    retailerPrice: 82,
    retailPrice: 95,
    retailerMarginPct: 13.7,
    caseSize: 30,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['ponds', 'ponds cream', 'cold cream', 'ponds cold cream', 'ponds moisturizer'],
  },
  {
    id: 'sku-glow-lovely-50g',
    name: 'Glow & Lovely Advanced Multivitamin Cream 50g',
    category: 'Skin Care',
    packSize: '50g Tube Carton',
    mrp: 115,
    retailerPrice: 99,
    retailPrice: 115,
    retailerMarginPct: 13.9,
    caseSize: 30,
    leadTimeDays: 1,
    minSafetyDays: 2,
    aliases: ['glow and lovely', 'fair and lovely', 'glow lovely', 'fair lovely cream', 'multivitamin cream'],
  },
];

export const RETAILERS: Retailer[] = [
  // Tier 1: Barcode / POS (3 stores)
  {
    id: 'ret-1',
    name: 'Sharma General Store',
    ownerName: 'Ramesh Sharma',
    tier: 1,
    area: 'Wadala East',
    zoneId: 'zone-mumbai-east',
    address: 'Shop 4, Anand Nagar, Wadala East, Mumbai 400037',
    phone: '+91 98202 11001',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 14,
    dataConfidenceScore: 94,
    dataConfidenceRating: 'High',
    confidenceReason: 'Daily automated POS sync with 100% attendance and regular rep reconciliation audits.',
    preferredCaptureMethod: 'pos',
    lastTriangulationDate: '2026-10-28',
    triangulationAccuracy: 98,
    deviceType: 'Windows PC & Honeywell 2D Scanner',
  },
  {
    id: 'ret-2',
    name: 'Gupta Supermarket',
    ownerName: 'Satish Gupta',
    tier: 1,
    area: 'Chembur Naka',
    zoneId: 'zone-mumbai-east',
    address: 'Plot 12, Station Road, Chembur Naka, Mumbai 400071',
    phone: '+91 98202 22002',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 12,
    dataConfidenceScore: 92,
    dataConfidenceRating: 'High',
    confidenceReason: 'ERP integration (Marg) synced daily at closing.',
    preferredCaptureMethod: 'pos',
    lastTriangulationDate: '2026-10-25',
    triangulationAccuracy: 96,
    deviceType: 'Tally / Marg ERP Connector',
  },
  {
    id: 'ret-3',
    name: 'Apna Provision Mart',
    ownerName: 'Mohd. Salim',
    tier: 1,
    area: 'Kurla Kamgar Nagar',
    zoneId: 'zone-mumbai-east',
    address: 'Near Railway Crossing, Kurla East, Mumbai 400024',
    phone: '+91 98202 33003',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-01',
    loggingStreakDays: 8,
    dataConfidenceScore: 88,
    dataConfidenceRating: 'High',
    confidenceReason: 'Vyapar billing software sync; minor 2% audit discrepancy.',
    preferredCaptureMethod: 'pos',
    lastTriangulationDate: '2026-10-22',
    triangulationAccuracy: 94,
    deviceType: 'Android POS Terminal',
  },

  // Tier 2: CCTV / AI Camera (3 stores)
  {
    id: 'ret-4',
    name: 'Mahadev Kirana & Grain Store',
    ownerName: 'Babulal Patel',
    tier: 2,
    area: 'Govandi West',
    zoneId: 'zone-mumbai-east',
    address: 'Bazaar Galli, Govandi West, Mumbai 400043',
    phone: '+91 98202 44004',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 11,
    dataConfidenceScore: 86,
    dataConfidenceRating: 'High',
    confidenceReason: 'Hikvision camera feed with DPDP consent; audited every fortnight.',
    preferredCaptureMethod: 'camera',
    lastTriangulationDate: '2026-10-24',
    triangulationAccuracy: 93,
    deviceType: 'Counter CCTV 4MP HD',
  },
  {
    id: 'ret-5',
    name: 'Sai Krupa Store',
    ownerName: 'Kailash Jadhav',
    tier: 2,
    area: 'Mankhurd Station',
    zoneId: 'zone-mumbai-east',
    address: 'Platform 1 West Entry, Mankhurd, Mumbai 400088',
    phone: '+91 98202 55005',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 6,
    dataConfidenceScore: 82,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Camera batch analysis; retailer consistently approves AI confirmation table.',
    preferredCaptureMethod: 'camera',
    lastTriangulationDate: '2026-10-18',
    triangulationAccuracy: 91,
    deviceType: 'CP Plus Dome Camera',
  },
  {
    id: 'ret-6',
    name: 'Ganesh Daily Needs',
    ownerName: 'Pradeep Chougule',
    tier: 2,
    area: 'Trombay Market',
    zoneId: 'zone-mumbai-east',
    address: 'Custom Road, Trombay, Mumbai 400088',
    phone: '+91 98202 66006',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-01',
    loggingStreakDays: 5,
    dataConfidenceScore: 78,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Periodic frame capture with good lighting and accurate SKU detection.',
    preferredCaptureMethod: 'camera',
    lastTriangulationDate: '2026-10-15',
    triangulationAccuracy: 89,
    deviceType: 'IP Camera 1080p',
  },

  // Tier 3: Voice Note Phone (3 stores)
  {
    id: 'ret-7',
    name: 'Laxmi Stores',
    ownerName: 'Sunil Jaiswal',
    tier: 3,
    area: 'Deonar Village',
    zoneId: 'zone-mumbai-east',
    address: 'Deonar Farm Road, Deonar, Mumbai 400088',
    phone: '+91 98202 77007',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 9,
    dataConfidenceScore: 84,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Consistently sends Hindi voice note every evening at 9:30 PM with active review.',
    preferredCaptureMethod: 'voice',
    lastTriangulationDate: '2026-10-26',
    triangulationAccuracy: 95,
    deviceType: 'Redmi 12 5G (Hindi voice)',
  },
  {
    id: 'ret-8',
    name: 'Jai Hind Provisions',
    ownerName: 'Gopal Soni',
    tier: 3,
    area: 'Ghatkopar East',
    zoneId: 'zone-mumbai-east',
    address: 'Near Pant Nagar Post Office, Ghatkopar East 400075',
    phone: '+91 98202 88008',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-01',
    loggingStreakDays: 7,
    dataConfidenceScore: 79,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Voice audio capture with occasional manual edits on sachets.',
    preferredCaptureMethod: 'voice',
    lastTriangulationDate: '2026-10-20',
    triangulationAccuracy: 92,
    deviceType: 'Vivo Y20 (Hinglish voice)',
  },
  {
    id: 'ret-9',
    name: 'Bharat General Store',
    ownerName: 'Deepak Varma',
    tier: 3,
    area: 'Tilak Nagar',
    zoneId: 'zone-mumbai-east',
    address: 'Building 14, Tilak Nagar, Chembur, Mumbai 400089',
    phone: '+91 98202 99009',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 13,
    dataConfidenceScore: 83,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Audio transcription verified in app; 97% rep triangulation match.',
    preferredCaptureMethod: 'voice',
    lastTriangulationDate: '2026-10-27',
    triangulationAccuracy: 96,
    deviceType: 'Samsung Galaxy M14',
  },

  // Tier 4: Handwritten Notebook Photo (3 stores)
  {
    id: 'ret-10',
    name: 'Patil Bandhu Kirana',
    ownerName: 'Vilas Patil',
    tier: 4,
    area: 'Sion Koliwada',
    zoneId: 'zone-mumbai-east',
    address: 'Guru Tegh Bahadur Nagar, Sion Koliwada, Mumbai 400037',
    phone: '+91 98202 10101',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-02',
    loggingStreakDays: 10,
    dataConfidenceScore: 81,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Photos of bahi-khata ledger taken nightly; clear handwriting, low error rate.',
    preferredCaptureMethod: 'notebook',
    lastTriangulationDate: '2026-10-21',
    triangulationAccuracy: 93,
    deviceType: 'Realme C55 (Camera upload)',
  },
  {
    id: 'ret-11',
    name: 'Yadav Kirana Store',
    ownerName: 'Ramprasad Yadav',
    tier: 4,
    area: 'Anik Depot',
    zoneId: 'zone-mumbai-east',
    address: 'Near BEST Bus Depot, Anik Road, Mumbai 400074',
    phone: '+91 98202 11211',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-10-30', // Stopped logging for 3 days as required!
    loggingStreakDays: 0,
    dataConfidenceScore: 54,
    dataConfidenceRating: 'Low',
    confidenceReason: 'Has not logged sales for 3 days. High staleness and stock-out vulnerability.',
    preferredCaptureMethod: 'notebook',
    lastTriangulationDate: '2026-10-12',
    triangulationAccuracy: 84,
    deviceType: 'Feature Phone / WhatsApp Photo',
  },
  {
    id: 'ret-12',
    name: 'Omkar Stores',
    ownerName: 'Sanjay More',
    tier: 4,
    area: 'Vashi Naka',
    zoneId: 'zone-mumbai-east',
    address: 'Mahul Road, Vashi Naka, Chembur, Mumbai 400074',
    phone: '+91 98202 12312',
    salespersonId: 'rep-rahul',
    lastLoggedDate: '2026-11-01',
    loggingStreakDays: 4,
    dataConfidenceScore: 71,
    dataConfidenceRating: 'Medium',
    confidenceReason: 'Handwritten ledger photo processed with OCR; salesperson visits weekly.',
    preferredCaptureMethod: 'notebook',
    lastTriangulationDate: '2026-10-19',
    triangulationAccuracy: 88,
    deviceType: 'Oppo A18',
  },
];

export const INITIAL_DELIVERY_SLOTS: DeliverySlot[] = [
  {
    id: 'slot-today-eve',
    label: 'Today 4:00 PM – 7:00 PM (Express Refill)',
    date: '2026-11-02',
    maxCases: 60,
    bookedCases: 48,
    isAvailable: true,
  },
  {
    id: 'slot-tmrw-morn',
    label: 'Tomorrow 8:00 AM – 11:30 AM (Standard Morning)',
    date: '2026-11-03',
    maxCases: 80,
    bookedCases: 52,
    isAvailable: true,
  },
  {
    id: 'slot-tmrw-eve',
    label: 'Tomorrow 3:00 PM – 6:30 PM (Standard Afternoon)',
    date: '2026-11-03',
    maxCases: 80,
    bookedCases: 26,
    isAvailable: true,
  },
  {
    id: 'slot-day3-morn',
    label: 'Wednesday 8:00 AM – 12:00 PM',
    date: '2026-11-04',
    maxCases: 90,
    bookedCases: 14,
    isAvailable: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'HUL-ME-9021',
    retailerId: 'ret-1',
    retailerName: 'Sharma General Store',
    createdAt: '2026-11-02T08:30:00Z',
    slot: 'Today 4:00 PM – 7:00 PM (Express Refill)',
    slotDate: '2026-11-02',
    status: 'OUT_FOR_DELIVERY',
    placedBy: 'retailer',
    totalAmount: 4320,
    totalCases: 3,
    confirmedByDistributor: true,
    items: [
      {
        skuId: 'sku-surf-500g',
        skuName: 'Surf Excel Easy Wash Detergent 500g',
        units: 24,
        cases: 1,
        pricePerUnit: 66,
        totalPrice: 1584,
      },
      {
        skuId: 'sku-lifebuoy-125g',
        skuName: 'Lifebuoy Total Germ Protection Soap 125g',
        units: 48,
        cases: 1,
        pricePerUnit: 34,
        totalPrice: 1632,
      },
      {
        skuId: 'sku-vim-bar-300g',
        skuName: 'Vim Dishwash Bar 300g with Pudina',
        units: 48,
        cases: 1,
        pricePerUnit: 21.5,
        totalPrice: 1032,
      },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'HUL-ME-9018',
    retailerId: 'ret-4',
    retailerName: 'Mahadev Kirana & Grain Store',
    createdAt: '2026-11-01T17:15:00Z',
    slot: 'Today 4:00 PM – 7:00 PM (Express Refill)',
    slotDate: '2026-11-02',
    status: 'ACCEPTED',
    placedBy: 'salesperson',
    salespersonName: 'Rahul (Field Rep)',
    totalAmount: 6420,
    totalCases: 4,
    confirmedByDistributor: true,
    items: [
      {
        skuId: 'sku-wheel-1kg',
        skuName: 'Active Wheel 2-in-1 Detergent Powder 1kg',
        units: 40,
        cases: 2,
        pricePerUnit: 60,
        totalPrice: 2400,
      },
      {
        skuId: 'sku-red-label-500g',
        skuName: 'Brooke Bond Red Label Tea 500g',
        units: 16,
        cases: 1,
        pricePerUnit: 255,
        totalPrice: 4080,
      },
    ],
  },
  {
    id: 'ord-103',
    orderNumber: 'HUL-ME-8994',
    retailerId: 'ret-10',
    retailerName: 'Patil Bandhu Kirana',
    createdAt: '2026-10-31T11:45:00Z',
    slot: 'Yesterday Morning',
    slotDate: '2026-11-01',
    status: 'DELIVERED',
    placedBy: 'retailer',
    totalAmount: 3820,
    totalCases: 2,
    confirmedByDistributor: true,
    items: [
      {
        skuId: 'sku-taj-mahal-250g',
        skuName: 'Brooke Bond Taj Mahal Tea 250g',
        units: 24,
        cases: 1,
        pricePerUnit: 154,
        totalPrice: 3696,
      },
    ],
  },
];

export const INITIAL_VISIT_REQUESTS: VisitRequest[] = [
  {
    id: 'vreq-1',
    retailerId: 'ret-1',
    retailerName: 'Sharma General Store',
    area: 'Wadala East',
    requestedDate: '2026-11-02',
    requestedTimeSlot: '11:30 AM – 1:00 PM',
    reason: 'Scheme query on Diwali hampers & detergent margin structure for festive bulk packs.',
    status: 'PENDING',
    createdAt: '2026-11-01T21:00:00Z',
  },
  {
    id: 'vreq-2',
    retailerId: 'ret-7',
    retailerName: 'Laxmi Stores',
    area: 'Deonar Village',
    requestedDate: '2026-11-03',
    requestedTimeSlot: '3:00 PM – 4:30 PM',
    reason: 'Requesting new display rack for Clinic Plus & Sunsilk bottle range.',
    status: 'PENDING',
    createdAt: '2026-11-02T07:15:00Z',
  },
];

/**
 * Generate realistic 60-day historical daily records for each retailer and SKU.
 * Features:
 * - Weekly seasonality (weekend sales multiplier 1.25, weekday ~0.95)
 * - Recent festive uplift in the last 7-10 days (+25% to +35% for detergents, teas, soaps)
 * - Specific deliberate stockouts (e.g. Surf Excel 500g at Sharma General Store running low, 0 on some days)
 * - Day 60 is today: 2026-11-02
 */
export function generateHistoricalRecords(): DailyRecord[] {
  const records: DailyRecord[] = [];
  const baseDate = new Date('2026-11-02T00:00:00Z');

  // Baseline daily sales by SKU
  const skuBaseSales: Record<string, number> = {
    'sku-surf-500g': 8,
    'sku-surf-10rs': 18,
    'sku-rin-bar': 10,
    'sku-wheel-1kg': 12,
    'sku-lifebuoy-125g': 14,
    'sku-lux-100g': 9,
    'sku-dove-75g': 6,
    'sku-pears-75g': 5,
    'sku-clinic-sachet': 22,
    'sku-clinic-plus-340ml': 3,
    'sku-sunsilk-180ml': 4,
    'sku-taj-mahal-250g': 7,
    'sku-red-label-500g': 8,
    'sku-bru-50g': 4,
    'sku-vim-bar-300g': 16,
    'sku-vim-liquid-500ml': 5,
    'sku-pepsodent-150g': 6,
    'sku-close-up-150g': 7,
    'sku-ponds-cream-50g': 4,
    'sku-glow-lovely-50g': 6,
  };

  // Iterate over 12 retailers
  for (const ret of RETAILERS) {
    // Retailer size factor (Sharma is high volume ~1.2, smaller stores ~0.8)
    const storeFactor = ret.id === 'ret-1' ? 1.3 : ret.id === 'ret-2' ? 1.4 : ret.id === 'ret-11' ? 0.75 : 1.0;

    for (const sku of SKUS) {
      const baseDaily = (skuBaseSales[sku.id] || 6) * storeFactor;
      let currentStock = Math.round(baseDaily * (sku.id === 'sku-surf-500g' && ret.id === 'ret-1' ? 1.8 : 5.5));

      // Generate for past 60 days
      for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
        const d = new Date(baseDate);
        d.setUTCDate(d.getUTCDate() - dayOffset);
        const dateStr = d.toISOString().slice(0, 10);
        const dayOfWeek = d.getUTCDay(); // 0 = Sun, 6 = Sat

        // Stop logging for Yadav Kirana ret-11 for last 3 days
        if (ret.id === 'ret-11' && dayOffset < 3) {
          continue;
        }

        // Seasonality & festive factors
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const weekendMult = isWeekend ? 1.25 : 0.95;
        // Festive season uplift in last 10 days (Diwali / wedding season prep)
        const isFestiveRecent = dayOffset <= 9;
        const festiveMult = isFestiveRecent ? (sku.category === 'Detergents' || sku.category === 'Tea & Coffee' ? 1.35 : 1.2) : 1.0;

        // Controlled deterministic noise using hash
        const hash = (ret.id.charCodeAt(4) * 31 + sku.id.charCodeAt(4) * 17 + dayOffset * 7) % 100;
        const noise = 0.85 + (hash / 100) * 0.3; // between 0.85 and 1.15

        let unitsSold = Math.round(baseDaily * weekendMult * festiveMult * noise);

        // Retailer restocks periodically (every 5-7 days or when stock gets low)
        if (currentStock < baseDaily * 1.5 && dayOffset > 0) {
          // Replenished yesterday
          const refillCases = Math.ceil((baseDaily * 7) / sku.caseSize);
          currentStock += refillCases * sku.caseSize;
        }

        // Cap sales by available stock
        if (unitsSold > currentStock) {
          unitsSold = currentStock;
        }

        currentStock = Math.max(0, currentStock - unitsSold);
        const isStockout = currentStock === 0;

        // Specific condition for Sharma General Store on Surf Excel 500g
        // Make it urgently low stock (e.g. 5 units left, with daily sales of 10 -> 0.5 days cover!)
        if (ret.id === 'ret-1' && sku.id === 'sku-surf-500g' && dayOffset === 0) {
          currentStock = 4;
          unitsSold = 11;
        }

        const source = ret.preferredCaptureMethod;
        const confidence = source === 'pos' ? 0.96 : source === 'camera' ? 0.88 : source === 'voice' ? 0.84 : 0.80;

        records.push({
          id: `rec-${ret.id}-${sku.id}-${dateStr}`,
          date: dateStr,
          retailerId: ret.id,
          skuId: sku.id,
          unitsSold,
          closingStock: currentStock,
          source,
          confidence,
          isStockout,
          reviewedByUser: dayOffset < 30,
        });
      }
    }
  }

  return records;
}

// Preset mock data for Tier 1: Simulated POS Feed
export const MOCK_POS_TRANSACTION_FEED = [
  { barcode: '8901030383748', skuId: 'sku-surf-500g', name: 'Surf Excel Easy Wash 500g', qty: 6, unitPrice: 75, time: '11:24 AM' },
  { barcode: '8901030383755', skuId: 'sku-surf-10rs', name: 'Surf Excel ₹10 Sachet (Pack 12)', qty: 14, unitPrice: 120, time: '12:05 PM' },
  { barcode: '8901030001001', skuId: 'sku-rin-bar', name: 'Rin Detergent Bar 250g (Pack 4)', qty: 8, unitPrice: 80, time: '01:15 PM' },
  { barcode: '8901030002002', skuId: 'sku-wheel-1kg', name: 'Active Wheel 2-in-1 1kg', qty: 9, unitPrice: 68, time: '02:40 PM' },
  { barcode: '8901030003003', skuId: 'sku-lifebuoy-125g', name: 'Lifebuoy Soap 125g', qty: 15, unitPrice: 40, time: '03:10 PM' },
  { barcode: '8901030004004', skuId: 'sku-lux-100g', name: 'Lux Rose Soap 100g (Pack 3)', qty: 7, unitPrice: 135, time: '04:18 PM' },
  { barcode: '8901030005005', skuId: 'sku-clinic-sachet', name: 'Clinic Plus ₹1 Sachet (Jar 192)', qty: 18, unitPrice: 192, time: '05:32 PM' },
  { barcode: '8901030006006', skuId: 'sku-taj-mahal-250g', name: 'Brooke Bond Taj Mahal Tea 250g', qty: 5, unitPrice: 175, time: '06:12 PM' },
  { barcode: '8901030007007', skuId: 'sku-vim-bar-300g', name: 'Vim Dishwash Bar 300g with Pudina', qty: 12, unitPrice: 25, time: '07:05 PM' },
  { barcode: '8901030008008', skuId: 'sku-close-up-150g', name: 'Close Up Red Hot Gel 150g', qty: 6, unitPrice: 110, time: '08:22 PM' },
];

// Preset curated sample voice recordings & Hinglish transcripts for Tier 3
export const SAMPLE_VOICE_PROMPTS = [
  {
    id: 'voice-1',
    label: 'Sharma Store Daily Closing (Hinglish/Hindi)',
    transcript: 'Surf Excel ten rupee packet bees bik gaye, Lifebuoy paanch bache hain, aur Vim bar barah bache hain, Taj Mahal chai teen packet bache hain.',
    description: 'Colloquial mix of sales & closing stock with typical kirana shorthand.',
  },
  {
    id: 'voice-2',
    label: 'Diwali Rush Detergent & Soaps (Hinglish)',
    transcript: 'Surf 500g aath bik gaye, dukan me sirf chaar packet bache hain khatam hone wale hain. Rin bar chaar bik gaye, Lux soap pandrah bache hain.',
    description: 'Urgent stockout alert for Surf Excel 500g and Rin detergent bars.',
  },
  {
    id: 'voice-3',
    label: 'Haircare & Beverages (Hindi)',
    transcript: 'Clinic Plus ek rupaye wala jar ek pura bik gaya, Sunsilk black bottle do biki teen bachi hain, Red Label chai aadha kilo chhah bik gaye.',
    description: 'High-velocity sachet jars and premium tea sales report.',
  },
];

// Preset curated ledger entries for Tier 4: Handwritten Notebook
export const SAMPLE_NOTEBOOK_PRESETS = [
  {
    id: 'notebook-1',
    title: 'Daily Bahi-Khata Ledger — Sharma General Store (Nov 2)',
    date: '02/11/2026',
    previewText: `
      बहीखाता दैनिक बिक्री (Sharma General Store, Wadala)
      --------------------------------------------------
      1. सर्फ 500 ग्राम (Surf 500g) : बिका = 11 | स्टॉक शेष = 4
      2. सर्फ ₹10 सैशे (Surf 10 Rs) : बिका = 19 | स्टॉक शेष = 22
      3. लाइफबॉय 125g (Lifebuoy)    : बिका = 14 | स्टॉक शेष = 18
      4. विम बार (Vim Bar 300g)     : बिका = 15 | स्टॉक शेष = 12
      5. ताज महल चाय 250g (Taj Tea) : बिका = 6  | स्टॉक शेष = 3 (अलर्ट!)
      6. क्लिनिक प्लस ₹1 सैशे जार   : बिका = 21 | स्टॉक शेष = 35
      7. क्लोज अप 150g (Close Up)   : बिका = 5  | स्टॉक शेष = 14
    `,
    detectedEntries: [
      { sku_id: 'sku-surf-500g', sku_name: 'Surf Excel Easy Wash Detergent 500g', units_sold: 11, closing_stock: 4, confidence: 0.94, source_text: 'सर्फ 500 ग्राम : बिका = 11 | शेष = 4' },
      { sku_id: 'sku-surf-10rs', sku_name: 'Surf Excel Quick Wash ₹10 Sachet (Pack of 12)', units_sold: 19, closing_stock: 22, confidence: 0.92, source_text: 'सर्फ ₹10 सैशे : बिका = 19 | शेष = 22' },
      { sku_id: 'sku-lifebuoy-125g', sku_name: 'Lifebuoy Total Germ Protection Soap 125g', units_sold: 14, closing_stock: 18, confidence: 0.91, source_text: 'लाइफबॉय 125g : बिका = 14 | शेष = 18' },
      { sku_id: 'sku-vim-bar-300g', sku_name: 'Vim Dishwash Bar 300g with Pudina', units_sold: 15, closing_stock: 12, confidence: 0.89, source_text: 'विम बार : बिका = 15 | शेष = 12' },
      { sku_id: 'sku-taj-mahal-250g', sku_name: 'Brooke Bond Taj Mahal Tea 250g', units_sold: 6, closing_stock: 3, confidence: 0.87, source_text: 'ताज महल चाय : बिका = 6 | शेष = 3' },
      { sku_id: 'sku-clinic-sachet', sku_name: 'Clinic Plus Strong & Long ₹1 Sachet (Jar of 192)', units_sold: 21, closing_stock: 35, confidence: 0.93, source_text: 'क्लिनिक प्लस ₹1 जार : बिका = 21 | शेष = 35' },
    ],
  },
  {
    id: 'notebook-2',
    title: 'Daily Register — Patil Bandhu Kirana (Sion)',
    date: '02/11/2026',
    previewText: `
      पाटील बंधू किराणा - दैनिक नोंद
      ---------------------------------
      - व्हील पावडर 1kg (Wheel 1kg)  : विकले = 14 | शिल्लक = 8
      - रिन साबण 4-pack (Rin Bar)   : विकले = 9  | शिल्लक = 6
      - लक्स साबण (Lux Rose 100g)   : विकले = 8  | शिल्लक = 15
      - सनसिल्क बॉटल 180ml          : विकले = 4  | शिल्लक = 7
      - ब्रू कॉफी 50g (Bru Instant)  : विकले = 3  | शिल्लक = 5
      - फेयर क्रीम (Glow & Lovely)  : विकले = 5  | शिल्लक = 11
    `,
    detectedEntries: [
      { sku_id: 'sku-wheel-1kg', sku_name: 'Active Wheel 2-in-1 Detergent Powder 1kg', units_sold: 14, closing_stock: 8, confidence: 0.92, source_text: 'व्हील पावडर 1kg : विकले 14 शिल्लक 8' },
      { sku_id: 'sku-rin-bar', sku_name: 'Rin Detergent Bar 250g (Pack of 4)', units_sold: 9, closing_stock: 6, confidence: 0.88, source_text: 'रिन साबण : विकले 9 शिल्लक 6' },
      { sku_id: 'sku-lux-100g', sku_name: 'Lux Velvet Touch Rose Soap 100g (Pack of 3)', units_sold: 8, closing_stock: 15, confidence: 0.90, source_text: 'लक्स साबण : विकले 8 शिल्लक 15' },
      { sku_id: 'sku-sunsilk-180ml', sku_name: 'Sunsilk Lusciously Thick & Long Shampoo 180ml', units_sold: 4, closing_stock: 7, confidence: 0.85, source_text: 'सनसिल्क बॉटल : विकले 4 शिल्लक 7' },
      { sku_id: 'sku-bru-50g', sku_name: 'Bru Instant Coffee 50g Glass Jar', units_sold: 3, closing_stock: 5, confidence: 0.86, source_text: 'ब्रू कॉफी 50g : विकले 3 शिल्लक 5' },
      { sku_id: 'sku-glow-lovely-50g', sku_name: 'Glow & Lovely Advanced Multivitamin Cream 50g', units_sold: 5, closing_stock: 11, confidence: 0.82, source_text: 'फेयर क्रीम : विकले 5 शिल्लक 11' },
    ],
  },
];

// Preset CCTV counter frames for Tier 2: AI Camera Layer
export const SAMPLE_CCTV_SCENES = [
  {
    id: 'cctv-1',
    timestamp: '17:42:10 IST',
    cameraLocation: 'Counter Camera 1 — Billing Front',
    storeName: 'Mahadev Kirana, Govandi',
    detectedDetections: [
      { sku_id: 'sku-surf-500g', sku_name: 'Surf Excel Easy Wash Detergent 500g', count: 3, confidence: 0.94, bbox: [120, 150, 80, 110] },
      { sku_id: 'sku-vim-bar-300g', sku_name: 'Vim Dishwash Bar 300g with Pudina', count: 4, confidence: 0.91, bbox: [210, 180, 60, 45] },
      { sku_id: 'sku-lifebuoy-125g', sku_name: 'Lifebuoy Total Germ Protection Soap 125g', count: 5, confidence: 0.89, bbox: [290, 160, 50, 40] },
      { sku_id: 'sku-clinic-sachet', sku_name: 'Clinic Plus Strong & Long ₹1 Sachet (Jar of 192)', count: 8, confidence: 0.86, bbox: [360, 140, 70, 90] },
    ],
  },
  {
    id: 'cctv-2',
    timestamp: '19:15:45 IST',
    cameraLocation: 'Counter Camera 2 — Shelf Handover',
    storeName: 'Sai Krupa Store, Mankhurd',
    detectedDetections: [
      { sku_id: 'sku-taj-mahal-250g', sku_name: 'Brooke Bond Taj Mahal Tea 250g', count: 2, confidence: 0.93, bbox: [140, 120, 75, 95] },
      { sku_id: 'sku-wheel-1kg', sku_name: 'Active Wheel 2-in-1 Detergent Powder 1kg', count: 4, confidence: 0.90, bbox: [240, 130, 90, 120] },
      { sku_id: 'sku-lux-100g', sku_name: 'Lux Velvet Touch Rose Soap 100g (Pack of 3)', count: 3, confidence: 0.88, bbox: [350, 170, 70, 55] },
    ],
  },
];
