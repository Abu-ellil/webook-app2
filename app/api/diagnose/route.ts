import { NextResponse } from 'next/server'
import { getDatabase, getCollection } from '@/lib/db'
import { MongoClient } from 'mongodb'

export async function GET() {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV as "development" | "production" | "test",
    hasDatabaseUrl: !!process.env.MONGODB_URI,
    databaseStatus: 'unknown' as 'unknown' | 'connected' | 'failed',
    environmentVariables: {} as Record<string, string>,
    databaseError: undefined as string | undefined,
    eventCount: undefined as number | string | undefined,
    eventCountError: undefined as string | undefined,
    error: undefined as string | undefined
  }

  try {
    // Check environment variables
    const envVars = [
      'MONGODB_URI',
      'NEXT_PUBLIC_BASE_URL'
    ]

    envVars.forEach(varName => {
      diagnosis.environmentVariables[varName] = process.env[varName] ? 'set' : 'not set'
    })

    // Test database connection
    if (process.env.MONGODB_URI) {
      try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        diagnosis.databaseStatus = 'connected'
        await client.close();
      } catch (error) {
        diagnosis.databaseStatus = 'failed'
        diagnosis.databaseError = error.message
      }
    }

    // Try to run a simple query
    if (diagnosis.databaseStatus === 'connected') {
      try {
        const eventsCollection = await getCollection('Event');
        const eventCount = await eventsCollection.countDocuments();
        diagnosis.eventCount = eventCount
      } catch (error) {
        diagnosis.eventCount = 'error'
        diagnosis.eventCountError = error.message
      }
    }

    return NextResponse.json(diagnosis)
  } catch (error) {
    diagnosis.error = error.message
    return NextResponse.json(diagnosis, { status: 500 })
  }
}
