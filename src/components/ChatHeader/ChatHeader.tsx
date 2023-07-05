import { ModalAddNewUser } from '../ModalAddNewUser/ModalAddNewUser'
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
import axios from 'axios'
import { observer } from 'mobx-react-lite'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/config/supabase'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import { useStore } from '@/hooks/useStore'
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon'
import { BinIcon } from '@/icons/BinIcon'
import { ThreeDotsIcon } from '@/icons/ThreeDotsIcon'
import { UserIcon } from '@/icons/UserIcon'
import { IChat, IConversation, ISocket, IUser } from '@/types/types'
import { SearchInput } from '@/ui/SearchInput/SearchInput'

interface ChatHeaderProps {
	chat: IChat
	setChats: Dispatch<SetStateAction<IChat[]>>
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
	setConversations: Dispatch<SetStateAction<IConversation[]>>
	onClickBack: () => void
}

export const ChatHeader: FC<ChatHeaderProps> = observer(
	({ chat, setChats, setSelectedChat, setConversations, onClickBack }) => {
		const [isAddNewUser, setIsAddNewUser] = useState(false)

		const store = useStore()

		const screenTo1024px = useMatchMedia('(max-width: 1024px)')

		const handleDeleteGroup = async () => {
			store.updateIsLoading(true)
			const responseDeleteImage = await axios.post(
				'/api/cloudinary/delete-image',
				{
					imageUrl: chat.cover,
				},
			)
			if (responseDeleteImage) {
				const responseDeleteGroup = await supabase
					.from('chats')
					.delete()
					.eq('id', chat.id)
				if (responseDeleteGroup.status === 204) {
					store.updateIsLoading(false)
					setSelectedChat(null)
					if (screenTo1024px) {
						onClickBack()
					}
				}
			}
		}

		const handleLeaveGroup = async () => {
			await supabase
				.from('members')
				.delete()
				.eq('user_id', store.getUserId())
				.eq('chat_id', chat.id)
		}

		const handleAddNewUser = () => {
			setIsAddNewUser(true)
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
						{chat.cover ? (
							<Image
								src={chat.cover}
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
										onClick={handleAddNewUser}
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
									>
										<Box
											className="flex items-center"
											onClick={handleDeleteGroup}
										>
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

				<ModalAddNewUser
					chat={chat}
					isOpen={isAddNewUser}
					onClose={() => setIsAddNewUser(false)}
				/>
			</>
		)
	},
)
