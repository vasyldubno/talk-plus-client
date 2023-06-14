import {
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { AuthService } from '@/services/authService'
import { PasswordInput } from '@/ui/PasswordInput/PasswordInput'

export const RegisterForm: FC = () => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')

	const store = useStore()
	const router = useRouter()

	const xs = useMatchMedia('(max-width: 390px)')

	const formSchema = z
		.object({
			email: z.string().email(),
			username: z.string().min(3, 'username must contain at least 3 symbols'),
			password: z.string().min(8, 'String must contain at least 8 characters'),
			confirmPassword: z.string().min(8, "Password doesn't match"),
			firstName: z
				.string()
				.min(3, 'First Name must contain at least 3 symbols'),
			terms: z.literal(true, {
				errorMap: () => ({ message: 'You must accept Terms and Conditions' }),
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Password doesn't match",
			path: ['confirmPassword'],
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
		'register',
		async () => {
			const data = getValues()
			const response = await AuthService.register(data)
			if (response) {
				store.updateUserId(response.id.toString())
				store.updateIsLogged(true)
				store.updateIsLoaded(true)
				store.updateAccessToken(response.accessToken)
				return router.push('/chat')
			}
			return null
		},
		{
			enabled: false,
			retry: false,
			onError(err: AxiosError<{ message: string }>) {
				console.log(err.response?.data.message)
				setErrorMessage(err.response?.data.message)
			},
		},
	)

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		await refetch()
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
				noValidate
			>
				<FormControl isRequired isInvalid={!!errors.email}>
					<FormLabel>Email</FormLabel>
					<Input type="email" {...register('email')} />
					{errors.email && (
						<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
					)}
				</FormControl>
				<FormControl isRequired isInvalid={!!errors.username}>
					<FormLabel>Username</FormLabel>
					<Input type="text" {...register('username')} />
					{errors.username && (
						<FormErrorMessage>{errors.username?.message}</FormErrorMessage>
					)}
				</FormControl>
				<FormControl isRequired isInvalid={!!errors.firstName}>
					<FormLabel>First Name</FormLabel>
					<Input type="text" {...register('firstName')} />
					{errors.firstName && (
						<FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
					)}
				</FormControl>
				<PasswordInput
					register={register}
					errors={errors.password}
					label="Password"
					name="password"
				/>
				<PasswordInput
					register={register}
					errors={errors.confirmPassword}
					label="Confirm password"
					name="confirmPassword"
				/>
				<FormControl isInvalid={!!errors.terms}>
					<Checkbox defaultChecked {...register('terms')}>
						<p className={`${xs ? 'text-xs' : 'text-base'}`}>
							I agree to the terms and conditions
						</p>
					</Checkbox>
					{errors.terms && (
						<FormErrorMessage>{errors.terms.message}</FormErrorMessage>
					)}
				</FormControl>
				<Button
					colorScheme="purple"
					type="submit"
					className="w-fit mt-5"
					style={{ alignSelf: 'center' }}
				>
					Register
				</Button>
			</form>
			{errorMessage && (
				<p className="text-center mt-10 text-red-500 font-bold text-lg">
					{errorMessage}
				</p>
			)}
		</>
	)
}
