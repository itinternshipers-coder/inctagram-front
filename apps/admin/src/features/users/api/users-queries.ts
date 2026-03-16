import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers($input: UsersListInput) {
    users(input: $input) {
      items {
        id
        username
        profileLink
        email
        isBanned
        banReason
        bannedAt
        dataAdded
        avatarUrl
      }
      page
      pageSize
      totalCount
      totalPages
    }
  }
`
