/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useEffect } from 'react'
import { supabase } from '@/config/supabase'
import { UserContext } from '@/context/userContext'
import { UserStore } from '@/store/userStore'

export const UserProvider: FC<{
	store: UserStore
	children: ReactNode
}> = observer(({ children, store }) => {
	useEffect(() => {
		supabase.auth.getUser().then((res) => {
			if (res.error) {
				store.updateIsLoaded(true)
				store.updateIsLogged(false)
				store.updateIsLoading(false)
			}

			if (res.data.user) {
				store.updateIsLoaded(true)
				store.updateIsLogged(true)
				store.updateUsername(res.data.user.user_metadata.username)
				store.updateUserId(res.data.user.id)
				store.updateIsLoading(false)
			}
		})
	}, [])

	console.log('STORE', store)

	return <UserContext.Provider value={store}>{children}</UserContext.Provider>
})
