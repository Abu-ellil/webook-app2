import { NextResponse } from 'next/server';
import { getSetting, setSetting } from '@/app/lib/settings';

export async function GET() {
  try {
    const currency = await getSetting('currency');
    return NextResponse.json({ value: currency || 'SAR' });
  } catch (error) {
    console.error('Error fetching currency setting:', error);
    return NextResponse.json({ error: 'Failed to fetch currency setting' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { value } = await request.json();
    
    // Validate currency code
    const supportedCurrencies = ['SAR', 'USD', 'EUR', 'AED', 'KWD', 'QAR'];
    if (!supportedCurrencies.includes(value)) {
      return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 });
    }
    
    const success = await setSetting('currency', value);
    if (success) {
      return NextResponse.json({ message: 'Currency updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to update currency' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating currency setting:', error);
    return NextResponse.json({ error: 'Failed to update currency setting' }, { status: 500 });
  }
}