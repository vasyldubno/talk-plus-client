import { v2 } from 'cloudinary'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	v2.config({
		cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
		api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
		api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
	})
	const response = await v2.uploader.upload(req.body.imageUrl, {
		upload_preset: 'test_test',
		folder: 'talk-plus',
		transformation: {
			radius: 'max',
		},
	})
	res.json({ imageUrl: response.secure_url })
}
