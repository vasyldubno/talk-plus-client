import axios from 'axios'
import { observer } from 'mobx-react-lite'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import { FC, ReactNode, useCallback, useEffect } from 'react'
import { $axios, authTokenStore } from '@/config/axiosConfig'
import { UserContext } from '@/context/userContext'
import { UserStore } from '@/store/userStore'

export const UserProvider: FC<{
	store: UserStore
	children: ReactNode
}> = observer(({ children, store }) => {
	const session = useSession()

	const refresh = useCallback(async () => {
		const res = await $axios.get('/auth/refresh')

		if (res && session.data) {
			authTokenStore.authToken = res.data.accessToken
			session.data.user.name = res.data.accessToken
		}
	}, [session.data])

	const update = useCallback(async () => {
		if (session.status === 'authenticated') {
			const {
				data: { timezone },
			} = await axios.get('https://ipapi.co/json/')

			store.updateTimezone(timezone)
			store.updateIsLogged(true)
			store.updateIsLoaded(true)
			authTokenStore.authToken = session.data.user.name

			if (session.data.user.id) {
				store.updateUserId(session.data.user.id)
			}

			refresh()
		}

		if (session.status === 'unauthenticated') {
			store.updateIsLogged(false)
			store.updateIsLoaded(true)
		}
	}, [refresh, session.status, store, session.data])

	useEffect(() => {
		// if (session.status === 'authenticated') {
		// 	store.updateIsLogged(true)
		// 	store.updateIsLoaded(true)
		// 	authTokenStore.authToken = session.data.user.name

		// 	if (session.data.user.id) {
		// 		store.updateUserId(session.data.user.id)
		// 	}

		// 	// $axios.get('/auth/refresh').then((res) => {
		// 	// 	authTokenStore.authToken = res.data.accessToken
		// 	// 	session.data.user.name = res.data.accessToken
		// 	// })
		// 	refresh()
		// }

		// if (session.status === 'unauthenticated') {
		// 	store.updateIsLogged(false)
		// 	store.updateIsLoaded(true)
		// }
		update()
	}, [update])

	// console.log('Store', store)
	// console.log('Session', session)

	return <UserContext.Provider value={store}>{children}</UserContext.Provider>
})
