import { useMeQuery } from '@/features/auth/api/auth-api'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'

export const usePostAuthor = (authorId: string, username?: string) => {
  const { data: profileData } = useGetProfileQuery(authorId)
  const { data: me } = useMeQuery()

  const author = {
    id: authorId,
    username: username ?? 'NoName',
    avatarUrl: profileData?.avatar?.[1]?.url ?? '',
  }

  const isAuthor = me?.userId === authorId

  return { author, isAuthor }
}
