import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import { MESSAGE_PER_PAGE } from '@/config/consts'
import { supabase } from '@/config/supabase'
import { toastConfig } from '@/config/toastConfig'
import { UserStore } from '@/store/userStore'
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
						.limit(MESSAGE_PER_PAGE)
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
										avatar: author.data.avatar,
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
			.limit(MESSAGE_PER_PAGE)
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
						author: {
							firstName: author.data.firstName,
							id: author.data.id,
							avatar: author.data.avatar,
						},
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

	static async getAuthor({ authorId }: { authorId: string }) {
		const author = await supabase
			.from('users')
			.select()
			.eq('id', authorId)
			.single()
		return author.data
	}

	static async getMessagesByPage({
		page,
		chatId,
	}: {
		page: number
		chatId: string
	}) {
		const from = (page - 1) * MESSAGE_PER_PAGE
		const to = from + MESSAGE_PER_PAGE - 1

		const amountOldMessages = page * MESSAGE_PER_PAGE

		const messagesSupabase = await supabase
			.from('messages')
			.select('*', { count: 'exact' })
			.eq('chat_id', chatId)
			.range(from, to)
			.order('created_at', { ascending: false })

		if (messagesSupabase.count) {
			return {
				messages: messagesSupabase.data,
				isNextPage: messagesSupabase.count > amountOldMessages,
			}
		}

		return {
			messages: [],
			isNextPage: false,
		}
	}

	static async deleteChat(chat: IChat) {
		await supabase.from('chats').delete().eq('id', chat.id)
	}

	static async uploadImageToCloudinary(image: File, store: UserStore) {
		const formData = new FormData()
		formData.append('file', image)
		formData.append(
			'api_key',
			process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
		)
		formData.append('upload_preset', 'test_test')

		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
			formData,
		)

		return response
	}
}
