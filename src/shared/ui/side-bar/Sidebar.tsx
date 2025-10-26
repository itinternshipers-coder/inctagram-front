'use client'

import Link from 'next/link'
import s from './sidebar.module.scss'
import { Icon } from '../icon/Icon'
import { usePathname } from 'next/navigation'

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const isActive = (href: string) => (pathname === href ? s.active : '')

  return (
    <div className={s.sidebar}>
      <div className={s.mainSection}>
        <Link href="/feed" className={`${s.sidebarItem} ${isActive('/feed')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="feed" width="24px" height="24px" />
          </span>
          <span className={s.label}>Feed</span>
        </Link>

        <Link href="/plus" className={`${s.sidebarItem} ${isActive('/plus')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="plus" width="24px" height="24px" />
          </span>
          <span className={s.label}>Create</span>
        </Link>

        <Link href="/profile" className={`${s.sidebarItem} ${isActive('/profile')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="profile" width="24px" height="24px" />
          </span>
          <span className={s.label}>My Profile</span>
        </Link>

        <Link href="/message" className={`${s.sidebarItem} ${isActive('/message')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="message" width="24px" height="24px" />
          </span>
          <span className={s.label}>Messenger</span>
        </Link>

        <Link href="/search" className={`${s.sidebarItem} ${isActive('/search')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="search" width="24px" height="24px" />
          </span>
          <span className={s.label}>Search</span>
        </Link>
      </div>

      <div className={s.additionalSection}>
        <Link href="/statistics" className={`${s.sidebarItem} ${isActive('/statistics')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="statistics" width="24px" height="24px" />
          </span>
          <span className={s.label}>Statistics</span>
        </Link>
        <Link href="/favorites" className={`${s.sidebarItem} ${isActive('/favorites')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="favorites" width="24px" height="24px" />
          </span>
          <span className={s.label}>Favorites</span>
        </Link>
      </div>

      <div className={s.logoutSection}>
        <Link href="/logout" className={`${s.sidebarItem} ${isActive('/logout')}`}>
          <span className={s.iconWrapper}>
            <Icon iconId="logout" width="24px" height="24px" />
          </span>
          <span className={s.label}>Log Out</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
