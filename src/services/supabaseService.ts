import { ChatService } from './chatService'
import { Dispatch, SetStateAction } from 'react'
import { supabase } from '@/config/supabase'
import { UserStore } from '@/store/userStore'
import { IChat, IConversation, IMessage } from '@/types/types'

interface IChatsDelete {
	setChats: Dispatch<SetStateAction<IChat[]>>
	setConversations: Dispatch<SetStateAction<IConversation[]>>
}

interface IChatInsert {
	store: UserStore
	setChats: Dispatch<SetStateAction<IChat[]>>
	setConversations: Dispatch<SetStateAction<IConversation[]>>
}

interface IMembersUpdate {
	store: UserStore
	setChats: Dispatch<SetStateAction<IChat[]>>
	setConversations: Dispatch<SetStateAction<IConversation[]>>
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
}

export class SupabaseService {
	static async membersInsert({
		store,
		setChats,
		setConversations,
	}: {
		store: UserStore
		setChats: Dispatch<SetStateAction<IChat[]>>
		setConversations: Dispatch<SetStateAction<IConversation[]>>
	}) {
		return supabase
			.channel('members-insert')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'members',
				},
				async (payload) => {
					if (payload.new.user_id === store.getUserId()) {
						const chat = await supabase
							.from('chats')
							.select()
							.eq('id', payload.new.chat_id)
							.single()

						setChats((prev) => {
							const isExistChat = prev.find(
								(existChat) => existChat.id === chat.data.id,
							)

							if (!isExistChat) {
								return [
									{
										id: chat.data.id,
										cover: chat.data.cover,
										created_at: chat.data.created_at,
										title: chat.data.title,
										updated_at: chat.data.updated_at,
										type: chat.data.type,
										isAdmin: chat.data.admin_id === store.getUserId(),
									},
									...prev,
								]
							}

							return prev
						})

						const messages = await ChatService.getMessages({
							chatId: chat.data.id,
						})

						setConversations((prev) => {
							const isExistConversation = prev.find(
								(existConversation) => existConversation.id === chat.data.id,
							)
							if (!isExistConversation) {
								return [
									...prev,
									{
										id: chat.data.id,
										title: chat.data.title,
										messages,
									},
								]
							}
							return prev
						})
					}
				},
			)
			.subscribe()
	}

	static async membersUpdate({
		store,
		setChats,
		setConversations,
		setSelectedChat,
	}: IMembersUpdate) {
		return supabase
			.channel('members-update')
			.on(
				'postgres_changes',
				{
					event: 'DELETE',
					schema: 'public',
					table: 'members',
				},
				async () => {
					const supabaseMembers = await supabase
						.from('members')
						.select()
						.eq('user_id', store.getUserId())

					if (supabaseMembers.data) {
						if (supabaseMembers.data.length > 0) {
							const chatIds = supabaseMembers.data.map(
								(supabaseMember) => supabaseMember.chat_id,
							)
							const chats = await supabase
								.from('chats')
								.select()
								.in('id', chatIds)
							if (chats.data && chats.data.length > 0) {
								setChats([])
								setConversations([])
								chats.data.forEach(async (chat) => {
									const updatedChat: IChat = {
										cover: chat.cover,
										created_at: chat.created_at,
										id: chat.id,
										title: chat.title,
										type: chat.type,
										updated_at: chat.updated_at,
										isAdmin: chat.admin_id === store.getUserId(),
									}
									setChats((prev) => [updatedChat, ...prev])
									const messages = await ChatService.getMessages({
										chatId: chat.id,
									})
									setConversations((prev) => [
										{ id: chat.id, title: chat.title, messages },
										...prev,
									])
								})
							}
						} else {
							setChats([])
							setConversations([])
						}
						setSelectedChat(null)
					}
				},
			)
			.subscribe()
	}

	static async chatsUpdate({
		setChats,
		store,
	}: {
		store: UserStore
		setChats: Dispatch<SetStateAction<IChat[]>>
	}) {
		return supabase
			.channel('chats-update')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'chats',
				},
				async (payload) => {
					const allMembersSupabase = await supabase
						.from('members')
						.select()
						.eq('user_id', store.getUserId())

					const arrayChatsIds = allMembersSupabase.data?.map(
						(member) => member.chat_id,
					) as string[]

					const allChatsSupabase = await supabase
						.from('chats')
						.select()
						.in('id', arrayChatsIds)
						.order('updated_at', { ascending: false })

					if (allChatsSupabase.data) {
						const allChats: IChat[] = allChatsSupabase.data.map(
							(chatSupabase) => ({
								cover: chatSupabase.cover,
								created_at: chatSupabase.created_at,
								id: chatSupabase.id,
								title: chatSupabase.title,
								type: chatSupabase.type,
								updated_at: chatSupabase.updated_at,
								isAdmin: chatSupabase.admin_id === store.getUserId(),
							}),
						)
						setChats(allChats)
					}
				},
			)
			.subscribe()
	}

	static async messagesInsert({
		setConversations,
	}: {
		setConversations: Dispatch<SetStateAction<IConversation[]>>
	}) {
		return supabase
			.channel('messages-insert')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
				},
				async (payload) => {
					const author = await supabase
						.from('users')
						.select()
						.eq('id', payload.new.author_id)
						.single()

					const newMessage: IMessage = {
						id: payload.new.id,
						content: payload.new.content,
						createdAt: payload.new.created_at,
						author: {
							firstName: author.data.firstName,
							id: author.data.id,
							avatar: author.data.avatar,
						},
					}

					setConversations((prev) => {
						const currentConversation = prev.find(
							(conversation) => conversation.id === payload.new.chat_id,
						)

						const otherConversations = prev.filter(
							(conversation) => conversation.id !== payload.new.chat_id,
						)

						if (currentConversation) {
							return [
								...otherConversations,
								{
									id: currentConversation?.id,
									title: currentConversation?.title,
									messages: [newMessage, ...currentConversation.messages],
								},
							]
						}
						return prev
					})
				},
			)
			.subscribe()
	}

	static async chatsDelete({ setChats, setConversations }: IChatsDelete) {
		return supabase
			.channel('chats-delete')
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', table: 'chats' },
				(payload) => {
					setChats((prev) => {
						const updatedChats: IChat[] = prev.filter(
							(chat) => chat.id !== payload.old.id,
						)
						return updatedChats
					})

					setConversations((prev) => {
						const updatedConversations = prev.filter(
							(conversation) => conversation.id !== payload.old.id,
						)
						return [...updatedConversations]
					})
				},
			)
			.subscribe()
	}

	static chatsInsert = async ({
		setChats,
		setConversations,
		store,
	}: IChatInsert) => {
		return supabase
			.channel('chats-insert')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'chats',
				},
				(payload) => {
					if (store.getUserId() === payload.new.admin_id) {
						setChats((prev) => {
							const updatedChats: IChat[] = [
								{
									id: payload.new.id,
									cover: payload.new.cover,
									created_at: payload.new.created_at,
									title: payload.new.title,
									type: payload.new.type,
									isAdmin: true,
									updated_at: payload.new.updated_at,
								},
								...prev,
							]
							return updatedChats
						})

						setConversations((prev) => {
							return [
								...prev,
								{ id: payload.new.id, title: payload.new.title, messages: [] },
							]
						})
					}
				},
			)
			.subscribe()
	}
}
