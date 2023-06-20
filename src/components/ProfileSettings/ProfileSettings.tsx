import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { $axios } from '@/config/axiosConfig'
import { toastConfig } from '@/config/toastConfig'
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon'
import { UserService } from '@/services/userService'
import { FileInput } from '@/ui/FileInput/FileInput'

interface ProfileSettingsProps {
	onClose?: () => void
}

export const ProfileSettings: FC<ProfileSettingsProps> = ({ onClose }) => {
	const [imageBase64, setImageBase64] = useState('')

	const formSchema = z.object({
		image: z.instanceof(FileList),
		userName: z.string(),
	})

	type FormSchema = z.infer<typeof formSchema>

	const { control, handleSubmit, register, setValue } = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
	})

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		return $axios.post('/users/change-profile-avatar', { image: imageBase64 })
	}

	useQuery('profile', async () => UserService.getUser(), {
		onSuccess(data) {
			setImageBase64(data.data.avatar)
			setValue('userName', data.data.userName)
		},
	})

	const handleSaveChanges = () => {
		toast.success('Changes successful applied', toastConfig)
	}

	return (
		<div className="h-screen">
			<Box className="bg-[var(--color-middle-gray)] py-4 px-3 justify-between flex items-center mb-5">
				<Box className="cursor-pointer lg:hidden" onClick={onClose}>
					<ArrowLeftIcon size="2rem" />
				</Box>
				<h1 className="font-bold text-center text-white text-lg">Settings</h1>
				<div />
			</Box>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="h-[100%] max-w-[50vw] mx-auto my-0 text-center"
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
							className="flex justify-center mb-5"
							heigth="h-52"
							width="w-52"
						/>
					)}
				/>
				<FormControl>
					<FormLabel>Username</FormLabel>
					<Input {...register('userName')} className="text-white" />
				</FormControl>
				<Button type="submit" className="mt-5" onClick={handleSaveChanges}>
					Save changes
				</Button>
			</form>
		</div>
	)
}
