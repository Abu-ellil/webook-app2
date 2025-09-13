import { prisma } from './db';

// Cache for settings to avoid repeated database calls
const settingsCache: { [key: string]: string } = {};

// Function to get a setting value
export async function getSetting(key: string): Promise<string> {
  // First check the cache
  if (settingsCache[key]) {
    return settingsCache[key];
  }

  try {
    // If not in cache, fetch from database
    const setting = await prisma.settings.findUnique({
      where: { key }
    });

    if (setting) {
      // Cache the value
      settingsCache[key] = setting.value;
      return setting.value;
    }

    // Return default value if not found
    return '';
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return '';
  }
}

// Function to set a setting value
export async function setSetting(key: string, value: string): Promise<void> {
  try {
    // Update or create the setting
    await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    // Update the cache
    settingsCache[key] = value;
  } catch (error) {
    console.error(`Error setting setting ${key}:`, error);
    throw error;
  }
}

// Function to get multiple settings at once
export async function getSettings(keys: string[]): Promise<{ [key: string]: string }> {
  const result: { [key: string]: string } = {};

  // First check the cache for any available settings
  const keysToFetch: string[] = [];

  for (const key of keys) {
    if (settingsCache[key]) {
      result[key] = settingsCache[key];
    } else {
      keysToFetch.push(key);
    }
  }

  // Fetch settings not in cache
  if (keysToFetch.length > 0) {
    try {
      const settings = await prisma.settings.findMany({
        where: { key: { in: keysToFetch } }
      });

      for (const setting of settings) {
        result[setting.key] = setting.value;
        settingsCache[setting.key] = setting.value;
      }

      // Set empty values for keys not found
      for (const key of keysToFetch) {
        if (!result[key]) {
          result[key] = '';
          settingsCache[key] = '';
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  return result;
}

// Function to clear the cache
export function clearSettingsCache(): void {
  Object.keys(settingsCache).forEach(key => {
    delete settingsCache[key];
  });
}
