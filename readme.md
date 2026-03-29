# GolfGives — Golf Charity Subscription Platform

> Play. Score. Give. Win. — A subscription-based golf platform combining Stableford score tracking, monthly prize draws, and charity fundraising.

---

## 🌐 Live Demo

Deploy to Vercel following the steps below. Add your Supabase credentials as environment variables.

---

## ✨ Features

### For Users
- **3-step signup** — account details → plan selection → charity choice
- **Monthly/Yearly subscriptions** — £9.99/mo or £99.99/yr
- **Rolling 5-score system** — enter Stableford scores (1–45), oldest auto-removed
- **Monthly draw participation** — scores compared automatically against draw numbers
- **Charity selection** — choose from 5 charities, set contribution % (10–50%)
- **Win prizes** — 3, 4, or 5 number matches → earn prize pool shares
- **Full dashboard** — scores, draw results, subscription status, charity impact

### For Admins
- **User management** — view all users, subscription statuses, plan types
- **Draw engine** — random or algorithm-based draws, simulation mode, publish controls
- **Jackpot rollover** — automatic if no 5-match winner
- **Winner verification** — approve/reject submissions, mark payouts as complete
- **Charity management** — add, edit, delete charities
- **Analytics overview** — total users, active subs, prize pool, charity totals

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Supabase (Auth + PostgreSQL) |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| State | React useState (no Redux) |
| Auth | Supabase Auth (email/password + JWT) |

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd golf-charity-platform
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a **new project**
2. Note your **Project URL** and **anon public key** (Settings → API)
3. Note your **service_role secret key** (Settings → API → Service Role)

### 3. Run the Database Schema

1. In Supabase dashboard, open **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and click **Run**

This will create all tables, RLS policies, and seed 5 charities.

### 4. Create Admin User

After running the schema, create your admin user:

1. Go to **Authentication → Users** in Supabase
2. Click **Add User** → enter `admin@golfgives.com` / `admin123`
3. Copy the user's UUID
4. In SQL Editor, run:

```sql
UPDATE user_profiles
SET is_admin = true, full_name = 'Admin User'
WHERE id = '<paste-uuid-here>';
```

### 5. Create Test User

1. Sign up at `/signup` with `demo@golfgives.com` / `password123`
2. Or create via Supabase Auth dashboard

### 6. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

> ⚠️ Never commit `.env.local` to version control

### 7. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment to Vercel

1. Push your code to a **new GitHub repository**
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Add the three environment variables (same as `.env.local`)
5. Click **Deploy**

> ✅ Use a **new Vercel account** and **new Supabase project** as required

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@golfgives.com | admin123 |
| Demo User | demo@golfgives.com | password123 |

---

## 📁 Project Structure

```
golf-charity-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # 3-step signup with charity selection
│   ├── dashboard/page.tsx          # User dashboard (server component)
│   ├── admin/page.tsx              # Admin panel (server component)
│   ├── contact/page.tsx            # Contact page (reference UI)
│   ├── api/
│   │   ├── scores/route.ts         # Score CRUD + rolling-5 logic
│   │   ├── subscriptions/route.ts  # Subscription creation
│   │   ├── draws/route.ts          # Draw engine + prize calculation
│   │   └── admin/
│   │       ├── verify/route.ts     # Winner verification
│   │       ├── payout/route.ts     # Mark payout complete
│   │       └── charities/route.ts  # Charity management
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Homepage
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── CharitySection.tsx
│   │   ├── DrawSection.tsx
│   │   └── CTASection.tsx
│   ├── dashboard/
│   │   └── DashboardClient.tsx
│   └── admin/
│       └── AdminClient.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client
│   ├── drawEngine.ts               # Draw generation + prize calculation
│   └── scoreUtils.ts               # Score validation + rolling-5 logic
├── types/
│   └── database.ts                 # TypeScript interfaces
├── middleware.ts                    # Route protection
├── supabase-schema.sql             # Full DB schema + RLS + seed data
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🎯 Testing Checklist

- [ ] User signup (3-step flow) + login
- [ ] Subscription flow (monthly and yearly)
- [ ] Score entry — rolling 5-score logic (add 6th → oldest removed)
- [ ] Score validation (1–45 range enforced)
- [ ] Draw system — simulate mode shows preview numbers
- [ ] Draw system — run official draw calculates winners
- [ ] Jackpot rollover when no 5-match winner
- [ ] Charity selection + contribution percentage slider
- [ ] Prize split across multiple winners in same tier
- [ ] User dashboard — all modules visible and functional
- [ ] Admin panel — user list, draw engine, winner verification, payout
- [ ] Route protection — unauthenticated → redirected to login
- [ ] Admin redirect — non-admins cannot access /admin
- [ ] Responsive design — mobile and desktop

---

## 🔐 Security Notes

- All routes protected via middleware + Supabase JWT
- Row Level Security (RLS) enabled on all tables
- Service role key used only server-side (never exposed to browser)
- Score ownership verified before deletion
- Admin status checked server-side on all admin API routes

---

## 📐 Design System

Color palette extracted from reference image (soft teal/mint):

| Token | Value | Usage |
|-------|-------|-------|
| brand-500 | `#2d9d92` | Primary buttons, icons, accents |
| brand-100 | `#d9f0ed` | Soft backgrounds, badges |
| mist-50 | `#f0f9f8` | Page backgrounds |
| navy-800 | `#122120` | Headings, sidebar |

Typography: **Playfair Display** (headings) + **DM Sans** (body)

---

Built with purpose for Digital Heroes Full-Stack Trainee Selection.