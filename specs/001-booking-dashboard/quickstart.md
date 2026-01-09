# Quickstart: Hostal Booking Dashboard

## Prerequisites
- Node.js 20+
- Supabase Project (Create one at supabase.com)
- Vercel Account (Optional, for deployment)

## Setup

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd <repo>
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   CRON_SECRET=your_secret_for_sync_api
   ```

3. **Database Setup**
   Run the SQL script from `specs/001-booking-dashboard/data-model.md` in your Supabase SQL Editor to create tables.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Key Commands

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run lint`: Check linting

## Deployment

1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables in Vercel Project Settings.
4. Setup Vercel Cron for `/api/sync` to run every 30 minutes.
