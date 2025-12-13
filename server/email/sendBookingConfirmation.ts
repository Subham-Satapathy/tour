import nodemailer from 'nodemailer';
import { appConfig } from '@/config/appConfig';

// Create reusable transporter
export const createTransporter = () => {
  console.log('Creating email transporter with config:', {
    host: appConfig.smtp.host,
    port: appConfig.smtp.port,
    user: appConfig.smtp.user,
    hasPassword: !!appConfig.smtp.pass,
  });
  
  return nodemailer.createTransport({
    host: appConfig.smtp.host,
    port: appConfig.smtp.port,
    secure: appConfig.smtp.port === 465, // true for 465, false for other ports
    auth: {
      user: appConfig.smtp.user,
      pass: appConfig.smtp.pass,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
};

export interface BookingEmailData {
  bookingId: number;
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  seatingCapacity?: number;
  fuelType?: string;
  transmissionType?: string;
  fromCity: string;
  toCity: string;
  startDateTime: Date;
  endDateTime: Date;
  totalAmount: number;
  securityDeposit?: number;
  tripDurationHours: number;
  pricePerHour?: number;
  pricePerDay?: number;
  invoiceNumber?: string;
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

  const vehicleDetails = `${data.vehicleName}${data.vehicleBrand ? ` (${data.vehicleBrand}${data.vehicleModel ? ` ${data.vehicleModel}` : ''})` : ''}`;
  const grandTotal = data.totalAmount + (data.securityDeposit || 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 650px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .success-badge {
      background-color: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .booking-id {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin: 25px 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .booking-details {
      background-color: #f9fafb;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border-left: 4px solid #000000;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 14px;
    }
    .detail-value {
      color: #1f2937;
      font-weight: 500;
      text-align: right;
      font-size: 14px;
    }
    .pricing-section {
      background-color: #f9fafb;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }
    .price-row.total {
      margin-top: 10px;
      padding-top: 15px;
      border-top: 2px solid #d1d5db;
      font-size: 20px;
      font-weight: 700;
      color: #000000;
    }
    .security-note {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin: 15px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #92400e;
    }
    .invoice-note {
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 12px 16px;
      margin: 15px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #1e40af;
    }
    .cta-button {
      display: inline-block;
      background-color: #000000;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background-color: #f9fafb;
      text-align: center;
      color: #6b7280;
      padding: 30px;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Confirmed!</h1>
      <p>Your journey awaits with Triveni Tours & Travels</p>
    </div>
    
    <div class="content">
      <div class="success-badge">✓ Payment Successful</div>
      
      <p style="font-size: 16px; color: #1f2937; margin-bottom: 10px;">Dear <strong>${data.customerName}</strong>,</p>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        Great news! Your booking has been confirmed and payment received successfully. 
        We're excited to serve you on your upcoming trip.
      </p>
      
      <div class="booking-id">
        Booking ID: <span style="color: #000000;">#${data.bookingId}</span>
        ${data.invoiceNumber ? `<br><span style="font-size: 14px; color: #6b7280;">Invoice: ${data.invoiceNumber}</span>` : ''}
      </div>

      <h2 class="section-title">🚗 Vehicle Details</h2>
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Vehicle</span>
          <span class="detail-value">${vehicleDetails}</span>
        </div>
        ${data.seatingCapacity ? `
        <div class="detail-row">
          <span class="detail-label">Seating Capacity</span>
          <span class="detail-value">${data.seatingCapacity} seats</span>
        </div>` : ''}
        ${data.fuelType ? `
        <div class="detail-row">
          <span class="detail-label">Fuel Type</span>
          <span class="detail-value">${data.fuelType}</span>
        </div>` : ''}
        ${data.transmissionType ? `
        <div class="detail-row">
          <span class="detail-label">Transmission</span>
          <span class="detail-value">${data.transmissionType}</span>
        </div>` : ''}
      </div>

      <h2 class="section-title">📍 Trip Details</h2>
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Route</span>
          <span class="detail-value">${data.fromCity} → ${data.toCity}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Pickup Date & Time</span>
          <span class="detail-value">${startDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Return Date & Time</span>
          <span class="detail-value">${endDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${data.tripDurationHours} hours (${Math.ceil(data.tripDurationHours / 24)} days)</span>
        </div>
      </div>

      <h2 class="section-title">💰 Payment Summary</h2>
      <div class="pricing-section">
        <div class="price-row">
          <span>Base Rental Amount</span>
          <span>₹${data.totalAmount.toLocaleString()}</span>
        </div>
        ${data.securityDeposit ? `
        <div class="price-row">
          <span>Security Deposit (Refundable)</span>
          <span>₹${data.securityDeposit.toLocaleString()}</span>
        </div>
        <div class="price-row total">
          <span>Total Paid</span>
          <span>₹${grandTotal.toLocaleString()}</span>
        </div>` : `
        <div class="price-row total">
          <span>Total Paid</span>
          <span>₹${data.totalAmount.toLocaleString()}</span>
        </div>`}
      </div>

      ${data.securityDeposit ? `
      <div class="security-note">
        <strong>💡 Security Deposit:</strong> Your security deposit of ₹${data.securityDeposit.toLocaleString()} 
        will be refunded within 7 business days after the vehicle is returned in good condition.
      </div>` : ''}

      ${data.invoiceNumber ? `
      <div class="invoice-note">
        <strong>📄 Invoice Attached:</strong> Your tax invoice (${data.invoiceNumber}) is attached to this email for your records.
      </div>` : ''}

      <div style="text-align: center;">
        <a href="${appConfig.baseUrl || 'http://localhost:3000'}/my-bookings" class="cta-button">
          View Booking Details
        </a>
      </div>

      <h2 class="section-title">📋 Important Notes</h2>
      <ul style="color: #4b5563; font-size: 14px; line-height: 1.8;">
        <li>Please carry a valid driving license during the entire rental period</li>
        <li>Arrive 15 minutes early for vehicle pickup</li>
        <li>Fuel charges are not included in the rental amount</li>
        <li>The vehicle must be returned in the same condition</li>
        <li>Late return charges: ₹500 per hour beyond agreed time</li>
      </ul>

      <p style="font-size: 15px; color: #1f2937; margin-top: 25px;">
        Thank you for choosing <strong>Triveni Tours & Travels</strong>. 
        We wish you a safe and wonderful journey! 🚗✨
      </p>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">
        Need help? Contact us at <a href="mailto:support@trivenitravels.com" style="color: #3b82f6;">support@trivenitravels.com</a> 
        or call <a href="tel:+919337478478" style="color: #3b82f6;">+91 9337478478</a>
      </p>
    </div>
    
    <div class="footer">
      <p style="font-weight: 600; color: #1f2937;">Triveni Tours & Travels</p>
      <p>Self Drive Cars, Bikes & Family Trips</p>
      <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} Triveni Tours & Travels. All rights reserved.</p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send booking confirmation email with optional PDF invoice attachment
 */
export async function sendBookingConfirmationEmail(
  data: BookingEmailData,
  pdfBuffer?: Buffer
): Promise<void> {
  console.log(`Attempting to send booking confirmation email to ${data.customerEmail} for booking #${data.bookingId}`);
  
  const transporter = createTransporter();

  const grandTotal = data.totalAmount + (data.securityDeposit || 0);
  
  const attachments: any[] = [];
  
  // Add invoice PDF if provided
  if (pdfBuffer && data.invoiceNumber) {
    attachments.push({
      filename: `${data.invoiceNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });
  }

  const mailOptions = {
    from: `"${appConfig.email.fromName}" <${appConfig.email.fromAddress}>`,
    to: data.customerEmail,
    subject: `🎉 Booking Confirmed - #${data.bookingId} | Triveni Tours & Travels`,
    html: generateBookingConfirmationEmail(data),
    text: `
Dear ${data.customerName},

🎉 BOOKING CONFIRMED!

Your booking has been confirmed and payment received successfully.

BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: #${data.bookingId}
${data.invoiceNumber ? `Invoice: ${data.invoiceNumber}` : ''}

VEHICLE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vehicle: ${data.vehicleName}${data.vehicleBrand ? ` (${data.vehicleBrand}${data.vehicleModel ? ` ${data.vehicleModel}` : ''})` : ''}
${data.seatingCapacity ? `Seating: ${data.seatingCapacity} seats` : ''}
${data.fuelType ? `Fuel Type: ${data.fuelType}` : ''}
${data.transmissionType ? `Transmission: ${data.transmissionType}` : ''}

TRIP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route: ${data.fromCity} → ${data.toCity}
Pickup: ${data.startDateTime.toLocaleString()}
Return: ${data.endDateTime.toLocaleString()}
Duration: ${data.tripDurationHours} hours (${Math.ceil(data.tripDurationHours / 24)} days)

PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base Rental: ₹${data.totalAmount.toLocaleString()}
${data.securityDeposit ? `Security Deposit: ₹${data.securityDeposit.toLocaleString()} (Refundable)` : ''}
Total Paid: ₹${grandTotal.toLocaleString()}

${data.securityDeposit ? `\n💡 Security deposit will be refunded within 7 business days after vehicle return.\n` : ''}
IMPORTANT NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Carry a valid driving license during rental period
• Arrive 15 minutes early for vehicle pickup
• Fuel charges are not included
• Vehicle must be returned in same condition
• Late return charges: ₹500/hour

Thank you for choosing Triveni Tours & Travels!
Safe travels! 🚗✨

Need help?
Email: support@trivenitravels.com
Phone: +91 9337478478

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Triveni Tours & Travels
Self Drive Cars, Bikes & Family Trips
© ${new Date().getFullYear()} All rights reserved.
    `.trim(),
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent successfully to ${data.customerEmail}`, info.messageId);
    console.log('Email accepted:', info.accepted);
    console.log('Email rejected:', info.rejected);
  } catch (error) {
    console.error(`❌ Failed to send booking confirmation email to ${data.customerEmail}:`, error);
    throw error;
  }
}
