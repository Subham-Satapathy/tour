// Application configuration module
// This centralizes app settings and feature flags for easy changes

export const appConfig = {
  // Pricing strategy: 'per-hour' | 'per-day' | 'min-of-both'
  pricingStrategy: 'min-of-both' as const,
  
  // Email settings
  email: {
    fromAddress: process.env.EMAIL_FROM || 'support@trivenitravels.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Triveni Tours & Travels',
  },
  
  // Feature flags
  features: {
    enableStripe: false,
    enableBikeBooking: true,
    enableCarBooking: true,
  },
  
  // Admin settings
  admin: {
    defaultEmail: process.env.ADMIN_DEFAULT_EMAIL || 'support@trivenitravels.com',
    defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123',
  },
  
  // SMTP settings
  smtp: {
    host: process.env.SMTP_HOST || 'mail.spacemail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
