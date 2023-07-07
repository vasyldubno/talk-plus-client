import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CLIENT_URL } from '@/config/consts'
import { supabase } from '@/config/supabase'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { Container } from '@/ui/Container/Container'

export const ForgotPasswordScreen = () => {
	const store = useStore()
	const sm = useMatchMedia('(max-width: 767px)')

	const formSchema = z.object({
		email: z.string().min(1, 'Enter your email').email(),
	})

	type FormSchema = z.infer<typeof formSchema>

	const {
		register,
		formState: { errors, isSubmitSuccessful, isSubmitting },
		handleSubmit,
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		store.updateIsLoading(true)
		await supabase.auth.resetPasswordForEmail(data.email, {
			redirectTo: `${CLIENT_URL}/change-password`,
		})
	}

	useEffect(() => {
		if (isSubmitSuccessful) {
			store.updateIsLoading(false)
		}
	}, [isSubmitSuccessful])

	return (
		<Container>
			<>
				{isSubmitSuccessful ? (
					<>
						<p className="text-center mt-10 text-xl">Check email.</p>
						<p className="text-center text-xl">
							You received link for reset password.
						</p>
					</>
				) : (
					<form
						onSubmit={handleSubmit(onSubmit)}
						className={`max-w-lg my-10 mx-auto flex flex-col gap-10 ${
							sm ? 'p-2' : ''
						}`}
					>
						<FormControl isRequired isInvalid={!!errors.email}>
							<FormLabel>Enter your email</FormLabel>
							<Input {...register('email')} />
							{errors.email && (
								<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
							)}
						</FormControl>
						<Button
							type="submit"
							className="w-fit bg-[var(--color-purple)] text-white self-center hover:bg-[var(--color-purple-dark)]"
							aria-label="Reset Password"
						>
							Reset Password
						</Button>
					</form>
				)}
			</>
		</Container>
	)
}
