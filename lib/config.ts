export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};