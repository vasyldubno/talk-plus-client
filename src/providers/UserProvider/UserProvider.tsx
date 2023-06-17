import axios from 'axios'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useEffect } from 'react'
import { $axios, authTokenStore } from '@/config/axiosConfig'
import { UserContext } from '@/context/userContext'
import { UserStore } from '@/store/userStore'

export const UserProvider: FC<{
	store: UserStore
	children: ReactNode
}> = observer(({ children, store }) => {
	useEffect(() => {
		const fetch = async () => {
			try {
				const {
					data: { accessToken, id },
				} = await $axios.get<{ accessToken: string; id: number }>(
					'/auth/refresh',
				)
				if (accessToken) {
					store.updateUserId(id.toString())
					store.updateAccessToken(accessToken)
					authTokenStore.authToken = accessToken
					store.updateIsLogged(true)
					store.updateIsLoaded(true)
				}

				const { data } = await axios.get<{ timezone: string }>(
					'https://ipapi.co/json/',
				)
				store.updateTimezone(data.timezone)
			} catch (error) {
				store.updateIsLogged(false)
				store.updateIsLoaded(true)
			}
		}
		fetch()
	}, [store])
	console.log(store)

	return <UserContext.Provider value={store}>{children}</UserContext.Provider>
})
