'use client'

import { BlockIcon, MoreHorizontalOutlineIcon, Typography } from '@inctagram/ui'
import { User, SortDirection } from '../model/types'
import s from './UsersTable.module.css'

type UsersTableProps = {
  users: User[]
  sortDirection: SortDirection
  onSort: () => void
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function UsersTable({ users, sortDirection, onSort }: UsersTableProps) {
  const sortArrow = sortDirection === 'asc' ? ' ↑' : sortDirection === 'desc' ? ' ↓' : ''

  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.th}>
              <Typography variant="bold_text_14" as="span">
                User ID
              </Typography>
            </th>
            <th className={`${s.th} ${s.sortable}`} onClick={onSort}>
              <Typography variant="bold_text_14" as="span">
                Profile link{sortArrow}
              </Typography>
            </th>
            <th className={s.th}>
              <Typography variant="bold_text_14" as="span">
                Username
              </Typography>
            </th>
            <th className={s.th}>
              <Typography variant="bold_text_14" as="span">
                Date added
              </Typography>
            </th>
            <th className={s.th} />
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className={s.row}>
              <td className={s.td}>
                <div className={s.userIdCell}>
                  {user.isBanned && <BlockIcon size={20} className={s.blockIcon} />}
                  <Typography variant="regular_text_14" as="span">
                    {user.id}
                  </Typography>
                </div>
              </td>
              <td className={s.td}>
                <Typography variant="regular_text_14" as="span">
                  {user.profileLink}
                </Typography>
              </td>
              <td className={s.td}>
                <Typography variant="regular_text_14" as="span">
                  {user.username}
                </Typography>
              </td>
              <td className={s.td}>
                <Typography variant="regular_text_14" as="span">
                  {formatDate(user.dataAdded)}
                </Typography>
              </td>
              <td className={s.td}>
                <button className={s.moreButton}>
                  <MoreHorizontalOutlineIcon size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
