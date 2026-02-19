import { AuthContext, AuthContextType } from '@/features/auth/providers/auth-context'
import { ReactNode } from 'react'

export const MockAuthProvider = ({ children, value }: { children: ReactNode; value: AuthContextType }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
)
