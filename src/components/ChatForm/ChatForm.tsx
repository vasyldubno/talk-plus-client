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
	Dispatch,
	FC,
	FormEvent,
	KeyboardEvent,
	SetStateAction,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from 'react'
import { COLORS } from '@/config/colors'
import { useStore } from '@/hooks/useStore'
import { SendIcon } from '@/icons/SendIcon'
import { ChatService } from '@/services/chatService'
import { IChat } from '@/types/types'

interface Props {
	chat: IChat
	className?: string
	setUpdateRef: Dispatch<SetStateAction<boolean>>
}

export const ChatForm = forwardRef<HTMLDivElement, Props>(
	({ chat, className, setUpdateRef }, lastRef) => {
		const [value, setValue] = useState('')
		const [isTouchScreen, setIsTouchScreen] = useState(false)

		const store = useStore()

		const inputRef = useRef<HTMLInputElement>(null)

		const handleClick = async () => {
			if (value) {
				ChatService.addNewMessage({
					content: value,
					chatId: chat.id,
					userId: store.getUserId(),
					afterSubmit: () => {
						setValue('')
						setUpdateRef(true)
					},
				})
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

		// console.log(lastRef)

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
	},
)

ChatForm.displayName = 'ChatForm'
