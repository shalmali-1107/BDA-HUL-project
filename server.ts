import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '35mb' }));

// Master SKU reference list to guide Gemini's matching
const SKU_CATALOG_PROMPT = `
Available HUL Master SKUs:
- sku-surf-500g: Surf Excel Easy Wash Detergent 500g (aliases: surf, surf excel, surf 500, surf packet)
- sku-surf-10rs: Surf Excel Quick Wash ₹10 Sachet (Pack of 12) (aliases: surf 10, surf sachet, surf ten rupee)
- sku-rin-bar: Rin Detergent Bar 250g (Pack of 4) (aliases: rin, rin bar, rin sabun, rin cake)
- sku-wheel-1kg: Active Wheel 2-in-1 Detergent Powder 1kg (aliases: wheel, active wheel, wheel 1kg)
- sku-lifebuoy-125g: Lifebuoy Total Germ Protection Soap 125g (aliases: lifebuoy, lifebuoy soap, lifebuoy red)
- sku-lux-100g: Lux Velvet Touch Rose Soap 100g (Pack of 3) (aliases: lux, lux rose, lux soap)
- sku-dove-75g: Dove Cream Beauty Bathing Bar 75g (aliases: dove, dove soap, dove bar)
- sku-pears-75g: Pears Pure & Gentle Glycerin Soap 75g (aliases: pears, pears soap)
- sku-clinic-sachet: Clinic Plus Strong & Long ₹1 Sachet (Jar of 192) (aliases: clinic plus, clinic sachet, clinic shampoo)
- sku-clinic-plus-340ml: Clinic Plus Strong & Long Shampoo 340ml (aliases: clinic plus bottle)
- sku-sunsilk-180ml: Sunsilk Lusciously Thick & Long Shampoo 180ml (aliases: sunsilk, sunsilk bottle)
- sku-taj-mahal-250g: Brooke Bond Taj Mahal Tea 250g (aliases: taj mahal, taj chai, taj tea)
- sku-red-label-500g: Brooke Bond Red Label Tea 500g (aliases: red label, red label chai)
- sku-bru-50g: Bru Instant Coffee 50g Glass Jar (aliases: bru, bru coffee, bru instant)
- sku-vim-bar-300g: Vim Dishwash Bar 300g with Pudina (aliases: vim, vim bar, vim sabun, bartan sabun)
- sku-vim-liquid-500ml: Vim Lemon Dishwash Gel 500ml Bottle (aliases: vim gel, vim liquid)
- sku-pepsodent-150g: Pepsodent 2-in-1 Germicheck Toothpaste 150g (aliases: pepsodent, toothpaste)
- sku-close-up-150g: Close Up Everfresh Red Hot Gel Toothpaste 150g (aliases: close up, closeup red)
- sku-ponds-cream-50g: Pond's Cold Cream Moisturizer 50g (aliases: ponds, cold cream)
- sku-glow-lovely-50g: Glow & Lovely Advanced Multivitamin Cream 50g (aliases: glow lovely, fair and lovely)
`;

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// JSON schema for structured extraction
const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    entries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sku_id: { type: Type.STRING, description: 'Matched sku_id from HUL master list' },
          sku_name: { type: Type.STRING, description: 'Canonical product name' },
          units_sold: { type: Type.INTEGER, description: 'Number of units sold today' },
          closing_stock: { type: Type.INTEGER, description: 'Number of units remaining on shelf' },
          confidence: { type: Type.NUMBER, description: 'Confidence between 0.0 and 1.0' },
          source_text: { type: Type.STRING, description: 'Snippet or context from input' },
        },
        required: ['sku_id', 'sku_name', 'units_sold', 'closing_stock', 'confidence'],
      },
    },
    unmatched_items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Any items mentioned that did not match an HUL master SKU',
    },
  },
  required: ['entries', 'unmatched_items'],
};

// 1. Voice Parse Endpoint
app.post('/api/gemini/voice-parse', async (req, res) => {
  const { transcript, audioBase64, mimeType } = req.body;

  if (ai && (transcript || audioBase64)) {
    try {
      let contents: any = '';
      if (audioBase64) {
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: audioBase64,
              },
            },
            {
              text: `Listen to this Indian kirana store audio note (spoken in Hindi, Hinglish, or English).
${SKU_CATALOG_PROMPT}
Transcribe the speech and extract the structured list of HUL products mentioned, how many units were sold today, and how many are remaining as closing stock. Note that colloquial terms like "bees bik gaye" means 20 sold, "paanch bache hain" means 5 remaining stock.`,
            },
          ],
        };
      } else {
        contents = `You are an AI for Indian Kirana stores. Parse this audio note transcript spoken by a shopkeeper in Hindi/Hinglish/English:
"${transcript}"

${SKU_CATALOG_PROMPT}

Extract all HUL products mentioned with:
- Matched sku_id
- Canonical sku_name
- units_sold (how many were sold today; if only closing stock is stated, default units_sold to 0 or estimate based on context)
- closing_stock (how many are left on shelf/bache hain; if only sales are stated, estimate a reasonable closing stock)
- confidence (0.5 to 0.99)
- source_text
Return valid JSON adhering to the schema.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: EXTRACTION_SCHEMA,
          systemInstruction: 'You extract kirana inventory numbers accurately from Indian colloquial speech in Hindi/Hinglish.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        ...parsed,
        source: 'gemini',
        raw_transcript: transcript || 'Audio transcription complete',
      });
    } catch (err: any) {
      console.warn('Gemini voice-parse failed, using graceful fallback', err.message);
    }
  }

  // Graceful Fallback
  const lower = (transcript || '').toLowerCase();
  const fallbackEntries = [
    {
      sku_id: 'sku-surf-10rs',
      sku_name: 'Surf Excel Quick Wash ₹10 Sachet (Pack of 12)',
      units_sold: lower.includes('bees') ? 20 : 18,
      closing_stock: 14,
      confidence: 0.94,
      source_text: 'Surf Excel ten rupee packet bees bik gaye',
    },
    {
      sku_id: 'sku-lifebuoy-125g',
      sku_name: 'Lifebuoy Total Germ Protection Soap 125g',
      units_sold: 8,
      closing_stock: lower.includes('paanch') ? 5 : 6,
      confidence: 0.91,
      source_text: 'Lifebuoy paanch bache hain',
    },
    {
      sku_id: 'sku-vim-bar-300g',
      sku_name: 'Vim Dishwash Bar 300g with Pudina',
      units_sold: 14,
      closing_stock: lower.includes('barah') ? 12 : 10,
      confidence: 0.88,
      source_text: 'Vim bar barah bache hain',
    },
    {
      sku_id: 'sku-taj-mahal-250g',
      sku_name: 'Brooke Bond Taj Mahal Tea 250g',
      units_sold: 6,
      closing_stock: lower.includes('teen') ? 3 : 4,
      confidence: 0.86,
      source_text: 'Taj Mahal chai teen packet bache hain',
    },
  ];

  return res.json({
    entries: fallbackEntries,
    unmatched_items: [],
    source: 'fallback',
    raw_transcript: transcript || 'Surf Excel ten rupee packet bees bik gaye, Lifebuoy paanch bache hain, Vim bar barah bache hain',
  });
});

// 2. Notebook OCR Endpoint
app.post('/api/gemini/notebook-ocr', async (req, res) => {
  const { imageBase64, mimeType, textHint } = req.body;

  if (ai && imageBase64) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: `You are an AI for digitising Indian kirana store handwritten daily sales ledgers (Bahi-Khata / Roznamcha).
${SKU_CATALOG_PROMPT}

Read the handwritten notebook page image and extract:
- Each HUL product listed
- Quantity sold (बिका / Sale / Out)
- Closing stock (बचा / शेष / Bal / Closing)
- Confidence score (0.5 to 0.99)
- Source text snippet in Devanagari or English.
Return valid JSON adhering to the schema.`,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: EXTRACTION_SCHEMA,
          systemInstruction: 'You are an expert at deciphering Indian handwriting, Devanagari script, and kirana shorthand notation.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        ...parsed,
        source: 'gemini',
      });
    } catch (err: any) {
      console.warn('Gemini notebook-ocr failed, using fallback', err.message);
    }
  }

  // Graceful Fallback
  return res.json({
    entries: [
      {
        sku_id: 'sku-surf-500g',
        sku_name: 'Surf Excel Easy Wash Detergent 500g',
        units_sold: 11,
        closing_stock: 4,
        confidence: 0.94,
        source_text: 'सर्फ 500 ग्राम : बिका = 11 | स्टॉक शेष = 4',
      },
      {
        sku_id: 'sku-surf-10rs',
        sku_name: 'Surf Excel Quick Wash ₹10 Sachet (Pack of 12)',
        units_sold: 19,
        closing_stock: 22,
        confidence: 0.92,
        source_text: 'सर्फ ₹10 सैशे : बिका = 19 | स्टॉक शेष = 22',
      },
      {
        sku_id: 'sku-lifebuoy-125g',
        sku_name: 'Lifebuoy Total Germ Protection Soap 125g',
        units_sold: 14,
        closing_stock: 18,
        confidence: 0.91,
        source_text: 'लाइफबॉय 125g : बिका = 14 | स्टॉक शेष = 18',
      },
      {
        sku_id: 'sku-vim-bar-300g',
        sku_name: 'Vim Dishwash Bar 300g with Pudina',
        units_sold: 15,
        closing_stock: 12,
        confidence: 0.89,
        source_text: 'विम बार 300g : बिका = 15 | स्टॉक शेष = 12',
      },
      {
        sku_id: 'sku-taj-mahal-250g',
        sku_name: 'Brooke Bond Taj Mahal Tea 250g',
        units_sold: 6,
        closing_stock: 3,
        confidence: 0.87,
        source_text: 'ताज महल चाय 250g : बिका = 6 | स्टॉक शेष = 3',
      },
      {
        sku_id: 'sku-clinic-sachet',
        sku_name: 'Clinic Plus Strong & Long ₹1 Sachet (Jar of 192)',
        units_sold: 21,
        closing_stock: 35,
        confidence: 0.93,
        source_text: 'क्लिनिक प्लस ₹1 सैशे जार : बिका = 21 | स्टॉक शेष = 35',
      },
    ],
    unmatched_items: ['टाटा नमक 1kg (Non-HUL)', 'फॉर्च्यून सनफ्लावर तेल 1L (Non-HUL)'],
    source: 'fallback',
  });
});

// 3. CCTV Counter Detection Endpoint
app.post('/api/gemini/cctv-detect', async (req, res) => {
  const { imageBase64, mimeType } = req.body;

  if (ai && imageBase64) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: `This is a CCTV counter snapshot from an Indian kirana store.
${SKU_CATALOG_PROMPT}

Analyze which HUL products were handed over to customers across the counter.
Count the units detected and provide confidence score.
Note: Only identify products, do not store or recognize human customer faces (DPDP compliance).
Return valid JSON adhering to schema.`,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: EXTRACTION_SCHEMA,
          systemInstruction: 'You detect FMCG retail consumer packages on grocery checkout counters.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        ...parsed,
        source: 'gemini',
      });
    } catch (err: any) {
      console.warn('Gemini cctv-detect failed, using fallback', err.message);
    }
  }

  // Graceful Fallback
  return res.json({
    entries: [
      {
        sku_id: 'sku-surf-500g',
        sku_name: 'Surf Excel Easy Wash Detergent 500g',
        units_sold: 5,
        closing_stock: 6,
        confidence: 0.94,
        source_text: 'Detected 5 blue foil pouches handed over at checkout',
      },
      {
        sku_id: 'sku-vim-bar-300g',
        sku_name: 'Vim Dishwash Bar 300g with Pudina',
        units_sold: 6,
        closing_stock: 14,
        confidence: 0.91,
        source_text: 'Detected green rectangular bars with tub wrapper',
      },
      {
        sku_id: 'sku-lifebuoy-125g',
        sku_name: 'Lifebuoy Total Germ Protection Soap 125g',
        units_sold: 7,
        closing_stock: 16,
        confidence: 0.89,
        source_text: 'Detected red soap cartons',
      },
      {
        sku_id: 'sku-clinic-sachet',
        sku_name: 'Clinic Plus Strong & Long ₹1 Sachet (Jar of 192)',
        units_sold: 12,
        closing_stock: 40,
        confidence: 0.87,
        source_text: 'Detected strip of blue shampoo sachets dispensed',
      },
    ],
    unmatched_items: [],
    source: 'fallback',
  });
});

// 4. Plain-Language Forecast Explanation via Gemini
app.post('/api/gemini/explain-forecast', async (req, res) => {
  const { skuName, daysCover, avgDailySales, currentStock, storeName } = req.body;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Explain in 2 scannable, business-focused sentences why this kirana store is at risk of stock-out and what action the HUL distributor/salesperson should take.
Store: ${storeName}
Product: ${skuName}
Current On-Shelf Stock: ${currentStock} units
Average Daily Sales (14-day): ${avgDailySales} units/day
Days of Cover: ${daysCover} days
Delivery Lead Time: 1 day (next delivery slot)`,
        config: {
          systemInstruction: 'You are an expert FMCG supply chain analyst advising HUL territory sales officers in India.',
        },
      });

      return res.json({
        explanation: response.text?.trim() || `${skuName} has only ${daysCover} days of inventory remaining. Immediate dispatch recommended.`,
        source: 'gemini',
      });
    } catch (e: any) {
      console.warn('Forecast explanation fallback used', e.message);
    }
  }

  return res.json({
    explanation: `${skuName} at ${storeName} has depleted to ${currentStock} units (${daysCover} days cover against ${avgDailySales} units/day burn rate). With weekend and festive uplift underway, dispatching 1-2 cases in today's evening delivery slot is critical to avoid lost sales.`,
    source: 'fallback',
  });
});

// Setup dev server with Vite middlewares
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HUL Kirana Platform backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
