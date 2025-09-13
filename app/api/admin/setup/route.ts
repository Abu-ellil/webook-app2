import { NextResponse } from 'next/server'
import mongoDB from '@/app/lib/db-mongo';

export async function POST() {
    try {
        console.log('🔧 Setting up admin user...')
        console.log('🔗 MONGODB_URI:', process.env.MONGODB_URI)

        const adminCollection = await mongoDB.getCollection('Admin');

        // Check if admin already exists
        const existingAdmin = await adminCollection.findOne({});

        if (existingAdmin) {
            console.log('✅ Admin user already exists')
            return NextResponse.json({
                message: 'Admin user already exists',
                username: existingAdmin.username
            })
        }

        // Create default admin user
        const admin = {
            username: 'admin',
            password: 'admin123' // في الإنتاج، استخدم كلمة مرور مشفرة
        };
        
        const result = await adminCollection.insertOne(admin);
        const createdAdmin = { ...admin, id: result.insertedId };

        console.log('✅ Admin user created successfully')

        return NextResponse.json({
            message: 'Admin user created successfully',
            username: createdAdmin.username,
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