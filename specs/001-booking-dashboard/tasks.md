---
description: "Task list for Hostal Booking Dashboard feature implementation"
---

# Tasks: Hostal Booking Dashboard

**Input**: Design documents from `/specs/001-booking-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are INCLUDED based on constitution and plan (Testability principle).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (Next.js + Supabase)
- [x] T002 Initialize Next.js project with TypeScript and App Router
- [x] T003 [P] Configure Supabase client in src/lib/supabase/client.ts
- [x] T004 [P] Install dependencies: `@supabase/supabase-js`, `fullcalendar`, `node-ical`, `date-fns`
- [x] T005 [P] Configure Tailwind CSS and theming for mobile-first UI
- [x] T006 Setup i18n support for Traditional Chinese (zh-TW) in src/lib/i18n/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Setup Supabase Database Schema (rooms, bookings, guests tables)
- [x] T008 [P] Create initial seed data for Rooms (sql script)
- [x] T009 [P] Create Admin Auth logic (Login page) in src/app/(auth)/login/page.tsx
- [x] T010 [P] Implement Auth Middleware protection in src/middleware.ts
- [x] T011 Create shared UI layout with mobile navigation in src/app/dashboard/layout.tsx
- [x] T012 Define shared TypeScript interfaces in src/types/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Daily Booking Dashboard (Priority: P1) 🎯 MVP

**Goal**: Staff can view calendar with bookings on mobile.

**Independent Test**: Manually insert a booking in DB, verify it appears on FullCalendar view.

### Tests for User Story 1
- [ ] T013 [P] [US1] Unit test for booking service (fetch logic) in tests/unit/booking.test.ts

### Implementation for User Story 1
- [x] T014 [P] [US1] Create BookingService (fetch bookings) in src/services/booking.ts
- [x] T015 [US1] Implement GET /api/bookings route in src/app/api/bookings/route.ts
- [x] T016 [US1] Create Calendar component using FullCalendar in src/components/calendar/BookingCalendar.tsx
- [x] T017 [US1] Implement Dashboard Page in src/app/dashboard/page.tsx
- [x] T018 [US1] Add Booking Details Modal (read-only) in src/components/calendar/BookingDetailModal.tsx
- [x] T019 [US1] Implement Manual Booking Creation Form in src/components/calendar/CreateBookingForm.tsx
- [x] T020 [US1] Connect Create Form to Supabase (insert logic) in src/services/booking.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Frequent Guest Management (Priority: P2)

**Goal**: Manage guest records and history.

**Independent Test**: Create/Edit guest via UI, verify persistence in DB.

### Tests for User Story 2
- [x] T021 [P] [US2] Unit test for GuestService logic in tests/unit/guest.test.ts

### Implementation for User Story 2
- [x] T022 [P] [US2] Create GuestService in src/services/guest.ts
- [x] T023 [US2] Create Guest List Page (with search) in src/app/guests/page.tsx
- [x] T024 [US2] Create Guest Search Component in src/components/guests/GuestSearch.tsx
- [x] T025 [US2] Implement Add/Edit Guest Form in src/components/guests/GuestForm.tsx
- [x] T026 [US2] Implement Guest History View (linked bookings) in src/app/guests/[id]/page.tsx
- [x] T027 [US2] Integrate Guest Search into Booking Creation Form (from T019)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Booking.com Integration (Priority: P3)

**Goal**: Sync external bookings via iCal.

**Independent Test**: Trigger sync with mock iCal URL, verify booking appears in DB and Calendar.

### Tests for User Story 3
- [x] T028 [P] [US3] Unit test for iCal parsing logic in tests/unit/sync.test.ts

### Implementation for User Story 3
- [x] T029 [P] [US3] Implement iCal parsing utility using `node-ical` in src/services/sync.ts
- [x] T030 [P] [US3] Create Sync Service (fetch -> parse -> upsert) in src/services/sync.ts
- [x] T031 [US3] Implement Conflict Detection Logic in src/services/sync.ts
- [x] T032 [US3] Create API route POST /api/sync in src/app/api/sync/route.ts
- [x] T033 [US3] Add "Sync Now" button to Dashboard Header in src/components/ui/SyncButton.tsx
- [x] T034 [US3] Display Sync Conflicts/Warnings on Dashboard in src/components/calendar/ConflictAlert.tsx
- [x] T035 [US3] Update Room Settings to allow saving iCal URL in src/app/dashboard/settings/page.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T036 Verify all UI strings are in Traditional Chinese (zh-TW)
- [x] T037 [P] Mobile responsiveness check (Calendar view on small screens)
- [x] T038 Performance check (Dashboard load < 2s)
- [x] T039 Security audit (RLS policies check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - T027 integrates with US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent logic, integrates with US1 UI

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
