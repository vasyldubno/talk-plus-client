import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react'
import { FC, useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface IBaseInputProps {
	register: UseFormRegister<any>
	errors: FieldError | undefined
	label: string
	name: string
	onChange?: () => void
}

export const PasswordInput: FC<IBaseInputProps> = ({
	errors,
	register,
	label,
	name,
	onChange,
}) => {
	const [show, setShow] = useState(false)
	const handleClick = () => {
		setShow(!show)
	}
	return (
		<FormControl isRequired isInvalid={!!errors}>
			<FormLabel>{label}</FormLabel>
			<InputGroup>
				<Input
					type={show ? 'text' : 'password'}
					{...register(name)}
					onChange={onChange}
				/>
				<InputRightElement width="4.5rem">
					<Button h="1.75rem" size="sm" onClick={handleClick}>
						{show ? 'Hide' : 'Show'}
					</Button>
				</InputRightElement>
			</InputGroup>
			{errors && <FormErrorMessage>{errors.message}</FormErrorMessage>}
		</FormControl>
	)
}
