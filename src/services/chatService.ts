import { Dispatch, SetStateAction } from 'react'
import { supabase } from '@/config/supabase'
import { IChat, IConversation, IMessage } from '@/types/types'

interface AddNewMessage {
	content: string
	chatId: string
	userId: string | null
	afterSubmit: () => void
}

export class ChatService {
	static async getAllChats(
		userId: string | null,
		setChats: Dispatch<SetStateAction<IChat[]>>,
		setConversations: Dispatch<SetStateAction<IConversation[]>>,
		onClose: () => void,
	) {
		const data = await supabase.from('members').select().eq('user_id', userId)

		const arrayChatsIds = data.data?.map((member) => member.chat_id) as string[]

		const allChatsSupabase = await supabase
			.from('chats')
			.select()
			.in('id', arrayChatsIds)
			.order('updated_at', { ascending: false })

		if (allChatsSupabase.data) {
			const allChats: IChat[] = allChatsSupabase.data.map((chatSupabase) => ({
				cover: chatSupabase.cover,
				created_at: chatSupabase.created_at,
				id: chatSupabase.id,
				title: chatSupabase.title,
				type: chatSupabase.type,
				updated_at: chatSupabase.updated_at,
				isAdmin: chatSupabase.admin_id === userId,
			}))

			setChats(allChats)

			const allChatsSupabasePromises = allChatsSupabase.data.map(
				async (chatSupabase) => {
					const messagesSupabase = await supabase
						.from('messages')
						.select()
						.eq('chat_id', chatSupabase.id)
						.limit(14)
						.order('created_at', { ascending: false })

					if (messagesSupabase.data) {
						const messagesPromise: Promise<IMessage>[] =
							messagesSupabase.data.map(async (messageSupabase) => {
								const author = await supabase
									.from('users')
									.select()
									.eq('id', messageSupabase.author_id)
									.single()

								return {
									id: messageSupabase.id,
									author: {
										firstName: author.data.firstName,
										id: author.data.id,
									},
									content: messageSupabase.content,
									createdAt: messageSupabase.created_at,
								}
							})

						const messages = await Promise.all(messagesPromise)
						setConversations((prev) => [
							...prev,
							{ id: chatSupabase.id, title: chatSupabase.title, messages },
						])
					}
				},
			)

			const finish = await Promise.all(allChatsSupabasePromises)

			if (finish) {
				onClose()
			}
		}
	}

	static async getMessages({ chatId }: { chatId: string }) {
		const messagesSupabase = await supabase
			.from('messages')
			.select()
			.eq('chat_id', chatId)
			.limit(14)
			.order('created_at', { ascending: false })

		if (messagesSupabase.data) {
			const messagesPromise: Promise<IMessage>[] = messagesSupabase.data.map(
				async (messageSupabase) => {
					const author = await supabase
						.from('users')
						.select()
						.eq('id', messageSupabase.author_id)
						.single()

					return {
						id: messageSupabase.id,
						author: { firstName: author.data.firstName, id: author.data.id },
						content: messageSupabase.content,
						createdAt: messageSupabase.created_at,
					}
				},
			)

			const messages = await Promise.all(messagesPromise)
			return messages
		}
		return []
	}

	// static async getAllMessages({
	// 	chats,
	// 	conversations,
	// 	setConversations,
	// }: {
	// 	chats: IChat[]
	// 	conversations: IConversation[]
	// 	setConversations: Dispatch<SetStateAction<IConversation[]>>
	// }) {
	// 	chats.forEach(async (chat) => {
	// 		const responseMessages = await supabase
	// 			.from('messages')
	// 			.select()
	// 			.eq('chat_id', chat.id)
	// 			.limit(14)
	// 			.order('created_at', { ascending: false })

	// 		if (responseMessages.data && responseMessages.data?.length > 0) {
	// 			const currentConversation = conversations.find(
	// 				(conversation) => conversation.id === chat.id,
	// 			)

	// 			const otherConversation = conversations.filter(
	// 				(conversation) => conversation.id !== chat.id,
	// 			)

	// 			const messages: Promise<IMessage>[] = responseMessages.data.map(
	// 				async (message) => {
	// 					const author = await supabase
	// 						.from('users')
	// 						.select()
	// 						.eq('id', message.author_id)
	// 						.single()

	// 					return {
	// 						id: message.id,
	// 						content: message.content,
	// 						createdAt: message.created_at,
	// 						author: {
	// 							firstName: author.data.firstName,
	// 						},
	// 					}
	// 				},
	// 			)

	// 			const resolvedMessages = await Promise.all(messages)

	// 			setConversations([
	// 				...otherConversation,
	// 				{
	// 					id: currentConversation?.id,
	// 					title: currentConversation?.title,
	// 					messages: resolvedMessages,
	// 				},
	// 			])
	// 		}
	// 	})
	// }

	static async addMember(userId: string | null, chatId: string) {
		const resFindMember = await supabase
			.from('members')
			.select()
			.eq('user_id', userId)
			.eq('chat_id', chatId)

		if (resFindMember.data?.length === 0) {
			const resInsertMember = await supabase
				.from('members')
				.insert({ user_id: userId, chat_id: chatId })
				.select()

			return resInsertMember
		}

		return null
	}

	static async addNewMessage({
		content,
		chatId,
		userId,
		afterSubmit,
	}: AddNewMessage) {
		if (userId) {
			const responseMessagesInsert = await supabase.from('messages').insert({
				content,
				chat_id: chatId,
				author_id: userId,
			})
			if (responseMessagesInsert.status === 201) {
				afterSubmit()
			}
		}
	}
}
