import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'

export const usePostAuthor = (authorId: string, username?: string) => {
  const { data: profileData } = useGetProfileQuery(authorId)
  const { user } = useAuthContext()

  const author = {
    id: authorId,
    username: username ?? 'NoName',
    avatarUrl: profileData?.avatar?.[1]?.url ?? '',
  }

  const isAuthor = user?.userId === authorId

  return { author, isAuthor }
}
