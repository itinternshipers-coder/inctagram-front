'use client'

import { useAuth } from '@/features/auth/lib/use-auth'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { ROUTES } from '@/shared/config/routes'
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
import { Modal } from '@/shared/ui/Modal/Modal'
import { usePathname } from 'next/navigation'
import React, { useContext, useState } from 'react'
import s from './Sidebar.module.scss'
import SidebarLinkItem from './SidebarLinkItem'
import '@/styles/base/_mixins.scss'

type SidebarProps = {
  role: 'user' | 'admin'
}

export const MOCK_ROUTES = {
  plus: '/plus',
  message: '/message',
  search: '/search',
  statistics: '/statistics',
  favorites: '/favorites',
  usersList: '/userslist',
  paymentsList: '/paymentslist',
  postsList: '/postslist',
} as const

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { user } = useContext(AuthContext)
  const email = user?.email
  const [openModal, setOpenModal] = useState(false)
  const [clickedLink, setClickedLink] = useState<string | null>(null)

  const handleClick = (href: string) => {
    if (href === pathname) {
      return
    }
    setClickedLink(href)
    setTimeout(() => setClickedLink(null), 1000)
  }

  const isActive = (href: string) => pathname === href
  const isDisabled = (href: string) => clickedLink === href

  const openCloseModal = () => {
    setOpenModal(!openModal)
  }

  const handleLogout = async () => {
    setOpenModal(!openModal)
    try {
      await logout()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={`${s.sidebar} ${role === 'admin' ? s.admin : ''}`}>
      {role === 'admin' ? (
        <div className={s.mainSection}>
          <SidebarLinkItem
            href={MOCK_ROUTES.usersList}
            label="Users list"
            ActiveIcon={<PersonIcon />}
            InactiveIcon={<PersonOutlineIcon />}
            isActive={isActive(MOCK_ROUTES.usersList)}
            disabled={isDisabled(MOCK_ROUTES.usersList)}
            onClick={() => handleClick(MOCK_ROUTES.usersList)}
          />
          <SidebarLinkItem
            href={MOCK_ROUTES.statistics}
            label="Statistics"
            ActiveIcon={<TrendingUpOutlineIcon />}
            InactiveIcon={<TrendingUpOutlineIcon />}
            isActive={isActive(MOCK_ROUTES.statistics)}
            disabled={isDisabled(MOCK_ROUTES.statistics)}
            onClick={() => handleClick(MOCK_ROUTES.statistics)}
          />

          <SidebarLinkItem
            href={MOCK_ROUTES.paymentsList}
            label="Payments list"
            ActiveIcon={<CreditCardIcon />}
            InactiveIcon={<CreditCardOutlineIcon />}
            isActive={isActive(MOCK_ROUTES.paymentsList)}
            disabled={isDisabled(MOCK_ROUTES.paymentsList)}
            onClick={() => handleClick(MOCK_ROUTES.paymentsList)}
          />

          <SidebarLinkItem
            href={MOCK_ROUTES.postsList}
            label="Posts list"
            ActiveIcon={<ImageIcon />}
            InactiveIcon={<ImageOutlineIcon />}
            isActive={isActive(MOCK_ROUTES.postsList)}
            disabled={isDisabled(MOCK_ROUTES.postsList)}
            onClick={() => handleClick(MOCK_ROUTES.postsList)}
          />
        </div>
      ) : (
        <>
          <div className={s.mainSection}>
            <SidebarLinkItem
              href={ROUTES.PUBLIC.HOME}
              label="Feed"
              ActiveIcon={<HomeIcon className="" />}
              InactiveIcon={<HomeOutlineIcon />}
              isActive={isActive(ROUTES.PUBLIC.HOME)}
              disabled={isDisabled(ROUTES.PUBLIC.HOME)}
              onClick={() => handleClick(ROUTES.PUBLIC.HOME)}
            />
            <SidebarLinkItem
              href={ROUTES.MODALS.CREATE_POST}
              label="Create"
              ActiveIcon={<PlusSquareIcon />}
              InactiveIcon={<PlusSquareOutlineIcon />}
              isActive={isActive(ROUTES.MODALS.CREATE_POST)}
              disabled={isDisabled(MOCK_ROUTES.plus)}
              onClick={() => handleClick(ROUTES.MODALS.CREATE_POST)}
            />
            <SidebarLinkItem
              href={ROUTES.PROTECTED.PROFILE}
              label="My Profile"
              ActiveIcon={<PersonIcon />}
              InactiveIcon={<PersonOutlineIcon />}
              isActive={isActive(ROUTES.PROTECTED.PROFILE)}
              disabled={isDisabled(ROUTES.PROTECTED.PROFILE)}
              onClick={() => handleClick(ROUTES.PROTECTED.PROFILE)}
            />
            <SidebarLinkItem
              href={MOCK_ROUTES.message}
              label="Messenger"
              ActiveIcon={<MessageCircleIcon />}
              InactiveIcon={<MessageCircleOutlineIcon />}
              isActive={isActive(MOCK_ROUTES.message)}
              disabled={isDisabled(MOCK_ROUTES.message)}
              onClick={() => handleClick(MOCK_ROUTES.message)}
            />
            <SidebarLinkItem
              href={MOCK_ROUTES.search}
              label="Search"
              ActiveIcon={<SearchOutlineIcon />}
              InactiveIcon={<SearchOutlineIcon />}
              isActive={isActive(MOCK_ROUTES.search)}
              disabled={isDisabled(MOCK_ROUTES.search)}
              onClick={() => handleClick(MOCK_ROUTES.search)}
            />
          </div>

          <div className={s.additionalSection}>
            <SidebarLinkItem
              href={MOCK_ROUTES.statistics}
              label="Statistics"
              ActiveIcon={<TrendingUpOutlineIcon />}
              InactiveIcon={<TrendingUpOutlineIcon />}
              isActive={isActive(MOCK_ROUTES.statistics)}
              disabled={isDisabled(MOCK_ROUTES.statistics)}
              onClick={() => handleClick(MOCK_ROUTES.statistics)}
            />
            <SidebarLinkItem
              href={MOCK_ROUTES.favorites}
              label="Favorites"
              ActiveIcon={<BookmarkIcon />}
              InactiveIcon={<BookmarkOutlineIcon />}
              isActive={isActive(MOCK_ROUTES.favorites)}
              disabled={isDisabled(MOCK_ROUTES.favorites)}
              onClick={() => handleClick(MOCK_ROUTES.favorites)}
            />
          </div>

          <div className={s.logoutSection}>
            <button type="button" className={`${s.sidebarItem} ${s.logoutButton}`} onClick={openCloseModal}>
              <span className={s.iconWrapper}>
                <LogOutOutlineIcon />
              </span>
              <span className={s.label}>Log Out</span>
            </button>
          </div>
          {openModal && (
            <Modal
              open={openModal}
              onOpenChange={openCloseModal}
              title={'Log Out'}
              message={`Are you really want to log out of your account "${email}"?`}
              confirmMode={true}
              buttonText={'No'}
              onAction={openCloseModal}
              cancelButtonText={'Yes'}
              onCancel={handleLogout}
              style={{ maxWidth: '478px', width: '100%' }}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Sidebar
