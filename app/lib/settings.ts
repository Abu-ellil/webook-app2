import mongoDB from './db-mongo';

export interface Setting {
  key: string;
  value: string;
}

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const settingsCollection = await mongoDB.getCollection('Settings');
    const setting = await settingsCollection.findOne({ key });
    
    return setting ? setting.value : null;
  } catch (error) {
    console.error(`Error fetching setting with key ${key}:`, error);
    return null;
  }
}

/**
 * Set a setting value by key
 */
export async function setSetting(key: string, value: string): Promise<boolean> {
  try {
    const settingsCollection = await mongoDB.getCollection('Settings');
    
    await settingsCollection.updateOne(
      { key },
      { $set: { key, value } },
      { upsert: true }
    );
    
    return true;
  } catch (error) {
    console.error(`Error setting value for key ${key}:`, error);
    return false;
  }
}

/**
 * Get all settings
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const settingsCollection = await mongoDB.getCollection('Settings');
    const settings = await settingsCollection.find({}).toArray();
    
    // Convert array to object
    const settingsObject: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value;
    });
    
    return settingsObject;
  } catch (error) {
    console.error('Error fetching all settings:', error);
    return {};
  }
}

/**
 * Initialize default settings if they don't exist
 */
export async function initializeDefaultSettings() {
  try {
    const defaultSettings: Record<string, string> = {
      'currency': 'SAR',
      'bronzeTicketPrice': '250',
      'telegramBotEnabled': 'false'
    };
    
    for (const [key, value] of Object.entries(defaultSettings)) {
      const existingValue = await getSetting(key);
      if (existingValue === null) {
        await setSetting(key, value);
        console.log(`Initialized default setting: ${key} = ${value}`);
      }
    }
  } catch (error) {
    console.error('Error initializing default settings:', error);
  }
}
