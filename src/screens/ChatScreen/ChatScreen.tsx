import { Box } from '@chakra-ui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AddGroup } from '@/components/AddGroup/AddGroup'
import { ChatFeed } from '@/components/ChatFeed/ChatFeed'
import { ChatForm } from '@/components/ChatForm/ChatForm'
import { ChatHeader } from '@/components/ChatHeader/ChatHeader'
import { ChatList } from '@/components/ChatList/ChatList'
import { ChatMenu } from '@/components/ChatMenu/ChatMenu'
import { ChatSearchInput } from '@/components/ChatSearchInput/ChatSearchInput'
import { ChatUserList } from '@/components/ChatUserList/ChatUserList'
import { ProfileSettings } from '@/components/ProfileSettings/ProfileSettings'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { ChatService } from '@/services/chatService'
import { SupabaseService } from '@/services/supabaseService'
import { IChat, IConversation, IMessage } from '@/types/types'
import { getCurrentConversation } from '@/utils/getCurrentConversation'

export const ChatScreen: FC = observer(() => {
	const [conversations, setConversations] = useState<IConversation[]>([])
	const [chats, setChats] = useState<IChat[]>([])
	const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
	const [selectedConversation, setSelectedConversation] = useState<
		IMessage[] | null
	>(null)
	const [searchValue, setSearchValue] = useState('')
	const [isAddGroup, setIsAddGroup] = useState(false)
	const [isProfileSettings, setIsProfileSettings] = useState(false)
	const [chatsLoaded, setChatsLoaded] = useState(false)
	const [isOpenLeftSide, setIsOpenLeftSide] = useState(true)
	const [isOpenRightSide, setIsOpenRightSide] = useState(true)
	const [updateRef, setUpdateRef] = useState(false)

	const md = useMatchMedia('(max-width: 1024px)')

	const router = useRouter()

	const store = useStore()
	const isLogged = store.getIsLogged()
	const isLoaded = store.getIsLoaded()

	const username = store.getUsername()
	const userId = store.getUserId()

	useEffect(() => {
		if (selectedChat) {
			const current = getCurrentConversation(conversations, selectedChat)
			setSelectedConversation(current ?? null)
		}
	}, [selectedChat, conversations])

	useEffect(() => {
		SupabaseService.chatsInsert({ setChats, setConversations, store })
		SupabaseService.chatsDelete({ setChats, setConversations })
		SupabaseService.messagesInsert({
			setConversations,
		})
		SupabaseService.chatsUpdate({ setChats, store })
		SupabaseService.membersInsert({ setChats, setConversations, store })
		SupabaseService.membersUpdate({
			setChats,
			setConversations,
			store,
			setSelectedChat,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (isLoaded && !isLogged) {
			router.push('/')
		}

		if (isLoaded && isLogged && userId) {
			ChatService.getAllChats(userId, setChats, setConversations, () =>
				setChatsLoaded(true),
			)
		}
	}, [isLoaded, isLogged, router, username, userId])

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

	const handleSearchValue = async (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	// console.log('CONVERSATIONS', conversations)
	// console.log('ONLINE_USERS', store.getOnlineUsers())
	console.log('SELECTED_CONVERSATION', selectedConversation)
	// console.log(lastMessageRef)
	// console.log('updateRef', updateRef)
	// const [value, setValue] = useState('')
	// const ref = useRef<HTMLDivElement>(null)
	// useEffect(() => {
	// 	console.log('useEffect')
	// 	if (ref && updateRef) {
	// 		ref.current?.scrollIntoView()
	// 		setUpdateRef(false)
	// 	}
	// }, [conversations])

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
							<ChatUserList
								selectedChat={selectedChat}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								setSelectedChat={setSelectedChat}
							/>
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
							<Box className="flex flex-col pb-3 h-[100dvh] w-full">
								<ChatHeader
									chat={selectedChat}
									setChats={setChats}
									setSelectedChat={setSelectedChat}
									setConversations={setConversations}
									onClickBack={() => {
										setIsOpenLeftSide(true)
										setIsOpenRightSide(false)
										setSelectedChat(null)
									}}
								/>
								<ChatFeed
									conversation={selectedConversation}
									setConversations={setConversations}
									selectedChat={selectedChat}
									setUpdateRef={setUpdateRef}
									updateRef={updateRef}
								/>
								<ChatForm
									chat={selectedChat}
									className="relative bottom-0"
									setUpdateRef={setUpdateRef}
								/>
								{/* <div
									style={{
										display: 'flex',
										flexDirection: 'column',
										overflow: 'scroll',
									}}
								>
									{getCurrentConversation(conversations, selectedChat)
										?.reverse()
										.map((item) => (
											<p
												key={item.id}
												style={{ color: 'white', fontSize: '2rem' }}
											>
												{item.content}
											</p>
										))}
									<div ref={ref} />
								</div>
								<form
									onSubmit={(e) => {
										e.preventDefault()
										ChatService.addNewMessage({
											content: value,
											chatId: selectedChat.id,
											userId: store.getUserId(),
											afterSubmit: () => {
												setValue('')
												setUpdateRef(true)
											},
										})
									}}
								>
									<input
										type="text"
										value={value}
										onChange={(e) => setValue(e.target.value)}
									/>
									<button type="submit" style={{ color: 'white' }}>
										add
									</button>
								</form> */}
							</Box>
						)}
					</Box>
				</Box>
			)}
		</>
	)
})
