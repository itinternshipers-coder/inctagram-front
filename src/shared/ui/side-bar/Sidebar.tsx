'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookmarkIcon,
  BookmarkOutlineIcon,
  HomeIcon,
  HomeOutlineIcon,
  LogOutOutlineIcon,
  MessageCircleIcon,
  MessageCircleOutlineIcon,
  PersonIcon,
  PersonOutlineIcon,
  PlusSquareIcon,
  PlusSquareOutlineIcon,
  SearchOutlineIcon,
  TrendingUpOutlineIcon,
} from '@/shared/icons/svgComponents'
import s from './Sidebar.module.scss'

const ROUTES = {
  feed: '/feed',
  plus: '/plus',
  profile: '/profile',
  message: '/message',
  search: '/search',
  statistics: '/statistics',
  favorites: '/favorites',
  logout: '/logout',
}

const ACTIVE_COLOR = '#397DF6'

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <div className={s.sidebar}>
      <div className={s.mainSection}>
        <Link href={ROUTES.feed} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.feed) ? <HomeIcon color={ACTIVE_COLOR} /> : <HomeOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.feed) ? s.active : ''}`}>Feed</span>
        </Link>

        <Link href={ROUTES.plus} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.plus) ? <PlusSquareIcon color={ACTIVE_COLOR} /> : <PlusSquareOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.plus) ? s.active : ''}`}>Create</span>
        </Link>

        <Link href={ROUTES.profile} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.profile) ? <PersonIcon color={ACTIVE_COLOR} /> : <PersonOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.profile) ? s.active : ''}`}>My Profile</span>
        </Link>

        <Link href={ROUTES.message} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.message) ? <MessageCircleIcon color={ACTIVE_COLOR} /> : <MessageCircleOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.message) ? s.active : ''}`}>Messenger</span>
        </Link>

        <Link href={ROUTES.search} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.search) ? <SearchOutlineIcon color={ACTIVE_COLOR} /> : <SearchOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.search) ? s.active : ''}`}>Search</span>
        </Link>
      </div>

      <div className={s.additionalSection}>
        <Link href={ROUTES.statistics} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.statistics) ? <TrendingUpOutlineIcon color={ACTIVE_COLOR} /> : <TrendingUpOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.statistics) ? s.active : ''}`}>Statistics</span>
        </Link>

        <Link href={ROUTES.favorites} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.favorites) ? <BookmarkIcon color={ACTIVE_COLOR} /> : <BookmarkOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.favorites) ? s.active : ''}`}>Favorites</span>
        </Link>
      </div>

      <div className={s.logoutSection}>
        <Link href={ROUTES.logout} className={s.sidebarItem}>
          <span className={s.iconWrapper}>
            {isActive(ROUTES.logout) ? <LogOutOutlineIcon color={ACTIVE_COLOR} /> : <LogOutOutlineIcon />}
          </span>
          <span className={`${s.label} ${isActive(ROUTES.logout) ? s.active : ''}`}>Log Out</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
