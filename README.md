# FixIt: Civic Issue Reporting Platform

AI-powered civic reporting that holds authorities accountable. Built for communities.

## Overview
FixIt allows citizens to snap photos of civic issues (like potholes, broken streetlights, or garbage). The platform uses AI to automatically classify the issue and route it to the correct department, while plotting it on a public, transparent heatmap.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Database/Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui
- **Maps:** react-leaflet + OpenStreetMap
- **State:** Zustand
- **Animations:** Framer Motion

## Local Development Setup

> **Note:** If you are experiencing network issues with `npm install`, ensure you are not behind a restrictive proxy or VPN.

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment Variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Database Setup**
   Run the SQL migration script located in `scripts/seed/schema.sql` (if you created one) in your Supabase SQL editor to create the `reports` and `profiles` tables.

4. **Seed Mock Data**
   We have provided a seed script populated with realistic data from Bangalore (Indiranagar, Koramangala, etc.).
   
   Run the seed script using `ts-node`:
   ```bash
   npx ts-node scripts/seed/seed.ts
   ```
   *This will create mock Citizen and Admin users, along with several pre-populated reports.*

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to view the application.

## User Roles & Testing
After seeding, you can log in with the following mock accounts:
- **Citizen:** `citizen1@example.com` (Password: `Password123!`)
- **Dept Admin:** `admin.roads@bangalore.gov.in` (Password: `Password123!`)
- **Super Admin:** `super@fixit.local` (Password: `Password123!`)
