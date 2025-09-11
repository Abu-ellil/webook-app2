import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create Prisma client with minimal logging
const createPrismaClient = () => {
    // Skip during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return null
    }

    // Check DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found')
        return null
    }

    try {
        const client = new PrismaClient({
            log: ['error'], // Only log errors to reduce noise
            errorFormat: 'pretty',
        })

        return client

    } catch (error) {
        console.error('❌ Failed to create PrismaClient:', error)
        return null
    }
}

// Initialize Prisma client with singleton pattern
const prismaInstance = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prismaInstance) {
    globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance

// Helper function to check if database is available
export function checkDatabaseConnection() {
    if (!prisma) {
        throw new Error('Database connection not available')
    }
    return prisma
}

