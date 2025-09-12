import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        console.log('🔐 Admin login attempt')
        console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL)
        console.log('📊 Environment:', {
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
            DATABASE_URL_VALID: process.env.DATABASE_URL?.startsWith('postgresql://'),
            JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
            PRISMA_AVAILABLE: !!prisma
        })

        // Check if prisma client is available
        if (!prisma) {
            console.error('❌ Prisma client not available')
            return NextResponse.json(
                { error: 'Database connection not available' },
                { status: 500 }
            )
        }

        const { username, password } = await request.json()
        console.log('👤 Login attempt for username:', username)

        // Count total admins first
        const adminCount = await prisma.admin.count()
        console.log('📊 Total admin users in database:', adminCount)

        if (adminCount === 0) {
            console.log('⚠️ No admin users found in database')
            return NextResponse.json(
                { error: 'No admin users found. Please setup admin first.' },
                { status: 404 }
            )
        }

        // Find admin user
        const admin = await prisma.admin.findUnique({
            where: { username }
        })

        console.log('🔍 Admin found:', !!admin)

        if (!admin) {
            console.log('❌ Admin user not found')
            return NextResponse.json(
                { error: 'Invalid username' },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            console.log('❌ Invalid password')
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            )
        }

        console.log('✅ Login successful')

        // Create JWT token
        const token = sign(
            { adminId: admin.id, username: admin.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        )

        return NextResponse.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        })
    } catch (error) {
        console.error('❌ Login error:', error)
        return NextResponse.json(
            { error: 'Login failed', details: error.message },
            { status: 500 }
        )
    }
}