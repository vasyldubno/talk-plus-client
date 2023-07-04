import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { Cloudinary } from '@cloudinary/url-gen'
import ICloudinaryConfigurations from '@cloudinary/url-gen/config/interfaces/Config/ICloudinaryConfigurations'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { v2 } from 'cloudinary'
import { observer } from 'mobx-react-lite'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from '@/config/supabase'
import { useStore } from '@/hooks/useStore'
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon'
import { ChatService } from '@/services/chatService'
import { IChat, ISocket } from '@/types/types'
import { FileInput } from '@/ui/FileInput/FileInput'

interface AddGroupProps {
	setChats: Dispatch<SetStateAction<IChat[]>>
	setIsAddGroup: Dispatch<SetStateAction<boolean>>
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
	onClose?: () => void
}

export const AddGroup: FC<AddGroupProps> = observer(
	({ setChats, setIsAddGroup, setSelectedChat, onClose }) => {
		const store = useStore()
		const isLoading = store.getIsLoading()
		const userId = store.getUserId()

		const [imageBase64, setImageBase64] = useState('')
		const [imageFile, setImageFile] = useState<File>()

		const formSchema = z.object({
			title: z.string().min(3, 'Must contain min 3 symbols'),
			file: z.instanceof(FileList, { message: 'Choose image' }),
		})

		type FormSchema = z.infer<typeof formSchema>

		const {
			register,
			handleSubmit,
			formState: { errors },
			control,
		} = useForm<FormSchema>({
			mode: 'onChange',
			resolver: zodResolver(formSchema),
		})

		const onSubmit: SubmitHandler<FormSchema> = async (data) => {
			store.updateIsLoading(true)

			if (imageFile) {
				const formData = new FormData()
				formData.append('file', imageFile)
				formData.append(
					'api_key',
					process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
				)
				formData.append('upload_preset', 'test_test')

				const response = await axios.post(
					`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
					formData,
				)

				if (response) {
					const user = await supabase.auth.getUser()

					const newGroup = await supabase
						.from('chats')
						.insert({
							title: data.title,
							admin_id: user.data.user?.id,
							cover: response.data.secure_url,
							type: 'group',
						})
						.select()
						.single()

					if (newGroup.status === 201) {
						// if (process.env.NEXT_PUBLIC_DEPLOY_VERCEL === 'FALSE') {
						// 	ChatService.addMember(userId, newGroup.data.id)
						// }

						ChatService.addMember(userId, newGroup.data.id)

						store.updateIsLoading(false)
						setIsAddGroup(false)
						if (onClose) {
							onClose()
						}
					}
				}
			}
		}

		return (
			<Box className="h-screen">
				<Box className="bg-[var(--color-middle-gray)] py-4 px-3 justify-between lg:justify-center flex items-center">
					<Box className="cursor-pointer lg:hidden" onClick={onClose}>
						<ArrowLeftIcon size="2rem" />
					</Box>
					<h1 className="font-bold text-white text-2xl py-2">New Group</h1>
					<div className="lg:hidden" />
				</Box>
				<Box className="">
					{!isLoading && (
						<form
							onSubmit={handleSubmit(onSubmit)}
							encType="multipart/form-data"
							className="px-5 pb-5 mt-5 sm:max-w-[50vw] mx-auto my-0 text-center flex flex-col gap-10 bg-[var(--color-dark-gray)]"
						>
							<Controller
								name="file"
								control={control}
								render={({ field: { onChange } }) => (
									<FileInput
										onChange={onChange}
										error={errors.file}
										setImageBase64={setImageBase64}
										imageBase64={imageBase64}
										setImageFile={setImageFile}
										className="flex justify-center"
										heigth="h-52"
										width="w-52"
									/>
								)}
							/>
							<FormControl isInvalid={!!errors.title} className="text-white">
								<FormLabel>Group Name</FormLabel>
								<Input
									type="text"
									{...register('title')}
									className="placeholder:text-gray-500"
									placeholder="Typing text..."
								/>
								{errors.title && (
									<FormErrorMessage>{errors.title.message}</FormErrorMessage>
								)}
							</FormControl>
							<Button type="submit" className="mt-5 self-center w-fit">
								Create Group
							</Button>
						</form>
					)}
				</Box>
			</Box>
		)
	},
)
