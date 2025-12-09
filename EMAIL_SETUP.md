# Email OTP and Invoice Setup Guide

This application uses **Resend** for sending OTP verification emails and invoice emails to customers.

## Prerequisites

1. Create a free account at [Resend](https://resend.com)
2. Get your API key from the Resend dashboard

## Environment Variables

Add the following to your `.env.local` file:

```env
RESEND_API_KEY=re_your_actual_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
```

## Features Implemented

### 1. **Email OTP Verification**
- Users must verify their email during signup
- 6-digit OTP sent via email
- OTP expires in 10 minutes
- Resend cooldown of 60 seconds
- Professional email template with security tips

**Flow:**
1. User fills signup form
2. OTP sent to email
3. User enters OTP
4. Account created after verification

### 2. **Duplicate Prevention**
- Email uniqueness enforced
- Phone number uniqueness enforced
- Database constraints prevent duplicates

### 3. **Professional Invoice System**
- PDF invoice generated automatically after payment
- Saved to database with unique invoice number
- Sent to customer email automatically
- Format: `INV-YYYY-NNNNNN` (e.g., `INV-2024-000123`)

**Invoice includes:**
- Company branding
- Customer details
- Booking information
- Vehicle details
- Trip itinerary
- Pricing breakdown
- Security deposit info
- Terms & conditions
- Professional formatting with tables

### 4. **Invoice Display**
- View invoice on booking success page
- Download/view from My Bookings
- Only available for PAID bookings
- Generate button if not yet created

## API Endpoints

### OTP Verification
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP code

### Invoice
- `GET /api/invoices/[id]` - Get/generate invoice for booking

## Testing

### Test OTP Flow (Development)
If using Resend's free tier with `onboarding@resend.dev` sender:
- Emails will only be sent to verified domains
- Add your test email in Resend dashboard
- Or use a verified domain

### Test Invoice Generation
1. Complete a booking
2. Process payment
3. Invoice generated automatically
4. Check email and booking details page

## Production Setup

1. **Verify your domain** in Resend:
   - Add DNS records (SPF, DKIM, DMARC)
   - Update sender email in code:
     - `/server/email/sendOTP.ts`
     - `/server/email/sendInvoice.ts`

2. **Update sender emails** from `onboarding@resend.dev` to `yourname@yourdomain.com`

3. **Set production URL**:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

## Troubleshooting

### OTP not received
- Check Resend dashboard for delivery status
- Verify email is not in spam
- Ensure RESEND_API_KEY is set correctly
- Check Resend account limits

### Invoice not generating
- Check booking status is 'PAID'
- Verify all booking data exists
- Check server logs for errors
- Ensure database tables created (run migrations)

### Email template not rendering
- Resend supports HTML emails
- Test template in Resend dashboard
- Check for HTML/CSS errors in email code

## Database Tables

### `otp_verifications`
```sql
- id (serial)
- email (varchar)
- code (varchar, 6 digits)
- expiresAt (timestamp)
- verified (boolean)
- createdAt (timestamp)
```

### `invoices`
```sql
- id (serial)
- bookingId (integer, unique)
- invoiceNumber (varchar, unique)
- pdfUrl (text, nullable)
- amount (integer)
- generatedAt (timestamp)
```

### `users` (updated)
```sql
- phone (varchar, unique) ← Now enforces uniqueness
```

## Cost

**Resend Pricing:**
- Free tier: 100 emails/day, 3,000 emails/month
- Perfect for testing and small deployments
- Upgrade for production use

## Support

For issues:
1. Check Resend dashboard for delivery logs
2. Review server logs
3. Verify environment variables
4. Check database migrations applied

---

**Note:** This system is production-ready with proper error handling, email templates, and database constraints. Remember to verify your domain in Resend before going live!
