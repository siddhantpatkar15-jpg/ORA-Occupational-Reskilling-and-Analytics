# ORA — Occupational Reskilling & Analytics

> **Tagline**: *Discover Skills. Bridge Gaps. Build Careers.*  
> **Mission**: An enterprise-grade, responsive, AI-enabled web platform for occupational competency assessment, personalized reskilling, career development, and workforce readiness analytics.

---

## 🌟 Executive Summary

ORA addresses the central workforce dilemma: **Organizations face massive skill deficits, while employees lack transparent, actionable guidance on which competencies to acquire next.**

ORA solves this by answering six fundamental questions:
1. **What skills does a person currently possess?** (Assessed vs verified vs self-reported)
2. **What skills are required for their target occupation?** (Structured occupational taxonomy)
3. **Which competencies are missing?** (Transparent deterministic gap algorithm)
4. **What training should they complete next?** (Personalized, prerequisite-aware roadmap)
5. **Has their competency improved after training?** (Post-course reassessment & evidence verification)
6. **Which skills are becoming critical to the organization?** (Real-time workforce analytics)

---

## 👥 Demo User Accounts

The database is pre-seeded with deterministic, reproducible demonstration profiles:

| Role | Name | Email | Password | Pre-configured Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Learner** | Arjun Sharma | `learner@ora-demo.com` | `OraDemo2024!` | Target: Data Analyst, active enrollments, completed Excel assessment, active roadmap |
| **Trainer** | Priya Patel | `trainer@ora-demo.com` | `OraDemo2024!` | Lead Data Science Trainer, 6 published courses, 5 question banks |
| **Admin** | Rajesh Kumar | `admin@ora-demo.com` | `OraDemo2024!` | Organization Administrator, access to workforce analytics & CSV employee import |
| **Learner (Extra)** | Meera Singh | `meera@ora-demo.com` | `OraDemo2024!` | Target: Full Stack Developer |
| **Learner (Extra)** | Vikram Desai | `vikram@ora-demo.com` | `OraDemo2024!` | Target: Product Manager |

*All demo accounts can be pre-filled with a single click on the `/login` page.*

---

## 🔄 The 10-Step SIH Demonstration Workflow

ORA features a connected, end-to-end operational scenario that runs with real persistent data:

1. **Login & Role Recognition**: Learner logs in at `/login` as `learner@ora-demo.com`. The platform detects their role and renders the learner learning dashboard.
2. **Target Occupation Selection**: Learner navigates to `/occupations` or `/profile` and sets **Data Analyst** as their target career goal.
3. **Skill Assessment**: Learner takes a timed knowledge assessment at `/assessments/asm-sql`. Answer multiple-choice questions with immediate scoring.
4. **Competency Profile Update**: Submitting the assessment automatically recalculates their verified competency score in the database (e.g. SQL evaluated to Level 4).
5. **Transparent Skill-Gap Analysis**: Learner visits `/skills` to view the **Deterministic Gap Analysis**:
   $$\text{gap} = \max(0, \text{required\_level} - \text{current\_level})$$
   $$\text{priority} = \text{gap} \times \text{importance\_weight}$$
   Gaps are prioritized: SQL (Critical), Python (Important), Statistics (Critical).
6. **Personalized Reskilling Roadmap**: At `/roadmap`, ORA generates an adaptive sequence with estimated hours, prerequisite ordering, and course linkages.
7. **Training & Curriculum**: Learner opens `/courses` and enrolls in *"SQL Fundamentals & Relational Querying"*, progressing through modules and lessons.
8. **Reassessment & Evidence Verification**: Learner submits project evidence and retakes the follow-up assessment, confirming benchmark progression.
9. **Trainer Coaching & Review**: Trainer logs in as `trainer@ora-demo.com` to review submitted learner evidence at `/trainer/learners`, assign verified proficiency levels, and generate new questions using the **AI Question Assistant** at `/trainer/assessments`.
10. **Workforce Analytics for Leadership**: Admin logs in as `admin@ora-demo.com` to inspect aggregate organization readiness across departments (Engineering, Data Science, Product) at `/admin/analytics` and export CSV reports.

---

## 🏗️ Technology Architecture

- **Frontend**: Next.js 16 (App Router, React 19 Canary, Server & Client Components, TypeScript)
- **Styling & Design System**: Tailwind CSS 4, Lucide React icons, accessible headless UI primitives
- **Data Visualization**: Recharts (Workforce Readiness Bar Charts, Competency Radar, Participation Trends)
- **Database & ORM**: SQLite (`better-sqlite3`) with **Drizzle ORM** (Schema designed for zero-friction PostgreSQL production migration)
- **Authentication**: Custom JWT session management with `jose`, `bcryptjs` password hashing, HttpOnly secure cookies, and Next.js 16 `proxy.ts` request protection
- **Internationalization (i18n)**: Translation system supporting **English** and **हिन्दी (Hindi)**
- **Explainable AI**: Rule-based deterministic skill-gap engine + interactive contextual AI Assistant

---

## 📊 Database Schema Summary

The relational schema includes 20+ models defined in `lib/db/schema.ts`:

- `users` (id, email, password_hash, role, organization_id, status, language)
- `organizations` & `departments` (Multi-tenant structure)
- `learner_profiles` & `trainer_profiles` (Extended metadata, education, target role)
- `occupations` (Catalog of jobs, seniority, sample salary, demand level)
- `skills` & `related_skills` (Competency taxonomy with 8 categories)
- `occupation_skills` (Required proficiency 1-5, importance: critical/important/nice_to_have)
- `assessments`, `questions`, `assessment_attempts`, `assessment_responses` (Timed test engine)
- `learner_competencies` & `competency_evidence` (Proficiency tracking across self-reported, assessed, and trainer-verified evidence)
- `courses`, `course_modules`, `enrollments`, `module_progress` (Training LMS engine)
- `learning_roadmaps` & `roadmap_steps` (Personalized reskilling sequence)
- `certificates` (Cryptographic certificate numbers with public verification)
- `notifications` & `audit_logs` (System activity & audit tracking)

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- Node.js 20+ or 24+
- npm 10+

### 2. Environment Setup
The `.env.local` file is pre-configured for local execution:
```env
DATABASE_URL=./data/ora.db
JWT_SECRET=ora-dev-secret-key-change-in-production-abc123xyz
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ORA
```

### 3. Database Seeding
To populate or reset the database with full demonstration data:
```bash
npx tsx lib/db/seed.ts
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Data Privacy

1. **Role-Based Access Control (RBAC)**: Enforced both at the UI layer and verified on every server action / API route handler (`lib/auth/permissions.ts`).
2. **Password Security**: Passwords hashed with `bcryptjs` (salt rounds: 10). Passwords are never stored or returned in plain text.
3. **Session Cookies**: Encrypted JWTs stored in `HttpOnly`, `SameSite=lax`, `Secure` cookies.
4. **Input Validation**: Server-side parsing and sanitization using `zod` schemas on all inputs.
5. **No Secret Leaks**: Client bundles contain zero API secrets or administrative keys.

---

## 🛡️ Ethical AI & Limitations Notice

- **No False Claims**: Labor market demand indicators and salary benchmarks are explicitly labeled as *illustrative sample data*.
- **Evidence Hierarchy**: Self-reported proficiencies are never treated as verified expertise. A distinction is maintained between *Self-Reported*, *Knowledge Assessed*, and *Trainer-Verified* skills.
- **No Employment Guarantees**: ORA clearly states that completing roadmaps develops competencies and provides verified credentials, but does not guarantee employment or promotion.
- **Explainable by Design**: Recommendations are produced by transparent, deterministic formulas rather than opaque black-box models.
