'use client'
import { Me } from '@/features/auth/model/types'
import { createContext } from 'react'

export type AuthContextType = {
  user: Me['response'] | null
  isLoggedIn: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: false,
})
