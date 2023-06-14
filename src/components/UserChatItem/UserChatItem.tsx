import { Box, Image, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { UserIcon } from '@/icons/UserIcon'
import { IChat } from '@/types/types'

interface UserChatItemProps {
	chat: IChat
	selectedChat: string | undefined
	onClick: () => void
}

export const UserChatItem: FC<UserChatItemProps> = ({
	chat,
	selectedChat,
	onClick,
}) => {
	return (
		<>
			<Box
				className={clsx(
					'cursor-pointer flex p-2 w-full rounded-xl hover:bg-[var(--color-purple)] hover:transition-all',
					selectedChat === chat.id.toString() && 'bg-slate-400',
				)}
				onClick={onClick}
			>
				{chat.imageUrl ? (
					<Image
						src={chat.imageUrl}
						alt={chat.title}
						width="auto"
						height="70px"
						className="object-cover rounded-full mr-3"
					/>
				) : (
					<Box className="bg-[var(--color-gray)] w-[70px] h-[70px] p-[5%] rounded-full mr-3">
						<UserIcon height="full" width="full" fill="black" />
					</Box>
				)}
				<Box className="flex flex-col justify-center">
					<Text className="text-white">{chat.title}</Text>
				</Box>
			</Box>
		</>
	)
}
