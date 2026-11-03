# HUL Kirana Demand-Sensing Platform (Prototype)

> **MBA Case Study Prototype for Hindustan Unilever (HUL) & Neighbourhood Kirana Networks**
> 
> *A multi-role demand-sensing and inventory replenishment platform connecting kirana shopkeepers, territory sales officers, redistribution stockists (depots), and national supply chain planners.*

---

## 1. Executive Summary & Problem Context

In traditional FMCG distribution across India's 12+ million kirana stores:
- **Visibility Deficit**: HUL and redistribution stockists cannot see what is selling or remaining on kirana shelves in real time.
- **Reactive Orders**: Orders are written by hand once a week during sales rep visits, leading to frequent stock-outs of high-velocity SKUs (Surf Excel, Rin, Lifebuoy, Vim).
- **Technology Resistance**: Previous direct-ordering apps (e.g., Shikhar) encountered friction because shopkeepers resisted complex interfaces or feared losing their relationship with their trusted human field representative.

### Our Solution
1. **Adaptive 4-Tier Data Capture**: Meets retailers at their exact technological comfort level:
   - **Tier 1 (Barcode / POS)**: Automated daily sync via Marg ERP / Vyapar / Tally connectors.
   - **Tier 2 (AI CCTV Camera)**: Analyzes checkout counter transactions using Gemini Vision (with India DPDP Act 2023 compliance).
   - **Tier 3 (Voice Note)**: Natural spoken audio in Hindi, Hinglish, or English (*"Surf Excel ten rupee packet bees bik gaye, Lifebuoy paanch bache hain"*).
   - **Tier 4 (Handwritten Notebook OCR)**: End-of-day photo of the handwritten *Bahi-Khata* register digitized by Gemini.
   - **Manual Touch Entry**: Minimum 44px tap target steppers with English/हिन्दी bilingual support.
2. **Human-in-the-Loop Review**: AI extractions are never saved silently; retailers confirm or edit in a structured verification table before data is committed.
3. **Live Unified Demand Layer**: Sales logged by a retailer immediately adjust:
   - The retailer's on-shelf days of cover
   - The salesperson's prioritized daily visit route
   - The distributor's replenishment recommendations
   - The manufacturer's national 4-week factory production schedule
4. **Human Sales Rep in the Loop**: Empowers field sales officers with algorithmic visit prioritization (40% urgency, 25% retailer requests, 20% at-risk demand, 15% staleness) and in-store physical triangulation audits.

---

## 2. Platform Architecture & Roles

```
┌─────────────────────────────────────────────────────────────┐
│                 CENTRAL REACTIVE DEMAND STORE               │
└───────┬─────────────────┬───────────────────┬───────────────┘
        │                 │                   │
┌───────▼───────┐ ┌───────▼────────┐  ┌───────▼───────┐  ┌─────────────▼─────────┐
│ Kirana Retail │ │ Field Sales Rep│  │ Distributor   │  │ HUL National Planner  │
│ Sharma Store  │ │ Rahul (10 Kir) │  │ Mumbai East   │  │ Factory S&OP Schedule │
└───────────────┘ └────────────────┘  └───────────────┘  └───────────────────────┘
```

### The 4 Demo Roles
1. **Retailer (`Sharma General Store`, Wadala East)**: Log sales, view Days of Cover, place self-orders with delivery slot selection, or request a sales rep visit.
2. **Salesperson (`Rahul`)**: 10-store route prioritized 0–100 by urgency and at-risk revenue, with physical triangulation audit mode to reconcile inventory discrepancies.
3. **Distributor (`Mumbai East Depot - Vijay Logistics`)**: Group replenishment into *Refill Today* (<1.0d cover), *Refill in 2 Days*, and *Healthy*; monitor van capacity bars; fulfill or reschedule orders with goodwill credit guarantees.
4. **Manufacturer / HUL Planner**: 4-week multi-zone factory production forecasts, festive season dynamics (+28%), top/bottom movers, and statistical forecast error (MAPE).

---

## 3. Mathematical Logic & Formulas

| Metric | Formula | Business Purpose |
|---|---|---|
| **Days of Cover** | `Closing Stock ÷ 14-Day Average Daily Sales` | Measures runway before a complete shelf stock-out occurs. Cover <1.5 days triggers immediate refill alert. |
| **Demand Forecast** | `14-Day Rolling Mean × Day-of-Week Multiplier × Festive Season Uplift` | Statistical baseline accounting for weekend surges (1.25x) and festive demand (1.32x). |
| **Reorder Point** | `(Avg Daily Sales × Delivery Lead Time) + Safety Stock` | Determines when to replenish to reach a target of 7 days of safety cover. |
| **Salesperson Priority Score (0–100)** | `(40% × Urgency) + (25% × Visit Request) + (20% × At-Risk Demand) + (15% × Staleness)` | Directs field sales officers to stores with the highest risk of lost sales or pending visit requests. |
| **Retailer Data Confidence** | `14-Day Consistency + Capture Tier Weight + Human Review + Audit Accuracy` | Rates data quality (High / Medium / Low) to build trust across the supply chain. |
| **Forecast Error (MAPE)** | `(1/n) × Σ(|Actual - Forecast| / Actual) × 100%` | Backtested across the trailing 7 days with full statistical transparency. |

---

## 4. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js & Express proxy with Vite middleware mode
- **AI Integration**: Google GenAI SDK (`@google/genai` with `gemini-3.8-flash`) for Hinglish voice parsing, Bahi-Khata ledger OCR, CCTV object detection, and natural language forecast reasoning.
- **Resilience**: Comprehensive client-side and server-side fallback engines so all demo features function seamlessly both online and offline.

---

## 5. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/shalmali-1107/BDA-HUL-project.git
cd BDA-HUL-project

# Install dependencies
npm install

# (Optional) Set your Gemini API key in .env
cp .env.example .env
# Edit .env and set: GEMINI_API_KEY="your_api_key_here"

# Start the full-stack development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 6. Testing the Live Demand Sensing Loop

1. **Log in as Retailer (`Sharma General Store`)**:
   - Go to **Log Sales** and use **Tier 3: Voice Note** or **Tier 4: Notebook OCR**.
   - Verify the numbers in the **Review & Confirm Table** and save.
2. **Switch to Salesperson (`Rahul`)**:
   - Check **Today's Visit Plan**; Sharma General Store moves up in priority due to stock depletion.
   - Tap **Visit Store** to perform a **Triangulation Audit** and update the stock count.
3. **Switch to Distributor (`Mumbai East Depot`)**:
   - Notice the **Replenishment Planner** automatically groups the depleted SKU under *Refill Today*.
   - Check the **Depot Purchase Suggestion to HUL Factory**.
4. **Switch to HUL Planner**:
   - See national live sell-through, festive uplift, and 4-week factory production volume update in real time.

---

## 7. Compliance & Privacy

- **India DPDP Act 2023**: In-store CCTV analysis is restricted strictly to packaged goods on checkout counters. Customer faces and biometrics are redacted at the edge; no customer PII or financial data is retained.
- **Sample Data Notice**: All stores, quantities, and distributor numbers are synthetic representations designed for MBA strategy case analysis.
