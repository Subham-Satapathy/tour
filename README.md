# Tour Booking - Car & Bike Travel Booking Web App

A full-stack travel booking application built with Next.js, TypeScript, Tailwind CSS, and Neon Postgres. This application allows users to search for and book cars and bikes for travel, while administrators can manage vehicles and view bookings through a dedicated admin panel.

> Last Updated: December 9, 2025

## Features

### User Features
- 🔍 **Search Vehicles**: Search for available cars and bikes by route and date/time
- 📅 **Real-time Availability**: Only see vehicles that are available for your selected time slot
- 💰 **Transparent Pricing**: View hourly and daily rates with automatic calculation
- 📧 **Email Confirmation**: Receive booking confirmation emails with trip details
- 💳 **Mock Payment**: Simulated payment processing (ready for Stripe integration)

### Admin Features
- 🔐 **Secure Login**: NextAuth-based authentication for admin access
- 🚗 **Vehicle Management**: Create, edit, and delete vehicles
- 📊 **Dashboard**: View statistics and recent bookings at a glance
- 📋 **Booking Management**: View all bookings with customer details

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: Neon Postgres with Drizzle ORM
- **Authentication**: NextAuth.js with Credentials provider
- **Forms**: react-hook-form with Zod validation
- **Email**: Nodemailer for transactional emails

## Architecture

This project follows a **layered architecture** for maintainability and extensibility:

```
├── app/                    # Next.js App Router pages and API routes
├── components/             # Reusable React components
├── src/
│   ├── config/            # Application configuration
│   └── server/
│       ├── auth/          # Authentication utilities
│       ├── db/            # Database connection, schema, and queries
│       │   └── queries/   # Data access layer (abstracted)
│       ├── domain/        # Business logic (pure functions)
│       │   ├── availability.ts
│       │   ├── booking.ts
│       │   └── pricing.ts
│       ├── email/         # Email service
│       └── validation/    # Zod schemas for input validation
```

### Key Design Principles

1. **Separation of Concerns**: Business logic is separated from data access and API handlers
2. **Pure Functions**: Domain logic uses pure, testable functions
3. **Config-Driven**: Feature flags and settings centralized in `appConfig.ts`
4. **Type Safety**: Full TypeScript coverage with Zod for runtime validation
5. **Abstracted Data Access**: Database queries wrapped in helper functions

## Prerequisites

- Node.js 18+ and npm
- A Neon Postgres database account ([neon.tech](https://neon.tech))
- SMTP credentials for email (use Mailtrap for development)

## Getting Started

### 1. Clone and Install

```bash
cd tour
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database (Required)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Admin Credentials (Optional - defaults provided)
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=admin123

# NextAuth (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# Email SMTP (Optional for development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@tour.com
EMAIL_FROM_NAME=Tour Booking
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

Generate and run migrations:

```bash
npm run db:generate
npm run db:push
```

Seed the database with sample data:

```bash
npm run db:seed
```

This will create:
- 5 cities (Bhubaneswar, Cuttack, Puri, Konark, Rourkela)
- 6 sample vehicles (3 cars, 3 bikes)
- 1 admin user (credentials from `.env`)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Admin Credentials

After seeding, you can login to the admin panel at `/admin/login` with:

- **Email**: `admin@example.com` (or value from `ADMIN_DEFAULT_EMAIL`)
- **Password**: `admin123` (or value from `ADMIN_DEFAULT_PASSWORD`)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with sample data
```

## Project Structure

### Database Schema

**Cities**
- Stores city information for routes

**Vehicles**
- Vehicle details including type (car/bike), route, and pricing
- Supports hourly and daily rates

**Bookings**
- Customer bookings with trip details and status
- Tracks payment and timestamps

**AdminUsers**
- Admin credentials with hashed passwords

### Domain Logic

**Pricing** (`src/server/domain/pricing.ts`)
- Pure functions for calculating trip costs
- Configurable pricing strategy (per-hour, per-day, or minimum of both)

**Availability** (`src/server/domain/availability.ts`)
- Overlap detection for booking conflicts
- Filters available vehicles based on bookings

**Booking** (`src/server/domain/booking.ts`)
- Booking validation and creation
- Payment simulation (ready for Stripe integration)

## Extending the Application

### Adding New Fields

1. Update schema in `src/server/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Run migration: `npm run db:push`
4. Update validation schemas in `src/server/validation/schemas.ts`
5. Update UI components as needed

### Changing Pricing Strategy

Edit `src/config/appConfig.ts`:

```typescript
export const appConfig = {
  pricingStrategy: 'per-hour', // 'per-day' | 'min-of-both'
  // ...
};
```

### Adding Payment Integration

Replace `simulatePayment()` in `src/server/domain/booking.ts` with actual payment provider (Stripe, Razorpay, etc.)

### Adding New Vehicle Types

1. Update enum in `src/server/db/schema.ts`
2. Update validation in `src/server/validation/schemas.ts`
3. Update UI components to handle new types

## Testing

The architecture supports easy unit testing of domain logic:

```typescript
import { calculatePrice, calculateTripDuration } from '@/server/domain/pricing';

test('calculates trip duration correctly', () => {
  const start = new Date('2024-01-01T10:00:00');
  const end = new Date('2024-01-01T15:00:00');
  expect(calculateTripDuration(start, end)).toBe(5);
});
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes |
| `ADMIN_DEFAULT_EMAIL` | Default admin email | No |
| `ADMIN_DEFAULT_PASSWORD` | Default admin password | No |
| `SMTP_HOST` | SMTP server host | No |
| `SMTP_PORT` | SMTP server port | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP password | No |
| `EMAIL_FROM` | Sender email address | No |
| `EMAIL_FROM_NAME` | Sender name | No |

## License

ISC

## Support

For issues or questions, please open an issue on the repository.
