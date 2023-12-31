import { Input } from '@chakra-ui/react'
import {
	ChangeEvent,
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState,
} from 'react'
import { useQuery } from 'react-query'
import { useDebounce } from '@/hooks/useDebounce'
import { IUser } from '@/types/types'

interface SearchInputProps {
	setUsers: Dispatch<SetStateAction<IUser[]>>
	chatId: string
	onChange: (username: string) => Promise<void>
}

export const SearchInput: FC<SearchInputProps> = ({
	setUsers,
	chatId,
	onChange,
}) => {
	const [searchValue, setSearchValue] = useState('')
	const debouncedValue = useDebounce(searchValue)
	const [subscribers, setSubscribers] = useState<IUser[] | null>(null)

	const handleChangleValue = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	useEffect(() => {
		if (debouncedValue.length >= 3) {
			onChange(debouncedValue)
		} else {
			setUsers([])
		}
	}, [debouncedValue])

	return (
		<Input
			placeholder="Search by username"
			onChange={handleChangleValue}
			value={searchValue}
		/>
	)
}
