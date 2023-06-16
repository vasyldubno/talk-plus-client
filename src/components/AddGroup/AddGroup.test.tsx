import { AddGroup } from './AddGroup'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ChatService } from '@/services/chatService'

describe('AddGroup', () => {
	const setChats = jest.fn()
	const setIsAddGroup = jest.fn()
	const setSelectedChat = jest.fn()
	const socket = null

	beforeEach(() => {
		render(
			<AddGroup
				setChats={setChats}
				setIsAddGroup={setIsAddGroup}
				setSelectedChat={setSelectedChat}
				socket={socket}
			/>,
		)
	})

	test('fill field', async () => {
		const titleInput = screen.getByLabelText('Group Name')
		const fileInput: HTMLInputElement = screen.getByTestId('file')

		fireEvent.change(titleInput, { target: { value: 'Upwork' } })
		fireEvent.change(fileInput, {
			target: { files: [new File([], 'test.png')] },
		})

		expect(titleInput).toHaveValue('Upwork')
		expect(fileInput.files?.length).toBe(1)
	})
})
