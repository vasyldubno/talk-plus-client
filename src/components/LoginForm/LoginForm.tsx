import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { useStore } from '@/hooks/useStore'
import { AuthService } from '@/services/authService'
import { PasswordInput } from '@/ui/PasswordInput/PasswordInput'

export const LoginForm: FC = observer(() => {
	const [errorEmail, setErrorEmail] = useState<string>('')
	const [errorPassword, setErrorPassword] = useState<string | undefined>('')

	const store = useStore()
	const router = useRouter()

	const formSchema = z.object({
		email: z.string().min(1, 'Enter your email').email(),
		password: z.string().min(8, 'Password must contain at least 8 characters'),
	})

	type FormSchema = z.infer<typeof formSchema>

	const {
		register,
		formState: { errors },
		handleSubmit,
		getValues,
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const { refetch } = useQuery(
		'login',
		async () => {
			const data = getValues()
			const res = await AuthService.login(data)
			if (res) {
				store.updateUserId(res.id.toString())
				store.updateIsLogged(true)
				store.updateIsLoaded(true)
				store.updateAccessToken(res.accessToken)
				return router.push('/chat')
			}
			return null
		},
		{
			enabled: false,
			retry: false,
			onError(err: AxiosError<{ message: string }>) {
				if (err.response?.data.message === 'Invalid email') {
					setErrorEmail('Invalid email')
				}
				if (err.response?.data.message === 'Invalid password') {
					setErrorPassword('Invalid password')
				}
			},
		},
	)

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		await refetch()
	}

	return (
		<>
			{errorEmail}
			{errorPassword}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
				noValidate
			>
				<FormControl isRequired isInvalid={!!errors.email}>
					<FormLabel>Email</FormLabel>
					<Input
						type="email"
						{...register('email')}
						onChange={() => setErrorEmail('')}
					/>
					{errors.email && (
						<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
					)}
				</FormControl>

				<PasswordInput
					register={register}
					errors={errors.password}
					label="Password"
					name="password"
					onChange={() => setErrorPassword('')}
				/>

				<Button
					colorScheme="purple"
					type="submit"
					className="w-fit mt-5"
					style={{ alignSelf: 'center' }}
				>
					Login
				</Button>
			</form>
		</>
	)
})
