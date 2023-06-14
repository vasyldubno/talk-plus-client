import { $axios } from '@/config/axiosConfig'
import { IUser } from '@/types/types'

export class UserService {
	static async getUser() {
		const user = await $axios.post<{ avatar: string; userName: string }>(
			'/users/get-user',
		)
		return user
	}

	static async searchUser(username: string) {
		const user = await $axios.post<IUser[]>('/users/search-user', { username })
		return user.data
	}

	static async retrieveSubscribers(idGroup: string) {
		const subscribers = await $axios.post<{ subscribers: IUser[] }>(
			'/users/retrieve-subscribers',
			{
				idGroup,
			},
		)
		return subscribers.data.subscribers
	}
}
