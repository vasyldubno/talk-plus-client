/* eslint-disable react/display-name */
import { Message } from '../Message/Message'
import { Box } from '@chakra-ui/react'
import {
	Dispatch,
	FC,
	SetStateAction,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { useCombinedRef } from '@/hooks/useCombinedRef'
import { ChatService } from '@/services/chatService'
import { IChat, IConversation, IMessage } from '@/types/types'

interface Props {
	conversation: IMessage[] | undefined
	setConversations: Dispatch<SetStateAction<IConversation[]>>
	selectedChat: IChat | null
	updateRef: boolean
	setUpdateRef: Dispatch<SetStateAction<boolean>>
}

export const ChatFeed = forwardRef<HTMLDivElement, Props>(
	(
		{ conversation, selectedChat, setConversations, setUpdateRef, updateRef },
		lastRef,
	) => {
		console.log(conversation)
		const { ref, inView } = useInView({
			threshold: 0.1,
			triggerOnce: true,
		})

		const [page, setPage] = useState(1)
		const [isNextPage, setIsNextPage] = useState(true)
		const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

		useEffect(() => {
			// lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
			if (updateRef && lastRef) {
				// @ts-ignore
				lastRef?.current?.scrollIntoView({ behavior: 'smooth' })
				setUpdateRef(false)
			}
		}, [conversation])

		useEffect(() => {
			if (inView && selectedChat && isNextPage) {
				setIsFetchingNextPage(true)
				setPage(page + 1)
				ChatService.getMessagesByPage({
					page: page + 1,
					chatId: selectedChat.id,
				}).then(async (res) => {
					setIsNextPage(res.isNextPage)
					const messagesPromise: Promise<IMessage>[] = res.messages.map(
						async (message) => {
							const author = await ChatService.getAuthor({
								authorId: message.author_id,
							})
							return {
								id: message.id,
								content: message.content,
								createdAt: message.created_at,
								author: {
									firstName: author.firstName,
									id: author.id,
								},
							}
						},
					)
					const messages = await Promise.all(messagesPromise)
					setConversations((prev) => {
						const currentConversation = prev.find(
							(conv) => conv.id === selectedChat.id,
						)
						const restConversations = prev.filter(
							(rConv) => rConv.id !== selectedChat.id,
						)
						if (currentConversation) {
							return [
								...restConversations,
								{
									id: currentConversation?.id,
									title: currentConversation?.title,
									messages: [...currentConversation.messages, ...messages],
								},
							]
						}
						return prev
					})
					setIsFetchingNextPage(false)
				})
			}
		}, [inView])

		// console.log(lastRef)

		return (
			<>
				<Box
					className="flex flex-col-reverse gap-3 overflow-y-scroll overflow-hidden scroll-smooth mt-auto mx-auto w-full lg:px-32 px-3"
					// style={{ border: '1px solid red' }}
					key={selectedChat?.id}
					// ref={lastRef}
				>
					<div style={{ color: 'red' }} ref={lastRef} />

					{conversation &&
						conversation.map((message, index) => {
							if (index === conversation.length - 1) {
								return (
									<Message
										message={message}
										key={message.id}
										chat={selectedChat}
										id={message.id}
										ref={ref}
									/>
								)
							}
							return (
								<Message
									message={message}
									key={message.id}
									chat={selectedChat}
									id={message.id}
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
