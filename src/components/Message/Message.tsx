/* eslint-disable react/display-name */
import { Box, Image, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import 'moment/locale/uk'
import { forwardRef } from 'react'
import { CiFaceSmile } from 'react-icons/ci'
import { useStore } from '@/hooks/useStore'
import { IMessage } from '@/types/types'
import { formatUTCDate } from '@/utils/formatUTCDate'

interface MessageProps {
	message: IMessage
	chatType: 'group' | 'chat' | undefined
}

export const Message = observer(
	forwardRef<HTMLDivElement, MessageProps>(({ message, chatType }, ref) => {
		const store = useStore()
		const userId = store.getUserId()
		const onlineUsers = store.getOnlineUsers()

		const isAdmin = () => {
			return userId === message.author.id.toString()
		}

		const isOnline = onlineUsers.includes(message.author.id)

		return (
			<Box
				className={clsx(
					'flex gap-2',
					isAdmin() ? '' : 'ml-auto flex-row-reverse',
					chatType === 'chat' ? 'w-full md:w-[70%]' : 'w-[90%] lg:w-[100%]',
				)}
				ref={ref}
			>
				<Box className="h-10 w-10 self-end flex-shrink-0 relative">
					{message.author.avatar ? (
						<Image
							src={message.author.avatar}
							className="w-full h-full rounded-full"
						/>
					) : (
						<CiFaceSmile className="h-full w-full fill-white" />
					)}
					{isOnline && (
						<div
							style={{
								position: 'absolute',
								bottom: '3px',
								right: '3px',
								borderRadius: '99px',
								backgroundColor: 'var(--color-subscriber-online)',
								width: '10px',
								height: '10px',
							}}
						/>
					)}
				</Box>
				<Box
					className={clsx(
						'text-gray-200 p-2 rounded-xl relative w-full',
						isAdmin() ? `bg-[#b5a3a3]` : `bg-[#f7b665]`,
					)}
				>
					<Text className="text-white text-sm">{message.author.firstName}</Text>
					<Text className="text-white">{message.message}</Text>
					<Text className="absolute right-2 bottom-1 text-xs text-white">
						{formatUTCDate(message.createdAt, store)}
					</Text>
				</Box>
			</Box>
		)
	}),
)
