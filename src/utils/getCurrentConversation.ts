import { IChat, IConversation } from '@/types/types'

export const getCurrentConversation = (
	conversations: IConversation[],
	selectedChat: IChat | null,
) => {
	return conversations.find(
		(conversation) => conversation.id === selectedChat?.id,
	)?.messages
}
