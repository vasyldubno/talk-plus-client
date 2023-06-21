/* eslint-disable react/display-name */
import { Message } from '../Message/Message'
import { Box } from '@chakra-ui/react'
import {
	Dispatch,
	SetStateAction,
	forwardRef,
	useCallback,
	useEffect,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'
import { ChatService } from '@/services/chatService'
import { IChat, IConversation, IMessage } from '@/types/types'

interface ChatFeedProps {
	conversation: IMessage[] | undefined
	setConversations: Dispatch<SetStateAction<IConversation[]>>
	selectedChat: IChat | null
}

export const ChatFeed = forwardRef<HTMLDivElement, ChatFeedProps>(
	({ conversation, selectedChat, setConversations }, chatFeedRef) => {
		const PAGE_SIZE = 14

		const { ref, inView } = useInView({
			threshold: 0.5,
			triggerOnce: true,
		})

		const getMessages = async (pageParam: any) => {
			return ChatService.getMessages({
				page: pageParam,
				chatId: selectedChat?.id,
				type: selectedChat?.type,
			})
		}

		const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
			useInfiniteQuery(
				['messages', selectedChat?.id],
				({ pageParam = 1 }) => getMessages(pageParam),
				{
					getNextPageParam: (_lastPage, pages) => {
						return pages[pages.length - 1].length < PAGE_SIZE
							? undefined
							: pages.length + 1
					},
				},
			)

		const updateMessages = useCallback(() => {
			setConversations((prev) => {
				const otherConversation = prev.filter((c) => c.id !== selectedChat?.id)

				if (data && selectedChat) {
					const updatedMessages: IMessage[] = data.pages.flat().map((d) => ({
						id: d.id.toString(),
						message: d.message,
						createdAt: d.createdAt,
						updatedAt: d.updatedAt,
						author: {
							avatar: d.author.avatar,
							id: d.author.id,
							firstName: d.author.firstName,
						},
					}))

					return [
						...otherConversation,
						{
							id: selectedChat.id,
							room: selectedChat.title,
							messages: updatedMessages,
						},
					]
				}

				return prev
			})
		}, [data, selectedChat, setConversations])

		useEffect(() => {
			updateMessages()
		}, [data, updateMessages])

		useEffect(() => {
			if (inView && selectedChat) {
				fetchNextPage()
			}
		}, [inView, selectedChat, fetchNextPage])

		return (
			<>
				<Box
					className="flex flex-col-reverse gap-3 overflow-y-auto scroll-smooth mt-auto mx-auto w-full overflow-x-hidden lg:px-32 px-3"
					ref={chatFeedRef}
					key={selectedChat?.id}
				>
					{conversation &&
						conversation.map((message, index) => {
							if (index === conversation.length - 1) {
								return (
									<Message
										message={message}
										key={message.id}
										ref={ref}
										chatType={selectedChat?.type}
									/>
								)
							}
							return (
								<Message
									message={message}
									key={message.id}
									chatType={selectedChat?.type}
								/>
							)
						})}
					{isFetchingNextPage && (
						<p className="text-white text-center">Loading...</p>
					)}
				</Box>
			</>
		)
	},
)
