import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'masoft',
    api_key: process.env.CLOUDINARY_API_KEY || '657846754332939',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'Jsg7AiP68YfIr74PmFwIP7T5YF8',
})

export default cloudinary

export const uploadImage = async (file: string | Buffer, options?: any) => {
    try {
        let uploadFile: string;

        if (Buffer.isBuffer(file)) {
            // Convert Buffer to base64 data URL
            uploadFile = `data:image/jpeg;base64,${file.toString('base64')}`;
        } else {
            uploadFile = file;
        }

        const result = await cloudinary.uploader.upload(uploadFile, {
            folder: 'event-booking',
            resource_type: 'auto',
            ...options,
        })
        return result
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
    }
}

export const deleteImage = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        throw error
    }
}