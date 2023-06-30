import s from './UserChatItem.module.scss'
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
					s.box,
					// selectedChat === chat.id.toString() && 'bg-slate-400',
				)}
				onClick={onClick}
			>
				{chat.cover ? (
					<Image
						src={chat.cover}
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
