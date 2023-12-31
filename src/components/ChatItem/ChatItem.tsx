import { Box, Image, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { useStore } from '@/hooks/useStore'
import { IChat, IConversation, IMessage } from '@/types/types'
import { formatUTCDate } from '@/utils/formatUTCDate'
import { getLastMessage } from '@/utils/getLastMessage'

interface ChatItemProps {
	chat: IChat
	selectedChat: IChat | null
	onClick: () => void
	conversation: IConversation | undefined
}

export const ChatItem: FC<ChatItemProps> = ({
	chat,
	onClick,
	selectedChat,
	conversation,
}) => {
	const [lastMessage, setLastMessage] = useState<IMessage | null>(null)
	const store = useStore()

	useEffect(() => {
		setLastMessage(getLastMessage(conversation))
	}, [conversation])

	const isSelectedChat = () => {
		if (selectedChat) {
			return selectedChat.id === chat.id
		}
		return false
	}

	return (
		<Box
			className={clsx(
				'cursor-pointer flex p-1 rounded-xl mb-2',
				isSelectedChat() && `bg-[var(--color-purple)]`,
			)}
			onClick={onClick}
		>
			<Image
				src={chat.cover}
				alt={chat.title}
				width="auto"
				height="70px"
				className="object-cover rounded-full mr-3 p-1"
			/>
			<Box className="pr-2 flex flex-col justify-center w-[calc(100%-80px)]">
				<Box className="flex justify-between">
					<Text className="text-white">{chat.title}</Text>
					<Text className="text-sm text-white">
						{formatUTCDate(chat.updated_at, store)}
					</Text>
				</Box>
				{lastMessage && (
					<Text
						className="text-white text-xs"
						style={{
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
						}}
					>
						{lastMessage.content}
					</Text>
				)}
			</Box>
		</Box>
	)
}
