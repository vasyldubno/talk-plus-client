import { AddGroup } from './AddGroup'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

jest.mock('@/hooks/useStore', () => {
	return {
		useStore() {
			return {
				getIsLoading: () => false,
				getUserId: () => '12344',
			}
		},
	}
})

jest.mock('@/hooks/useMatchMedia', () => {
	return {
		useMatchMedia() {
			return true
		},
	}
})

describe('AddGroup', () => {
	const setChats = jest.fn()
	const setIsAddGroup = jest.fn()
	const setSelectedChat = jest.fn()

	beforeEach(() => {
		render(
			<AddGroup
				setChats={setChats}
				setIsAddGroup={setIsAddGroup}
				setSelectedChat={setSelectedChat}
			/>,
		)
	})

	test('fill field', async () => {
		const titleInput = screen.getByLabelText('Group Name')
		fireEvent.change(titleInput, { target: { value: 'Upwork' } })
		expect(titleInput).toHaveValue('Upwork')

		const fileInput: HTMLInputElement = screen.getByTestId('file')
		fireEvent.change(fileInput, {
			target: { files: [new File([], 'test.png')] },
		})
		expect(fileInput.files?.length).toBe(1)
	})
})
