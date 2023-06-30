import { Dispatch, SetStateAction } from 'react'
import { supabase } from '@/config/supabase'
import { IChat } from '@/types/types'

export class ChatService {
	static async getAllChats(
		userId: string | null,
		setChats: Dispatch<SetStateAction<IChat[]>>,
	) {
		const data = await supabase.from('members').select().eq('user_id', userId)

		if (data.data) {
			data.data.forEach(async (chat) => {
				const responseChat = await supabase
					.from('chats')
					.select()
					.eq('id', chat.chat_id)
					.single()

				if (responseChat) {
					console.log(responseChat.data)
					const newChat: IChat = {
						cover: responseChat.data.cover,
						created_at: responseChat.data.created_at,
						id: responseChat.data.id,
						title: responseChat.data.title,
						type: responseChat.data.type,
						isAdmin: responseChat.data.admin_id === userId,
					}
					setChats((prev) => [newChat, ...prev])
				}
			})
		}
	}

	static async addMember(userId: string | null, chatId: string) {
		if (userId) {
			await supabase
				.from('members')
				.insert({ user_id: userId, chat_id: chatId })
		}
	}
}
