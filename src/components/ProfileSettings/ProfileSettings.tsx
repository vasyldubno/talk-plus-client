import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { supabase } from '@/config/supabase'
import { toastConfig } from '@/config/toastConfig'
import { useStore } from '@/hooks/useStore'
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon'
import { ChatService } from '@/services/chatService'
import { FileInput } from '@/ui/FileInput/FileInput'

interface ProfileSettingsProps {
	onClose?: () => void
}

export const ProfileSettings: FC<ProfileSettingsProps> = ({ onClose }) => {
	const [imageBase64, setImageBase64] = useState('')
	const [imageFile, setImageFile] = useState<File>()

	const store = useStore()
	const userId = store.getUserId()

	const formSchema = z.object({
		image: z.instanceof(FileList),
	})

	type FormSchema = z.infer<typeof formSchema>

	const { control, handleSubmit, formState } = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
	})

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		store.updateIsLoading(true)
		const existAvatar = await supabase
			.from('users')
			.select('avatar')
			.eq('id', userId)
			.single()

		if (existAvatar.data) {
			const responseDeleteAvatar = await axios.post(
				'/api/cloudinary/delete-image',
				{ imageUrl: existAvatar.data.avatar },
			)

			if (responseDeleteAvatar) {
				if (imageFile) {
					const responseUploadImage = await ChatService.uploadImageToCloudinary(
						imageFile,
						store,
					)
					if (responseUploadImage) {
						if (responseUploadImage.data) {
							toast.success('Changes successful applied', toastConfig)
							const res = await supabase
								.from('users')
								.update({ avatar: responseUploadImage.data.secure_url })
								.eq('id', store.getUserId())
							if (res.status) {
								store.updateIsLoading(false)
							}
						}
					}
				}
			}
		}

		if (existAvatar.error) {
			if (imageFile) {
				const responseUploadImage = await ChatService.uploadImageToCloudinary(
					imageFile,
					store,
				)
				if (responseUploadImage) {
					if (responseUploadImage.data) {
						toast.success('Changes successful applied', toastConfig)
						const res = await supabase
							.from('users')
							.update({ avatar: responseUploadImage.data.secure_url })
							.eq('id', store.getUserId())
						if (res.status) {
							store.updateIsLoading(false)
						}
					}
				}
			}
		}
	}

	useEffect(() => {
		if (userId) {
			supabase
				.from('users')
				.select('avatar')
				.eq('id', userId)
				.single()
				.then((res) => setImageBase64(res.data?.avatar))
		}
	}, [userId])

	return (
		<div className="h-screen">
			<Box className="bg-[var(--color-middle-gray)] py-4 px-3 justify-between lg:justify-center flex items-center">
				<Box className="cursor-pointer lg:hidden" onClick={onClose}>
					<ArrowLeftIcon size="2rem" />
				</Box>
				<h1 className="font-bold text-white text-2xl py-2">Settings</h1>
				<div className="lg:hidden" />
			</Box>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="px-5 mt-5 sm:max-w-[50vw] mx-auto my-0 text-center flex flex-col gap-10"
			>
				<Controller
					control={control}
					name="image"
					render={({ field: { onChange }, fieldState: { error } }) => (
						<FileInput
							onChange={onChange}
							error={error}
							imageBase64={imageBase64}
							setImageBase64={setImageBase64}
							setImageFile={setImageFile}
							className="flex justify-center"
							heigth="h-52"
							width="w-52"
						/>
					)}
				/>
				<Button type="submit" className="w-fit self-center mt-5">
					Save changes
				</Button>
			</form>
		</div>
	)
}
