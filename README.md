# Skills Mirage – Workforce Intelligence Platform

**Skills Mirage** is a workforce intelligence platform for individual workers. It combines live job-market data, automation-risk analysis, and reskilling recommendations into a single dashboard, backed by Supabase and a data-aware AI assistant.

The platform is built as a modern **Next.js** app with **Supabase** for auth and data, Python services for scraping and scoring, and a separate **Streamlit** deployment for a powerful *Career Intelligence Chatbot*.

---

## Features

### Command Center (Overview)

- High-level "what this platform does" introduction
- Clear navigation into:
  - **Market Signals**
  - **Risk Analysis**
  - **Reskilling Paths**
  - **Castor** (chatbot)
  - **Profile**

### Market Signals

Personalized labour-market intelligence for the logged-in user's role:

- **Active job postings** – Total postings for the user's `job_title`
- **Average salary in ₹** – Computed from `jobs.payrate` for relevant roles
- **Demand index** – Simple 0–100 signal based on volume of postings
- **Top location** – Most active city/location for the role
- **Job Market Trends**
  - Combines `naukri_jobs` and `jobs` data
  - Groups postings by month across the available date range
  - Filtered by the user's `profiles.job_title`
- **Recent Job Postings**
  - Uses only `naukri_jobs`, filtered by the logged-in user's `job_title`
  - If no postings match, shows a clear *"No current job postings for that role"* message

**Tables used:** `profiles`, `naukri_jobs`, `jobs`

### Risk Analysis

An automation-exposure dashboard for the user's role:

- **Overall Risk Score** with risk level badge (Low / Medium / High / Critical)
- **Task Automation**, **AI Replacement Risk**, **Market Saturation**
- **Risk Gauge** visualization (radial gauge combining the above)
- **Task-level analysis** – Breaks down the role into daily tasks and highlights which are more automatable vs safer
- **Automation timeline** – Simple narrative on when different parts of the role may be impacted

Backed by Supabase `profiles` (`job_title`, `daily_tasks`, `city`) and a risk-analysis helper (`fetchRiskAnalysis`) that can be wired to your Python scoring engine.

### Reskilling Paths

Role-aware reskilling recommendations built on your `courses` table:

- Uses `profiles.job_title` to build an intelligent "search profile"
- **Role taxonomy** mapping (e.g. *software engineer* → system design, data structures, cloud computing, etc.)
- Filters and ranks courses by title/discipline matches and relevance scoring
- Groups courses into a small number of **paths** (disciplines), each showing top courses
- **Alignment metrics:** Current alignment, target alignment (e.g. 95%), and "critical skills to acquire"

Only shows courses that match the current user's `job_title`; if none match, displays *"No courses are available"* with an explanation.

### Castor (In-App Chatbot)

A built-in chatbot inside the dashboard:

- Uses Supabase for auth and chat history (`chat_messages` table)
- Contextual awareness: job title, city, years of experience
- **Rule-based, data-backed answers** (no external paid LLM API in this version), e.g.:
  - "How many BPO jobs are in Indore right now?"
  - "Show me paths that take less than 3 months"
  - "Why is my risk score so high?"
- Supports **English and Hindi** – detects Devanagari and answers in Hindi when appropriate
- Persists messages per user in Supabase

### Streamlit Career Intelligence Chatbot (Separate Deployment)

In addition to the in-app Intel Agent, a **separate Streamlit app** is deployed:

- **`Chatbot/chatbot.py`**
- Uses **Supabase** (`naukri_jobs`, `jobs`) as the primary data source and **Groq LLM** (`ChatGroq` with `llama-3.3-70b-versatile`)
- Optional Google Translate for Hindi/English handling
- Tool- and data-aware: reads tables to answer job-market questions and understands the detailed `naukri_jobs` and `jobs` schemas
- **Deployed independently on Streamlit** (as in your current setup)

---

## Architecture

### High-Level

- **Frontend:** Next.js (App Router) + React + Tailwind
- **Backend (web):** Next.js API routes (`/api/chat`, `/api/chatbot`)
- **Data:** Supabase (Postgres + Auth + RLS)
- **Python services:** Scrapers, risk scoring & vulnerability analysis, Streamlit chatbot

### Data Flow

- Users log in via Supabase Auth and get a `profiles` row
- Dashboard pages (server components) fetch profile via Supabase SSR client and market/jobs/courses via service-role admin client
- Risk engine can be wired to Python services that write scores into tables the app reads
- **Chat:** In-app Intel Agent uses `/api/chatbot` (Supabase + rules); Streamlit chatbot reads Supabase directly and uses Groq LLM for responses

---

## Tech Stack

| Layer        | Technologies |
|-------------|---------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Radix UI, Recharts |
| **Backend/API** | Next.js API routes, `@supabase/ssr`, `@supabase/supabase-js` v2 |
| **Data**    | Supabase Postgres |
| **Python**  | `supabase-py`, FastAPI (risk engine), Streamlit, `langchain_groq`, Groq LLM |
| **Tooling** | TypeScript, ESLint, Vercel (recommended for deployment) |

---

## Getting Started (Local)

### 1. Clone and install

```bash
git clone https://github.com/your-username/skills-mirage-platform.git
cd skills-mirage-platform

npm install
# or
pnpm install
```

### 2. Supabase configuration

Create a project in [Supabase](https://supabase.com), then in the dashboard:

- Copy **Project URL** and **anon key**
- Generate a **Service Role key** (server-only; never expose to the browser)

### 3. Environment variables

Create **`.env.local`** in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Create **`backend/.env`** for Python services:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_KEY=your_service_role_key
NODE_ENV=development
PORT=5000
PYTHON_PORT=8000
FRONTEND_URL=http://localhost:3000
```

> **Do not** commit `.env` or `.env.local` to Git.

### 4. Database schema

Ensure these tables exist in Supabase:

- `profiles` – user metadata (`job_title`, `city`, `years_of_experience`, `daily_tasks`, etc.)
- `naukri_jobs` – primary job feed
- `jobs` – secondary job feed (salary, location, etc.)
- `courses` – learning resources
- `chat_messages` – chat memory for the Intel Agent

Run the SQL in your `scripts/` folder or in the Supabase SQL editor if needed.

### 5. Run the Next.js app

```bash
npm run dev
```

Then open **http://localhost:3000**. Sign up or log in; once you set your **job title** on the Profile page, Market, Risk, and Reskilling sections will personalize to your role.

---

## Running the Streamlit Chatbot Locally

1. **Install dependencies** (in the `Chatbot` folder):

```bash
cd Chatbot
pip install -r requirements.txt
```

2. **Set environment variables** (or use `secrets.toml` on Streamlit Cloud):

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_or_anon_key
GROQ_API_KEY=your_groq_api_key
```

3. **Run the app:**

```bash
streamlit run chatbot.py
```

The Streamlit chatbot will be at **http://localhost:8501**.

---

## Project Structure (Key Parts)

```
app/
  dashboard/
    page.tsx              # Command Center overview
    market/page.tsx        # Market Signals (jobs, trends, stats)
    risk/page.tsx         # Risk Analysis
    reskilling/page.tsx   # Reskilling Paths
    chat/page.tsx         # Intel Agent (in-app chatbot)
  api/
    chat/route.ts         # LLM-style chat endpoint (if used)
    chatbot/route.ts      # Rule-based, Supabase-backed chatbot

backend/
  scrapers/
    naukri_scraper.py     # Naukri scraper → Supabase
  services/
    vulnerability_scoring.py   # Risk scoring (FastAPI-ready)

Chatbot/
  chatbot.py              # Streamlit app (Supabase + Groq LLM)

lib/supabase/
  server.ts               # SSR client
  admin.ts                # Service-role client

components/dashboard/
  market-trends-chart.tsx
  job-postings-table.tsx
  chat-interface.tsx
  risk-gauge.tsx
  ...
```

---

## Roadmap Ideas

- Role-based risk benchmarks by geography
- Deeper integration between Streamlit chatbot and in-app Intel Agent
- More granular salary insights (percentiles, experience bands)
- Notifications/alerts for changes in market demand for the user's role

---

## License

See the repository for license information.
