import { makeAutoObservable } from 'mobx'

export class UserStore {
	private isLogged: boolean
	private isLoaded: boolean
	private username: string | null
	private userId: string | null
	private timezone: string | null
	private onlineUsers: number[]
	private isLoading: boolean

	constructor() {
		this.isLogged = false
		this.isLoaded = false
		this.username = null
		this.userId = null
		this.timezone = null
		this.onlineUsers = []
		this.isLoading = true
		makeAutoObservable(this)
	}

	updateIsLogged(payload: boolean) {
		this.isLogged = payload
		return null
	}

	updateIsLoaded(payload: boolean) {
		this.isLoaded = payload
		return null
	}

	updateUsername(payload: string | null) {
		this.username = payload
		return null
	}

	updateTimezone(payload: string) {
		this.timezone = payload
		return null
	}

	updateOnlineUsers(payload: number[]) {
		this.onlineUsers = payload
		return null
	}

	updateIsLoading(payload: boolean) {
		this.isLoading = payload
		return null
	}

	updateUserId(payload: string) {
		this.userId = payload
		return null
	}

	getIsLogged() {
		return this.isLogged
	}

	getIsLoaded() {
		return this.isLoaded
	}

	getUsername() {
		return this.username
	}

	getTimezone() {
		return this.timezone
	}

	getOnlineUsers() {
		return this.onlineUsers
	}

	getIsLoading() {
		return this.isLoading
	}

	getUserId() {
		return this.userId
	}
}
