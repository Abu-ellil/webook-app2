import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
    try {
        console.log('🔧 Setting up admin user...')
        console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL)

        if (!prisma) {
            console.error('❌ Prisma client not available')
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findFirst()

        if (existingAdmin) {
            console.log('✅ Admin user already exists')
            return NextResponse.json({
                message: 'Admin user already exists',
                username: existingAdmin.username
            })
        }

        // Create default admin user
        const admin = await prisma.admin.create({
            data: {
                username: 'admin',
                password: 'admin123' // في الإنتاج، استخدم كلمة مرور مشفرة
            }
        })

        console.log('✅ Admin user created successfully')

        return NextResponse.json({
            message: 'Admin user created successfully',
            username: admin.username,
            note: 'Default password is: admin123'
        })

    } catch (error) {
        console.error('❌ Setup admin error:', error)
        return NextResponse.json({
            error: 'Failed to setup admin user',
            details: error.message
        }, { status: 500 })
    }
}