import { Box } from '@chakra-ui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import io from 'socket.io-client'
import { useRouter } from 'next/router'
import { AddGroup } from '@/components/AddGroup/AddGroup'
import { ChatFeed } from '@/components/ChatFeed/ChatFeed'
import { ChatForm } from '@/components/ChatForm/ChatForm'
import { ChatHeader } from '@/components/ChatHeader/ChatHeader'
import { ChatItem } from '@/components/ChatItem/ChatItem'
import { ChatMenu } from '@/components/ChatMenu/ChatMenu'
import { ChatSearchInput } from '@/components/ChatSearchInput/ChatSearchInput'
import { ProfileSettings } from '@/components/ProfileSettings/ProfileSettings'
import { UserChatItem } from '@/components/UserChatItem/UserChatItem'
import { authTokenStore } from '@/config/axiosConfig'
import { useDebounce } from '@/hooks/useDebounce'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { ChatService } from '@/services/chatService'
import { UserService } from '@/services/userService'
import { IChat, IConversation, ISocket } from '@/types/types'
import { Loader } from '@/ui/Loader/Loader'
import { getCurrentConversation } from '@/utils/getCurrentConversation'
import { moveChatToTop } from '@/utils/moveChatToTop'
import { scrollToBottom } from '@/utils/scrollToBottom'
import { socketMessage } from '@/utils/socketMessage'

export const ChatScreen: FC = observer(() => {
	const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
	const [socket, setSocket] = useState<ISocket | null>(null)
	const [socketError, setSocketError] = useState('')
	const [conversations, setConversations] = useState<IConversation[]>([])
	const [isAddGroup, setIsAddGroup] = useState(false)
	const [isProfileSettings, setIsProfileSettings] = useState(false)
	const [chats, setChats] = useState<IChat[]>([])
	const [chatsLoaded, setChatsLoaded] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [users, setUsers] = useState<IChat[]>([])
	const [isOpenLeftSide, setIsOpenLeftSide] = useState(true)
	const [isOpenRightSide, setIsOpenRightSide] = useState(true)

	const md = useMatchMedia('(max-width: 1024px)')

	const debouncedValue = useDebounce(searchValue)

	const router = useRouter()

	const chatFeedRef = useRef<HTMLDivElement>(null)

	const store = useStore()
	const isLogged = store.getIsLogged()
	const isLoaded = store.getIsLoaded()
	const userId = store.getUserId()

	useEffect(() => {
		if (isLoaded && !isLogged) {
			router.push('/')
		}

		if (isLoaded) {
			const newSocket: ISocket = io(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/chat`,
				{
					extraHeaders: { authorization: `Bearer ${authTokenStore.authToken}` },
					secure: true,
				},
			)
			setSocket(newSocket)
		}
	}, [isLoaded, router, store, isLogged])

	useEffect(() => {
		if (socket) {
			socketMessage(socket, setConversations)
			socket.on('onlineUsers', (payload) => {
				store.updateOnlineUsers(
					payload.onlineUsers.filter((onlineUser) => onlineUser !== null),
				)
			})
		}
	}, [socket, store])

	useEffect(() => {
		if (socket && chatsLoaded) {
			socket.on('connect_error', (error) => {
				setSocketError(error.message)
			})
			chats.forEach((chat) => {
				socket.emit('join', { room: chat.title, type: chat.type })

				ChatService.getMessages({
					page: 1,
					chatId: chat.id,
					type: chat.type,
				}).then((messages) => {
					const newConversation: IConversation = {
						id: chat.id,
						room: chat.title,
						messages,
					}

					setConversations((prev) => [...prev, newConversation])
				})
			})
		}
	}, [chatsLoaded, chats, socket])

	useEffect(() => {
		if (debouncedValue.length >= 3) {
			UserService.searchUser(debouncedValue).then((usersList) => {
				setUsers(
					usersList.map((user) => ({
						id: user.id,
						title: user.profile.firstName,
						imageUrl: user.profile?.avatar
							? user.profile.avatar
							: 'https://res.cloudinary.com/dtkchspyx/image/upload/v1686323806/talk-plus/empty-user-image_tzkax8.png',
					})),
				)
			})
		} else {
			setUsers([])
		}
	}, [debouncedValue])

	useEffect(() => {
		if (searchValue.length <= 2) {
			setUsers([])
		}
	}, [searchValue])

	useEffect(() => {
		if (md) {
			setIsOpenRightSide(false)
		}
	}, [md])

	const { isLoading: isLoadingChats } = useQuery(
		'all-chats',
		ChatService.getAllChats,
		{
			enabled: !!userId,
			onSuccess(data) {
				setChats(data.data.chats)
				setChatsLoaded(true)
			},
		},
	)

	const handleAddGroup = () => {
		setIsAddGroup(true)
		setSelectedChat(null)
		setIsProfileSettings(false)
		if (md) {
			setIsOpenLeftSide(false)
			setIsOpenRightSide(false)
		}
	}

	const handleSettings = () => {
		setIsProfileSettings(true)
		setIsAddGroup(false)
		setSelectedChat(null)
		if (md) {
			setIsOpenLeftSide(false)
			setIsOpenRightSide(false)
		}
	}

	const handleSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
		if (e.target.value.length <= 2) {
			setUsers([])
		}
	}

	const handleUserFromSearch = async (user: IChat) => {
		const existedChat = chats.find((c) => c.title === user.title)

		if (existedChat) {
			setSearchValue('')
			setChats((prev) => {
				const index = prev.findIndex((i) => i.id === existedChat.id)
				const chat = prev.splice(index, 1)[0]
				return [chat, ...prev]
			})
			setSelectedChat({
				id: existedChat.id,
				imageUrl: user.imageUrl,
				title: user.title,
				type: user.type ? 'group' : 'chat',
			})
		} else {
			try {
				if (socket) {
					socket.emit('join', { room: user.title, type: 'chat' })

					const {
						data: { chat },
					} = await ChatService.addPersonalChat(
						user.title,
						user.imageUrl,
						user.id,
					)

					setSearchValue('')

					setChats((prev) => [
						{
							id: chat.id,
							imageUrl: user.imageUrl,
							title: user.title,
							type: user.type ? 'group' : 'chat',
						},
						...prev,
					])

					setSelectedChat({
						id: chat.id,
						imageUrl: user.imageUrl,
						title: user.title,
						type: user.type ? 'group' : 'chat',
					})
				}
			} catch (e) {
				console.log('Error with socket connection')
			}
		}
	}

	// console.log(authTokenStore.authToken)

	return (
		<>
			{socketError && <p>{socketError}</p>}
			{/* {isLoading && <Loader />} */}
			{isLogged && isLoaded && !socketError && (
				<Box className="flex">
					{isAddGroup &&
						!selectedChat &&
						!isOpenLeftSide &&
						!isOpenRightSide && (
							<Box className="bg-[var(--color-dark-gray)] w-screen">
								<AddGroup
									setChats={setChats}
									setIsAddGroup={setIsAddGroup}
									setSelectedChat={setSelectedChat}
									socket={socket}
									onClose={() => {
										setIsOpenLeftSide(true)
										setIsOpenRightSide(false)
									}}
								/>
							</Box>
						)}
					{isProfileSettings &&
						!selectedChat &&
						!isOpenLeftSide &&
						!isOpenRightSide && (
							<Box className="bg-[var(--color-dark-gray)] w-screen">
								<ProfileSettings
									onClose={() => {
										setIsOpenLeftSide(true)
										setIsOpenRightSide(false)
									}}
								/>
							</Box>
						)}
					<Box
						className={clsx(
							'border-r-[1px] border-black h-screen overflow-y-auto bg-[var(--color-middle-gray)] flex-shrink-0 lg:w-[300px]',
							md && isOpenLeftSide ? 'w-[100%]' : 'w-[300px]',
							md && !isOpenLeftSide ? 'hidden' : 'block',
						)}
					>
						<Box className="flex gap-3 my-3 mx-2">
							<ChatMenu
								onClickAddGroup={handleAddGroup}
								onClickProfileSettings={handleSettings}
							/>
							<ChatSearchInput
								onChange={handleSearchValue}
								value={searchValue}
								setValue={setSearchValue}
							/>
						</Box>
						<Box className="p-2">
							{users &&
								users.map((user) => (
									<UserChatItem
										key={user.id}
										chat={user}
										selectedChat={selectedChat?.id.toString()}
										onClick={() => handleUserFromSearch(user)}
									/>
								))}
						</Box>
						<Box className="p-2">
							{isLoadingChats ? (
								<p className="text-white font-bold text-center">Updating...</p>
							) : (
								<>
									{!searchValue &&
										chats.map((chat) => (
											<ChatItem
												key={`${chat.id}-${chat.type}`}
												chat={chat}
												selectedChat={`${selectedChat?.id}-${selectedChat?.type}`}
												onClick={() => {
													setSelectedChat(chat)
													setIsOpenLeftSide(false)
													setIsOpenRightSide(true)
												}}
												conversation={conversations.find(
													(conversation) => conversation.id === chat.id,
												)}
											/>
										))}
								</>
							)}
						</Box>
					</Box>
					<Box
						className={clsx(
							'w-full bg-[var(--color-dark-gray)]',
							isOpenRightSide ? 'block' : 'hidden',
						)}
					>
						{isAddGroup && !selectedChat && (
							<AddGroup
								setChats={setChats}
								setIsAddGroup={setIsAddGroup}
								setSelectedChat={setSelectedChat}
								socket={socket}
							/>
						)}
						{isProfileSettings && !selectedChat && <ProfileSettings />}
						{selectedChat && (
							<Box className="flex flex-col pb-3 h-[100vh] w-full">
								<ChatHeader
									chat={selectedChat}
									setChats={setChats}
									setSelectedChat={setSelectedChat}
									setMessages={setConversations}
									onClickBack={() => {
										setIsOpenLeftSide(true)
										setIsOpenRightSide(false)
									}}
								/>
								<ChatFeed
									conversation={getCurrentConversation(
										conversations,
										selectedChat,
									)}
									setConversations={setConversations}
									selectedChat={selectedChat}
									key={selectedChat.id}
									ref={chatFeedRef}
								/>
								<ChatForm
									socket={socket}
									room={selectedChat.title}
									roomId={selectedChat.id}
									typeChat={selectedChat.type}
									className="relative bottom-0"
									afterSubmit={() => {
										scrollToBottom(chatFeedRef)
										moveChatToTop(selectedChat, setChats)
									}}
								/>
							</Box>
						)}
					</Box>
				</Box>
			)}
		</>
	)
})
