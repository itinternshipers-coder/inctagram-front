import { useQuery } from '@apollo/client'
import { GET_USERS } from './users-queries'
import { UsersListInput, UsersListOutput, UserFilter, SortDirection } from '../model/types'
import { mockUsers } from '../model/mock-data'

// Переключить на false когда бэкенд починит GraphQL endpoint
const USE_MOCK_DATA = true

type UseUsersParams = {
  page: number
  pageSize: number
  search: string
  filter: UserFilter
  sortDirection: SortDirection
}

export function useUsers({ page, pageSize, search, filter, sortDirection }: UseUsersParams) {
  const input: UsersListInput = {
    page,
    pageSize,
    ...(search && { search }),
    ...(sortDirection && { sortBy: 'profileLink', sortDirection }),
    ...(filter === 'blocked' && { filterBanned: 'banned' }),
    ...(filter === 'not-blocked' && { filterBanned: 'unbanned' }),
  }

  const { data, loading, error } = useQuery<{ users: UsersListOutput }>(GET_USERS, {
    variables: { input },
    skip: USE_MOCK_DATA,
  })

  if (USE_MOCK_DATA) {
    let users = [...mockUsers]

    if (search) {
      const q = search.toLowerCase()
      users = users.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      )
    }

    if (filter === 'blocked') {
      users = users.filter((u) => u.isBanned)
    } else if (filter === 'not-blocked') {
      users = users.filter((u) => !u.isBanned)
    }

    if (sortDirection) {
      users.sort((a, b) => {
        const cmp = a.profileLink.localeCompare(b.profileLink)
        return sortDirection === 'asc' ? cmp : -cmp
      })
    }

    const totalCount = users.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const items = users.slice((page - 1) * pageSize, page * pageSize)

    return {
      users: items,
      page,
      pageSize,
      totalCount,
      totalPages,
      loading: false,
      error: undefined,
    }
  }

  return {
    users: data?.users.items ?? [],
    page: data?.users.page ?? 1,
    pageSize: data?.users.pageSize ?? pageSize,
    totalCount: data?.users.totalCount ?? 0,
    totalPages: data?.users.totalPages ?? 1,
    loading,
    error,
  }
}
