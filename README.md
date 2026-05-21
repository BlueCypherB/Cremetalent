# CrèmeTalent

African creative talent platform connecting vetted creatives with clients across the continent. The platform supports three user roles — **Admin**, **Talent**, and **Client** — each with dedicated authentication and dashboard flows.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Backend / DB | Supabase (Postgres + Auth + Storage + Edge Functions) |
| State management | TanStack React Query 5 |
| Forms | React Hook Form 7 + Zod 3 |
| Email | Resend API (via Supabase Edge Functions) |
| Charts | Recharts |
| Routing | React Router DOM 6 |

---

## Local Development

### Prerequisites

- Node.js ≥ 18 and npm
- A Supabase project (free tier works)
- A Resend account (for transactional emails)

### 1. Clone and install

```sh
git clone <repo-url>
cd cremetalent
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Both values are found in your Supabase dashboard under **Project Settings → API**.

### 3. Database setup

Run `supabase/schema.sql` in the Supabase SQL Editor. This creates all tables, indexes, triggers, and RLS policies.

After running the schema, create your first admin user:

1. Go to **Authentication → Users** in the Supabase dashboard and create a user with email + password.
2. Copy the user's UUID and run:

```sql
INSERT INTO public.admin_users (id, full_name, role)
VALUES ('<UUID>', 'Your Name', 'super_admin');
```

### 4. Supabase Edge Functions

The platform uses two edge functions for email and account invitations. Set these secrets in your Supabase project under **Project Settings → Edge Functions**:

```
RESEND_API_KEY=<your-resend-api-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SITE_URL=https://<your-production-domain>   # or http://localhost:5173 for dev
```

Deploy the functions:

```sh
supabase functions deploy send-email
supabase functions deploy invite-talent
supabase functions deploy invite-client
```

### 5. Storage buckets

Create two public storage buckets in **Storage** in the Supabase dashboard:

- `resumes` — talent resume PDFs
- `profiles` — talent profile photos

Then apply the storage RLS policies from `supabase/schema.sql`.

### 6. Start the dev server

```sh
npm run dev
```

---

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard panels (stats, talent lists, blog/course/webinar admins)
│   ├── client/         # Client intake form, client route guard
│   ├── talent/         # Application form, talent card, filter sidebar, profile modal, talent route guard
│   └── ui/             # shadcn/ui primitives
├── contexts/
│   └── AuthContext.tsx # Session, role detection (admin / talent / client), signIn/signOut
├── data/
│   └── categories.ts   # Single source of truth for specializations, experience levels, availability
├── hooks/
│   └── useTalentPool.ts # Talent browsing, filtering, and AI-style matching logic
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── database.types.ts # Generated table row types
├── pages/
│   ├── admin/          # AdminLogin, AdminDashboard
│   ├── client/         # ClientLogin, ClientSetPassword, ClientDashboard, ClientJobForm
│   ├── talent/         # TalentLogin, TalentSetPassword, TalentProfile
│   └── ...             # Public pages: Index, TalentPool, Jobs, Blog, Projects, etc.
├── services/
│   ├── talentService.ts # approveTalent, rejectTalent, deleteTalent
│   └── clientService.ts # createJob, publishJob, getOpenJobs, etc.
└── types/
    └── talent.ts        # TalentData interface used across the browsing UI

supabase/
├── schema.sql                    # Full database schema + RLS policies
└── functions/
    ├── send-email/index.ts       # Generic email dispatcher (Resend API)
    ├── invite-talent/index.ts    # Creates auth account + sends invite to approved talent
    └── invite-client/index.ts   # Creates auth account + sends invite to onboarded client
```

---

## User Roles & Flows

### Admin
- Login at `/admin/login`
- Dashboard at `/admin/dashboard`
- Can: review talent applications (approve / reject / delete), manage client inquiries, invite clients, manage projects / blog / courses / webinars / newsletter subscribers

### Talent
- Apply at `/join-talent-pool` (no account required)
- On admin approval → receives invite email → sets password at `/talent/set-password`
- Login at `/talent/login` · Profile at `/talent/profile`
- Can: edit bio, skills, availability, portfolio URL, upload resume and profile photo

### Client
- Submit project brief at `/client-intake-form` (no account required)
- Admin reviews intake and invites client → invite email → sets password at `/client/set-password`
- Login at `/client/login` · Dashboard at `/client/dashboard`
- Can: post job listings, publish / close listings, view their posted jobs

### Public
- Browse approved talent at `/talent-pool` (filter + match)
- Browse open job listings at `/jobs`
- View projects at `/projects`, blog at `/blog`, training at `/training-resources`

---

## Key Database Tables

| Table | Purpose |
|---|---|
| `talent_applications` | Talent profiles (pending → approved → rejected); linked to auth via `user_id` |
| `client_intake_submissions` | 8-step client project briefs; linked to client account via `client_account_id` |
| `client_accounts` | Client role table (PK = `auth.users.id`) |
| `job_listings` | Job posts owned by clients; `status`: draft / open / closed |
| `admin_users` | Admin role table (PK = `auth.users.id`) |
| `projects` | Crowdfunding-style projects managed by admin |
| `blog_posts` | Blog content managed by admin |
| `courses` | Training courses managed by admin |
| `webinars` | Webinar listings managed by admin |
| `newsletter_subscribers` | Email subscribers |

---

## Available Scripts

```sh
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
```
