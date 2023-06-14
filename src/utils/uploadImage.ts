import { $cloudinary } from '@/config/cloudinaryConfig'

export const uploadImage = async (file: string) => {
	try {
		const result = await $cloudinary.uploader.upload(file, {
			folder: 'talk-plus',
		})

		return result.secure_url
	} catch (error) {
		console.error('Error uploading image to Cloudinary:', error)
		return null
	}
}
