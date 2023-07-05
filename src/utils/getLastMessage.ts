import { IConversation } from '@/types/types'

export const getLastMessage = (conversation: IConversation | undefined) => {
	if (conversation) {
		return conversation.messages[0]
	}
	return null
}
