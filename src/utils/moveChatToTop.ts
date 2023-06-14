import { Dispatch, SetStateAction } from 'react'
import { IChat } from '@/types/types'

export const moveChatToTop = (
	selectedChat: IChat,
	setChats: Dispatch<SetStateAction<IChat[]>>,
) => {
	setChats((prev) => {
		const index = prev.findIndex((i) => i.id === selectedChat.id)
		const chat = prev.splice(index, 1)[0]
		return [chat, ...prev]
	})
}
