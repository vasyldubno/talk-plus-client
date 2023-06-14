import { $axios } from '@/config/axiosConfig'
import { IChat, IMessage } from '@/types/types'

interface IChatResponse {
	id: number
	title: string
	imageUrl: string
	createdAt: string
	updatedAt: string
	isAdmin?: boolean
	type: 'group' | 'chat'
}

interface IGetMessagesPayload {
	page: number
	chatId: number | undefined
	type: 'chat' | 'group' | undefined
}

export class ChatService {
	static async addGroup(title: string, imageBase64: string, userId: string) {
		return $axios.post('/chat/add-group', {
			title,
			imageBase64,
			userId,
		})
	}

	static async leaveGroup(idGroup: number) {
		return $axios.post('/chat/unsubscribe-group', { idGroup })
	}

	static async deleteGroup(chat: IChat) {
		return $axios.post('/chat/delete-group', {
			groupId: chat.id.toString(),
			title: chat.title,
		})
	}

	static addPersonalChat(title: string, imageSrc: string, guestUserId: number) {
		return $axios.post<{
			chat: { id: number; title: string; imageUrl: string }
		}>('/chat/add-personal-chat', {
			title,
			imageSrc,
			guestUserId,
		})
	}

	static deleteChat(chatId: number) {
		return $axios.post('/chat/delete-chat', { chatId: chatId.toString() })
	}

	static getAllChats() {
		return $axios.post<{ chats: IChatResponse[] }>('/chat/get-all-chats')
	}

	static async getMessages(dto: IGetMessagesPayload) {
		const response = await $axios.post<{ messages: IMessage[] }>(
			`/chat/get-messages?page=${dto.page}`,
			{
				chatId: dto.chatId,
				type: dto.type,
			},
		)

		return response.data.messages
	}
}
