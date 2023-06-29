import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { Container } from '@/ui/Container/Container'
import { Loader } from '@/ui/Loader/Loader'

export const ForgotPasswordScreen = () => {
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
		console.log('')
	}

	return (
		<Container>
			{isSubmitting ? (
				<Loader />
			) : (
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
								colorScheme="purple"
								type="submit"
								className="w-fit"
								style={{ alignSelf: 'center' }}
								aria-label="Create New Account"
							>
								Reset Password
							</Button>
						</form>
					)}
				</>
			)}
		</Container>
	)
}
