import { v2 } from 'cloudinary'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		v2.config({
			cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
			api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
			api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
		})

		const getPublicId = () => {
			const split = req.body.imageUrl.split('/')
			const publicId = `${split[7]}/${split[8].split('.')[0]}`
			return publicId
		}

		await v2.uploader.destroy(getPublicId())
		res.json({ message: 'Success' })
	} catch (error) {
		res.json({ message: 'Error' })
	}
}
