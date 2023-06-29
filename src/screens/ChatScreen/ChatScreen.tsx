import { Box } from '@chakra-ui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { useRouter } from 'next/router'
import { AddGroup } from '@/components/AddGroup/AddGroup'
import { ChatFeed } from '@/components/ChatFeed/ChatFeed'
import { ChatForm } from '@/components/ChatForm/ChatForm'
import { ChatHeader } from '@/components/ChatHeader/ChatHeader'
import { ChatList } from '@/components/ChatList/ChatList'
import { ChatMenu } from '@/components/ChatMenu/ChatMenu'
import { ChatSearchInput } from '@/components/ChatSearchInput/ChatSearchInput'
import { ProfileSettings } from '@/components/ProfileSettings/ProfileSettings'
import { UserChatItem } from '@/components/UserChatItem/UserChatItem'
import { useDebounce } from '@/hooks/useDebounce'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { IChat, IConversation, ISocket } from '@/types/types'
import { Loader } from '@/ui/Loader/Loader'
import { getCurrentConversation } from '@/utils/getCurrentConversation'

export const ChatScreen: FC = observer(() => {
	const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
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
	const isLoading = store.getIsLoading()

	useEffect(() => {
		if (isLoaded && !isLogged) {
			router.push('/')
		}
	}, [isLoaded, isLogged, router])

	useEffect(() => {
		if (debouncedValue.length >= 3) {
			console.log('')
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

	const handleUserFromSearch = (user: IChat) => {
		console.log(user)
	}

	return (
		<>
			{isLogged && isLoaded && (
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
										onClick={() => {
											handleUserFromSearch(user)
										}}
									/>
								))}
						</Box>
						<ChatList
							chats={chats}
							conversations={conversations}
							searchValue={searchValue}
							selectedChat={selectedChat}
							setChats={setChats}
							setChatsLoaded={setChatsLoaded}
							setIsOpenLeftSide={setIsOpenLeftSide}
							setIsOpenRightSide={setIsOpenRightSide}
							setSelectedChat={setSelectedChat}
							chatsLoaded={chatsLoaded}
						/>
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
							/>
						)}
						{isProfileSettings && !selectedChat && <ProfileSettings />}
						{selectedChat && (
							<Box className="flex flex-col pb-3 h-[100vh] w-full">
								<ChatHeader
									chat={selectedChat}
									setChats={setChats}
									setSelectedChat={setSelectedChat}
									setConversations={setConversations}
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
									room={selectedChat.title}
									roomId={selectedChat.id}
									typeChat={selectedChat.type}
									className="relative bottom-0"
									afterSubmit={() => {
										// scrollToBottom(chatFeedRef)
										// moveChatToTop(selectedChat, setChats)
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
