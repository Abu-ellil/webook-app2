import { NextResponse } from 'next/server';
import { getSetting, setSetting, getAllSettings } from '@/app/lib/settings';

export async function GET() {
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();
    
    // Save each setting
    const savePromises = Object.entries(settings).map(([key, value]) => {
      // Skip currency as it's handled by the dedicated currency API
      if (key === 'currency') return Promise.resolve(true);
      return setSetting(key, String(value));
    });
    
    await Promise.all(savePromises);
    
    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}