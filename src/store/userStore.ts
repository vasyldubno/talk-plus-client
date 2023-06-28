import { makeAutoObservable } from 'mobx'

export class UserStore {
	private isLogged: boolean
	private isLoaded: boolean
	private userId: string | null
	private timezone: string | null
	private onlineUsers: number[]
	private isLoading: boolean

	constructor() {
		this.isLogged = false
		this.isLoaded = false
		this.userId = null
		this.timezone = null
		this.onlineUsers = []
		this.isLoading = false
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

	updateUserId(payload: string | null) {
		this.userId = payload
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

	getIsLogged() {
		return this.isLogged
	}

	getIsLoaded() {
		return this.isLoaded
	}

	getUserId() {
		return this.userId
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
}
