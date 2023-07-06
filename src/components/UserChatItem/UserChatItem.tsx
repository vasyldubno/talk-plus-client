import s from './UserChatItem.module.scss'
import { Box, Image, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { UserIcon } from '@/icons/UserIcon'
import { IChat, IUser } from '@/types/types'

interface UserChatItemProps {
	user: IUser
	selectedChat: IChat | null
	onClick: () => void
}

export const UserChatItem: FC<UserChatItemProps> = ({
	user,
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
				{user.profile.avatar ? (
					<Image
						src={user.profile.avatar}
						alt={user.profile.firstName}
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
					<Text className="text-white">{user.profile.firstName}</Text>
				</Box>
			</Box>
		</>
	)
}
