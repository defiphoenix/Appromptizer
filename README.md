# Appromptizer PRO

> **SaaS Master Prompt Generator for Google AI Studio & ChatGPT Work**

Appromptizer turns simple one-sentence product ideas into complete, production-grade 20+ section SaaS Master Prompts. It outputs battle-tested software blueprints equipped with explicit database schemas, REST & state API endpoints, zero-data cold-start contracts, automated business logic rules, and verification checklists.

---

## 🌟 Key Features

### 🚀 Fast Concept Presets
Quickly jumpstart prompt generation with built-in presets tailored for real-world software archetypes:
* **Budget Tracker (`BudgetIQ`)**: Automated spending categorization, budget thresholds, income vs. expense charts, and CSV imports.
* **Habit Tracker Mobile App (`HabitPulse`)**: Streak counters, completion history, customizable reminder schedules, and progress analytics.
* **Trading App (`TradeX`)**: Live price feeds, paper trading order execution, profit/loss tracking, and AI market sentiment analysis.
* **Social Community App (`TribeHub`)**: Topic discussion feeds, member profiles, event scheduling, and tiered paid memberships with Stripe.

### 🛠️ Multi-Stack Architecture Support
Choose from primary production architecture stacks to align database schemas and API specifications:
* **Express + PostgreSQL**: Relational schemas, Prisma / Drizzle ORM, RESTful routes.
* **React + Firebase**: Firestore NoSQL schemas, real-time subscriptions, Firebase Auth.
* **Cloudflare + ViNext**: Cloudflare D1 / KV, Edge functions, ViNext routing.
* **Next.js + Supabase**: PostgreSQL with Row Level Security (RLS), Supabase Auth & Storage.

### 🔍 4 Interactive View & Export Modes
1. **Full Spec View**: Monospace markdown display with real-time character count, word count, token estimation (~tokens), and quick copy options.
2. **Section Breakdown**: Searchable sidebar drawer to inspect individual sections (e.g., *Database Schema*, *Page Specifications*, *Business Logic*, *Cold-Start Contract*).
3. **Variable Injector**: Replace runtime placeholders (`<APP_NAME>`, `<EXACT_SITE_URL>`, `<EXACT_DRIVE_FOLDER_NAME>`, `<TIMEZONE>`) dynamically before copying.
4. **AI Refinement Studio**: Powered by Google Gemini (`@google/genai`) to expand or adjust specific prompt sections on the fly (e.g., adding multi-currency, OAuth, or RBAC).

### 🏆 Architectural Quality Audit
Every generated prompt is evaluated against a 100-point structural scoring system across four key dimensions:
* **Database Schema Precision**
* **Page & UI Specifications**
* **Automated Business Logic**
* **Zero-Data Cold Start Contract**

### 📦 Prompt Vault
Locally save, filter, search, and reload previous blueprints so you never lose a generated master prompt.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion
* **Backend**: Node.js, Express, `esbuild`, `tsx`
* **AI Engine**: Google Gen AI SDK (`@google/genai`) with server-side Gemini API routing

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or bun

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file at the root of your project (refer to `.env.example`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: The Gemini API key is kept securely on the server side in `server.ts` and is never exposed to client-side bundles.

### 3. Development Mode

Run the Express dev server with Vite middleware integration:

```bash
npm run dev
```

The application will be served at `http://localhost:3000`.

### 4. Production Build & Start

To compile both the Vite client assets and the bundled Express server (`dist/server.cjs`):

```bash
npm run build
npm start
```

---

## 📁 Directory Overview

```
├── .env.example              # Sample environment variables
├── metadata.json             # App metadata & platform capabilities
├── package.json              # Dependencies and build scripts
├── server.ts                 # Express server with Vite middleware & Gemini API endpoint
├── src/
│   ├── App.tsx               # Main application controller and layout
│   ├── index.css             # Tailwind CSS entry with wavy background styles
│   ├── main.tsx              # React entry point
│   └── components/
│       ├── Navbar.tsx            # Header navigation & tab switcher
│       ├── SimplePromptForm.tsx  # Core prompt generator input form & concept presets
│       ├── PromptOutputView.tsx  # Interactive prompt viewer, variable injector & AI refinement
│       ├── TemplateGallery.tsx   # Benchmark SaaS archetype specs
│       ├── SavedPromptsDrawer.tsx# Prompt vault for stored blueprints
│       └── QualityAnalyzerModal.tsx # Architectural quality audit modal
└── vite.config.ts            # Vite configuration
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
