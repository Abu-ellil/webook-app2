import { getSetting, setSetting } from './settings';

// Application configuration
export interface AppConfig {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  paymentMethods: string[];
  bookingConfirmation: boolean;
  telegramNotifications: boolean;
  maxSeatsPerBooking: number;
  minBookingTime: number;
}

// Cache for app configuration
let appConfigCache: AppConfig | null = null;

// Load application configuration from database
export async function loadAppConfig(): Promise<AppConfig> {
  if (appConfigCache) {
    return appConfigCache;
  }

  try {
    const [
      siteName,
      contactEmail,
      contactPhone,
      currency,
      paymentMethods,
      bookingConfirmation,
      telegramNotifications,
      maxSeatsPerBooking,
      minBookingTime
    ] = await Promise.all([
      getSetting('site_name'),
      getSetting('contact_email'),
      getSetting('contact_phone'),
      getSetting('currency'),
      getSetting('payment_methods'),
      getSetting('booking_confirmation'),
      getSetting('telegram_notifications'),
      getSetting('max_seats_per_booking'),
      getSetting('min_booking_time')
    ]);

    appConfigCache = {
      siteName: siteName || 'ويبوك - حجوزات الفعاليات',
      contactEmail: contactEmail || 'info@webook.com',
      contactPhone: contactPhone || '+966501234567',
      currency: currency || 'SAR',
      paymentMethods: paymentMethods ? paymentMethods.split(',') : ['visa', 'mada', 'mastercard'],
      bookingConfirmation: bookingConfirmation === 'true',
      telegramNotifications: telegramNotifications === 'true',
      maxSeatsPerBooking: parseInt(maxSeatsPerBooking) || 6,
      minBookingTime: parseInt(minBookingTime) || 24
    };

    return appConfigCache;
  } catch (error) {
    console.error('Error loading app configuration:', error);

    // Return default configuration if there's an error
    return {
      siteName: 'ويبوك - حجوزات الفعاليات',
      contactEmail: 'info@webook.com',
      contactPhone: '+966501234567',
      currency: 'SAR',
      paymentMethods: ['visa', 'mada', 'mastercard'],
      bookingConfirmation: true,
      telegramNotifications: true,
      maxSeatsPerBooking: 6,
      minBookingTime: 24
    };
  }
}

// Clear the app configuration cache
export function clearAppConfigCache(): void {
  appConfigCache = null;
}

// Get a specific setting value with caching
export async function getAppSetting(key: string): Promise<string> {
  return await getSetting(key);
}

// Set a specific setting value and update the cache if needed
export async function setAppSetting(key: string, value: string): Promise<void> {
  await setSetting(key, value);

  // Update the cache if needed
  if (appConfigCache) {
    switch (key) {
      case 'site_name':
        appConfigCache.siteName = value;
        break;
      case 'contact_email':
        appConfigCache.contactEmail = value;
        break;
      case 'contact_phone':
        appConfigCache.contactPhone = value;
        break;
      case 'currency':
        appConfigCache.currency = value;
        break;
      case 'payment_methods':
        appConfigCache.paymentMethods = value.split(',');
        break;
      case 'booking_confirmation':
        appConfigCache.bookingConfirmation = value === 'true';
        break;
      case 'telegram_notifications':
        appConfigCache.telegramNotifications = value === 'true';
        break;
      case 'max_seats_per_booking':
        appConfigCache.maxSeatsPerBooking = parseInt(value) || 6;
        break;
      case 'min_booking_time':
        appConfigCache.minBookingTime = parseInt(value) || 24;
        break;
    }
  }
}

// Helper function to format currency
export function formatCurrency(amount: number, currency = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Helper function to validate phone number
export function validatePhoneNumber(phone: string): boolean {
  // Simple validation for Saudi phone numbers
  const saudiPhoneRegex = /^05[0-9]{8}$/;
  return saudiPhoneRegex.test(phone.replace(/\s|-|\+/g, ''));
}

// Helper function to validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to generate booking reference
export function generateBookingReference(): string {
  const prefix = 'WBK';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

// Helper function to check if booking time is valid
export async function isBookingValid(eventDate: Date): Promise<boolean> {
  const now = new Date();
  const minHours = 24; // Default minimum hours before event

  // Try to get the minimum booking time from settings
  try {
    const minBookingTimeString = await getSetting('min_booking_time');
    const minBookingTimeHours = parseInt(minBookingTimeString) || minHours;
    const eventTime = new Date(eventDate).getTime();
    const nowTime = now.getTime();
    const timeDiff = eventTime - nowTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff >= minBookingTimeHours;
  } catch (error) {
    // If we can't get the setting, use default
    const eventTime = new Date(eventDate).getTime();
    const nowTime = now.getTime();
    const timeDiff = eventTime - nowTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff >= minHours;
  }
}
