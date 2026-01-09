# Research: Hostal Booking Dashboard

**Feature**: `001-booking-dashboard`

## Decisions

### 1. Calendar UI Component
**Decision**: `FullCalendar` (React)
**Rationale**: 
- Excellent mobile support with touch gestures.
- Built-in "List View" which is superior for mobile screens compared to grid views.
- Robust ecosystem and documentation.
- Standard MIT license for the core functionality we need (displaying events).
**Alternatives Considered**:
- `react-big-calendar`: Good and free, but requires more work to make mobile-friendly and responsive.
- `Mobiscroll`: Excellent mobile UI but is a paid commercial product.

### 2. iCal Parsing Library
**Decision**: `node-ical`
**Rationale**:
- Native Node.js support (perfect for Next.js API routes).
- Handles both fetching (from URL) and parsing in a single utility.
- Actively maintained and handles common calendar quirks.
**Alternatives Considered**:
- `ical.js`: More low-level, better if we needed complex manipulation/generation, but overkill for just parsing.

### 3. Single Admin Authentication
**Decision**: Supabase Auth with "Signups Disabled"
**Rationale**:
- Most secure: Prevents unauthorized account creation at the platform level.
- Simple: Admin account is created manually via Supabase Dashboard (or invite).
- No code overhead: Don't need to write "allowlist" logic in code.
**Alternatives Considered**:
- Hardcoded password: Insecure.
- Middleware allowlist: Adds maintenance overhead.

## Open Questions Resolved
- **Mobile View**: Use FullCalendar's "List View" as default on mobile, "Month View" on desktop.
- **Sync**: Use a Next.js Cron Job (Vercel Cron) to hit the API endpoint that uses `node-ical`.
