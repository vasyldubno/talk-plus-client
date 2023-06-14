import { Socket } from 'socket.io-client'

type Prettify<T> = {
	[K in keyof T]: T[K]
}

export interface IMessage {
	id: string
	message: string
	author: {
		avatar: string
		id: number
		firstName: string
	}
	createdAt: string
	updatedAt: string
}

export interface IConversation {
	id: number
	room: string
	messages: IMessage[]
}

export interface IUser {
	id: number
	email: string
	password: string
	username: string
	profile: {
		id: number
		avatar: string
		firstName: string
	}
}

export interface IChat {
	id: number
	title: string
	imageUrl: string
	updatedAt?: string
	isAdmin?: boolean
	type?: 'group' | 'chat'
}

interface ISocketMessage {
	message: string
	room: string | undefined
	roomId: number
	userId: string
	type: 'group' | 'chat' | undefined
}

interface ISocketJoin {
	room: string
	type: 'group' | 'chat' | undefined
}

export interface ISocketEventsToServer {
	message: (payload: ISocketMessage) => void
	join: (payload: ISocketJoin) => void
}

export interface ISocketEventsFromServer {
	message: (payload: {
		room: string
		message: Prettify<IMessage>
		id: number
	}) => void
	onlineUsers: (payload: { onlineUsers: number[] }) => void
}

export type ISocket = Socket<ISocketEventsFromServer, ISocketEventsToServer>

type Test = 'a' | 'b'
