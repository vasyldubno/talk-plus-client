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
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { METADATA } from '@/config/metadata'
import { supabase } from '@/config/supabase'
import { useStore } from '@/hooks/useStore'
import { DividerWithText } from '@/ui/DividerWithText/DividerWithText'
import { PasswordInput } from '@/ui/PasswordInput/PasswordInput'

export const LoginForm: FC = observer(() => {
	const [errorAuth, setErrorAuth] = useState(false)

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

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		const response = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		})

		if (response.error) {
			setErrorAuth(true)
		}

		if (response.data.user) {
			store.updateIsLogged(true)
			store.updateIsLoaded(true)
			store.updateUsername(response.data.user.user_metadata.username)
			router.push('/chat')
		}
	}

	return (
		<>
			{errorAuth && (
				<p className="text-center text-[var(--color-error)] pb-5">
					Invalid email or password
				</p>
			)}
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
						onChange={() => setErrorAuth(false)}
					/>
					{errors.email && (
						<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
					)}
				</FormControl>

				<Box className="flex flex-col">
					<PasswordInput
						register={register}
						errors={errors.password}
						label="Password"
						name="password"
						onChange={() => setErrorAuth(false)}
					/>
					<Link
						href="/forgot-password"
						className="text-sm hover:text-[var(--color-link)] hover:underline self-end"
					>
						Forgot Password?
					</Link>
				</Box>

				<Button
					colorScheme="purple"
					type="submit"
					className="w-fit mt-5"
					style={{ alignSelf: 'center' }}
					aria-label="Login"
				>
					Login
				</Button>
			</form>
			<Box className="flex flex-col">
				<DividerWithText
					text={`New to ${METADATA.title}?`}
					styles={{ marginTop: '3rem', marginBottom: '1rem' }}
				/>
				<Button
					colorScheme="purple"
					type="button"
					className="w-fit"
					style={{ alignSelf: 'center' }}
					aria-label="Create New Account"
					onClick={() => router.push('/register')}
				>
					Create New Account
				</Button>
			</Box>
		</>
	)
})
