import {
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from '@/config/supabase'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { PasswordInput } from '@/ui/PasswordInput/PasswordInput'

interface RegisterFormProps {
	setIsSignUpSuccess: Dispatch<SetStateAction<boolean>>
}

export const RegisterForm: FC<RegisterFormProps> = ({ setIsSignUpSuccess }) => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')

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
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		const res = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				emailRedirectTo: `${process.env.NEXT_PUBLIC_CLIEN_URL}/login`,
				data: {
					username: data.username,
					firstName: data.firstName,
				},
			},
		})

		if (res.error) {
			setErrorMessage(res.error.message)
		}

		if (res.data.user) {
			await supabase.from('users').insert({
				id: res.data.user.id,
				username: data.username,
				firstName: data.firstName,
			})

			setIsSignUpSuccess(true)
		}
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
