import { Box, Button, Container } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { observer } from 'mobx-react-lite'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import { supabase } from '@/config/supabase'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { PasswordInput } from '@/ui/PasswordInput/PasswordInput'

export const ChangePasswordScreen = observer(() => {
	const store = useStore()
	const sm = useMatchMedia('(max-width: 767px)')

	const formSchema = z
		.object({
			password: z.string().min(8, 'String must contain at least 8 characters'),
			confirmPassword: z.string().min(8, "Password doesn't match"),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Password doesn't match",
			path: ['confirmPassword'],
		})

	type FormSchema = z.infer<typeof formSchema>

	const {
		register,
		formState: { errors, isSubmitSuccessful },
		handleSubmit,
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		store.updateIsLoading(true)
		const res = await supabase.auth.updateUser({ password: data.password })
		if (res.data.user) {
			store.updateIsLoading(false)
		}
	}

	return (
		<Container>
			{isSubmitSuccessful ? (
				<>
					<p className="text-center mt-10 text-xl">Thank you.</p>
					<p className="text-center text-xl">You successfull change password</p>
					<p className="text-center text-base hover:underline mt-10 hover:text-[var(--color-link)]">
						<Link href="/login">Go to Login Page</Link>
					</p>
				</>
			) : (
				<Box className={`max-w-lg my-10 mx-auto ${sm ? 'p-2' : ''}`}>
					<form
						className="flex flex-col gap-5"
						onSubmit={handleSubmit(onSubmit)}
					>
						<PasswordInput
							register={register}
							errors={errors.password}
							label="New password"
							name="password"
						/>
						<PasswordInput
							register={register}
							errors={errors.confirmPassword}
							label="Confirm password"
							name="confirmPassword"
						/>
						<Button
							className="w-fit bg-[var(--color-purple)] text-white self-center hover:bg-[var(--color-purple-dark)]"
							type="submit"
							aria-label="Change Password"
						>
							Change Password
						</Button>
					</form>
				</Box>
			)}
		</Container>
	)
})
