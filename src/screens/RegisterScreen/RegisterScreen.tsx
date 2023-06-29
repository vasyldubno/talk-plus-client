import { Box } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { RegisterForm } from '@/components/RegisterForm/RegisterForm'
import { useMatchMedia } from '@/hooks/useMatchMedia'

export const RegisterScreen: FC = () => {
	const [isSignUnSuccess, setIsSignUpSuccess] = useState(false)
	const sm = useMatchMedia('(max-width: 767px)')

	return (
		<div className={`max-w-lg my-0 mx-auto ${sm ? 'p-2' : ''}`}>
			{isSignUnSuccess ? (
				<Box className="my-10">
					<h1 className="text-center font-normal text-[var(--color-dark-gray)] text-xl">
						Success
					</h1>
					<p className="text-center font-normal text-[var(--color-dark-gray)] text-xl">
						Go to email and confirmed your account
					</p>
				</Box>
			) : (
				<>
					<Box className={`flex flex-col my-10 ${sm ? 'gap-0' : 'gap-2'}`}>
						<h1
							className={`text-center font-medium ${
								sm ? 'text-xl' : 'text-4xl'
							}`}
						>
							Create Account
						</h1>
						<p
							className={`text-center font-normal text-[var(--color-gray)] ${
								sm ? 'text-base' : 'text-lg'
							}`}
						>
							Connect with your Friends Today!
						</p>
					</Box>
					<RegisterForm setIsSignUpSuccess={setIsSignUpSuccess} />
				</>
			)}
		</div>
	)
}
