import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client on server-side
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Appromptizer API', timestamp: new Date().toISOString() });
});

// SYSTEM PROMPT FOR MASTER SAAS PROMPT GENERATION
const SYSTEM_PROMPT_TEMPLATE = `You are the master prompt engineer for AI coding assistants (ChatGPT Work, Google AI Studio, Claude, Cursor, Windsurf).
Your goal is to convert simple SaaS product ideas into hyper-detailed, production-grade, 20+ section "SaaS Master Prompts" following the exact benchmark structure provided below.

BENCHMARK MASTER PROMPT FORMAT TO REPLICATE:
# MASTER PROMPT — START

You are my product engineer inside [AI Platform]. Build and publish a complete, private, mobile-friendly [SaaS Category] named **[AppName]**.

Do the work, not merely describe a plan or produce a mockup. Use [Tech Stack & Server Architecture].

Follow this specification exactly. Do not omit a page, control, persistence behavior, empty state, import path, or verification step. Do not seed sample data unless specified as config.

## 1. Non-negotiable product rules
(12-15 numbered strict rules covering: single deployment site, privacy, durable database schema bindings, file/asset storage, no browser localStorage source-of-truth, API bridges for integrations, zero sample/fake financial/domain records on cold start, configuration vs transaction/domain data separation, complete interactive UI controls with lucide-react icons, text readability, mobile touch target sizes >=44px, secret/token protection)

## 2. Build and setup sequence
(Numbered step-by-step sequential setup tasks for the AI engineer to execute sequentially: resource verification, folder/service lookup, DB schema creation, endpoint confirmation, automation scheduling, verification, final reporting)

## 3. Empty-start contract
(Explicit exact cold-start initial values: transactions/records = [], documents = [], goals = [], charts empty states, totals = $0.00, no fake recent activity. Define starter configuration definitions like category/lookup names)

## 4. Technical architecture and durable storage
### 4.1 Database tables & Schema
(Complete explicit SQL or D1 schema with column names, datatypes, PRIMARY KEYs, NOT NULL constraints, DEFAULT values, UNIQUE fingerprint constraints, ISO date formats, JSON arrays, and foreign references)
### 4.2 Object storage / bucket rules
(Key naming conventions, max upload size limits e.g. 20MB, file types, security access)
### 4.3 State API (GET /api/state)
(Exact JSON payload specification returned by GET /api/state)
### 4.4 Resource APIs (POST/PATCH/DELETE /api/[resources])
(Validation, deduplication fingerprint logic e.g. date + "|" + merchant/title + "|" + amount + "|" + account, tag normalization, update/delete specs)
### 4.5 Preferences API (PUT /api/preferences)
### 4.6 Document/Asset Upload API (POST /api/documents)
### 4.7 Complete data wipe API (DELETE /api/state)
(Requires exact strict confirmation string e.g. "DELETE ALL [APP_NAME] DATA", wipes database and R2/storage, resets drive/sync flags, re-initializes clean empty configuration)

## 5. Global application shell and visual system
(Design palette: light background, card styles, primary accent hex code, status colors, card radius, desktop sidebar width e.g. 238px, top bar height 76px, mobile bottom scrollable navigation, exact tab navigation order, global action buttons, modal dialog focus traps)

## 6. Detailed Page Specifications
(Provide comprehensive 6+ page specifications. For EACH page include exact controls, date/period filters, persistence, empty states, modals, calculations, and chart specs)
- Page 1: Dashboard (Date period selectors, summary metric cards with exact formulas, cash flow / trend charts, recent activity list, actionable insights)
- Page 2: Primary Data Records / Transactions (Search, filters, inline category/tag editing modal, Add entry modal with validation)
- Page 3: Automated Engine / Recurring & Subscriptions (Merchant normalization, candidate grouping, cadence detection windows, confidence metrics, keep/ignore actions)
- Page 4: Budget / Goals / Performance Trackers (Calculations, spending progress bars, over-budget states, modals)
- Page 5: Documents / Storage Vault (Upload zones, source tracking, status flags e.g. queued/stored/review)
- Page 6: Rules & Tag Management (When/Then rule creation, tag management, deduplication)
- Page 7: Settings & Danger Zone (Net worth/global setup, category management, sync settings, Erase all data confirmation)

## 7. Business Logic & Detection Algorithms (if applicable)
(Explicit mathematical rules, merchant normalization steps, cadence windows: weekly 5-9d, monthly 24-40d, confidence thresholds, false positive protection)

## 8. Integrations & Scheduled Automations
(Protected server endpoint specs e.g. POST /api/sync, schedule specs, error handling, token isolation)

## 9. Responsive behavior & Touch Guidelines
(Desktop 1440px, Tablet 768px, Mobile 390px rules, card reflow, chart responsiveness, mobile navigation)

## 10. Reliability and security behavior
(Parameterized queries, server validation, error states, UUIDs, non-sensitive logging)

## 11. Required functional verification checklist
(15-20 step verification checklist that the developer must test and confirm)

## 12. Completion response format
(Strict concise handoff report schema)

# MASTER PROMPT — END`;

// Generate SaaS Master Prompt API Endpoint
app.post('/api/generate-prompt', async (req, res) => {
  try {
    const {
      simplePrompt,
      appName = 'MySaaS',
      techStack = 'Express + Vite + React + Cloudflare D1/R2',
      database = 'Cloudflare D1 / SQL',
      storage = 'Cloudflare R2 Bucket',
      authType = 'Private Owner Access / OAuth',
      integrations = [],
      targetAudience = 'General SaaS Users',
      customRequirements = ''
    } = req.body;

    if (!simplePrompt || typeof simplePrompt !== 'string') {
      return res.status(400).json({ error: 'simplePrompt is required' });
    }

    const ai = getGenAI();

    const userInstructions = `
Target App Name: ${appName}
Simple Concept / User Request: "${simplePrompt}"
Selected Tech Stack: ${techStack}
Database Choice: ${database}
Object Storage Choice: ${storage}
Authentication Model: ${authType}
Integrations Requested: ${integrations.join(', ') || 'Standard REST APIs'}
Target Audience: ${targetAudience}
Additional Custom Notes: ${customRequirements}

Please generate a COMPLETE, exhaustive, production-ready Master SaaS Prompt for this product idea. Ensure all database table definitions are written out completely with real column names, data types, constraints, and fingerprint deduplication logic. Ensure all page specifications (at least 6-8 pages/tabs) are deeply articulated with exact formulas, inline editing, modals, and empty states. Match the 12-part benchmark structure provided in system instructions.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userInstructions,
      config: {
        systemInstruction: SYSTEM_PROMPT_TEMPLATE,
        temperature: 0.7,
      },
    });

    const generatedText = response.text || '';
    res.json({ prompt: generatedText });
  } catch (error: any) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ error: error.message || 'Failed to generate Master Prompt' });
  }
});

// Refine Prompt Endpoint
app.post('/api/refine-prompt', async (req, res) => {
  try {
    const { currentPrompt, instruction } = req.body;

    if (!currentPrompt || !instruction) {
      return res.status(400).json({ error: 'currentPrompt and instruction are required' });
    }

    const ai = getGenAI();

    const promptText = `
Here is an existing Master SaaS Prompt:

---
${currentPrompt}
---

The user wants the following modification/refinement:
"${instruction}"

Please revise the Master SaaS Prompt maintaining its exact structure, Markdown formatting, and high technical depth. Output the updated full Master Prompt.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an expert prompt engineer. Refine the given Master SaaS Prompt according to user instructions without losing any required sections or technical rigor.',
        temperature: 0.5,
      },
    });

    res.json({ prompt: response.text || currentPrompt });
  } catch (error: any) {
    console.error('Error refining prompt:', error);
    res.status(500).json({ error: error.message || 'Failed to refine prompt' });
  }
});

// Analyze Prompt Endpoint
app.post('/api/analyze-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const ai = getGenAI();

    const analysisPrompt = `
Analyze the following Master SaaS Prompt and return a JSON object evaluating its completeness and quality.

Prompt to evaluate:
---
${prompt}
---

Return JSON in this exact structure:
{
  "overallScore": number (0-100),
  "schemaScore": number (0-100),
  "pageSpecsScore": number (0-100),
  "businessLogicScore": number (0-100),
  "zeroDataContractScore": number (0-100),
  "verificationScore": number (0-100),
  "strengths": string[],
  "missingElements": string[],
  "recommendations": string[]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: analysisPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    res.json(parsedJson);
  } catch (error: any) {
    console.error('Error analyzing prompt:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze prompt' });
  }
});

// Serve frontend in dev and prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Appromptizer server running on http://localhost:${PORT}`);
  });
}

startServer();
