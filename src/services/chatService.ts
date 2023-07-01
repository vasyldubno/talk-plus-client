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

		const allMessagesSupabase = await supabase
			.from('messages')
			.select()
			.in('chat_id', arrayChatsIds)

		console.log(allMessagesSupabase)

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

			if (allMessagesSupabase.data) {
				const allConversationsPromises: Promise<IConversation>[] =
					allChatsSupabase.data.map(async (chatSupabase) => {
						const allMessagesFiltered = allMessagesSupabase.data.filter(
							(message) => message.chat_id === chatSupabase.id,
						)

						const messagesPromises: Promise<IMessage>[] =
							allMessagesFiltered.map(async (messageFiltered) => {
								const author = await supabase
									.from('users')
									.select()
									.eq('id', messageFiltered.author_id)
									.single()

								return {
									id: messageFiltered.id,
									content: messageFiltered.content,
									createdAt: messageFiltered.created_at,
									author: { firstName: author.data.firstName },
								}
							})

						const messages = await Promise.all(messagesPromises)

						return {
							id: chatSupabase.id,
							title: chatSupabase.title,
							messages,
						}
					})

				const allConversations = await Promise.all(allConversationsPromises)

				setConversations(allConversations)
			}

			onClose()
		}

		// if (data.data) {
		// 	const allPromises = data.data.map(async (chat) => {
		// 		const responseChat = await supabase
		// 			.from('chats')
		// 			.select()
		// 			.eq('id', chat.chat_id)
		// 			.single()

		// 		if (responseChat) {
		// 			const newChat: IChat = {
		// 				cover: responseChat.data.cover,
		// 				created_at: responseChat.data.created_at,
		// 				updated_at: responseChat.data.updated_at,
		// 				id: responseChat.data.id,
		// 				title: responseChat.data.title,
		// 				type: responseChat.data.type,
		// 				isAdmin: responseChat.data.admin_id === userId,
		// 			}
		// 			setChats((prev) => [newChat, ...prev])

		// 			const newConversation: IConversation = {
		// 				id: responseChat.data.id,
		// 				title: responseChat.data.title,
		// 				messages: [],
		// 			}
		// 			setConversations((prev) => [newConversation, ...prev])
		// 		}
		// 	})

		// 	Promise.all(allPromises).then(() => onClose())
		// }
	}

	static async getAllMessages({
		chats,
		conversations,
		setConversations,
	}: {
		chats: IChat[]
		conversations: IConversation[]
		setConversations: Dispatch<SetStateAction<IConversation[]>>
	}) {
		chats.forEach(async (chat) => {
			const responseMessages = await supabase
				.from('messages')
				.select()
				.eq('chat_id', chat.id)
				.limit(14)
				.order('created_at', { ascending: false })

			if (responseMessages.data && responseMessages.data?.length > 0) {
				const currentConversation = conversations.find(
					(conversation) => conversation.id === chat.id,
				)

				const otherConversation = conversations.filter(
					(conversation) => conversation.id !== chat.id,
				)

				const messages: Promise<IMessage>[] = responseMessages.data.map(
					async (message) => {
						const author = await supabase
							.from('users')
							.select()
							.eq('id', message.author_id)
							.single()

						return {
							id: message.id,
							content: message.content,
							createdAt: message.created_at,
							author: {
								firstName: author.data.firstName,
							},
						}
					},
				)

				const resolvedMessages = await Promise.all(messages)

				setConversations([
					...otherConversation,
					{
						id: currentConversation?.id,
						title: currentConversation?.title,
						messages: resolvedMessages,
					},
				])
			}
		})
	}

	static async addMember(userId: string | null, chatId: string) {
		const res = await supabase
			.from('members')
			.select()
			.eq('user_id', userId)
			.eq('chat_id', chatId)
		if (res.data?.length === 0) {
			await supabase
				.from('members')
				.insert({ user_id: userId, chat_id: chatId })
				.select()
		}
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
