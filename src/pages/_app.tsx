import '../styles/globals.css'
import reportAccessibility from '../utils/reportAccessibility'
import { ChakraProvider } from '@chakra-ui/react'
import { Poppins } from '@next/font/google'
import React, { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { ReactQueryConfig } from '@/config/reactQueryConfig'
import { useStore } from '@/hooks/useStore'
import { UserProvider } from '@/providers/UserProvider/UserProvider'

const font = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
	const userStore = useStore()
	const [queryClient] = useState(() => new QueryClient(ReactQueryConfig))

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<UserProvider store={userStore}>
					<main className={font.className}>
						<ChakraProvider>
							<Component {...pageProps} />
							<ToastContainer />
						</ChakraProvider>
					</main>
				</UserProvider>
			</Hydrate>
		</QueryClientProvider>
	)
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
	if (metric.label === 'web-vital') {
		console.log(metric)
	}
}

reportAccessibility(React)
