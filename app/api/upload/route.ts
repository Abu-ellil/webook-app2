import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'masoft',
    api_key: process.env.CLOUDINARY_API_KEY || '657846754332939',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'Jsg7AiP68YfIr74PmFwIP7T5YF8',
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Convert buffer to base64 data URL
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

        // Upload to Cloudinary with simplified options
        const result = await cloudinary.uploader.upload(base64, {
            folder: 'event-booking',
            public_id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            resource_type: 'auto',
            // Apply transformations after upload to avoid complexity
            eager: [
                { width: 800, height: 600, crop: 'fill', quality: 'auto', format: 'webp' }
            ]
        })

        return NextResponse.json({
            url: (result as any).secure_url,
            publicId: (result as any).public_id,
            width: (result as any).width,
            height: (result as any).height
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        )
    }
}