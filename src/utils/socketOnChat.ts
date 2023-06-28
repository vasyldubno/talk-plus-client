import { Dispatch, SetStateAction } from 'react'
import { UserStore } from '@/store/userStore'
import { IChat, IConversation, IMessage, ISocket } from '@/types/types'

export const socketOnChat = (
	socket: ISocket,
	setChats: Dispatch<SetStateAction<IChat[]>>,
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>,
	userId: string | null,
	store: UserStore,
) => {
	return socket.on('chat', (payload) => {
		setChats((prev) => [
			{
				id: payload.id,
				imageUrl: payload.imageUrl,
				title: payload.title,
				type: payload.type,
			},
			...prev,
		])

		store.updateIsLoading(false)

		if (userId === payload.authorId.toString()) {
			setSelectedChat({
				id: payload.id,
				imageUrl: payload.imageUrl,
				title: payload.title,
				type: payload.type,
			})
		}
	})
}
