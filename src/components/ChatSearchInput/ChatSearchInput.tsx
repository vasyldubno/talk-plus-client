import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { CloseIcon } from '@/icons/CloseIcon'

interface ChatSearchInputProps {
	value: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	setValue: Dispatch<SetStateAction<string>>
}

export const ChatSearchInput: FC<ChatSearchInputProps> = ({
	value,
	onChange,
	setValue,
}) => {
	return (
		<InputGroup position="relative">
			<Input
				placeholder="Search"
				value={value}
				onChange={onChange}
				className="text-white"
			/>
			{value && (
				<InputRightElement height="full" width="1.2rem" className="mr-2">
					<CloseIcon
						size="1.2rem"
						onClick={() => setValue('')}
						className="cursor-pointer"
					/>
				</InputRightElement>
			)}
		</InputGroup>
	)
}
