import { signOut } from 'next-auth/react'
import { $axios, authTokenStore } from '@/config/axiosConfig'

interface LoginDto {
	email: string
	password: string
}

interface LoginResponse {
	id: number
	accessToken: string
}

interface RegisterDto {
	email: string
	password: string
	username: string
	firstName: string
}

export class AuthService {
	static async register(dto: RegisterDto) {
		const response = await $axios.post<LoginResponse>('/auth/register', dto)
		authTokenStore.authToken = response.data.accessToken
		return response.data
	}

	static async login(dto: LoginDto) {
		const response = await $axios.post<LoginResponse>('/auth/login', dto)
		authTokenStore.authToken = response.data.accessToken
		return response.data
	}

	static async logout() {
		authTokenStore.authToken = null
		return signOut({ redirect: false })
	}
}
