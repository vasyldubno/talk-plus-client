import { UserItem } from '../UserItem/UserItem'
import { Button, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { ChatService } from '@/services/chatService'
import { IChat, IUser } from '@/types/types'
import { SearchInput } from '@/ui/SearchInput/SearchInput'
import { getExistedMembers } from '@/utils/getExistedMember'

interface ModalAddNewUserProps {
	isOpen: boolean
	onClose: () => void
	chat: IChat
}

export const ModalAddNewUser: FC<ModalAddNewUserProps> = ({
	isOpen,
	onClose,
	chat,
}) => {
	const [users, setUsers] = useState<IUser[]>([])
	const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
	const [existedMembers, setExistedMembers] = useState<any[]>([])

	useEffect(() => {
		if (isOpen) {
			getExistedMembers({ chat, setState: setExistedMembers })
		}
	}, [isOpen])

	const searchUsers = async (username: string) => {
		const responseUsers = await supabase
			.from('users')
			.select()
			.ilike('username', `%${username}%`)

		if (responseUsers.data) {
			responseUsers.data.forEach(async (responseUser) => {
				const isExist = existedMembers.includes(responseUser.username)

				if (!isExist) {
					setUsers((prev) => [
						...prev,
						{
							id: responseUser.id,
							profile: {
								firstName: responseUser.firstName,
								avatar: responseUser.avatar,
							},
							username: responseUser.username,
						},
					])
				}
			})
		}
	}

	const handleAddNewMemebers = async () => {
		selectedUsers.forEach(async (selectedUser) => {
			const responseAddMember = await ChatService.addMember(
				selectedUser.id,
				chat.id,
			)

			if (!responseAddMember?.error) {
				onClose()
			}
		})
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				w="max-content"
				height="80vh"
				p={5}
				backgroundColor="white"
				boxShadow="none"
				marginTop="10px"
			>
				<SearchInput
					setUsers={setUsers}
					chatId={chat.id}
					onChange={searchUsers}
				/>
				{users &&
					users.map((user) => (
						<UserItem
							user={user}
							key={user.id}
							setSelectedUsers={setSelectedUsers}
						/>
					))}
				<Button className="mt-5" onClick={handleAddNewMemebers}>
					Add
				</Button>
			</ModalContent>
		</Modal>
	)
}
