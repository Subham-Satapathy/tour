You are an expert Next.js + TypeScript + React + Tailwind CSS full-stack engineer.

Build a complete car/bike travel booking web app with the following requirements.

## Tech stack

- Next.js (App Router, latest stable)
- TypeScript
- React
- Tailwind CSS for styling
- **Neon Postgres** as the database
- **Drizzle ORM** for schema & queries (Postgres)
- Use `@neondatabase/serverless` (or compatible driver) in the backend
- Use Next.js `app/` directory and Route Handlers (`app/api/.../route.ts`) for APIs
- Use server components for data-fetching views where possible; client components only for interactive parts

Also add:
- `react-hook-form` + `zod` for form validation
- Either NextAuth (Credentials provider) or a simple custom auth for admin

---

## Architecture & flexibility requirements (IMPORTANT)

Design the codebase so it’s **easy to change and extend later** (pricing rules, booking logic, fields, roles, etc.).

Follow these principles:

1. **Layered / modular structure**

   - Keep **domain logic** in separate modules under something like:
     - `src/server/domain/booking.ts`
     - `src/server/domain/vehicle.ts`
     - `src/server/domain/pricing.ts`
   - Keep **data-access** (Drizzle queries) under:
     - `src/server/db` (e.g., `schema.ts`, `queries/vehicles.ts`, `queries/bookings.ts`)
   - Keep **API handlers** thin:
     - They should:
       - Parse/validate input
       - Call domain services
       - Return responses
     - Almost no business logic directly in `route.ts`.

2. **DB abstraction / ORM flexibility**

   - Wrap Drizzle operations in helper functions (e.g., `getAvailableVehicles(...)`, `createBooking(...)`) instead of using Drizzle directly all over the app.
   - Accept `db` client as a parameter in domain functions where reasonable. This makes swapping ORM/DB easier in the future.

3. **Config-driven behavior**

   - Create a config module, e.g., `src/config/appConfig.ts`, with things like:
     - Default pricing strategy (per-hour vs per-day vs min of both)
     - Email sender name, from-address
     - Feature flags (e.g., `enableStripe: boolean`, `enableBikeBooking: boolean`)
   - Use environment variables for secrets and environment-specific settings:
     - `DATABASE_URL`
     - `ADMIN_DEFAULT_EMAIL`, etc.

4. **Validation & types**

   - Centralize input validation schemas in `src/server/validation/...` using `zod`:
     - `searchVehiclesSchema`
     - `createBookingSchema`
     - `adminVehicleSchema`, etc.
   - Export types from these schemas using `z.infer` so that frontend and backend share the same types.

5. **Pricing & availability logic as pure functions**

   - Implement pricing calculations in a dedicated module:
     - `src/server/domain/pricing.ts` with pure functions like:
       - `calculateTripDuration(start, end)`
       - `calculatePrice({ durationHours, ratePerHour, ratePerDay, strategy })`
   - Implement booking availability logic in:
     - `src/server/domain/availability.ts`
   - These functions should be pure and easily unit-testable.

6. **Testability**

   - Add unit tests (even simple ones) for:
     - Overlap detection (availability)
     - Pricing calculation logic
   - Keep domain logic in pure functions so tests do not depend on Next.js or React.

7. **Reusable UI components**

   - Create reusable UI components in `src/components`:
     - `SearchForm`
     - `VehicleCard`
     - `BookingSummary`
     - `AdminTable`
   - This makes it easy to change layout/UI later without touching core logic.

---

## High-level product description

Build a **travel booking website for cars and bikes** where users can:

1. Select:
   - From City
   - To City
   - Start Date & Time
   - End Date & Time
2. See a list of **available vehicles** for that slot.
3. Check **rate per hour** and **rate per day** for each vehicle.
4. Choose a vehicle and proceed to a **booking form**.
5. Complete the booking by:
   - Filling contact + trip details
   - Completing a **mock payment** (for now, simulate success; later we may plug in Stripe).
6. After payment:
   - Save booking in DB
   - Mark it as `PAID`
   - Send a **booking confirmation email** with an invoice-like summary
   - Show a **confirmation page** with booking ID.

Additionally, there should be an **Admin Panel** where company owners can:

- Log in as admin
- Create / update / delete vehicles
- Set or update:
  - Vehicle name
  - Type: car or bike
  - From City
  - To City
  - Rate per hour
  - Rate per day
  - Description
  - Image URL
  - Availability status (active/inactive)
- View a list of bookings and their status.

**Critical:** Before confirming any booking, the system must check if that **exact vehicle is available** for the requested date & time range (no overlapping bookings).

---

## Database & ORM (Neon + Drizzle)

Use **Neon Postgres** with **Drizzle ORM**.

Set up:

- `src/server/db/schema.ts` – Drizzle schema definitions
- `src/server/db/index.ts` – db client using Neon connection
- `drizzle.config.ts` – Drizzle migrations config

Use `DATABASE_URL` from env for Neon.

### Tables (Drizzle schema)

#### City

- `id` (serial or uuid PK)
- `name` (string)
- `slug` (string, unique)

#### Vehicle

- `id`
- `name`
- `type` (enum: `"CAR" | "BIKE"`)
- `fromCityId` (FK -> City)
- `toCityId` (FK -> City)
- `ratePerHour` (numeric/int)
- `ratePerDay` (numeric/int)
- `description` (optional text)
- `imageUrl` (optional)
- `isActive` (boolean, default true)
- `createdAt` (timestamp, default now)
- `updatedAt` (timestamp, default now, update on change)

#### Booking

- `id`
- `vehicleId` (FK -> Vehicle)
- `fromCityId` (FK -> City)
- `toCityId` (FK -> City)
- `startDateTime` (timestamp)
- `endDateTime` (timestamp)
- `tripDurationHours` (int, stored)
- `pricePerHour` (numeric/int)
- `pricePerDay` (numeric/int)
- `totalAmount` (numeric/int)
- `customerName`
- `customerEmail`
- `customerPhone`
- `status` (enum: `"PENDING" | "PAID | "CANCELLED"`)
- `paymentReference` (optional)
- `createdAt`
- `updatedAt`

#### AdminUser

- `id`
- `email` (unique)
- `passwordHash`
- `createdAt`

Add appropriate indexes on `vehicleId`, `startDateTime`, `endDateTime`, `status` for availability checks.

Provide **Drizzle migrations** and `package.json` scripts to generate and run them.

---

## Availability logic

Input for availability:

- `fromCityId`
- `toCityId`
- `startDateTime`
- `endDateTime`
- Optional: vehicle type (car/bike/both)

Domain logic (put inside `availability.ts`):

1. Query all **active vehicles** with matching `fromCityId` and `toCityId` (and optional type).
2. For each vehicle, check `Booking` table for non-cancelled bookings where time range overlaps.
3. Overlap condition:
   - Two ranges overlap if:
     - `NOT (existingEnd <= requestedStart OR existingStart >= requestedEnd)`
4. Return only vehicles that have **no overlapping booking**.

When creating a booking (inside domain booking service):

1. Re-check availability for the specific `vehicleId` && time range.
2. If not available, throw a domain error that API can translate to HTTP 409 or similar.
3. If available:
   - Calculate duration:
     - `durationHours = ceil((end - start) in hours)`
     - `durationDays = ceil(durationHours / 24)`
   - Calculate pricing using the **pricing module** and **config**.
   - Create booking with `PENDING` status.
   - Simulate payment.
   - On “success”:
     - Update status to `PAID`.
     - Trigger email send.
   - Return booking data.

---

## Frontend pages (App Router)

### `/` – Home page

- Search form:
  - From City (dropdown from DB)
  - To City (dropdown from DB)
  - Start Date & Time
  - End Date & Time
  - Vehicle type filter (car / bike / both)
- On submit:
  - Call `POST /api/search-vehicles`
  - Navigate to `/search` (with query params) or manage via state.

### `/search` – Search results

- Reads query params or uses search state.
- Shows list of **available vehicles**:
  - Image
  - Name
  - Type
  - From → To
  - Rate per hour and per day
  - Short description
  - “Select & Book” button.
- “Select & Book” navigates to `/booking/[vehicleId]` with:
  - fromCityId
  - toCityId
  - startDateTime
  - endDateTime (via query or state).

### `/booking/[vehicleId]` – Booking form

- Server component:
  - Fetches vehicle data.
  - Validates query params (dates, cities).
  - Calls pricing logic to show estimate.
- Client component:
  - Booking form with `react-hook-form` + `zod`:
    - Name
    - Email
    - Phone
    - Optional notes
  - On submit:
    - Calls `POST /api/bookings/create`.
    - Handles success/error state.
    - Redirects to `/booking/success/[bookingId]` on success.

### `/booking/success/[bookingId]`

- Server component:
  - Fetch booking and vehicle details.
  - Show:
    - Booking ID
    - Route
    - Dates
    - Total amount
    - Message: “A booking confirmation email has been sent to your email address.”

---

## Email sending

- Use `nodemailer` with SMTP (Mailtrap or similar for dev).
- On booking marked as `PAID`:
  - Send email to `customerEmail` with:
    - Booking ID
    - Vehicle name
    - From City & To City
    - Start & End datetime
    - Total amount
  - Layout can be simple HTML + plain text.
- Implement email logic in a separate module, e.g., `src/server/email/sendBookingConfirmation.ts`.

Keep email configuration driven by environment variables & config module for easy changes later.

---

## Admin Panel

### Auth

- `/admin/login`:
  - Email + Password form.
  - Use a simple credentials-based auth (NextAuth Credentials provider or a manual session solution with cookies).
- Protected routes:
  - All `/admin/**` pages and `/api/admin/**` routes should require admin authentication.

### `/admin` – Dashboard

- Show:
  - Total number of vehicles
  - Total number of bookings
  - Recent bookings list.

### `/admin/vehicles`

- Table view:
  - Name, type, route, rate per hour/day, active/inactive.
  - Actions: Edit, Delete.
- “Add New Vehicle” button.

### `/admin/vehicles/new` & `/admin/vehicles/[id]`

- Form using `react-hook-form` + `zod`:
  - Name
  - Type (car/bike)
  - From City
  - To City
  - Rate per hour
  - Rate per day
  - Description
  - Image URL
  - `isActive` toggle
- On submit:
  - Call admin API:
    - `POST /api/admin/vehicles` for new
    - `PUT /api/admin/vehicles/[id]` for edit
  - Redirect to `/admin/vehicles` on success.

### `/admin/bookings`

- Table:
  - Booking ID
  - Vehicle
  - Customer name + email
  - Start & end
  - Total amount
  - Status
- Ability to change status to `CANCELLED`.

---

## API routes (route handlers)

Implement route handlers that call domain services:

- `POST /api/search-vehicles`
  - Body: fromCityId, toCityId, startDateTime, endDateTime, optional type.
  - Validates with `zod`.
  - Uses availability domain service.
  - Returns list of vehicles.

- `POST /api/bookings/create`
  - Body: vehicleId, fromCityId, toCityId, startDateTime, endDateTime, customer details.
  - Validates with `zod`.
  - Calls booking service:
    - Re-check availability.
    - Compute pricing.
    - Create booking.
    - Simulate payment.
    - Trigger email.
  - Returns booking info and redirect URL or bookingId.

- Admin APIs:
  - `GET /api/admin/vehicles`
  - `POST /api/admin/vehicles`
  - `PUT /api/admin/vehicles/[id]`
  - `DELETE /api/admin/vehicles/[id]`
  - `GET /api/admin/bookings`
  - `PUT /api/admin/bookings/[id]`
- Ensure all admin APIs verify admin session.

---

## UI/UX & styling

- Tailwind CSS with a clean, modern layout:
  - Navbar with brand + links (Home, Admin Login).
  - Simple responsive layout for mobile and desktop.
- Use reusable components for:
  - Forms
  - Cards
  - Tables
  - Buttons
- Provide:
  - Loading states for data fetching
  - Error messages for failed actions
  - Disabled states for buttons during submission

---

## Seed data & scripts

- Implement a seed script using Drizzle:
  - A few cities (e.g., Bhubaneswar, Cuttack, Kolkata).
  - A few demo vehicles (cars & bikes).
  - One default `AdminUser` with known credentials (hash the password).
- Add to `package.json`:
  - Scripts for:
    - `drizzle-kit generate`
    - `drizzle-kit migrate`
    - `seed` (runs the seed script)
- Add a `README.md` explaining:
  - How to set `DATABASE_URL` (Neon)
  - How to run migrations
  - How to run the seed script
  - How to start the dev server

---

Now:

1. Scaffold the Next.js project.
2. Set up Tailwind CSS.
3. Set up Neon + Drizzle + migrations.
4. Implement schemas, db layer, domain services (availability, booking, pricing).
5. Build the public pages (`/`, `/search`, `/booking/[vehicleId]`, `/booking/success/[bookingId]`).
6. Build admin auth and `/admin/**` pages.
7. Implement email sending.
8. Ensure architecture remains modular and easy to extend with new fields, pricing rules, and features.
