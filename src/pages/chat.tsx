import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { ChatScreen } from '@/screens/ChatScreen/ChatScreen'

const ChatPage: NextPage = observer(() => {
	return <ChatScreen />
})

export default ChatPage
