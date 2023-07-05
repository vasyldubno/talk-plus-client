/* eslint-disable @typescript-eslint/no-empty-function */

/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
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
		axios
			.get('https://ipapi.co/json/')
			.then((res) => store.updateTimezone(res.data.timezone))
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

				const channel = supabase.channel('online-users')

				channel
					.on('presence', { event: 'sync' }, () => {
						const presenseUsers = channel.presenceState() as {
							[key: string]: { user_id: string }[]
						}
						const onlineUsers = Object.values(presenseUsers).flatMap((arr) =>
							arr.map((obj) => obj.user_id),
						)
						store.updateOnlineUsers(onlineUsers)
					})
					.on('presence', { event: 'join' }, (payload) => {})
					.on('presence', { event: 'leave' }, (payload) => {})
					.subscribe((status) => {
						if (status === 'SUBSCRIBED') {
							channel.track({ user_id: store.getUserId() })
						}
						if (status === 'CLOSED') {
							channel.untrack()
						}
					})
			}
		})
	}, [])

	console.log('STORE', store)

	return <UserContext.Provider value={store}>{children}</UserContext.Provider>
})
