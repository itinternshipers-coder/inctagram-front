import { useContext } from 'react'
import { AuthContext } from '../providers/auth-context'

export const useAuthContext = () => useContext(AuthContext)
