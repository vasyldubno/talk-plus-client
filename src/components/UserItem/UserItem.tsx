import { Box, Checkbox, Image, Text } from '@chakra-ui/react'
import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { UserIcon } from '@/icons/UserIcon'
import { IUser } from '@/types/types'

interface UserItemProps {
	user: IUser
	setSelectedUsers: Dispatch<SetStateAction<IUser[] | null>>
}

export const UserItem: FC<UserItemProps> = ({ user, setSelectedUsers }) => {
	const handleCheckedUser = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedUsers((prev) => {
				if (prev !== null) {
					return [...prev, user]
				}
				return [user]
			})
		} else {
			setSelectedUsers((prev) => {
				if (prev !== null) {
					return prev.filter((prevUser) => prevUser.username !== user.username)
				}
				return null
			})
		}
	}

	return (
		<Box className="flex h-7 gap-3 my-1">
			<Checkbox onChange={handleCheckedUser} />
			{user.profile?.avatar ? (
				<Image
					src={user.profile?.avatar}
					w="auto"
					h="full"
					className="rounded-full"
				/>
			) : (
				<Box className="h-7 w-7 p-[6px] bg-slate-400 rounded-full">
					<UserIcon height="full" width="full" />
				</Box>
			)}
			<Text>{user.username}</Text>
		</Box>
	)
}
