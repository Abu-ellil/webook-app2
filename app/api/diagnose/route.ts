import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV as "development" | "production" | "test",
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    prismaStatus: prisma ? 'initialized' : 'not initialized',
    databaseConnection: 'unknown' as 'unknown' | 'connected' | 'failed',
    environmentVariables: {} as Record<string, string>,
    databaseError: undefined as string | undefined,
    eventCount: undefined as number | string | undefined,
    eventCountError: undefined as string | undefined,
    error: undefined as string | undefined
  }

  try {
    // Check environment variables
    const envVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_BASE_URL',
      'PRISMA_CLIENT_ENGINE_TYPE',
      'PRISMA_CLI_QUERY_ENGINE_TYPE'
    ]

    envVars.forEach(varName => {
      diagnosis.environmentVariables[varName] = process.env[varName] ? 'set' : 'not set'
    })

    // Test database connection
    if (prisma) {
      try {
        await prisma.$connect()
        diagnosis.databaseConnection = 'connected'
      } catch (error) {
        diagnosis.databaseConnection = 'failed'
        diagnosis.databaseError = error.message
      }
    }

    // Try to run a simple query
    if (prisma && diagnosis.databaseConnection === 'connected') {
      try {
        const eventCount = await prisma.event.count()
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
