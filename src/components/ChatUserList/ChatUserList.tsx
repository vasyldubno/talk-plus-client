import { UserChatItem } from '../UserChatItem/UserChatItem'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { EMPTY_USER_IMG } from '@/config/consts'
import { supabase } from '@/config/supabase'
import { useStore } from '@/hooks/useStore'
import { ChatService } from '@/services/chatService'
import { IChat, ISupabaseChat, IUser } from '@/types/types'

interface ChatUserListProps {
	selectedChat: IChat | null
	searchValue: string
	setSearchValue: Dispatch<SetStateAction<string>>
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
}

export const ChatUserList: FC<ChatUserListProps> = ({
	selectedChat,
	searchValue,
	setSearchValue,
	setSelectedChat,
}) => {
	const store = useStore()
	const username = store.getUsername()

	const [users, setUsers] = useState<IUser[]>([])
	const [existedUsers, setExistedUsers] = useState<string[]>([])

	const handleUserFromSearch = async (user: IUser) => {
		const existChat = await supabase
			.from('chats')
			.select()
			.eq('title', user.profile.firstName)
			.eq('admin_id', store.getUserId())
			.single()

		if (existChat.data) {
			setSearchValue('')
			setSelectedChat({
				cover: existChat.data.cover,
				created_at: existChat.data.created_at,
				id: existChat.data.id,
				title: existChat.data.title,
				type: existChat.data.type,
				updated_at: existChat.data.updated_at,
				isAdmin: existChat.data.admin_id === store.getUserId(),
			})
		}

		if (existChat.error) {
			const res = await supabase
				.from('chats')
				.insert<ISupabaseChat>({
					title: user.profile.firstName,
					type: 'chat',
					cover: user.profile.avatar ?? EMPTY_USER_IMG,
					admin_id: store.getUserId(),
				})
				.select()
				.single()
			if (res.status === 201) {
				ChatService.addMember(user.id, res.data.id)
				ChatService.addMember(store.getUserId(), res.data.id)
				setSearchValue('')
				setSelectedChat({
					cover: res.data.cover,
					created_at: res.data.created_at,
					id: res.data.id,
					title: res.data.title,
					type: res.data.type,
					updated_at: res.data.updated_at,
					isAdmin: res.data.admin_id === store.getUserId(),
				})
			}
		}
	}

	useEffect(() => {
		if (searchValue.length <= 2) {
			setUsers([])
		} else {
			supabase
				.from('users')
				.select()
				.ilike('username', `%${searchValue}%`)
				.then((res) => {
					setUsers(() => {
						if (res.data) {
							const filteredUsers = res.data.filter(
								(item) => !existedUsers.includes(item.username),
							)

							const updatedUsers: IUser[] = filteredUsers.map(
								(filteredUser) => ({
									id: filteredUser.id,
									username: filteredUser.username,
									profile: {
										firstName: filteredUser.firstName,
										avatar: filteredUser.avatar,
									},
								}),
							)
							return updatedUsers
						}
						return []
					})
				})
		}
	}, [searchValue])

	useEffect(() => {
		if (username) {
			setExistedUsers([username])
		}
	}, [username])

	return (
		<>
			{users &&
				users.map((user) => (
					<UserChatItem
						key={user.id}
						selectedChat={selectedChat}
						user={user}
						onClick={() => {
							handleUserFromSearch(user)
						}}
					/>
				))}
		</>
	)
}
