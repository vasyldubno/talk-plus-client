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
import { UserService } from '@/services/userService'
import { IUser } from '@/types/types'

interface SearchInputProps {
	setUsers: Dispatch<SetStateAction<IUser[] | null>>
	chatId: number
}

export const SearchInput: FC<SearchInputProps> = ({ setUsers, chatId }) => {
	const [searchValue, setSearchValue] = useState('')
	const debouncedValue = useDebounce(searchValue)
	const [subscribers, setSubscribers] = useState<IUser[] | null>(null)

	const handleChangleValue = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	useQuery(
		'subscribers',
		async () => UserService.retrieveSubscribers(chatId.toString()),
		{
			onSuccess(data) {
				setSubscribers(data)
			},
		},
	)

	useEffect(() => {
		if (debouncedValue.length >= 3) {
			UserService.searchUser(debouncedValue).then((res) => {
				return setUsers(
					res.filter((r) => {
						const isExist = subscribers?.some((subs) => subs.id === r.id)
						if (isExist) {
							return null
						}
						return r
					}),
				)
			})
		}
	}, [debouncedValue, setUsers, subscribers])

	return (
		<Input placeholder="Search by username" onChange={handleChangleValue} />
	)
}
