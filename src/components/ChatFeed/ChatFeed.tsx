/* eslint-disable react/display-name */
import { Message } from '../Message/Message'
import { Box } from '@chakra-ui/react'
import {
	Dispatch,
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

interface ChatFeedProps {
	conversation: IMessage[] | undefined
	setConversations: Dispatch<SetStateAction<IConversation[]>>
	selectedChat: IChat | null
}

export const ChatFeed = forwardRef<HTMLDivElement, ChatFeedProps>(
	({ conversation, selectedChat, setConversations }, chatFeedRef) => {
		const { ref, inView } = useInView({
			threshold: 0.1,
			triggerOnce: true,
		})

		const [page, setPage] = useState(1)
		const [isNextPage, setIsNextPage] = useState(true)
		const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

		const lastMessageRef = useRef<HTMLDivElement>(null)

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

		// const combinedRef = useCombinedRef(ref, chatFeedRef)
		// console.log(combinedRef)

		// const messageRef = useRef<HTMLDivElement>(null)

		// useEffect(() => {
		// 	// @ts-ignore
		// 	navigator.virtualKeyboard.overlaysContent = true
		// }, [])

		// useEffect(() => {
		// 	if (messageRef.current) {
		// 		console.log(messageRef.current)
		// 		messageRef.current.scrollIntoView()
		// 	}
		// }, [conversation])

		return (
			<>
				<Box
					className="flex flex-col-reverse gap-3 overflow-y-scroll overflow-x-hidden scroll-smooth mt-auto mx-auto w-full lg:px-32 px-3"
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
										chat={selectedChat}
									/>
								)
							}
							return (
								<Message
									message={message}
									key={message.id}
									chat={selectedChat}
									ref={index === 0 ? lastMessageRef : null}
								/>
							)
						})}
					{/* {conversation &&
						conversation.map((message, index) => (
							<div key={index}>
								{index === conversation.length - 1 ? (
									<div key={message.id} ref={messageRef}>
										<Message
											key={message.id}
											message={message}
											ref={ref}
											chat={selectedChat}
										/>
									</div>
								) : (
									<Message
										message={message}
										key={message.id}
										chat={selectedChat}
									/>
								)}
							</div>
						))} */}
					{isFetchingNextPage && (
						<p className="text-white text-center">Loading...</p>
					)}
				</Box>
			</>
		)
	},
)
