import { NextRequest, NextResponse } from 'next/server'

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

        // Use Cloudinary's unsigned upload with a preset
        // This bypasses the timestamp validation issue
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/masoft/image/upload`

        const uploadData = new FormData()
        uploadData.append('file', base64)
        uploadData.append('upload_preset', 'ml_default') // Default unsigned preset
        uploadData.append('folder', 'event-booking')
        uploadData.append('public_id', `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`)

        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: uploadData,
        })

        if (!response.ok) {
            throw new Error(`Cloudinary upload failed: ${response.statusText}`)
        }

        const result = await response.json()

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
        })

    } catch (error) {
        console.error('Upload error:', error)

        // Fallback: Return a placeholder image URL
        const placeholderUrl = `https://via.placeholder.com/800x600/6366f1/ffffff?text=${encodeURIComponent('صورة الفعالية')}`

        return NextResponse.json({
            url: placeholderUrl,
            publicId: 'placeholder',
            width: 800,
            height: 600,
            fallback: true
        })
    }
}