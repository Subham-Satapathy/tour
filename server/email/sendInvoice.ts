import { createTransporter } from './sendBookingConfirmation';
import { appConfig } from '@/config/appConfig';

interface SendInvoiceEmailParams {
  email: string;
  customerName: string;
  bookingId: number;
  invoiceNumber: string;
  totalAmount: number;
  pdfBuffer?: Buffer; // Optional: attach PDF as buffer
}

export async function sendInvoiceEmail({
  email,
  customerName,
  bookingId,
  invoiceNumber,
  totalAmount,
  pdfBuffer,
}: SendInvoiceEmailParams) {
  try {
    const transporter = createTransporter();
    
    const mailOptions: any = {
      from: `${appConfig.smtp.fromName} <${appConfig.smtp.from}>`,
      to: email,
      subject: `Invoice ${invoiceNumber} - Tour Booking Confirmation`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice ${invoiceNumber}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #000000 0%, #333333 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Tour Booking</h1>
                        <p style="margin: 10px 0 0; color: #cccccc; font-size: 14px;">Professional Vehicle Rental Services</p>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; font-size: 24px; color: #000000;">Invoice Generated</h2>
                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Dear ${customerName},</p>
                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Thank you for your booking! Your payment has been successfully processed.</p>
                        
                        <!-- Invoice Details Box -->
                        <table role="presentation" style="width: 100%; margin: 30px 0; background-color: #f8f9fa; border-radius: 8px; border: 2px solid #e9ecef;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" style="width: 100%;">
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <strong style="color: #666666; font-size: 14px;">Invoice Number:</strong>
                                  </td>
                                  <td align="right" style="padding: 8px 0;">
                                    <span style="color: #000000; font-size: 14px; font-weight: 600;">${invoiceNumber}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <strong style="color: #666666; font-size: 14px;">Booking ID:</strong>
                                  </td>
                                  <td align="right" style="padding: 8px 0;">
                                    <span style="color: #000000; font-size: 14px; font-weight: 600;">#${bookingId}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <strong style="color: #666666; font-size: 14px;">Invoice Date:</strong>
                                  </td>
                                  <td align="right" style="padding: 8px 0;">
                                    <span style="color: #000000; font-size: 14px; font-weight: 600;">${new Date().toLocaleDateString('en-IN')}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding: 15px 0 8px; border-top: 2px solid #e9ecef;">
                                    <strong style="color: #666666; font-size: 14px;">Total Amount:</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" align="right">
                                    <span style="color: #000000; font-size: 24px; font-weight: 700;">₹${totalAmount.toLocaleString('en-IN')}</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0; font-size: 16px; color: #333333;">You can download your invoice from your booking details page or view it in the attachment above.</p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-bookings" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">View Booking Details</a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Support Notice -->
                        <div style="background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin-top: 30px; border-radius: 4px;">
                          <p style="margin: 0; font-size: 13px; color: #004a99;">
                            <strong>📞 Need Help?</strong><br>
                            Contact our support team at support@tourbooking.com or call +91 1800-XXX-XXXX
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px; font-size: 13px; color: #666666; text-align: center;">This is an automated message, please do not reply.</p>
                        <p style="margin: 0; font-size: 13px; color: #666666; text-align: center;">© ${new Date().getFullYear()} Tour Booking. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    // Add PDF attachment if provided
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, data: info };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error };
  }
}
