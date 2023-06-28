import { UserItem } from '../UserItem/UserItem'
import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { $axios } from '@/config/axiosConfig'
import { useStore } from '@/hooks/useStore'
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon'
import { BinIcon } from '@/icons/BinIcon'
import { ThreeDotsIcon } from '@/icons/ThreeDotsIcon'
import { UserIcon } from '@/icons/UserIcon'
import { ChatService } from '@/services/chatService'
import { IChat, IConversation, ISocket, IUser } from '@/types/types'
import { SearchInput } from '@/ui/SearchInput/SearchInput'

interface ChatHeaderProps {
	chat: IChat
	setChats: Dispatch<SetStateAction<IChat[]>>
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
	setMessages: Dispatch<SetStateAction<IConversation[]>>
	onClickBack: () => void
	socket: ISocket | null
}

export const ChatHeader: FC<ChatHeaderProps> = observer(
	({ chat, setChats, setSelectedChat, setMessages, onClickBack, socket }) => {
		const [isAddNewUser, setIsAddNewUser] = useState(false)
		const [users, setUsers] = useState<IUser[] | null>(null)
		const [selectedUsers, setSelectedUsers] = useState<IUser[] | null>(null)

		const store = useStore()

		const handleDeleteGroup = () => {
			store.updateIsLoading(true)
			// setChats((prev) => prev.filter((c) => c.title !== chat.title))
			setMessages((prev) => prev.filter((c) => c.room !== chat.title))
			if (socket) {
				socket.emit('delete-group', {
					title: chat.title,
					groupId: chat.id.toString(),
				})
			}
			setSelectedChat(null)
			// store.updateIsLoading(false)
		}

		const handleIsAddNewUser = () => {
			setIsAddNewUser(true)
		}

		const handleClickAddNewUsers = () => {
			selectedUsers?.forEach((user) => {
				socket?.emit('subscribe-group', {
					idGroup: chat.id.toString(),
					nameGroup: chat.title,
					userId: user.id.toString(),
				})
			})
			setIsAddNewUser(false)
			setUsers(null)
		}

		const handleLeaveGroup = () => {
			setChats((prev) => prev.filter((c) => c.title !== chat.title))
			setSelectedChat(null)
			return ChatService.leaveGroup(chat.id)
		}

		const handleDeleteChat = () => {
			if (socket) {
				socket.emit('deleteChat', { chatId: chat.id.toString() })
				store.updateIsLoading(true)
			}
		}

		return (
			<>
				<Box className="flex p-3 items-center border-b-[1px] border-gray-400 top-0 relative justify-between mb-2 bg-[var(--color-middle-gray)]">
					<Box className="flex items-center">
						<Box
							className="cursor-pointer lg:hidden mr-8"
							onClick={onClickBack}
						>
							<ArrowLeftIcon size="2rem" />
						</Box>
						{chat.imageUrl ? (
							<Image
								src={chat.imageUrl}
								alt={chat.title}
								width={40}
								height={40}
								className="rounded-full mr-4"
							/>
						) : (
							<Box className="rounded-full mr-4 bg-fuchsia-400 p-[7%] w-[40px] h-[40px]">
								<UserIcon height="full" width="full" fill="black" />
							</Box>
						)}
						<Text className="text-white">{chat.title}</Text>
					</Box>
					<Box>
						<Menu>
							<MenuButton
								className="hover:bg-[var(--color-gray-50)] p-2 rounded-full"
								style={{ transition: 'all 0.3s' }}
							>
								<ThreeDotsIcon width="2rem" height="2rem" />
							</MenuButton>
							<MenuList minWidth="fit-content">
								{chat.isAdmin && chat.type === 'group' && (
									<MenuItem
										className="text-sm"
										paddingTop={1}
										paddingBottom={1}
										onClick={handleIsAddNewUser}
									>
										<Box className="flex items-center">
											<UserIcon height="1rem" width="1rem" fill="black" />
											<Text className="ml-2">Add new user</Text>
										</Box>
									</MenuItem>
								)}
								{chat.isAdmin && chat.type === 'group' && (
									<MenuItem
										className="text-sm"
										paddingTop={1}
										paddingBottom={1}
										onClick={handleDeleteGroup}
									>
										<Box className="flex items-center">
											<BinIcon height="1rem" width="1rem" fill="black" />
											<Text className="ml-2">Delete & Leave group</Text>
										</Box>
									</MenuItem>
								)}
								{!chat.isAdmin && chat.type === 'group' && (
									<MenuItem
										className="text-sm"
										paddingTop={1}
										paddingBottom={1}
										onClick={handleLeaveGroup}
									>
										<Box className="flex items-center">
											<BinIcon height="1rem" width="1rem" fill="black" />
											<Text className="ml-2">Leave group</Text>
										</Box>
									</MenuItem>
								)}
								{chat.type === 'chat' && (
									<MenuItem
										className="text-sm"
										paddingTop={1}
										paddingBottom={1}
										onClick={handleDeleteChat}
									>
										<Box className="flex items-center">
											<BinIcon height="1rem" width="1rem" fill="black" />
											<Text className="ml-2">Delete chat</Text>
										</Box>
									</MenuItem>
								)}
							</MenuList>
						</Menu>
					</Box>
				</Box>

				<Modal isOpen={isAddNewUser} onClose={() => setIsAddNewUser(false)}>
					<ModalOverlay />
					<ModalContent
						w="max-content"
						height="80vh"
						p={5}
						backgroundColor="white"
						boxShadow="none"
						marginTop="10px"
					>
						<SearchInput setUsers={setUsers} chatId={chat.id} />
						{users &&
							users.map((user) => (
								<UserItem
									user={user}
									key={user.id}
									setSelectedUsers={setSelectedUsers}
								/>
							))}
						<Button className="mt-5" onClick={handleClickAddNewUsers}>
							Add
						</Button>
					</ModalContent>
				</Modal>
			</>
		)
	},
)
