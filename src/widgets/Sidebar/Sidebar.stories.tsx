import React from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import s from './Sidebar.module.scss'

import {
  BookmarkIcon,
  CreditCardIcon,
  HomeIcon,
  ImageIcon,
  LogOutOutlineIcon,
  MessageCircleIcon,
  PersonIcon,
  PlusSquareIcon,
  SearchOutlineIcon,
  TrendingUpOutlineIcon,
} from '@/shared/icons/svgComponents'

const SidebarMock = ({ role }: { role: 'user' | 'admin' }) => {
  return (
    <div className={`${s.sidebar} ${role === 'admin' ? s.admin : ''}`}>
      {role === 'admin' ? (
        <div className={s.mainSection}>
          <div className={s.sidebarItem}>
            <PersonIcon className={s.iconWrapper} /> <span className={s.label}>Users list</span>
          </div>
          <div className={s.sidebarItem}>
            <TrendingUpOutlineIcon className={s.iconWrapper} /> <span className={s.label}>Statistics</span>
          </div>
          <div className={s.sidebarItem}>
            <CreditCardIcon className={s.iconWrapper} /> <span className={s.label}>Payments list</span>
          </div>
          <div className={s.sidebarItem}>
            <ImageIcon className={s.iconWrapper} /> <span className={s.label}>Posts list</span>
          </div>
        </div>
      ) : (
        <>
          <div className={s.mainSection}>
            <div className={s.sidebarItem}>
              <HomeIcon className={s.iconWrapper} /> <span className={s.label}>Feed</span>
            </div>
            <div className={s.sidebarItem}>
              <PlusSquareIcon className={s.iconWrapper} /> <span className={s.label}>Create</span>
            </div>
            <div className={s.sidebarItem}>
              <PersonIcon className={s.iconWrapper} /> <span className={s.label}>My Profile</span>
            </div>
            <div className={s.sidebarItem}>
              <MessageCircleIcon className={s.iconWrapper} /> <span className={s.label}>Messenger</span>
            </div>
            <div className={s.sidebarItem}>
              <SearchOutlineIcon className={s.iconWrapper} /> <span className={s.label}>Search</span>
            </div>
          </div>

          <div className={s.additionalSection}>
            <div className={s.sidebarItem}>
              <TrendingUpOutlineIcon className={s.iconWrapper} />
              <span className={s.label}>Statistics</span>
            </div>
            <div className={s.sidebarItem}>
              <BookmarkIcon className={s.iconWrapper} />
              <span className={s.label}>Favorites</span>
            </div>
          </div>
          <div className={s.logoutSection}>
            <div className={`${s.sidebarItem} ${s.logoutButton}`}>
              <LogOutOutlineIcon className={s.iconWrapper} />
              <span className={s.label}>Log Out</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const meta: Meta<typeof SidebarMock> = {
  title: 'Widgets/Sidebar',
  component: SidebarMock,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof SidebarMock>

export const UserSidebar: Story = {
  args: {
    role: 'user',
  },
}

export const AdminSidebar: Story = {
  args: {
    role: 'admin',
  },
}
