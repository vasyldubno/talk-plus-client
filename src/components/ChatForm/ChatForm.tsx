import {
	Box,
	Button,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react'
import clsx from 'clsx'
import { ChangeEvent, FC, useState } from 'react'
import { COLORS } from '@/config/colors'
import { useStore } from '@/hooks/useStore'
import { SendIcon } from '@/icons/SendIcon'
import { ISocket } from '@/types/types'

interface IChatFormProps {
	socket: ISocket | null
	room: string | undefined
	roomId: number
	typeChat: 'chat' | 'group' | undefined
	className?: string
	afterSubmit: () => void
}

export const ChatForm: FC<IChatFormProps> = ({
	socket,
	room,
	roomId,
	className,
	typeChat,
	afterSubmit,
}) => {
	const [value, setValue] = useState('')

	const store = useStore()
	const userId = store.getUserId()

	const handleClick = () => {
		if (socket) {
			const response = socket.emit('message', {
				message: value,
				room,
				roomId,
				userId,
				type: typeChat,
			})
			setValue('')
			if (response) {
				afterSubmit()
			}
		}
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	return (
		<Box className={clsx('flex  gap-2 bg-[#1f2121] mt-3 px-3', className)}>
			<InputGroup>
				<Input
					className="text-white p-2"
					placeholder="Write message"
					onChange={handleChange}
					value={value}
					onKeyUp={(e) => {
						if (e.key === 'Enter') {
							handleClick()
						}
					}}
				/>
				<InputRightElement>
					<Button
						padding={0}
						bg="transparent"
						rounded="full"
						minWidth="1.9rem"
						height="1.9rem"
						className="hover:rounded-full"
						_hover={{ bg: COLORS['purple-50'] }}
						transition="all 0.5s"
						onClick={handleClick}
					>
						<SendIcon size="1rem" className="cursor-pointer" />
					</Button>
				</InputRightElement>
			</InputGroup>
		</Box>
	)
}
