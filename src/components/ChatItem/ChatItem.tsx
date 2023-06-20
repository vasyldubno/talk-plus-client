import { Box, Image, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { useStore } from '@/hooks/useStore'
import { IChat, IConversation } from '@/types/types'
import { formatUTCDate } from '@/utils/formatUTCDate'

interface ChatItemProps {
	chat: IChat
	selectedChat: string | undefined
	onClick: () => void
	conversation: IConversation | undefined
}

export const ChatItem: FC<ChatItemProps> = ({
	chat,
	onClick,
	selectedChat,
	conversation,
}) => {
	const store = useStore()

	const getLastMessage = () => {
		return conversation?.messages[0]
	}

	const isSelectedChat = () => {
		return selectedChat === `${chat.id}-${chat.type}`
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
				src={chat.imageUrl}
				alt={chat.title}
				width="auto"
				height="70px"
				className="object-cover rounded-full mr-3 p-1"
			/>
			<Box className="pr-2 flex flex-col justify-center w-[calc(100%-80px)]">
				<Box className="flex justify-between">
					<Text className="text-white">{chat.title}</Text>
					<Text className="text-sm text-white">
						{formatUTCDate(getLastMessage()?.updatedAt, store)}
					</Text>
				</Box>
				{getLastMessage() && (
					<Text
						className="text-white text-xs"
						style={{
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
						}}
					>
						{getLastMessage()?.message}
					</Text>
				)}
			</Box>
		</Box>
	)
}
