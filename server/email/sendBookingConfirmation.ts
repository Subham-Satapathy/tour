import nodemailer from 'nodemailer';
import { appConfig } from '@/config/appConfig';

// Create reusable transporter
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: appConfig.smtp.host,
    port: appConfig.smtp.port,
    auth: {
      user: appConfig.smtp.user,
      pass: appConfig.smtp.pass,
    },
  });
};

export interface BookingEmailData {
  bookingId: number;
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  fromCity: string;
  toCity: string;
  startDateTime: Date;
  endDateTime: Date;
  totalAmount: number;
  tripDurationHours: number;
}

/**
 * Generate booking confirmation email HTML
 */
export function generateBookingConfirmationEmail(data: BookingEmailData): string {
  const startDate = data.startDateTime.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const endDate = data.endDateTime.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #2563eb;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border: 1px solid #e5e7eb;
    }
    .booking-details {
      background-color: white;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-label {
      font-weight: bold;
    }
    .total {
      font-size: 1.2em;
      color: #2563eb;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      padding: 20px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear ${data.customerName},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Booking ID:</span>
          <span>#${data.bookingId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Vehicle:</span>
          <span>${data.vehicleName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Route:</span>
          <span>${data.fromCity} → ${data.toCity}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Start:</span>
          <span>${startDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">End:</span>
          <span>${endDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration:</span>
          <span>${data.tripDurationHours} hours</span>
        </div>
        <div class="detail-row" style="border-bottom: none; margin-top: 10px;">
          <span class="detail-label">Total Amount:</span>
          <span class="total">₹${data.totalAmount}</span>
        </div>
      </div>
      
      <p>Thank you for choosing our service. We hope you have a great trip!</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; ${new Date().getFullYear()} Tour Booking. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  data: BookingEmailData
): Promise<void> {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${appConfig.email.fromName}" <${appConfig.email.fromAddress}>`,
    to: data.customerEmail,
    subject: `Booking Confirmation - ID #${data.bookingId}`,
    html: generateBookingConfirmationEmail(data),
    text: `
Dear ${data.customerName},

Your booking has been confirmed!

Booking ID: #${data.bookingId}
Vehicle: ${data.vehicleName}
Route: ${data.fromCity} → ${data.toCity}
Start: ${data.startDateTime.toLocaleString()}
End: ${data.endDateTime.toLocaleString()}
Duration: ${data.tripDurationHours} hours
Total Amount: ₹${data.totalAmount}

Thank you for choosing our service!

Tour Booking
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
}
