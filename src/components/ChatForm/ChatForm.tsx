import s from './ChatForm.module.scss'
import {
	Box,
	Button,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react'
import clsx from 'clsx'
import {
	ChangeEvent,
	FC,
	FormEvent,
	KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from 'react'
import { COLORS } from '@/config/colors'
import { useStore } from '@/hooks/useStore'
import { SendIcon } from '@/icons/SendIcon'
import { ISocket } from '@/types/types'

interface IChatFormProps {
	socket: ISocket | null
	room: string
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
	const [isTouchScreen, setIsTouchScreen] = useState(false)

	const store = useStore()
	const userId = store.getUserId()

	const inputRef = useRef<HTMLInputElement>(null)

	const handleClick = () => {
		if (socket && userId) {
			socket.emit('message', {
				message: value,
				room,
				roomId,
				userId,
				type: typeChat,
			})
			setValue('')
		}

		if (isTouchScreen) {
			inputRef.current?.blur()
		} else {
			inputRef.current?.focus()
		}
	}

	const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleClick()
		}
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		handleClick()
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	useEffect(() => {
		if (typeof window !== undefined) {
			window.addEventListener(
				'touchstart',
				function handleTouch() {
					setIsTouchScreen(true)
					window.removeEventListener('touchstart', handleTouch, false)
				},
				false,
			)
		}
	}, [])

	return (
		<Box className={clsx('flex  gap-2 bg-[#1f2121] mt-3 px-3', className)}>
			<form className={s.form} onSubmit={handleSubmit}>
				<InputGroup>
					<Input
						ref={inputRef}
						className="text-white p-2"
						placeholder="Write message"
						onChange={handleChange}
						value={value}
					/>
					<InputRightElement>
						<Button
							padding={0}
							bg="transparent"
							rounded="full"
							minWidth="1.9rem"
							height="1.9rem"
							className={s.button}
							_hover={{
								bg: isTouchScreen ? 'transparent' : COLORS['purple-50'],
							}}
							transition="all 0.5s"
							type="submit"
						>
							<SendIcon size="1rem" className="cursor-pointer" />
						</Button>
					</InputRightElement>
				</InputGroup>
			</form>
		</Box>
	)
}
