/* eslint-disable react/display-name */
import { Box, Image, Text } from '@chakra-ui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import 'moment/locale/uk'
import { FC, forwardRef, useEffect, useState } from 'react'
import { CiFaceSmile } from 'react-icons/ci'
import { useStore } from '@/hooks/useStore'
import { IChat, IMessage } from '@/types/types'
import { formatUTCDate } from '@/utils/formatUTCDate'

interface MessageProps {
	message: IMessage
	chat: IChat | null
	id?: string
}

// export const Message = observer(
// 	forwardRef<HTMLDivElement, MessageProps>(({ message, chat, id }, ref) => {
// 		const [isOnline, setIsOnline] = useState(false)

// 		const store = useStore()
// 		const onlineUsers = store.getOnlineUsers()
// 		const userId = store.getUserId()

// 		useEffect(() => {
// 			if (userId) {
// 				setIsOnline(onlineUsers.includes(message.author.id))
// 			}
// 		}, [userId, onlineUsers])

// 		// useEffect(() => {
// 		// 	if (ref) {
// 		// 		// @ts-ignore
// 		// 		ref?.current?.scrollIntoView
// 		// 	}
// 		// }, [ref])

// 		return (
// 			<Box
// 				className={clsx(
// 					'flex gap-2',
// 					'flex-row',
// 					chat?.type === 'chat' ? 'w-full md:w-[70%]' : 'w-[90%] lg:w-[100%]',
// 					chat?.type === 'chat' && message.author.id === store.getUserId()
// 						? 'flex-row-reverse mr-auto'
// 						: 'ml-auto',
// 				)}
// 				ref={ref}
// 				id={id}
// 			>
// 				<Box
// 					className={`h-10 w-10 self-end flex-shrink-0 relative

//           `}
// 				>
// 					{message.author.avatar ? (
// 						<Image
// 							src={message.author.avatar}
// 							className="w-full h-full rounded-full"
// 						/>
// 					) : (
// 						<>
// 							<Image
// 								src="https://res.cloudinary.com/dtkchspyx/image/upload/v1686323806/talk-plus/empty-user-image_tzkax8.png"
// 								className="w-full h-full rounded-full"
// 							/>
// 						</>
// 					)}

// 					{isOnline && (
// 						<div
// 							style={{
// 								position: 'absolute',
// 								bottom: '2px',
// 								right: '1px',
// 								borderRadius: '99px',
// 								backgroundColor: 'var(--color-subscriber-online)',
// 								width: '10px',
// 								height: '10px',
// 							}}
// 						/>
// 					)}
// 				</Box>
// 				<Box
// 					className={clsx(
// 						'text-gray-200 p-2 rounded-xl relative w-full ',
// 						chat?.type === 'chat' && message.author.id === store.getUserId()
// 							? 'bg-[var(--color-orange)]'
// 							: 'bg-[var(--color-gray-light)]',
// 					)}
// 				>
// 					<Text className="text-white text-sm">{message.author.firstName}</Text>
// 					<Text className="text-white">{message.content}</Text>
// 					<Text className="absolute right-2 bottom-1 text-xs text-white">
// 						{formatUTCDate(message.createdAt, store)}
// 					</Text>
// 				</Box>
// 			</Box>
// 		)
// 	}),
// )

export const Message: FC<MessageProps> = observer(({ chat, message, id }) => {
	const [isOnline, setIsOnline] = useState(false)

	const store = useStore()
	const onlineUsers = store.getOnlineUsers()
	const userId = store.getUserId()

	useEffect(() => {
		if (userId) {
			setIsOnline(onlineUsers.includes(message.author.id))
		}
	}, [userId, onlineUsers])

	// useEffect(() => {
	// 	if (ref) {
	// 		// @ts-ignore
	// 		ref?.current?.scrollIntoView
	// 	}
	// }, [ref])

	return (
		<Box
			className={clsx(
				'flex gap-2',
				'flex-row',
				chat?.type === 'chat' ? 'w-full md:w-[70%]' : 'w-[90%] lg:w-[100%]',
				chat?.type === 'chat' && message.author.id === store.getUserId()
					? 'flex-row-reverse mr-auto'
					: 'ml-auto',
			)}
			// ref={ref}
			id={id}
		>
			<Box
				className={`h-10 w-10 self-end flex-shrink-0 relative 
         
          `}
			>
				{message.author.avatar ? (
					<Image
						src={message.author.avatar}
						className="w-full h-full rounded-full"
					/>
				) : (
					<>
						<Image
							src="https://res.cloudinary.com/dtkchspyx/image/upload/v1686323806/talk-plus/empty-user-image_tzkax8.png"
							className="w-full h-full rounded-full"
						/>
					</>
				)}

				{isOnline && (
					<div
						style={{
							position: 'absolute',
							bottom: '2px',
							right: '1px',
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
					'text-gray-200 p-2 rounded-xl relative w-full ',
					chat?.type === 'chat' && message.author.id === store.getUserId()
						? 'bg-[var(--color-orange)]'
						: 'bg-[var(--color-gray-light)]',
				)}
			>
				<Text className="text-white text-sm">{message.author.firstName}</Text>
				<Text className="text-white">{message.content}</Text>
				<Text className="absolute right-2 bottom-1 text-xs text-white">
					{formatUTCDate(message.createdAt, store)}
				</Text>
			</Box>
		</Box>
	)
})
