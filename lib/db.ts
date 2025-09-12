import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create Prisma client with minimal logging
const createPrismaClient = () => {
    // Check DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found')
        throw new Error('DATABASE_URL environment variable is not set')
    }

    try {
        console.log('🔗 Creating new Prisma client...')
        const client = new PrismaClient({
            log: ['error'], // Only log errors to reduce noise
            errorFormat: 'pretty',
        })

        // Test the connection
        console.log('🧪 Testing database connection...')
        client.$connect().then(() => {
            console.log('✅ Database connection established')
        }).catch((error) => {
            console.error('❌ Database connection failed:', error)
        })

        return client
    } catch (error) {
        console.error('❌ Failed to create PrismaClient:', error)
        throw error
    }
}

// Initialize Prisma client with singleton pattern
let prismaInstance: PrismaClient | undefined

try {
    if (typeof window === 'undefined') { // Only run on server side
        prismaInstance = globalForPrisma.prisma ?? createPrismaClient()
        
        if (process.env.NODE_ENV !== 'production' && prismaInstance) {
            globalForPrisma.prisma = prismaInstance
        }
    }
} catch (error) {
    console.error('❌ Failed to initialize Prisma client:', error)
}

export const prisma = prismaInstance

// Helper function to check if database is available
export function checkDatabaseConnection() {
    if (!prisma) {
        throw new Error('Database connection not available')
    }
    return prisma
}

