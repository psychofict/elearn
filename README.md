# eLearn

**E-learning platform for Zimbabwean high school students preparing for ZIMSEC O Level and A Level examinations.**

Built as a flagship product at GliTech to make quality exam preparation accessible to students across Zimbabwe.

## Features

- **Structured Curriculum** — 20+ subjects across O Level and A Level, with 70+ detailed lessons aligned to the ZIMSEC syllabus
- **Progress Tracking** — Lesson completion tracking, study streaks, and per-subject progress percentages
- **Learning Analytics** — Dashboard with daily activity, total study time, streak metrics, and subject-by-subject breakdowns
- **Personalized Settings** — Level preference (O Level / A Level / Both), font size, notification preferences
- **Search & Filter** — Find lessons by name or filter by certification level

## Subjects

**O Level:** Mathematics, English, Combined Science, History, Geography, Accounting, Business Studies, Ndebele

**A Level:** Pure Mathematics, Physics, Chemistry, Biology, Economics, Literature in English

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons

**Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite

**Auth & Security:** JWT, bcryptjs, Helmet, Zod validation

## Getting Started

```bash
# Backend
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev

# Frontend
cd project
npm install
npm run dev
```

## Project Structure

```
elearn/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── seed.ts               # Demo data seeding
│   │   ├── middleware/            # Auth & error handling
│   │   └── routes/               # Auth, progress, settings, analytics
│   └── prisma/
│       └── schema.prisma         # Database schema
└── project/
    └── src/
        ├── components/
        │   └── ELearnPlatform.tsx # Main platform UI
        ├── lib/api.ts            # API client
        └── types.ts              # TypeScript interfaces
```

## Context

All curriculum content is tailored to the Zimbabwe School Examinations Council (ZIMSEC) standards, with locally relevant examples and references throughout lessons.
