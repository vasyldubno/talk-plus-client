import { ChatItem } from '../ChatItem/ChatItem'
import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Dispatch, FC, SetStateAction } from 'react'
import { useQuery } from 'react-query'
import { useStore } from '@/hooks/useStore'
import { ChatService } from '@/services/chatService'
import { IChat, IConversation } from '@/types/types'

interface ChatListProps {
	setChats: Dispatch<SetStateAction<IChat[]>>
	setChatsLoaded: Dispatch<SetStateAction<boolean>>
	chats: IChat[]
	searchValue: string
	selectedChat: IChat | null
	setSelectedChat: Dispatch<SetStateAction<IChat | null>>
	setIsOpenLeftSide: Dispatch<SetStateAction<boolean>>
	setIsOpenRightSide: Dispatch<SetStateAction<boolean>>
	conversations: IConversation[]
	chatsLoaded: boolean
}

export const ChatList: FC<ChatListProps> = observer(
	({
		setChats,
		setChatsLoaded,
		chats,
		searchValue,
		selectedChat,
		setIsOpenLeftSide,
		setIsOpenRightSide,
		setSelectedChat,
		conversations,
		chatsLoaded,
	}) => {
		return (
			<Box className="p-2">
				{!chatsLoaded ? (
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
										// console.log('onClick')
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
				{/* <>
					{!searchValue &&
						chats.map((chat) => (
							<ChatItem
								key={`${chat.id}-${chat.type}`}
								chat={chat}
								selectedChat={`${selectedChat?.id}-${selectedChat?.type}`}
								onClick={() => {
									// console.log('onClick')
									setSelectedChat(chat)
									setIsOpenLeftSide(false)
									setIsOpenRightSide(true)
								}}
								conversation={conversations.find(
									(conversation) => conversation.id === chat.id,
								)}
							/>
						))}
				</> */}
			</Box>
		)
	},
)
