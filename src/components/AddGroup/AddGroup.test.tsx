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
	const setIsAddGroup = jest.fn()

	beforeEach(() => {
		render(<AddGroup setIsAddGroup={setIsAddGroup} />)
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
