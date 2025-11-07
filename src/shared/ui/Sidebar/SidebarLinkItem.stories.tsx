import { useState } from 'react'
import SidebarLinkItem from './SidebarLinkItem'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useRouter } from 'next/router'
import s from './Sidebar.module.scss'

import {
  PlusSquareIcon,
  PlusSquareOutlineIcon,
  PersonIcon,
  PersonOutlineIcon,
  MessageCircleIcon,
  MessageCircleOutlineIcon,
  SearchOutlineIcon,
  TrendingUpOutlineIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  HomeIcon,
  HomeOutlineIcon,
  LogOutOutlineIcon,
} from '@/shared/icons/svgComponents'

const meta: Meta<typeof SidebarLinkItem> = {
  title: 'Components/SidebarLinkItem',
  component: SidebarLinkItem,
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof SidebarLinkItem>

const SidebarTemplateUser = ({
  activeHref,
  disabledHref,
  enableHover = false,
}: {
  activeHref?: string
  disabledHref?: string
  enableHover?: boolean
}) => {
  const [currentActive, setCurrentActive] = useState<string | null>(activeHref || null)
  const [hovered, setHovered] = useState<string | null>(null)
  const router = useRouter()

  const handleClick = (href: string) => {
    setCurrentActive(href)
    console.log(`${href} clicked`)
  }

  const getItemClass = (href: string) => {
    const isActive = currentActive === href
    const isDisabled = disabledHref === href
    const isHovered = enableHover && hovered === href
    return `${s.sidebarItem} ${isActive ? s.active : ''} ${isDisabled ? s.disabled : ''} ${isHovered ? s.hovered : ''}`
  }

  return (
    <div className={s.sidebar}>
      <div className={s.mainSection}>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/feed"
            label="Feed"
            ActiveIcon={<HomeIcon />}
            InactiveIcon={<HomeOutlineIcon />}
            isActive={currentActive === '/feed'}
            disabled={disabledHref === '/feed'}
            className={getItemClass('/feed')}
            onClick={() => handleClick('/feed')}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/plus"
            label="Create"
            ActiveIcon={<PlusSquareIcon />}
            InactiveIcon={<PlusSquareOutlineIcon />}
            isActive={currentActive === '/plus'}
            disabled={disabledHref === '/plus'}
            className={getItemClass('/plus')}
            onClick={() => handleClick('/plus')}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/profile"
            label="My Profile"
            ActiveIcon={<PersonIcon />}
            InactiveIcon={<PersonOutlineIcon />}
            isActive={currentActive === '/profile'}
            disabled={disabledHref === '/profile'}
            className={getItemClass('/profile')}
            onClick={() => handleClick('/profile')}
          />
        </div>
      </div>
      <div className={s.divider}></div>
      <div className={s.additionalSection}>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/message"
            label="Messenger"
            ActiveIcon={<MessageCircleIcon />}
            InactiveIcon={<MessageCircleOutlineIcon />}
            isActive={currentActive === '/message'}
            disabled={disabledHref === '/message'}
            className={getItemClass('/message')}
            onClick={() => handleClick('/message')}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/search"
            label="Search"
            ActiveIcon={<SearchOutlineIcon />}
            InactiveIcon={<SearchOutlineIcon />}
            isActive={currentActive === '/search'}
            disabled={disabledHref === '/search'}
            className={getItemClass('/search')}
            onClick={() => handleClick('/search')}
          />
        </div>
      </div>
      <div className={s.divider}></div>
      <div className={s.additionalSection}>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/statistics"
            label="Statistics"
            ActiveIcon={<TrendingUpOutlineIcon />}
            InactiveIcon={<TrendingUpOutlineIcon />}
            isActive={currentActive === '/statistics'}
            disabled={disabledHref === '/statistics'}
            className={getItemClass('/statistics')}
            onClick={() => handleClick('/statistics')}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href="/favorites"
            label="Favorites"
            ActiveIcon={<BookmarkIcon />}
            InactiveIcon={<BookmarkOutlineIcon />}
            isActive={currentActive === '/favorites'}
            disabled={disabledHref === '/favorites'}
            className={getItemClass('/favorites')}
            onClick={() => handleClick('/favorites')}
          />
        </div>
      </div>
      <div className={s.logoutSection}>
        <button type="button" className={`${s.sidebarItem} ${s.logoutButton}`} onClick={() => router.push('/login')}>
          <span className={s.iconWrapper}>
            <LogOutOutlineIcon />
          </span>
          <span className={s.label}>Log Out</span>
        </button>
      </div>
    </div>
  )
}

export const Active: Story = { render: () => <SidebarTemplateUser /> }
export const Disabled: Story = {
  render: () => <SidebarTemplateUser disabledHref="/feed" activeHref="" />,
}
export const Hover: Story = { render: () => <SidebarTemplateUser enableHover /> }
export const Tab: Story = { render: () => <SidebarTemplateUser activeHref="" enableHover /> }
