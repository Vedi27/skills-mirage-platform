# skills-mirage-platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_JYZzEJShlSpxUMRdrkT0Fw44yd9P)

## Authentication (Google + Supabase)

The app supports **Google sign-in** and email/password. User data is stored in Supabase and validated via Supabase Auth.

### 1. Supabase

- Create a project at [supabase.com](https://supabase.com) and add to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- In **Authentication → URL Configuration**, set **Site URL** (e.g. `http://localhost:3000`) and add **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - Your production URL, e.g. `https://yourdomain.com/auth/callback`
- Run the SQL in `scripts/001_create_profiles.sql`, then `scripts/002_profiles_google_oauth.sql` in the Supabase SQL editor to create/update the `profiles` table and trigger.

### 2. Google OAuth

- In [Google Cloud Console](https://console.cloud.google.com/), create (or select) a project and enable the **Google+ API** / **Google Identity** (Credentials).
- Create an **OAuth 2.0 Client ID** (Web application). Add:
  - **Authorized JavaScript origins:** `http://localhost:3000`, your production origin (e.g. `https://yourdomain.com`)
  - **Authorized redirect URIs:** `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback` (from Supabase Dashboard → Authentication → Providers → Google)
- In Supabase Dashboard → **Authentication → Providers**, enable **Google** and paste the Client ID and Client Secret.

After this, "Continue with Google" on the login and sign-up pages will work; the auth callback will exchange the code for a session and new users will get a row in `profiles` (including `full_name` and `avatar_url` for Google sign-ins).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/Vedi27/skills-mirage-platform" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
