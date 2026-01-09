# Implementation Plan: Hostal Booking Dashboard & Guest Management

**Branch**: `001-booking-dashboard` | **Date**: 2026-01-09 | **Spec**: [specs/001-booking-dashboard/spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-booking-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a mobile-first web dashboard for hostel management, featuring a daily booking calendar, frequent guest management, and iCal synchronization with Booking.com. It uses Supabase for the backend/database and Vercel for hosting the frontend.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Node.js 20+ (LTS)
**Framework**: Next.js 14+ (App Router)
**Primary Dependencies**: 
- `@supabase/supabase-js` (Database & Auth)
- `ical.js` or `node-ical` (iCal parsing) [NEEDS RESEARCH]
- Calendar Component Library (e.g., `react-big-calendar`, `fullcalendar`, or custom) [NEEDS RESEARCH]
**Storage**: Supabase (PostgreSQL)
**Testing**: Vitest or Jest, React Testing Library
**Target Platform**: Mobile Web (Responsive), hosted on Vercel
**Project Type**: Web application (Next.js Monorepo or Single Repo)
**Performance Goals**: Dashboard load < 2s on 4G
**Constraints**: 
- Mobile-first UI
- Traditional Chinese (zh-TW)
- Single Admin Authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **User-Centric**: Mobile-first design addresses primary user context.
- [x] **Security**: Supabase Auth for single admin; RLS (Row Level Security) to protect data.
- [x] **Clean Code**: Will use standard Next.js App Router patterns.
- [x] **Error Handling**: Sync conflicts will generate warnings (not crashes).
- [x] **Testability**: Logic for sync and booking validation will be unit tested.
- [x] **Tech Constraints**: Matches Architecture (Web App), DB (Relational), API (Supabase).

## Project Structure

### Documentation (this feature)

```text
specs/001-booking-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js Structure (Supabase + Vercel)
src/
├── app/
│   ├── (auth)/login/     # Admin login
│   ├── dashboard/        # Main calendar view (Protected)
│   ├── guests/           # Guest management (Protected)
│   └── api/
│       └── sync/         # Cron job endpoint for iCal sync
├── components/
│   ├── ui/               # Shared UI components
│   ├── calendar/         # Booking calendar components
│   └── guests/           # Guest forms/lists
├── lib/
│   ├── supabase/         # Supabase client setup
│   ├── i18n/             # Chinese text constants
│   └── utils.ts
├── services/
│   ├── booking.ts        # Booking logic
│   ├── guest.ts          # Guest logic
│   └── sync.ts           # iCal sync logic
└── types/                # TypeScript definitions
```

**Structure Decision**: Standard Next.js App Router structure for Vercel deployment. Supabase handles the heavy lifting for backend, so no separate backend server folder is needed (API routes handle server-side logic).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | | |
