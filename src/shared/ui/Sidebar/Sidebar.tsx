'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookmarkIcon,
  BookmarkOutlineIcon,
  CreditCardIcon,
  CreditCardOutlineIcon,
  HomeIcon,
  HomeOutlineIcon,
  ImageIcon,
  ImageOutlineIcon,
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
import SidebarLinkItem from './SidebarLinkItem'
import '../../../styles/base/_mixins.scss'
import s from './Sidebar.module.scss'

type SidebarProps = {
  role: 'user' | 'admin'
}

const ROUTES = {
  feed: '/feed',
  plus: '/plus',
  profile: '/profile',
  message: '/message',
  search: '/search',
  statistics: '/statistics',
  favorites: '/favorites',
  logout: '/logout',
  usersList: '/userslist',
  paymentsList: '/paymentslist',
  postsList: '/postslist',
} as const

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const [disabledLink, setDisabledLink] = useState<string | null>(null)

  useEffect(() => {
    setDisabledLink(null)
  }, [pathname])

  const handleClick = async (href: string) => {
    if (href !== pathname) {
      setDisabledLink(href)
    }
  }
  const isActive = (href: string) => pathname === href

  return (
    <div className={`${s.sidebar} ${role === 'admin' ? s.admin : ''}`}>
      {role === 'admin' ? (
        <div className={s.mainSection}>
          <SidebarLinkItem
            href={ROUTES.usersList}
            label="Users list"
            ActiveIcon={<PersonIcon />}
            InactiveIcon={<PersonOutlineIcon />}
            isActive={isActive(ROUTES.usersList)}
            disabled={disabledLink === ROUTES.usersList}
            onClick={() => handleClick(ROUTES.usersList)}
          />
          <SidebarLinkItem
            href={ROUTES.statistics}
            label="Statistics"
            ActiveIcon={<TrendingUpOutlineIcon />}
            InactiveIcon={<TrendingUpOutlineIcon />}
            isActive={isActive(ROUTES.statistics)}
            disabled={disabledLink === ROUTES.statistics}
            onClick={() => handleClick(ROUTES.statistics)}
          />

          <SidebarLinkItem
            href={ROUTES.paymentsList}
            label="Payments list"
            ActiveIcon={<CreditCardIcon />}
            InactiveIcon={<CreditCardOutlineIcon />}
            isActive={isActive(ROUTES.paymentsList)}
            disabled={disabledLink === ROUTES.paymentsList}
            onClick={() => handleClick(ROUTES.paymentsList)}
          />

          <SidebarLinkItem
            href={ROUTES.postsList}
            label="Posts list"
            ActiveIcon={<ImageIcon />}
            InactiveIcon={<ImageOutlineIcon />}
            isActive={isActive(ROUTES.postsList)}
            disabled={disabledLink === ROUTES.postsList}
            onClick={() => handleClick(ROUTES.postsList)}
          />
        </div>
      ) : (
        <>
          <div className={s.mainSection}>
            <SidebarLinkItem
              href={ROUTES.feed}
              label="Feed"
              ActiveIcon={<HomeIcon className="" />}
              InactiveIcon={<HomeOutlineIcon />}
              isActive={isActive(ROUTES.feed)}
              disabled={disabledLink === ROUTES.feed}
              onClick={() => handleClick(ROUTES.feed)}
            />
            <SidebarLinkItem
              href={ROUTES.plus}
              label="Create"
              ActiveIcon={<PlusSquareIcon />}
              InactiveIcon={<PlusSquareOutlineIcon />}
              isActive={isActive(ROUTES.plus)}
              disabled={disabledLink === ROUTES.plus}
              onClick={() => handleClick(ROUTES.plus)}
            />
            <SidebarLinkItem
              href={ROUTES.profile}
              label="My Profile"
              ActiveIcon={<PersonIcon />}
              InactiveIcon={<PersonOutlineIcon />}
              isActive={isActive(ROUTES.profile)}
              disabled={disabledLink === ROUTES.profile}
              onClick={() => handleClick(ROUTES.profile)}
            />
            <SidebarLinkItem
              href={ROUTES.message}
              label="Messenger"
              ActiveIcon={<MessageCircleIcon />}
              InactiveIcon={<MessageCircleOutlineIcon />}
              isActive={isActive(ROUTES.message)}
              disabled={disabledLink === ROUTES.message}
              onClick={() => handleClick(ROUTES.message)}
            />
            <SidebarLinkItem
              href={ROUTES.search}
              label="Search"
              ActiveIcon={<SearchOutlineIcon />}
              InactiveIcon={<SearchOutlineIcon />}
              isActive={isActive(ROUTES.search)}
              disabled={disabledLink === ROUTES.search}
              onClick={() => handleClick(ROUTES.search)}
            />
          </div>

          <div className={s.additionalSection}>
            <SidebarLinkItem
              href={ROUTES.statistics}
              label="Statistics"
              ActiveIcon={<TrendingUpOutlineIcon />}
              InactiveIcon={<TrendingUpOutlineIcon />}
              isActive={isActive(ROUTES.statistics)}
              disabled={disabledLink === ROUTES.statistics}
              onClick={() => handleClick(ROUTES.statistics)}
            />
            <SidebarLinkItem
              href={ROUTES.favorites}
              label="Favorites"
              ActiveIcon={<BookmarkIcon />}
              InactiveIcon={<BookmarkOutlineIcon />}
              isActive={isActive(ROUTES.favorites)}
              disabled={disabledLink === ROUTES.favorites}
              onClick={() => handleClick(ROUTES.favorites)}
            />
          </div>

          <div className={s.logoutSection}>
            <button
              type="button"
              className={`${s.sidebarItem} ${s.logoutButton}`}
              onClick={() => router.push('/login')}
            >
              <span className={s.iconWrapper}>
                <LogOutOutlineIcon />
              </span>
              <span className={s.label}>Log Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Sidebar
