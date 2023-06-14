import { QueryClientConfig } from 'react-query'

export const ReactQueryConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
}
