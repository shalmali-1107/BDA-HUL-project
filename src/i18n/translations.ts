import { AppLanguage } from '../types';

export interface TranslationDict {
  // Common / Header / Navigation
  appName: string;
  appSubtitle: string;
  sampleDataBadge: string;
  sampleDataFooter: string;
  help: string;
  about: string;
  resetData: string;
  resetConfirmTitle: string;
  resetConfirmDesc: string;
  cancel: string;
  confirm: string;
  logout: string;
  loginAs: string;
  roleRetailer: string;
  roleSalesperson: string;
  roleDistributor: string;
  roleManufacturer: string;
  switchRole: string;
  readAloud: string;
  readAloudStop: string;
  undo: string;
  save: string;
  download: string;
  downloadSuccess: string;
  downloadNoData: string;
  stepOf: string;
  yesCorrect: string;
  change: string;
  isThisCorrect: string;
  helpline: string;
  lowStock: string;
  totalUnits: string;
  totalAmount: string;
  delivery: string;
  salesmanChecked: string;

  // Retailer bottom nav
  navHome: string;
  navStock: string;
  navOrder: string;
  navHelp: string;
  navOrdersTrack: string;

  // Retailer Home & Today's Sales
  todaysSales: string;
  unitsSold: string;
  moneyEarned: string;
  estimatedProfit: string;
  estimatedProfitLabel: string;
  notAddedYet: string;
  addTodaysSales: string;
  orderStock: string;
  moreThanYesterday: string;
  lessThanYesterday: string;
  sameAsYesterday: string;
  salesLast7Days: string;
  itemsSoldToday: string;
  viewPastDays: string;
  today: string;
  yesterday: string;
  earlier: string;
  streakDays: string;
  nextDelivery: string;
  lowStockAlerts: string;
  viewAllStock: string;
  restockNow: string;

  // Capture methods
  howToAddSales: string;
  captureSpeakTitle: string;
  captureSpeakDesc: string;
  capturePhotoTitle: string;
  capturePhotoDesc: string;
  captureTypeTitle: string;
  captureTypeDesc: string;
  captureBillingTitle: string;
  captureBillingDesc: string;
  listening: string;
  tapToRecord: string;
  recordingHint: string;
  selectAudioSample: string;
  readFromVoice: string;
  readFromPhoto: string;
  chooseNotebookSample: string;
  readingNotebook: string;
  pullingBillingData: string;
  billingConnected: string;
  pullTodaySales: string;
  searchProduct: string;

  // Confirmation Table
  reviewAndConfirm: string;
  reviewInstructions: string;
  productName: string;
  soldCount: string;
  stockRemaining: string;
  accuracyCheck: string;
  looksRight: string;
  pleaseCheck: string;
  deleteRow: string;
  addProduct: string;
  correctionsLogged: string;
  confirmAndSave: string;
  discardAndBack: string;

  // My Stock
  myStock: string;
  stockSearchPlaceholder: string;
  allCategories: string;
  willLastAbout: string;
  willLastDays: string;
  lowStockFlag: string;
  healthyStock: string;
  burnRatePerDay: string;
  sourceRecorded: string;
  units: string;
  days: string;

  // Ordering
  placeOrder: string;
  orderMyself: string;
  orderMyselfDesc: string;
  callSalesman: string;
  callSalesmanDesc: string;
  suggestedBasketTitle: string;
  suggestedBasketDesc: string;
  caseCount: string;
  unitCount: string;
  totalOrderValue: string;
  chooseDeliverySlot: string;
  vanCapacity: string;
  vanFull: string;
  sendOrder: string;
  salesmanVisitDate: string;
  salesmanVisitTime: string;
  salesmanVisitReason: string;
  submitVisitRequest: string;
  visitRequestSent: string;

  // Order tracking
  orderStatusPlaced: string;
  orderStatusAccepted: string;
  orderStatusInVan: string;
  orderStatusDelivered: string;
  expectedDeliverySlot: string;
  callSalesmanDirect: string;
  goodwillCreditNotice: string;
  noOrdersYet: string;

  // CSV Download Modal
  downloadDataTitle: string;
  chooseDataType: string;
  salesByDayProduct: string;
  currentStockList: string;
  ordersList: string;
  distSalesZone: string;
  distStockZone: string;
  distOrdersZone: string;
  distRestockRecs: string;
  distVisitsLog: string;
  choosePeriod: string;
  periodToday: string;
  period7Days: string;
  period30Days: string;
  periodCustom: string;
  fromDate: string;
  toDate: string;
  downloadCsvBtn: string;

  // Help & Customer Service
  helplineTitle: string;
  helplineNumber: string;
  helplineCallNow: string;
  helplineHours: string;
  whatsappChat: string;
  whatsappHelp: string;
  requestCallback: string;
  problemType: string;
  preferredTime: string;
  noteOptional: string;
  submitCallback: string;
  myRequests: string;
  noRequestsYet: string;
  quickQuestionsTitle: string;
  statusReceived: string;
  statusInProgress: string;
  statusClosed: string;

  // Salesperson
  todaysVisitPlan: string;
  visitPlanDesc: string;
  priorityScore: string;
  visitStore: string;
  checkStockTriangulation: string;
  checkStockDesc: string;
  recordedInApp: string;
  countedOnShelf: string;
  difference: string;
  saveAuditCounts: string;
  storeRequestsInbox: string;
  acceptRequest: string;
  rescheduleRequest: string;
  showDetails: string;
  hideDetails: string;

  // Distributor & Charts
  zoneOverview: string;
  replenishmentPlanner: string;
  refillTodayGroup: string;
  refillTodayDesc: string;
  refill2DaysGroup: string;
  refill2DaysDesc: string;
  healthyGroup: string;
  factoryRefillSuggestion: string;
  factoryRefillDesc: string;
  incomingOrdersQueue: string;
  retailerZoneTable: string;
  skuSellThroughTitle: string;
  chartView: string;
  tableView: string;
  salesTrend30d: string;
  forecastNext14d: string;
  actualVsForecastTitle: string;
  mapeLabel: string;
  reorderThresholdLine: string;
  topProductsZone: string;

  // First time guide
  guideStep1Title: string;
  guideStep1Desc: string;
  guideStep2Title: string;
  guideStep2Desc: string;
  guideStep3Title: string;
  guideStep3Desc: string;
  guideClose: string;
  guideStart: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  en: {
    appName: 'Retail Partner',
    appSubtitle: 'Kirana Stock & Demand Network',
    sampleDataBadge: 'Sample data',
    sampleDataFooter: 'Sample data for study prototype — not real company data.',
    help: 'Help',
    about: 'About',
    resetData: 'Reset Data',
    resetConfirmTitle: 'Reset demo data?',
    resetConfirmDesc: 'This will restore all 12 stores, 60 days of sales, and initial orders to seed data.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    logout: 'Log out',
    loginAs: 'Log in as',
    roleRetailer: 'Retailer',
    roleSalesperson: 'Salesperson',
    roleDistributor: 'Distributor',
    roleManufacturer: 'Manufacturer',
    switchRole: 'Switch Role',
    readAloud: 'Read aloud',
    readAloudStop: 'Stop reading',
    undo: 'Undo',
    save: 'Save',
    download: 'Download',
    downloadSuccess: 'Downloaded file:',
    downloadNoData: 'No records found for the chosen date range.',
    stepOf: 'Step',
    yesCorrect: 'Yes, correct',
    change: 'Change',
    isThisCorrect: 'Is this correct?',
    helpline: 'Helpline',
    lowStock: 'Low stock',
    totalUnits: 'Total units',
    totalAmount: 'Total amount',
    delivery: 'Delivery',
    salesmanChecked: 'Checked by salesman',

    navHome: 'Home',
    navStock: 'My Stock',
    navOrder: 'Order',
    navHelp: 'Help',
    navOrdersTrack: 'Track Orders',

    todaysSales: "Today's sales",
    unitsSold: 'Units sold',
    moneyEarned: 'Total sales value',
    estimatedProfit: 'Estimated profit',
    estimatedProfitLabel: 'est. margin',
    notAddedYet: 'Not added yet',
    addTodaysSales: "Add today's sales",
    orderStock: 'Order stock',
    moreThanYesterday: 'more than yesterday',
    lessThanYesterday: 'less than yesterday',
    sameAsYesterday: 'same as yesterday',
    salesLast7Days: 'Last 7 days sales',
    itemsSoldToday: 'Items sold today',
    viewPastDays: 'View past days',
    today: 'Today',
    yesterday: 'Yesterday',
    earlier: 'Earlier',
    streakDays: 'day streak',
    nextDelivery: 'Next delivery',
    lowStockAlerts: 'Low stock alerts',
    viewAllStock: 'View all stock',
    restockNow: 'Restock now',

    howToAddSales: "Choose how to add today's sales",
    captureSpeakTitle: 'Speak',
    captureSpeakDesc: 'Say sales in Hindi, Marathi or English',
    capturePhotoTitle: 'Take a photo of notebook',
    capturePhotoDesc: 'Photo of handwritten daily register',
    captureTypeTitle: 'Type',
    captureTypeDesc: 'Direct + and - buttons for each item',
    captureBillingTitle: 'From billing machine',
    captureBillingDesc: 'Pull today’s barcode scans from Marg/Vyapar',
    listening: 'Listening... Tap to stop',
    tapToRecord: 'Tap microphone to speak',
    recordingHint: 'Example: "Surf Excel ten rupee packet twenty sold, Lifebuoy five left"',
    selectAudioSample: 'Or choose a sample voice note:',
    readFromVoice: 'Read from voice',
    readFromPhoto: 'Read from photo',
    chooseNotebookSample: 'Select sample notebook page:',
    readingNotebook: 'Reading handwritten page...',
    pullingBillingData: 'Pulling sales from billing machine...',
    billingConnected: 'Billing system connected',
    pullTodaySales: "Pull today's sales and review",
    searchProduct: 'Search product...',

    reviewAndConfirm: 'Review and confirm',
    reviewInstructions: 'Check the numbers below. Tap any number to change it.',
    productName: 'Product',
    soldCount: 'Sold today',
    stockRemaining: 'Stock left',
    accuracyCheck: 'Check',
    looksRight: 'Looks right',
    pleaseCheck: 'Please check',
    deleteRow: 'Delete',
    addProduct: '+ Add product',
    correctionsLogged: 'changes made',
    confirmAndSave: 'Save sales',
    discardAndBack: 'Back',

    myStock: 'My Stock',
    stockSearchPlaceholder: 'Search by product name...',
    allCategories: 'All Categories',
    willLastAbout: 'Will last about',
    willLastDays: 'days',
    lowStockFlag: 'Low stock',
    healthyStock: 'Stock healthy',
    burnRatePerDay: 'daily sales',
    sourceRecorded: 'Source',
    units: 'units',
    days: 'days',

    placeOrder: 'Place order',
    orderMyself: 'Order myself',
    orderMyselfDesc: 'Refill basket suggested from expected sales',
    callSalesman: 'Call my salesman',
    callSalesmanDesc: 'Ask salesman to visit your shop',
    suggestedBasketTitle: 'Suggested Refill Basket',
    suggestedBasketDesc: 'Based on expected sales to keep 7 days of stock',
    caseCount: 'cases',
    unitCount: 'units',
    totalOrderValue: 'Total order value',
    chooseDeliverySlot: 'Choose delivery slot',
    vanCapacity: 'Van capacity',
    vanFull: 'full',
    sendOrder: 'Place order',
    salesmanVisitDate: 'Preferred date',
    salesmanVisitTime: 'Preferred time',
    salesmanVisitReason: 'Reason for visit (scheme, discount, display)',
    submitVisitRequest: 'Submit visit request',
    visitRequestSent: 'Visit request sent to your salesman',

    orderStatusPlaced: 'Placed',
    orderStatusAccepted: 'Accepted',
    orderStatusInVan: 'Out for delivery',
    orderStatusDelivered: 'Delivered',
    expectedDeliverySlot: 'Expected delivery slot',
    callSalesmanDirect: 'Call my salesman',
    goodwillCreditNotice: 'Slot delay credit: ₹150 applied to next bill',
    noOrdersYet: 'No orders placed yet',

    downloadDataTitle: 'Download Sales & Stock Data',
    chooseDataType: 'Choose what to download:',
    salesByDayProduct: 'Sales (by day and product)',
    currentStockList: 'Current stock and days left',
    ordersList: 'Orders and delivery status',
    distSalesZone: 'Sales by store, product and day',
    distStockZone: 'Current stock and days of cover by store',
    distOrdersZone: 'Orders and delivery status',
    distRestockRecs: 'Restock recommendations (dates and cases)',
    distVisitsLog: 'Salesperson store visits log',
    choosePeriod: 'Choose period:',
    periodToday: 'Today',
    period7Days: 'Last 7 days',
    period30Days: 'Last 30 days',
    periodCustom: 'Custom dates',
    fromDate: 'From date',
    toDate: 'To date',
    downloadCsvBtn: 'Download CSV file',

    helplineTitle: 'Help and Support',
    helplineNumber: '1800-XXX-XXXX',
    helplineCallNow: 'Call helpline (toll free)',
    helplineHours: 'Working hours: Monday to Saturday, 9:00 AM – 7:00 PM',
    whatsappChat: 'Chat on WhatsApp',
    whatsappHelp: 'Message our support team on WhatsApp',
    requestCallback: 'Request a call back',
    problemType: 'What do you need help with?',
    preferredTime: 'Best time to call me',
    noteOptional: 'Note (optional)',
    submitCallback: 'Submit call back request',
    myRequests: 'My recent requests',
    noRequestsYet: 'No requests submitted yet',
    quickQuestionsTitle: 'Frequently Asked Questions',
    statusReceived: 'Received',
    statusInProgress: 'In progress',
    statusClosed: 'Closed',

    todaysVisitPlan: "Today's Visit Plan",
    visitPlanDesc: 'Stores sorted by urgency, pending requests, and stock risk.',
    priorityScore: 'Urgency score',
    visitStore: 'Visit store',
    checkStockTriangulation: 'Check physical stock',
    checkStockDesc: 'Count 4 to 5 fast-moving items to ensure records match physical shelf.',
    recordedInApp: 'In app',
    countedOnShelf: 'On shelf',
    difference: 'Difference',
    saveAuditCounts: 'Save counts and update store trust',
    storeRequestsInbox: 'Store visit requests',
    acceptRequest: 'Accept',
    rescheduleRequest: 'Reschedule',
    showDetails: 'Show details',
    hideDetails: 'Hide details',

    zoneOverview: 'Zone Overview',
    replenishmentPlanner: 'Replenishment Planner',
    refillTodayGroup: 'Refill Today (imminent stock-out)',
    refillTodayDesc: 'Stores with less than 1 day of stock left.',
    refill2DaysGroup: 'Refill in 2 Days (watch list)',
    refill2DaysDesc: 'Stores with 1 to 2 days of stock left.',
    healthyGroup: 'Healthy Stock',
    factoryRefillSuggestion: 'Suggested Depot Order to Factory',
    factoryRefillDesc: 'Aggregated cases to order from HUL factory for 7-day cover.',
    incomingOrdersQueue: 'Incoming Orders and Van Capacity',
    retailerZoneTable: 'Zone Retailers Table',
    skuSellThroughTitle: 'Product Velocity in Zone',
    chartView: 'Chart',
    tableView: 'Table',
    salesTrend30d: 'Last 30 days sales',
    forecastNext14d: 'Next 14 days expected sales',
    actualVsForecastTitle: 'Forecast vs Actual (Last 7 Days)',
    mapeLabel: 'Forecast error (MAPE)',
    reorderThresholdLine: 'Reorder line (1.5 days)',
    topProductsZone: 'Top products in zone this week',

    guideStep1Title: 'Step 1: Record Sales Daily',
    guideStep1Desc: 'Take 30 seconds at shop closing to speak, snap your notebook, or tap your billing sync.',
    guideStep2Title: 'Step 2: Check Low Stock',
    guideStep2Desc: 'See how many days of stock are left for each product before it runs out.',
    guideStep3Title: 'Step 3: Easy Refill & Salesman Visit',
    guideStep3Desc: 'Order directly or call your salesman with one tap whenever you need schemes.',
    guideClose: 'Close guide',
    guideStart: 'Get started',
  },

  hi: {
    appName: 'रिटेल पार्टनर',
    appSubtitle: 'किराना स्टॉक और बिक्री नेटवर्क',
    sampleDataBadge: 'सैंपल डेटा',
    sampleDataFooter: 'केस स्टडी हेतु सैंपल डेटा — वास्तविक कंपनी डेटा नहीं है।',
    help: 'हेल्पलाइन',
    about: 'जानकारी',
    resetData: 'डेटा रीसेट करें',
    resetConfirmTitle: 'क्या डेमो डेटा रीसेट करना है?',
    resetConfirmDesc: 'यह सभी 12 दुकानों, 60 दिनों की बिक्री और ऑर्डर्स को शुरुआती स्थिति में ला देगा।',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    logout: 'लॉग आउट',
    loginAs: 'इस रूप में लॉगिन करें',
    roleRetailer: 'दुकानदार (रिटेलर)',
    roleSalesperson: 'सेल्समैन',
    roleDistributor: 'डिस्ट्रीब्यूटर (डिपो)',
    roleManufacturer: 'कंपनी प्लानर',
    switchRole: 'भूमिका बदलें',
    readAloud: 'बोलकर सुनाएँ',
    readAloudStop: 'पढ़ना रोकें',
    undo: 'पूर्ववत (Undo)',
    save: 'सेव करें',
    download: 'डाउनलोड करा',
    downloadSuccess: 'फ़ाइल डाउनलोड हो गई:',
    downloadNoData: 'चुनी गई तारीखों में कोई डेटा नहीं मिला।',
    stepOf: 'कदम',
    yesCorrect: 'हाँ, सही है',
    change: 'बदलें',
    isThisCorrect: 'क्या यह सही है?',
    helpline: 'हेल्पलाइन',
    lowStock: 'स्टॉक कम है',
    totalUnits: 'कुल पीस',
    totalAmount: 'कुल रकम',
    delivery: 'डिलीवरी',
    salesmanChecked: 'सेल्समैन ने चेक किया',

    navHome: 'होम',
    navStock: 'मेरा स्टॉक',
    navOrder: 'ऑर्डर',
    navHelp: 'हेल्पलाइन',
    navOrdersTrack: 'ऑर्डर स्थिति',

    todaysSales: 'आज की बिक्री',
    unitsSold: 'बिके हुए पीस',
    moneyEarned: 'कुल बिक्री (₹)',
    estimatedProfit: 'अनुमानित मुनाफा',
    estimatedProfitLabel: 'अनुमानित मार्जिन',
    notAddedYet: 'अभी दर्ज नहीं किया गया',
    addTodaysSales: 'आज की बिक्री दर्ज करें',
    orderStock: 'स्टॉक ऑर्डर करें',
    moreThanYesterday: 'कल से ज्यादा',
    lessThanYesterday: 'कल से कम',
    sameAsYesterday: 'कल के बराबर',
    salesLast7Days: 'पिछले 7 दिनों की बिक्री',
    itemsSoldToday: 'आज बिके सामान',
    viewPastDays: 'पुराने दिन देखें',
    today: 'आज',
    yesterday: 'कल',
    earlier: 'पहले का',
    streakDays: 'दिनों का स्ट्रीक',
    nextDelivery: 'अगली डिलीवरी',
    lowStockAlerts: 'स्टॉक कम अलर्ट',
    viewAllStock: 'पूरा स्टॉक देखें',
    restockNow: 'अभी ऑर्डर करें',

    howToAddSales: 'बिक्री दर्ज करने का तरीका चुनें',
    captureSpeakTitle: 'बोलकर बताएं',
    captureSpeakDesc: 'हिंदी, हिंग्लिश या अंग्रेजी में बोलें',
    capturePhotoTitle: 'नोटबुक / बहीखाता की फोटो',
    capturePhotoDesc: 'दैनिक रजिस्टर की तस्वीर खींचें',
    captureTypeTitle: 'टाइप करें (+ / -)',
    captureTypeDesc: 'हर सामान के लिए बटन से संख्या चुनें',
    captureBillingTitle: 'बिलिंग मशीन से',
    captureBillingDesc: 'Marg या Vyapar कंप्यूटर से आज के बारकोड खींचें',
    listening: 'सुन रहे हैं... रोकने के लिए टैप करें',
    tapToRecord: 'बोलने के लिए माइक दबाएँ',
    recordingHint: 'उदाहरण: "सर्फ एक्सेल दस रुपये पैकेट बीस बिक गए, लाइफबॉय पाँच बचे हैं"',
    selectAudioSample: 'या उदाहरण आवाज़ चुनें:',
    readFromVoice: 'आवाज़ से पढ़ें',
    readFromPhoto: 'फोटो से पढ़ें',
    chooseNotebookSample: 'बहीखाते का सैंपल चुनें:',
    readingNotebook: 'हस्तलिखित पन्ना पढ़ा जा रहा है...',
    pullingBillingData: 'बिलिंग सिस्टम से डेटा निकाला जा रहा है...',
    billingConnected: 'बिलिंग सिस्टम कनेक्टेड है',
    pullTodaySales: 'आज की बिक्री खींचें और जाँचें',
    searchProduct: 'सामान खोजें...',

    reviewAndConfirm: 'जाँचें और सही करें',
    reviewInstructions: 'नीचे दी गई संख्याएँ देखें। बदलने के लिए किसी भी संख्या पर टैप करें।',
    productName: 'सामान (प्रोडक्ट)',
    soldCount: 'आज बिका',
    stockRemaining: 'स्टॉक बचा',
    accuracyCheck: 'स्थिति',
    looksRight: 'सही लग रहा है',
    pleaseCheck: 'कृपया जाँचें',
    deleteRow: 'हटाएँ',
    addProduct: '+ सामान जोड़ें',
    correctionsLogged: 'बदलाव दर्ज किए',
    confirmAndSave: 'सेव करें',
    discardAndBack: 'वापस जाएँ',

    myStock: 'मेरा स्टॉक',
    stockSearchPlaceholder: 'सामान का नाम खोजें...',
    allCategories: 'सभी श्रेणियाँ',
    willLastAbout: 'चलेगा लगभग',
    willLastDays: 'दिन',
    lowStockFlag: 'स्टॉक कम है',
    healthyStock: 'स्टॉक ठीक है',
    burnRatePerDay: 'रोज की बिक्री',
    sourceRecorded: 'स्रोत',
    units: 'नग',
    days: 'दिन',

    placeOrder: 'ऑर्डर दें',
    orderMyself: 'स्वयं ऑर्डर करें',
    orderMyselfDesc: 'अपेक्षित बिक्री के आधार पर तैयार बास्केट',
    callSalesman: 'सेल्समैन को बुलाएँ',
    callSalesmanDesc: 'स्कीम और डिस्काउंट के लिए सेल्समैन को बुलाएँ',
    suggestedBasketTitle: 'सुझाई गई रीस्टॉक बास्केट',
    suggestedBasketDesc: '7 दिनों का सुरक्षित स्टॉक बनाए रखने हेतु',
    caseCount: 'पेटी (केस)',
    unitCount: 'पीस',
    totalOrderValue: 'कुल ऑर्डर मूल्य',
    chooseDeliverySlot: 'डिलीवरी का समय चुनें',
    vanCapacity: 'गाड़ी (वैन) क्षमता',
    vanFull: 'भरी है',
    sendOrder: 'ऑर्डर भेजें',
    salesmanVisitDate: 'पसंदीदा तारीख',
    salesmanVisitTime: 'पसंदीदा समय',
    salesmanVisitReason: 'आने का कारण (स्कीम, मार्जिन, डिस्प्ले)',
    submitVisitRequest: 'अनुरोध भेजें',
    visitRequestSent: 'सेल्समैन को अनुरोध भेज दिया गया',

    orderStatusPlaced: 'ऑर्डर दिया',
    orderStatusAccepted: 'स्वीकार हुआ',
    orderStatusInVan: 'गाड़ी में रवाना',
    orderStatusDelivered: 'डिलीवर हुआ',
    expectedDeliverySlot: 'डिलीवरी का समय',
    callSalesmanDirect: 'सेल्समैन को कॉल करें',
    goodwillCreditNotice: 'डिलीवरी में देरी होने पर ₹150 का डिस्काउंट क्रेडिट',
    noOrdersYet: 'अभी कोई ऑर्डर नहीं दिया गया',

    downloadDataTitle: 'बिक्री और स्टॉक डेटा डाउनलोड करें',
    chooseDataType: 'क्या डाउनलोड करना है चुनें:',
    salesByDayProduct: 'बिक्री (दिन और सामान अनुसार)',
    currentStockList: 'वर्तमान स्टॉक और शेष दिन',
    ordersList: 'ऑर्डर और डिलीवरी स्थिति',
    distSalesZone: 'दुकान, सामान और दिन अनुसार बिक्री',
    distStockZone: 'दुकान अनुसार स्टॉक और स्टॉक कवर',
    distOrdersZone: 'सभी ऑर्डर और डिलीवरी स्थिति',
    distRestockRecs: 'रीस्टॉक सिफारिशें (तारीख और पेटियां)',
    distVisitsLog: 'सेल्समैन स्टोर विजिट रिपोर्ट',
    choosePeriod: 'समय सीमा चुनें:',
    periodToday: 'आज',
    period7Days: 'पिछले 7 दिन',
    period30Days: 'पिछले 30 दिन',
    periodCustom: 'तारीख चुनें',
    fromDate: 'इस तारीख से',
    toDate: 'इस तारीख तक',
    downloadCsvBtn: 'CSV फ़ाइल डाउनलोड करें',

    helplineTitle: 'हेल्पलाइन और सहायता',
    helplineNumber: '1800-XXX-XXXX',
    helplineCallNow: 'हेल्पलाइन पर कॉल करें (टोल फ्री)',
    helplineHours: 'कामकाज के घंटे: सोमवार से शनिवार, सुबह 9 से शाम 7 बजे',
    whatsappChat: 'व्हाट्सएप पर बात करें',
    whatsappHelp: 'व्हाट्सएप पर हमारी सपोर्ट टीम को संदेश भेजें',
    requestCallback: 'कॉल बैक का अनुरोध करें',
    problemType: 'आपको किस बारे में मदद चाहिए?',
    preferredTime: 'कॉल करने का सही समय',
    noteOptional: 'विवरण (वैकल्पिक)',
    submitCallback: 'अनुरोध दर्ज करें',
    myRequests: 'मेरे हालिया अनुरोध',
    noRequestsYet: 'कोई अनुरोध नहीं है',
    quickQuestionsTitle: 'अक्सर पूछे जाने वाले सवाल',
    statusReceived: 'प्राप्त हुआ',
    statusInProgress: 'प्रक्रिया में',
    statusClosed: 'हल हुआ',

    todaysVisitPlan: 'आज का विजिट प्लान',
    visitPlanDesc: 'दुकानें तात्कालिकता, ऑर्डर जोखिम और अनुरोध अनुसार क्रमबद्ध हैं।',
    priorityScore: 'प्राथमिकता अंक',
    visitStore: 'दुकान पर जाएँ',
    checkStockTriangulation: 'स्टॉक जाँचें (फिजिकल काउंट)',
    checkStockDesc: '4 से 5 मुख्य सामान गिनकर ऐप और दुकान के स्टॉक का मिलान करें।',
    recordedInApp: 'ऐप में दर्ज',
    countedOnShelf: 'शेल्फ पर गिना',
    difference: 'अंतर',
    saveAuditCounts: 'स्टॉक ठीक करें और विश्वास अंक बढ़ाएँ',
    storeRequestsInbox: 'दुकानदारों के विजिट अनुरोध',
    acceptRequest: 'स्वीकार करें',
    rescheduleRequest: 'तारीख बदलें',
    showDetails: 'विवरण देखें',
    hideDetails: 'विवरण छिपाएँ',

    zoneOverview: 'ज़ोन सारांश',
    replenishmentPlanner: 'रीस्टॉक प्लानर (अपेक्षित मांग)',
    refillTodayGroup: 'आज भेजें (स्टॉक खत्म होने का खतरा)',
    refillTodayDesc: 'वे दुकानें जहाँ 1 दिन से कम का स्टॉक बचा है।',
    refill2DaysGroup: '2 दिन में भेजें (निगरानी सूची)',
    refill2DaysDesc: 'वे दुकानें जहाँ 1 से 2 दिन का स्टॉक है।',
    healthyGroup: 'सुरक्षित स्टॉक',
    factoryRefillSuggestion: 'फैक्ट्री से डिपो ऑर्डर की सिफारिश',
    factoryRefillDesc: 'सभी 12 दुकानों के 7 दिन के स्टॉक हेतु कुल पेटियां।',
    incomingOrdersQueue: 'आए हुए ऑर्डर और डिलीवरी वैन क्षमता',
    retailerZoneTable: 'ज़ोन के सभी दुकानदार',
    skuSellThroughTitle: 'ज़ोन में सामान की बिक्री गति',
    chartView: 'चार्ट',
    tableView: 'टेबल',
    salesTrend30d: 'पिछले 30 दिनों की बिक्री',
    forecastNext14d: 'अगले 14 दिनों की अपेक्षित बिक्री',
    actualVsForecastTitle: 'पूर्वानुमान बनाम वास्तविक बिक्री (पिछले 7 दिन)',
    mapeLabel: 'पूर्वानुमान त्रुटि (MAPE)',
    reorderThresholdLine: 'रीऑर्डर सीमा (1.5 दिन)',
    topProductsZone: 'इस हफ्ते के सबसे ज्यादा बिकने वाले सामान',

    guideStep1Title: 'कदम 1: रोज बिक्री दर्ज करें',
    guideStep1Desc: 'दुकान बंद करते वक्त 30 सेकंड में बोलकर, फोटो खींचकर या कंप्यूटर से बिक्री दर्ज करें।',
    guideStep2Title: 'कदम 2: कम स्टॉक देखें',
    guideStep2Desc: 'देखें कौन सा सामान कितने दिन में खत्म होने वाला है।',
    guideStep3Title: 'कदम 3: रीस्टॉक ऑर्डर या सेल्समैन को बुलाएँ',
    guideStep3Desc: 'जरूरत पड़ने पर सीधे ऐप से ऑर्डर दें या सेल्समैन को अपनी दुकान पर बुलाएँ।',
    guideClose: 'गाइड बंद करें',
    guideStart: 'शुरू करें',
  },

  mr: {
    appName: 'रिटेल पार्टनर',
    appSubtitle: 'किराणा साठा आणि मागणी नेटवर्क',
    sampleDataBadge: 'सॅम्पल डेटा',
    sampleDataFooter: 'अभ्यासासाठी सॅम्पल डेटा — प्रत्यक्ष कंपनी डेटा नाही.',
    help: 'हेल्पलाइन',
    about: 'माहिती',
    resetData: 'डेटा रीसेट करा',
    resetConfirmTitle: 'डेमो डेटा रीसेट करायचा का?',
    resetConfirmDesc: 'यामुळे सर्व १२ दुकाने, ६० दिवसांची विक्री आणि ऑर्डर्स सुरुवातीच्या स्थितीत येतील.',
    cancel: 'रद्द करा',
    confirm: 'नक्की करा',
    logout: 'लॉग आउट',
    loginAs: 'या नात्याने लॉगिन करा',
    roleRetailer: 'दुकानदार (रिटेलर)',
    roleSalesperson: 'सेल्समन',
    roleDistributor: 'डिस्ट्रीब्यूटर (डेपो)',
    roleManufacturer: 'कंपनी प्लॅनर',
    switchRole: 'भूमिका बदला',
    readAloud: 'वाचून दाखवा',
    readAloudStop: 'वाचणे थांबवा',
    undo: 'पूर्ववत (Undo)',
    save: 'सेव्ह करा',
    download: 'डाउनलोड करा',
    downloadSuccess: 'फाइल डाउनलोड झाली:',
    downloadNoData: 'निवडलेल्या तारखांमध्ये कोणताही डेटा आढळला नाही.',
    stepOf: 'पायरी',
    yesCorrect: 'होय, बरोबर',
    change: 'बदला',
    isThisCorrect: 'हे बरोबर आहे का?',
    helpline: 'हेल्पलाइन',
    lowStock: 'साठा कमी आहे',
    totalUnits: 'एकूण नग',
    totalAmount: 'एकूण रक्कम',
    delivery: 'डिलिव्हरी',
    salesmanChecked: 'सेल्समनने तपासले',

    navHome: 'होम',
    navStock: 'माझा साठा',
    navOrder: 'ऑर्डर',
    navHelp: 'हेल्पलाइन',
    navOrdersTrack: 'ऑर्डर स्थिती',

    todaysSales: 'आजची विक्री',
    unitsSold: 'विकलेले नग',
    moneyEarned: 'एकूण विक्री (₹)',
    estimatedProfit: 'अंदाजे नफा',
    estimatedProfitLabel: 'अंदाजे मार्जिन',
    notAddedYet: 'अजून नोंदवलेली नाही',
    addTodaysSales: 'आजची विक्री नोंदवा',
    orderStock: 'माल मागवा (ऑर्डर)',
    moreThanYesterday: 'कालपेक्षा जास्त',
    lessThanYesterday: 'कालपेक्षा कमी',
    sameAsYesterday: 'कालच्या एवढीच',
    salesLast7Days: 'मागील ७ दिवसांची विक्री',
    itemsSoldToday: 'आज विकलेला माल',
    viewPastDays: 'मागील दिवस पहा',
    today: 'आज',
    yesterday: 'काल',
    earlier: 'पूर्वीचे',
    streakDays: 'दिवसांचा सलग क्रम',
    nextDelivery: 'पुढील डिलिव्हरी',
    lowStockAlerts: 'कमी साठा सूचना',
    viewAllStock: 'सर्व साठा पहा',
    restockNow: 'आत्ताच मागवा',

    howToAddSales: 'विक्री कशी नोंदवायची ते निवडा',
    captureSpeakTitle: 'बोलून सांगा',
    captureSpeakDesc: 'मराठी, हिंदी किंवा इंग्रजीत बोला',
    capturePhotoTitle: 'वही / खतावणीचा फोटो',
    capturePhotoDesc: 'दैनिक नोंद वहीचे छायाचित्र काढा',
    captureTypeTitle: 'टाइप करा (+ / -)',
    captureTypeDesc: 'प्रत्येक मालासाठी बटनाने संख्या निवडा',
    captureBillingTitle: 'बिलिंग मशिनमधून',
    captureBillingDesc: 'Marg किंवा Vyapar सॉफ्टवेअरमधून आजचे बारकोड घ्या',
    listening: 'ऐकत आहे... थांबवण्यासाठी दाबा',
    tapToRecord: 'बोलण्यासाठी माइक दाबा',
    recordingHint: 'उदा: "सर्फ एक्सेल दहा रुपयांचे पाकीट वीस विकले, लाइफबॉय पाच उरले आहेत"',
    selectAudioSample: 'किंवा नमुना आवाज निवडा:',
    readFromVoice: 'आवाजावरून वाचा',
    readFromPhoto: 'फोटोवरून वाचा',
    chooseNotebookSample: 'खतावणीचा नमुना निवडा:',
    readingNotebook: 'हस्तलिखित पान वाचत आहे...',
    pullingBillingData: 'बिलिंग मशिनमधून माहिती घेतली जात आहे...',
    billingConnected: 'बिलिंग सिस्टीम जोडलेली आहे',
    pullTodaySales: 'आजची विक्री आणा आणि तपासा',
    searchProduct: 'माल शोधा...',

    reviewAndConfirm: 'तपासा आणि खात्री करा',
    reviewInstructions: 'खालील आकडे तपासा. बदलण्यासाठी कोणत्याही आकड्यावर दाबा.',
    productName: 'मालाचे नाव',
    soldCount: 'आज विकले',
    stockRemaining: 'उरलेला साठा',
    accuracyCheck: 'स्थिती',
    looksRight: 'योग्य दिसते',
    pleaseCheck: 'कृपया तपासा',
    deleteRow: 'काढून टाका',
    addProduct: '+ माल जोडा',
    correctionsLogged: 'बदल नोंदवले',
    confirmAndSave: 'सेव्ह करा',
    discardAndBack: 'मागे जा',

    myStock: 'माझा साठा',
    stockSearchPlaceholder: 'मालाचे नाव शोधा...',
    allCategories: 'सर्व प्रकार',
    willLastAbout: 'पुरेल साधारण',
    willLastDays: 'दिवस',
    lowStockFlag: 'साठा कमी आहे',
    healthyStock: 'साठा पुरेसा आहे',
    burnRatePerDay: 'रोजची विक्री',
    sourceRecorded: 'स्रोत',
    units: 'नग',
    days: 'दिवस',

    placeOrder: 'ऑर्डर द्या',
    orderMyself: 'स्वतः ऑर्डर द्या',
    orderMyselfDesc: 'अपेक्षित विक्रीवर आधारित तयार बास्केट',
    callSalesman: 'सेल्समनला बोलवा',
    callSalesmanDesc: 'स्कीम आणि सवलतींसाठी सेल्समनला दुकानात बोलवा',
    suggestedBasketTitle: 'सुचवलेली मालाची यादी (बास्केट)',
    suggestedBasketDesc: '७ दिवसांचा सुरक्षित साठा राहण्यासाठी',
    caseCount: 'खोकी (पेट्या)',
    unitCount: 'नग',
    totalOrderValue: 'एकूण ऑर्डर रक्कम',
    chooseDeliverySlot: 'डिलिव्हरीची वेळ निवडा',
    vanCapacity: 'गाडी (व्हॅन) क्षमता',
    vanFull: 'भरलेली',
    sendOrder: 'ऑर्डर पाठवा',
    salesmanVisitDate: 'हवी असलेली तारीख',
    salesmanVisitTime: 'हवी असलेली वेळ',
    salesmanVisitReason: 'बोलवण्याचे कारण (स्कीम, मार्जिन, डिस्प्ले)',
    submitVisitRequest: 'विनंती पाठवा',
    visitRequestSent: 'सेल्समनला विनंती पाठवली आहे',

    orderStatusPlaced: 'ऑर्डर दिली',
    orderStatusAccepted: 'स्वीकारली',
    orderStatusInVan: 'गाडीत निघाली',
    orderStatusDelivered: 'डिलिव्हर झाली',
    expectedDeliverySlot: 'अपेक्षित डिलिव्हरी वेळ',
    callSalesmanDirect: 'सेल्समनला फोन करा',
    goodwillCreditNotice: 'डिलिव्हरी उशीर झाल्यास ₹१५० डिस्काउंट क्रेडिट',
    noOrdersYet: 'अजून कोणतीही ऑर्डर दिलेली नाही',

    downloadDataTitle: 'विक्री आणि साठा डेटा डाउनलोड करा',
    chooseDataType: 'काय डाउनलोड करायचे ते निवडा:',
    salesByDayProduct: 'विक्री (दिवस आणि मालानुसार)',
    currentStockList: 'सध्याचा साठा आणि उरलेले दिवस',
    ordersList: 'ऑर्डर्स आणि डिलिव्हरी स्थिती',
    distSalesZone: 'दुकान, माल आणि दिवसानुसार विक्री',
    distStockZone: 'दुकाननिहाय साठा आणि दिवस कव्हर',
    distOrdersZone: 'सर्व ऑर्डर्स आणि डिलिव्हरी स्थिती',
    distRestockRecs: 'पुनर्भरणा शिफारसी (तारीख आणि खोकी)',
    distVisitsLog: 'सेल्समन भेट अहवाल',
    choosePeriod: 'कालावधी निवडा:',
    periodToday: 'आज',
    period7Days: 'मागील ७ दिवस',
    period30Days: 'मागील ३० दिवस',
    periodCustom: 'तारीख निवडा',
    fromDate: 'या तारखेपासून',
    toDate: 'या तारखेपर्यंत',
    downloadCsvBtn: 'CSV फाइल डाउनलोड करा',

    helplineTitle: 'हेल्पलाइन आणि मदत',
    helplineNumber: '1800-XXX-XXXX',
    helplineCallNow: 'हेल्पलाइनवर कॉल करा (टोल फ्री)',
    helplineHours: 'कामाची वेळ: सोमवार ते शनिवार, सकाळी ९ ते संध्याकाळी ७',
    whatsappChat: 'व्हॉट्सॲपवर संपर्क करा',
    whatsappHelp: 'व्हॉट्सॲपवर आमच्या मदत केंद्राशी बोला',
    requestCallback: 'कॉल बॅक विनंती करा',
    problemType: 'कोणत्या विषयावर मदत हवी आहे?',
    preferredTime: 'फोन करण्यासाठी सोयीची वेळ',
    noteOptional: 'टीप (पर्यायी)',
    submitCallback: 'विनंती नोंदवा',
    myRequests: 'माझ्या अलीकडील विनंत्या',
    noRequestsYet: 'कोणतीही विनंती नाही',
    quickQuestionsTitle: 'नेहमी विचारले जाणारे प्रश्न',
    statusReceived: 'प्राप्त झाली',
    statusInProgress: 'काम चालू आहे',
    statusClosed: 'पूर्ण झाली',

    todaysVisitPlan: 'आजच्या भेटींचे नियोजन',
    visitPlanDesc: 'तात्काळ गरज, मागणी आणि विनंत्यांनुसार दुकानांची क्रमवारी.',
    priorityScore: 'प्राधान्य गुण',
    visitStore: 'दुकानाला भेट द्या',
    checkStockTriangulation: 'प्रत्यक्ष साठा तपासा',
    checkStockDesc: '४ ते ५ मुख्य मालाची मोजणी करून ॲप आणि शेल्फवरील साठा जुळवून घ्या.',
    recordedInApp: 'ॲपमधील नोंद',
    countedOnShelf: 'शेल्फवर मोजलेले',
    difference: 'फरक',
    saveAuditCounts: 'साठा दुरुस्त करा आणि विश्वास वाढवा',
    storeRequestsInbox: 'दुकानदारांच्या भेटीच्या विनंत्या',
    acceptRequest: 'स्वीकारा',
    rescheduleRequest: 'तारीख बदला',
    showDetails: 'तपशील पहा',
    hideDetails: 'तपशील लपवा',

    zoneOverview: 'विभाग आढावा (झोन)',
    replenishmentPlanner: 'साठा भरणा नियोजन',
    refillTodayGroup: 'आज पाठवा (साठा संपण्याची भीती)',
    refillTodayDesc: '१ दिवसापेक्षा कमी साठा उरलेली दुकाने.',
    refill2DaysGroup: '२ दिवसात पाठवा (लक्ष ठेवा)',
    refill2DaysDesc: '१ ते २ दिवसांचा साठा असलेली दुकाने.',
    healthyGroup: 'सुरक्षित साठा',
    factoryRefillSuggestion: 'कारखान्याकडून डेपो ऑर्डर शिफारस',
    factoryRefillDesc: 'सर्व १२ दुकानांच्या ७ दिवसांच्या साठ्यासाठी एकूण खोकी.',
    incomingOrdersQueue: 'आलेल्या ऑर्डर्स आणि व्हॅन क्षमता',
    retailerZoneTable: 'विभागातील सर्व दुकानदार',
    skuSellThroughTitle: 'विभागातील मालाची विक्री गती',
    chartView: 'आलेख (चार्ट)',
    tableView: 'तक्ता (टेबल)',
    salesTrend30d: 'मागील ३० दिवसांची विक्री',
    forecastNext14d: 'पुढील १४ दिवसांची अपेक्षित विक्री',
    actualVsForecastTitle: 'अंदाज विरूद्ध प्रत्यक्ष विक्री (मागील ७ दिवस)',
    mapeLabel: 'अंदाज चूक (MAPE)',
    reorderThresholdLine: 'पुनर्मागणी मर्यादा (१.५ दिवस)',
    topProductsZone: 'या आठवड्यातील सर्वाधिक विकला जाणारा माल',

    guideStep1Title: 'पायरी १: रोज विक्री नोंदवा',
    guideStep1Desc: 'दुकान बंद करताना ३० सेकंदात बोलून, फोटो काढून किंवा सॉफ्टवेअरवरून विक्री नोंदवा.',
    guideStep2Title: 'पायरी २: कमी साठा तपासा',
    guideStep2Desc: 'कोणता माल किती दिवसात संपणार आहे ते आधीच समजून घ्या.',
    guideStep3Title: 'पायरी ३: सोपी ऑर्डर आणि सेल्समनला बोलवा',
    guideStep3Desc: 'गरज असेल तेव्हा थेट ॲपवरून माल मागवा किंवा सेल्समनला दुकानात बोलवा.',
    guideClose: 'मार्गदर्शक बंद करा',
    guideStart: 'सुरू करा',
  },
};

/**
 * Format currency with Indian digit grouping: e.g. ₹1,25,000
 */
export function formatRupees(amount: number): string {
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Format date in DD-MM-YYYY using locale
 */
export function formatDateLocale(dateStr: string, lang: AppLanguage = 'en'): string {
  try {
    const d = new Date(dateStr + 'T00:00:00Z');
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Translation helper
 */
export function t(key: keyof TranslationDict, lang: AppLanguage = 'en', params?: Record<string, any>): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = dict[key] || TRANSLATIONS.en[key] || (key as string);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
    });
  }
  return text;
}
