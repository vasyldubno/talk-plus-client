/* eslint-disable react/display-name */
import { Message } from '../Message/Message'
import { Box } from '@chakra-ui/react'
import { Dispatch, SetStateAction, forwardRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { IChat, IConversation, IMessage } from '@/types/types'

interface ChatFeedProps {
	conversation: IMessage[] | undefined
	setConversations: Dispatch<SetStateAction<IConversation[]>>
	selectedChat: IChat | null
}

export const ChatFeed = forwardRef<HTMLDivElement, ChatFeedProps>(
	({ conversation, selectedChat, setConversations }, chatFeedRef) => {
		const { ref, inView } = useInView({
			threshold: 0.5,
			triggerOnce: true,
		})

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
								/>
							)
						})}
				</Box>
			</>
		)
	},
)
