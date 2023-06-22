/* eslint-disable no-shadow */
import { Button, Image } from '@chakra-ui/react'
import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react'
import ReactCrop, {
	Crop,
	PixelCrop,
	centerCrop,
	makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useMatchMedia } from '@/hooks/useMatchMedia'

interface ImageCropperProps {
	image: File
	setImageBase64: Dispatch<SetStateAction<string>>
	onClose: () => void
}

export const ImageCropper: FC<ImageCropperProps> = ({
	image,
	setImageBase64,
	onClose,
}) => {
	const imgRef = useRef<HTMLImageElement>(null)
	const [imgSrc, setImgSrc] = useState('')
	const [crop, setCrop] = useState<Crop>()
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
	const [aspect] = useState<number>(1 / 1)
	const [imageType, setImageType] = useState('')

	const smSceen = useMatchMedia('(max-width: 640px)')

	const centerAspectCrop = (
		mediaWidth: number,
		mediaHeight: number,
		newAspect: number,
	) => {
		return centerCrop(
			makeAspectCrop(
				{
					unit: '%',
					height: 100,
				},
				newAspect,
				mediaWidth,
				mediaHeight,
			),
			mediaWidth,
			mediaHeight,
		)
	}

	useEffect(() => {
		if (image) {
			setImageType(image.type)
			setCrop(undefined)
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				setImgSrc(reader.result?.toString() || '')
			})
			reader.readAsDataURL(image)
		}
	}, [image])

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget
		setCrop(centerAspectCrop(width, height, aspect))
	}

	const onDownloadCropClick = async () => {
		if (completedCrop && imgRef.current) {
			const image = imgRef.current
			const scaleX = image.naturalWidth / image.width
			const scaleY = image.naturalHeight / image.height
			const cropX = completedCrop.x * scaleX
			const cropY = completedCrop.y * scaleY
			const cropWidth = completedCrop.width * scaleX
			const cropHeight = completedCrop.height * scaleY
			const canvas = document.createElement('canvas')
			canvas.width = cropWidth
			canvas.height = cropHeight
			const ctx = canvas.getContext('2d')
			if (!ctx) return
			ctx.drawImage(
				image,
				cropX,
				cropY,
				cropWidth,
				cropHeight,
				0,
				0,
				cropWidth,
				cropHeight,
			)
			const croppedImage = canvas.toDataURL(imageType, 0.9)
			setImageBase64(croppedImage)
			onClose()
		}
	}

	return (
		<div className="flex flex-col">
			<ReactCrop
				crop={crop}
				onChange={(_, percentCrop) => setCrop(percentCrop)}
				onComplete={(c) => {
					setCompletedCrop(c)
				}}
				aspect={aspect}
			>
				<Image
					src={imgSrc}
					ref={imgRef}
					onLoad={onImageLoad}
					w="auto"
					h={smSceen ? 'auto' : '80vh'}
				/>
			</ReactCrop>
			<Button onClick={onDownloadCropClick} className="w-fit mx-auto mt-3">
				SAVE
			</Button>
		</div>
	)
}
