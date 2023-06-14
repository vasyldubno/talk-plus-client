import { makeAutoObservable } from 'mobx'

export class UserStore {
	private accessToken: string
	private isLogged: boolean
	private isLoaded: boolean
	private userId: string
	private timezone: string
	private onlineUsers: number[]

	constructor() {
		this.accessToken = ''
		this.isLogged = false
		this.isLoaded = false
		this.userId = ''
		this.timezone = ''
		this.onlineUsers = []
		makeAutoObservable(this)
	}

	updateAccessToken(accessToken: string) {
		this.accessToken = accessToken
		return null
	}

	updateIsLogged(payload: boolean) {
		this.isLogged = payload
		return null
	}

	updateIsLoaded(payload: boolean) {
		this.isLoaded = payload
		return null
	}

	updateUserId(payload: string) {
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

	getAccessToken() {
		return this.accessToken
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
}
