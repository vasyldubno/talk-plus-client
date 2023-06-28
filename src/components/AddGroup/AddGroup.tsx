import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { observer } from 'mobx-react-lite'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useStore } from '@/hooks/useStore'
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon'
import { ChatService } from '@/services/chatService'
import { IChat, ISocket } from '@/types/types'
import { FileInput } from '@/ui/FileInput/FileInput'
import { Loader } from '@/ui/Loader/Loader'

interface AddGroupProps {
	setChats: Dispatch<SetStateAction<IChat[]>>
	setIsAddGroup: Dispatch<SetStateAction<boolean>>
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
	socket: ISocket | null
	onClose?: () => void
}

export const AddGroup: FC<AddGroupProps> = observer(
	({ setChats, setIsAddGroup, setSelectedChat, socket, onClose }) => {
		const store = useStore()
		const userId = store.getUserId()
		const isLoading = store.getIsLoading()

		const [imageBase64, setImageBase64] = useState('')

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

			if (userId) {
				const response = await ChatService.addGroup(
					data.title,
					imageBase64,
					userId,
				)
				if (response) {
					const newChat: IChat = {
						id: response.data.id,
						imageUrl: imageBase64,
						title: data.title,
						isAdmin: true,
						type: 'group',
					}

					if (socket) {
						socket.emit('join', { room: newChat.title, type: 'group' })
					}

					setChats((prev) => [newChat, ...prev])
					setIsAddGroup(false)
					setSelectedChat(newChat)
					store.updateIsLoading(false)
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
				{!isLoading && (
					<form
						onSubmit={handleSubmit(onSubmit)}
						encType="multipart/form-data"
						className="px-5 mt-5 sm:max-w-[50vw] mx-auto my-0 text-center flex flex-col gap-10"
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
				{/* {isLoading ? (
					<Loader />
				) : (
					<form
						onSubmit={handleSubmit(onSubmit)}
						encType="multipart/form-data"
						className="px-5 mt-5 sm:max-w-[50vw] mx-auto my-0 text-center flex flex-col gap-10"
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
				)} */}
			</Box>
		)
	},
)
