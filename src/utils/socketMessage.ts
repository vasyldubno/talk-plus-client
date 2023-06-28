import { moveChatToTop } from './moveChatToTop'
import { scrollToBottom } from './scrollToBottom'
import { Dispatch, RefObject, SetStateAction } from 'react'
import { IChat, IConversation, IMessage, ISocket } from '@/types/types'

export const socketMessage = (
	socket: ISocket,
	setConversations: Dispatch<SetStateAction<IConversation[]>>,
	chatFeedRef: RefObject<HTMLDivElement>,
	selectedChat: IChat | null,
	setChats: Dispatch<SetStateAction<IChat[]>>,
) => {
	return socket.on('message', (payload) => {
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

		setConversations((prev) => {
			const isExistRoom = prev.find((room) => room.room === payload.room)
			const isExistMessage = isExistRoom?.messages.some(
				(message) => Number(message.id) === Number(newMessage.id),
			)

			if (isExistRoom && !isExistMessage) {
				isExistRoom.messages.unshift(newMessage)

				return prev
			}

			if (isExistRoom && isExistMessage) {
				return prev
			}

			return [
				...prev,
				{ id: payload.id, room: payload.room, messages: [newMessage] },
			]
		})

		// console.log(selectedChat)

		scrollToBottom(chatFeedRef)
		// moveChatToTop(selectedChat, setChats)
	})
}
