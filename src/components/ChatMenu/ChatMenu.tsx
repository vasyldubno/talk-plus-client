import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { FC } from 'react'
import { TiThMenu } from 'react-icons/ti'
import { useRouter } from 'next/router'
import { useStore } from '@/hooks/useStore'
import { GroupIcon } from '@/icons/GroupIcon'
import { LogoutIcon } from '@/icons/LogoutIcon'
import { SettingIcon } from '@/icons/SettingIcon'
import { AuthService } from '@/services/authService'

interface ChatMenuProps {
	onClickAddGroup: () => void
	onClickProfileSettings: () => void
}

export const ChatMenu: FC<ChatMenuProps> = ({
	onClickAddGroup,
	onClickProfileSettings,
}) => {
	const router = useRouter()
	const store = useStore()

	const handleLogout = () => {
		store.updateIsLogged(false)
		router.push('/')
		AuthService.logout()
	}

	return (
		<Menu>
			<MenuButton className="hover:bg-[var(--color-gray-50)] rounded-full px-2">
				<TiThMenu className="w-7 h-7 fill-[var(--color-gray)]" />
			</MenuButton>
			<MenuList>
				<MenuItem
					className="text-sm"
					paddingTop={1}
					paddingBottom={1}
					onClick={onClickAddGroup}
				>
					<GroupIcon height="1rem" width="1rem" />
					<p className="ml-3">Add Group</p>
				</MenuItem>
				<MenuItem
					className="text-sm"
					paddingTop={1}
					paddingBottom={1}
					onClick={onClickProfileSettings}
				>
					<SettingIcon height="1rem" width="1rem" />
					<p className="ml-3">Settings</p>
				</MenuItem>
				<MenuItem
					className="text-sm"
					paddingTop={1}
					paddingBottom={1}
					onClick={handleLogout}
				>
					<LogoutIcon height="1rem" width="1rem" fill="black" />
					<p className="ml-3">Logout</p>
				</MenuItem>
			</MenuList>
		</Menu>
	)
}
