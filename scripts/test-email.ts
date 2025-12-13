import { sendOTP } from '../server/email/sendOTP';
import { sendBookingConfirmationEmail } from '../server/email/sendBookingConfirmation';

// Test email sending functionality
async function testEmail() {
  const testEmail = process.argv[2] || 'test@example.com';
  
  console.log('\n=== Testing Email Functionality ===\n');
  console.log(`Sending test OTP email to: ${testEmail}\n`);
  
  try {
    // Test OTP email
    const otpResult = await sendOTP(testEmail, '123456', 'Test User');
    
    if (otpResult.success) {
      console.log('\n✅ OTP Email test PASSED');
      console.log('Message ID:', otpResult.data?.messageId);
    } else {
      console.log('\n❌ OTP Email test FAILED');
      console.error('Error:', otpResult.error);
    }
  } catch (error) {
    console.error('\n❌ Email test FAILED with exception:', error);
    process.exit(1);
  }
}

testEmail();
