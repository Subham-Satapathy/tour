import { createTransporter } from './sendBookingConfirmation';
import { appConfig } from '@/config/appConfig';

export async function sendOTP(email: string, code: string, name?: string) {
  console.log(`Attempting to send OTP to ${email}`);
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${appConfig.email.fromName} <${appConfig.email.fromAddress}>`,
      to: email,
      subject: 'Your OTP for Tour Booking Signup',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        ${process.env.NEXT_PUBLIC_APP_URL ? `<img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-transparent.png" alt="Triveni Tours & Travels" style="height: 60px; width: auto; margin: 0 auto 15px; display: block;" />` : ''}
                        <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: 700;">Triveni Tours & Travels</h1>
                        <p style="margin: 8px 0 0; color: #666666; font-size: 14px;">Self Drive Cars, Bikes & Family Trips</p>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        ${name ? `<p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi ${name},</p>` : ''}
                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Thank you for choosing Triveni Tours & Travels! To complete your registration, please verify your email address using the OTP below:</p>
                        
                        <!-- OTP Box -->
                        <table role="presentation" style="width: 100%; margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <div style="background-color: #f8f9fa; border: 2px dashed #000000; border-radius: 8px; padding: 30px; display: inline-block;">
                                <p style="margin: 0 0 10px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your OTP Code</p>
                                <p style="margin: 0; font-size: 36px; font-weight: 700; color: #000000; letter-spacing: 8px;">${code}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">This OTP will expire in <strong>10 minutes</strong>.</p>
                        <p style="margin: 0 0 20px; font-size: 14px; color: #666666;">If you didn't request this code, please ignore this email.</p>
                        
                        <!-- Security Notice -->
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 4px;">
                          <p style="margin: 0; font-size: 13px; color: #856404;">
                            <strong>⚠️ Security Tip:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px; font-size: 13px; color: #666666; text-align: center;">For support: support@trivenitravels.com | +91 9337478478</p>
                        <p style="margin: 0 0 5px; font-size: 13px; color: #666666; text-align: center;">This is an automated message, please do not reply.</p>
                        <p style="margin: 0; font-size: 13px; color: #666666; text-align: center;">© ${new Date().getFullYear()} Triveni Tours & Travels. All rights reserved.</p>
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

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`, info.messageId);
    console.log('Email accepted:', info.accepted);
    console.log('Email rejected:', info.rejected);
    return { success: true, data: info };
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error);
    return { success: false, error };
  }
}
