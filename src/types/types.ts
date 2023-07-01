import { Socket } from 'socket.io-client'

type Prettify<T> = {
	[K in keyof T]: T[K]
}

export interface IMessage {
	id: string
	content: string
	author: {
		firstName: string
	}
	createdAt: string
}

export interface IConversation {
	id: string | undefined
	title: string | undefined
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
	id: string
	title: string
	cover: string
	isAdmin: boolean
	created_at: string
	updated_at: string
	type: 'group' | 'chat'
}

interface ISocketMessage {
	message: string
	room: string
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
	chat: (payload: {
		title: string
		imageSrc: string
		guestUserId: number
		type: 'chat' | 'group'
	}) => void
	allChats: () => void
	deleteChat: (payload: { chatId: string }) => void
	'subscribe-group': (payload: {
		userId: string
		nameGroup: string
		idGroup: string
	}) => void
	'delete-group': (payload: { groupId: string; title: string }) => void
}

export interface ISocketEventsFromServer {
	message: (payload: {
		room: string
		message: Prettify<IMessage>
		id: number
	}) => void
	onlineUsers: (payload: { onlineUsers: number[] }) => void
	chat: (payload: {
		title: string
		imageUrl: string
		id: number
		type: 'chat' | 'group'
		authorId: number
	}) => void
	allChats: (
		payload: {
			id: number
			title: string
			type: 'chat' | 'group'
			imageUrl: string
			createdAt: string
			updatedAt: string
			isAdmin?: boolean
		}[],
	) => void
}

export type ISocket = Socket<ISocketEventsFromServer, ISocketEventsToServer>

type Test = 'a' | 'b'
