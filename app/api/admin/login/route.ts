import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import mongoDB from '@/app/lib/db-mongo';

export async function POST(request: NextRequest) {
    try {
        console.log('🔐 Admin login attempt')
        const { username, password } = await request.json()
        console.log('👤 Login attempt for username:', username, 'and password:', password)

        const adminCollection = await mongoDB.getCollection('admins');

        // Count total admins first
        const adminCount = await adminCollection.countDocuments();
        console.log('📊 Total admin users in database:', adminCount)

        if (adminCount === 0) {
            console.log('⚠️ No admin users found in database')
            return NextResponse.json(
                { error: 'No admin users found. Please setup admin first.' },
                { status: 404 }
            )
        }

        // Find admin user
        const admin = await adminCollection.findOne({ username });

        console.log('🔍 Admin found:', !!admin)

        if (!admin) {
            console.log('❌ Admin user not found')
            return NextResponse.json(
                { error: 'Invalid username' },
                { status: 401 }
            )
        }

        if (admin.password !== password) {
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
