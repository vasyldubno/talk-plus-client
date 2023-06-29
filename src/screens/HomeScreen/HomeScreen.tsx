import { Box, Button, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'

const welcomeImages = ['/welcome-1.jpg', '/welcome-2.jpg', '/welcome-3.jpg']

export const HomeScreen: FC = observer(() => {
	const router = useRouter()

	const xs = useMatchMedia('(max-width: 320px)')
	const sm = useMatchMedia('(max-width: 767px)')

	const store = useStore()
	const isLoaded = store.getIsLoaded()
	const isLogged = store.getIsLogged()
	const isLoading = store.getIsLoading()

	useEffect(() => {
		if (isLoaded && isLogged && !isLoading) {
			router.push('/chat')
		}
	}, [isLoaded, isLogged, router, isLoading])

	return (
		<>
			{isLoaded && !isLogged && !isLoading && (
				<Box className="min-h-screen bg-[var(--color-middle-green)] py-3">
					<Box
						className={clsx(
							'mx-auto flex flex-col justify-center max-w-[500px]',
							sm && 'p-3',
						)}
					>
						<Box className={clsx('pt-5 pb-16', sm ? 'px-2' : 'px-16')}>
							{welcomeImages.map((imageSrc, index) => {
								if (xs && index >= 2) {
									return null
								}

								if (index % 2 === 0) {
									return (
										<Image
											key={index}
											alt="welcome"
											src={imageSrc}
											width="150"
											height="120"
											className={clsx(
												'object-cover rounded-2xl rotate-12',
												xs && 'mb-6',
											)}
										/>
									)
								}
								return (
									<Image
										key={index}
										alt="welcome"
										src={imageSrc}
										width="150"
										height="120"
										className="object-cover ml-auto rounded-2xl -rotate-12"
									/>
								)
							})}
						</Box>
						<Button
							className="font-normal hover:scale-105 mb-10"
							style={{ transition: 'all 0.5s' }}
							onClick={() => router.push('/login')}
						>
							Get Started
						</Button>
						<Text
							className={clsx(
								'text-white font-bold text-center mb-8',
								xs ? 'text-3xl' : 'text-5xl',
							)}
						>
							Let’s Get Started
						</Text>
						<Text
							className={clsx(
								'text-white pr-5 text-center mb-8',
								xs ? 'text-base' : 'text-lg',
							)}
						>
							Connect with each other while chatting or calling. Enjoy safe and
							private texting
						</Text>
					</Box>
				</Box>
			)}
		</>
	)
})
