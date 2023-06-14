import { useContext } from 'react'
import { UserContext } from '@/context/userContext'

export const useStore = () => {
	return useContext(UserContext)
}
