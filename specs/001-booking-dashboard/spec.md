# Feature Specification: Hostal Booking Dashboard & Guest Management

**Feature Branch**: `001-booking-dashboard`  
**Created**: 2026-01-09  
**Status**: Draft  
**Input**: User description: "幫我計劃我想要為我家的民宿做一個可以檢視每日訂房情況的網頁，然後他可以跟booking做串接並且有一個紀錄常客的頁面"

## Clarifications
### Session 2026-01-09
- Q: Integration method for Booking.com? → A: iCal Calendar Sync (exchange of .ics links).
- Q: Conflict resolution behavior? → A: Flag conflict with a warning (only send warning, do not auto-reject).
- Q: Device target? → A: Mobile-first design (interface optimized for phone usage).
- Q: Access Control? → A: Single Admin Account (shared password for all staff).
- Q: Hosting Strategy? → A: Cloud Hosted (Supabase for backend/DB, Vercel for frontend) to ensure accessibility.
- Q: Language Requirement? → A: Traditional Chinese (Taiwan/zh-TW) for all UI text.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Daily Booking Dashboard (Priority: P1)

The homestay owner/staff needs to view a calendar-based dashboard to see room occupancy status for any given day, preventing double bookings and planning housekeeping.

**Why this priority**: Core functionality. Without seeing bookings, the system provides no immediate operational value.

**Independent Test**: Can be tested by manually creating bookings in the database and verifying they appear correctly on the calendar for specific dates and rooms.

**Acceptance Scenarios**:

1. **Given** a calendar month with existing bookings, **When** the user opens the dashboard on a mobile device, **Then** they see a responsive grid/list of days/rooms showing occupied and available slots legible on a small screen.
2. **Given** a specific booking, **When** the user taps on it, **Then** they see details (Guest Name, Check-in/out dates, Room).
3. **Given** a date range, **When** the user navigates to next/previous month, **Then** the booking status updates accordingly.

---

### User Story 2 - Frequent Guest Management (Priority: P2)

The owner wants to record frequent guest information (preferences, history) to provide better service and recognize returning customers.

**Why this priority**: Enhances customer service and retention, a key request from the user. Independent of external integrations.

**Independent Test**: Can be tested by adding, searching, and updating guest records in isolation.

**Acceptance Scenarios**:

1. **Given** a new guest, **When** the user saves their details (Name, Contact, Notes), **Then** the record is persisted and retrievable.
2. **Given** a list of past guests, **When** the user searches by name or phone number, **Then** the correct guest record is displayed.
3. **Given** an existing guest, **When** the user updates their "Notes" (e.g., "likes extra pillows"), **Then** the changes are saved.

---

### User Story 3 - Booking.com Integration (Priority: P3)

The system should sync with Booking.com to automatically reflect external bookings on the dashboard.

**Why this priority**: Automation reduces manual entry, but the system is usable (via manual entry) without it initially. Complex dependency.

**Independent Test**: Can be tested using a mock iCal feed or sandbox API response to verify the system parses and imports external bookings correctly.

**Acceptance Scenarios**:

1. **Given** a new reservation on Booking.com, **When** the synchronization triggers (scheduled or manual), **Then** the booking appears on the local dashboard.
2. **Given** a cancellation on Booking.com, **When** synchronization occurs, **Then** the booking is removed or marked cancelled on the dashboard.
3. **Given** overlapping manual and external bookings, **When** sync occurs, **Then** the system flags a conflict with a visible warning (no auto-rejection).

---

### Edge Cases

- What happens when a booking spans across two months (e.g., Jan 31 - Feb 2)?
- How does the system handle time zone differences between Booking.com and local time?
- What happens if the internet connection is lost during Booking.com sync?
- How to handle duplicate guest records (same name/phone)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a calendar view showing room availability by date.
- **FR-002**: System MUST allow manual entry of bookings (dates, room, guest name).
- **FR-003**: System MUST store guest details (Name, Phone, Email, Notes, History).
- **FR-004**: System MUST search guest records by name or phone number.
- **FR-005**: System MUST sync with Booking.com bookings via iCal Calendar Sync (exchange of .ics links).
- **FR-006**: System MUST prevent/flag double bookings for the same room/date (show warning for sync conflicts).
- **FR-007**: System MUST support multiple rooms/room types.
- **FR-008**: System MUST provide a mobile-responsive interface optimized for touch interactions.
- **FR-009**: System MUST require authentication via a Single Admin Account (shared credentials) to access the dashboard.
- **FR-010**: System MUST be deployed on cloud infrastructure (Supabase + Vercel) for remote access.
- **FR-011**: System UI text and messages MUST be in Traditional Chinese (Taiwan/zh-TW).

### Key Entities

- **Booking**: Check-in/out dates, Room ID, Guest ID/Name, Source (Manual/Booking.com), Status, External ID (for iCal sync).
- **Room**: Name/Number, Type, Capacity, iCal URL (for export/import).
- **Guest**: Name, Phone, Email, Notes, Visit Count.
- **User**: Admin credentials (single account).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard loads current month's availability in under 2 seconds on 4G mobile network.
- **SC-002**: Synchronization with Booking.com completes within 1 minute of trigger.
- **SC-003**: 100% of Booking.com reservations (from provided feed) are accurately reflected on the dashboard.
- **SC-004**: Staff can retrieve a frequent guest's record in under 5 seconds using search.
