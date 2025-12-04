import { Typography } from '@/shared/ui/Typography/Typography'
import s from './RegisteredUsers.module.scss'

export type RegisteredUsersProps = {
  count: number
}

export function RegisteredUsers({ count }: RegisteredUsersProps) {
  return (
    <div className={s.registeredUsers}>
      <Typography variant="h3">Registered users:</Typography>
      <div className={s.digits}>
        {String(count)
          .padStart(6, '0')
          .split('')
          .map((n, i) => (
            <span key={i} className={s.digit}>
              {n}
            </span>
          ))}
      </div>
    </div>
  )
}
