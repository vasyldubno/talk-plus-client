import { Dispatch, SetStateAction } from 'react'
import { IConversation, IMessage, ISocket } from '@/types/types'

export const socketMessage = (
	socket: ISocket,
	setConversations: Dispatch<SetStateAction<IConversation[]>>,
) => {
	return socket.on('message', (payload) => {
		setConversations((prev) => {
			const currentRoom = prev.find((room) => room.id === payload.id)
			const otherRooms = prev.filter((room) => room.id !== payload.id)
			const newMessage: IMessage = {
				id: payload.message.id,
				message: payload.message.message,
				author: {
					avatar: payload.message.author.avatar,
					id: payload.message.author.id,
					firstName: payload.message.author.firstName,
				},
				createdAt: payload.message.createdAt,
				updatedAt: payload.message.updatedAt,
			}
			if (currentRoom) {
				currentRoom.messages.unshift(newMessage)
				return [...otherRooms, currentRoom]
			}
			return [
				...otherRooms,
				{
					id: payload.id,
					room: payload.room,
					messages: [newMessage],
				},
			]
		})
	})
}
