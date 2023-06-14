/* eslint-disable no-param-reassign */
import axios from 'axios'
import { observable } from 'mobx'

export const authTokenStore = observable<{ authToken: null | string }>({
	authToken: null,
})

export const $axios = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	withCredentials: true,
})

$axios.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${authTokenStore.authToken}`
	return config
})
