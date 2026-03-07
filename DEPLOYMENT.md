# Skills Mirage Platform – Deployment Guide

Step-by-step guide to deploy your website with the chatbot integrated.

---

## Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js 18+](https://nodejs.org/) installed
- A [Supabase](https://supabase.com) project (you already have one)
- A [Vercel](https://vercel.com) account (free tier works)

---

## Step 1: Prepare Your Supabase Project

### 1.1 Verify your tables

Ensure these tables exist in your Supabase project:

- `profiles` (id, job_title, city, years_of_experience, daily_tasks, full_name, avatar_url, etc.)
- `naukri_jobs` (id, jobtitle, company, stars, experience, location, skills, posted, postdate, site_name, uniq_id, created_at)
- `jobs` (for market stats and trends)
- `courses` (for reskilling page)
- `chat_messages` (for chatbot memory)

Run your SQL scripts in Supabase Dashboard → SQL Editor if any tables are missing.

### 1.2 Add production redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **URL Configuration**
3. Add your production URL to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - Replace `your-app` with your actual Vercel project name

---

## Step 2: Push Code to GitHub

1. Initialize git (if not already):
   ```bash
   cd skills-mirage-platform
   git init
   ```

2. Create a `.gitignore` (if missing) and ensure it includes:
   ```
   .env
   .env.local
   .env*.local
   node_modules
   .next
   ```

3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel

### 3.1 Import project

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub recommended)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure environment variables

Before deploying, add these in **Settings** → **Environment Variables**:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mwapuwqoofloyjgtngbh.supabase.co` | From Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | From Supabase → Settings → API (keep secret) |

**Important:** Use the same values as in your `.env.local`. Do not commit `.env.local` to git.

### 3.3 Deploy

1. Click **Deploy**
2. Wait for the build to finish (usually 1–2 minutes)
3. Your site will be live at `https://your-project.vercel.app`

---

## Step 4: Verify Chatbot Integration

Your chatbot uses:

- **Supabase** for auth and data-backed answers (jobs, courses, etc.)
- **Rule-based logic** (no paid LLM API required)
- **chat_messages** table for persistent chat history

### 4.1 Test the chatbot

1. Open your deployed site
2. Sign in (or create an account)
3. Go to **Intel Agent** (chat)
4. Try prompts such as:
   - "How many BPO jobs are in Indore right now?"
   - "Show me paths that take less than 3 months"
   - "Why is my risk score so high?"

If these work, the chatbot is integrated correctly.

### 4.2 If chatbot fails

- Check Supabase **Authentication** → **URL Configuration** (redirect URLs)
- Confirm `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check Vercel **Functions** logs for errors

---

## Step 5: Optional – Custom Domain

1. In Vercel: **Settings** → **Domains**
2. Add your domain (e.g. `skillsmirage.com`)
3. Update DNS as instructed by Vercel
4. Add the new domain to Supabase redirect URLs:
   - `https://skillsmirage.com/auth/callback`

---

## Environment Variables Summary

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase → Settings → API → service_role |

---

## Troubleshooting

### Build fails

- Run `npm run build` locally and fix any errors
- Ensure all dependencies are in `package.json`

### Auth redirect loop

- Add the exact production URL to Supabase redirect URLs
- Use `https://` (not `http://`)

### Chatbot returns 401

- User must be logged in
- Supabase auth cookies must be sent; ensure the domain is allowed in Supabase

### No data on Market / Reskilling pages

- Ensure `naukri_jobs`, `jobs`, and `courses` have data
- Confirm `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel (used for server-side reads)

---

## Quick Reference

```bash
# Local development
npm run dev

# Production build (test before deploy)
npm run build
npm run start

# Deploy (after connecting to Vercel)
git push origin main   # Vercel auto-deploys on push
```
