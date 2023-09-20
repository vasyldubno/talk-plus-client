import { useEffect, useId, useRef, useState } from 'react'
import { useStore } from '@/hooks/useStore'
import { ChatService } from '@/services/chatService'
import { IChat, IConversation } from '@/types/types'

const TestPage = () => {
	const [messages, setMessages] = useState([
		{ id: 1, content: '1' },
		{ id: 2, content: '2' },
		{ id: 3, content: '3' },
		{ id: 4, content: '4' },
		{ id: 5, content: '5' },
		{ id: 6, content: '6' },
		{ id: 7, content: '7' },
		{ id: 8, content: '8' },
		{ id: 9, content: '9' },
		{ id: 10, content: '10' },
		{ id: 11, content: '11' },
		{ id: 12, content: '12' },
		{ id: 13, content: '13' },
		{ id: 14, content: '14' },
		{ id: 15, content: '15' },
		{ id: 16, content: '16' },
		{ id: 17, content: '17' },
		{ id: 18, content: '18' },
		{ id: 19, content: '19' },
		{ id: 20, content: '20' },
	])
	const [value, setValue] = useState('')
	const [updateRef, setUpdateRef] = useState(true)
	const [chats, setChats] = useState<IChat[]>([])
	const [conversations, setConversations] = useState<IConversation[]>([])

	const ref = useRef<HTMLDivElement>(null)
	const store = useStore()
	const userId = store.getUserId()

	useEffect(() => {
		if (userId) {
			ChatService.getAllChats(userId, setChats, setConversations, () => {
				console.log()
			})
		}
	}, [userId])

	useEffect(() => {
		if (updateRef) {
			ref.current?.scrollIntoView()
			setUpdateRef(false)
		}
	}, [messages])

	console.log('chats', chats)
	console.log('conversations', conversations)

	return (
		<div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
			<div
				style={{
					overflowY: 'scroll',
					display: 'flex',
					flexDirection: 'column',
					minHeight: '0',
				}}
			>
				{messages.map((message) => (
					<p key={message.id} style={{ fontSize: '3rem' }}>
						{message.content}
					</p>
				))}
				<div ref={ref} />
			</div>
			<div>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						setMessages((prev) => [...prev, { id: 200, content: value }])
						setUpdateRef(true)
					}}
				>
					<input
						type="text"
						style={{ border: '1px solid red' }}
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					<button type="submit">add</button>
				</form>
			</div>
		</div>
	)
}

export default TestPage
