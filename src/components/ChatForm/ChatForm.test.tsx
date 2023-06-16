import { ChatForm } from './ChatForm'
import { fireEvent, render, screen } from '@testing-library/react'

describe('ChatFrom', () => {
	beforeEach(() => {
		render(
			<ChatForm
				room="title"
				roomId={1}
				socket={null}
				afterSubmit={jest.fn()}
				typeChat="chat"
			/>,
		)
	})

	test('change input', () => {
		const input: HTMLInputElement = screen.getByRole('textbox')
		fireEvent.change(input, { target: { value: 'Hello' } })
		expect(input.value).toBe('Hello')
	})

	test('submit form', () => {
		const input: HTMLInputElement = screen.getByRole('textbox')
		fireEvent.change(input, { target: { value: 'Hello' } })
		expect(input.value).toBe('Hello')

		// const button = screen.getByRole('button')
		// fireEvent.click(button)
		// expect(input.value).toBe('')
	})
})
