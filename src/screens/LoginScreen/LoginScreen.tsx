import { Box, Text } from '@chakra-ui/react'
import { FC } from 'react'
import Image from 'next/image'
import { LoginForm } from '@/components/LoginForm/LoginForm'
import { useMatchMedia } from '@/hooks/useMatchMedia'

export const LoginScreen: FC = () => {
	const sm = useMatchMedia('(max-width: 767px)')

	return (
		<div className={`max-w-lg my-0 mx-auto ${sm ? 'p-2' : ''}`}>
			<Box className={`flex flex-col my-10 ${sm ? 'gap-0' : 'gap-2'}`}>
				<Box className="flex justify-center items-center gap-1">
					<Text
						className={`font-medium flex ${sm ? 'text-xl' : 'text-4xl'}`}
						as="h1"
					>
						Hello! Welcome back!
					</Text>
					<Box
						className={`relative ${
							sm ? 'w-[25px] h-[20px]' : 'w-[42px] h-[35px]'
						}`}
					>
						<Image
							alt="emoji-hello"
							src="/emoji-hello.svg"
							fill
							className="object-contain"
						/>
					</Box>
				</Box>
				<p
					className={`text-center font-normal text-[var(--color-gray)] ${
						sm ? 'text-base' : 'text-lg'
					}`}
				>
					Hello again, You’ve been missed!
				</p>
			</Box>
			<LoginForm />
		</div>
	)
}
