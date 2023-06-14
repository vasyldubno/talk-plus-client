import { createContext } from 'react'
import { UserStore } from '@/store/userStore'

export const UserContext = createContext<UserStore>(new UserStore())
