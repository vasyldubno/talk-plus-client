import {
	Box,
	Image,
	Modal,
	ModalContent,
	ModalOverlay,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react'
import clsx from 'clsx'
import {
	ChangeEvent,
	Dispatch,
	FC,
	SetStateAction,
	useRef,
	useState,
} from 'react'
import { FieldError } from 'react-hook-form'
import { BsCamera } from 'react-icons/bs'
import { ImageCropper } from '@/components/ImageCropper/ImageCropper'

interface FileInputProps {
	onChange: (files: FileList) => void
	error: FieldError | undefined
	setImageBase64: Dispatch<SetStateAction<string>>
	imageBase64: string
	className?: string
	width: string
	heigth: string
}

export const FileInput: FC<FileInputProps> = ({
	onChange,
	error,
	imageBase64,
	setImageBase64,
	className,
	heigth,
	width,
}) => {
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const { onClose, isOpen, onOpen } = useDisclosure()

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if (files) {
			onChange(files)
			setSelectedImage(files[0])
			onOpen()
			e.target.value = ''
		}
	}

	return (
		<div className={clsx('relative', className)}>
			<input
				data-testid="file"
				accept="image/*"
				type="file"
				style={{ display: 'none' }}
				ref={inputRef}
				onChange={handleInputChange}
			/>
			<Tooltip
				label={imageBase64 ? 'Update avatar' : 'Select avatar'}
				aria-label="a tooltip"
				placement="bottom"
			>
				<Box
					className={clsx(
						'border-[1px] border-gray-600 rounded-full flex justify-center items-center cursor-pointer overflow-hidden mr-0',
						width,
						heigth,
					)}
					onClick={() => inputRef.current?.click()}
				>
					{imageBase64 ? (
						<Image src={imageBase64} className={clsx(width, heigth)} />
					) : (
						<BsCamera className="w-full h-full p-[15%] hover:scale-[1.1] transition-all duration-300 fill-white" />
					)}
				</Box>
			</Tooltip>
			{error && (
				<p
					className="absolute top-[20%] left-[-160%]"
					style={{
						color: '#E53E3E',
						fontSize: '0.875rem',
						marginTop: '0.5rem',
					}}
					aria-live="polite"
				>
					{error.message}
				</p>
			)}

			<Modal isOpen={isOpen} onClose={onClose} size="full">
				<ModalOverlay />
				<ModalContent
					h="80vh"
					w="max-content"
					minH="80vh"
					p={0}
					backgroundColor="transparent"
					boxShadow="none"
					marginTop="10px"
				>
					<ImageCropper
						image={selectedImage as File}
						setImageBase64={setImageBase64}
						// setSelectedImage={setSelectedImage}
						onClose={onClose}
					/>
				</ModalContent>
			</Modal>
		</div>
	)
}
