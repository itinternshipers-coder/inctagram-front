import { ROUTES } from '@/shared/config/routes'
import { MOCK_ROUTES } from '@/widgets/Sidebar/Sidebar'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import s from './Sidebar.module.scss'
import SidebarLinkItem from './SidebarLinkItem'

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

const meta: Meta<typeof SidebarLinkItem> = {
  title: 'Widgets/SidebarLinkItem',
  component: SidebarLinkItem,
  parameters: { layout: 'fullscreen' },
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
            href={ROUTES.PUBLIC.HOME}
            label="Feed"
            ActiveIcon={<HomeIcon />}
            InactiveIcon={<HomeOutlineIcon />}
            isActive={currentActive === ROUTES.PUBLIC.HOME}
            disabled={disabledHref === ROUTES.PUBLIC.HOME}
            className={getItemClass(ROUTES.PUBLIC.HOME)}
            onClick={() => handleClick(ROUTES.PUBLIC.HOME)}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href={MOCK_ROUTES.plus}
            label="Create"
            ActiveIcon={<PlusSquareIcon />}
            InactiveIcon={<PlusSquareOutlineIcon />}
            isActive={currentActive === MOCK_ROUTES.plus}
            disabled={disabledHref === MOCK_ROUTES.plus}
            className={getItemClass(MOCK_ROUTES.plus)}
            onClick={() => handleClick(MOCK_ROUTES.plus)}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href={ROUTES.PROTECTED.PROFILE}
            label="My Profile"
            ActiveIcon={<PersonIcon />}
            InactiveIcon={<PersonOutlineIcon />}
            isActive={currentActive === ROUTES.PROTECTED.PROFILE}
            disabled={disabledHref === ROUTES.PROTECTED.PROFILE}
            className={getItemClass(ROUTES.PROTECTED.PROFILE)}
            onClick={() => handleClick(ROUTES.PROTECTED.PROFILE)}
          />
        </div>
      </div>
      <div className={s.divider}></div>
      <div className={s.additionalSection}>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href={MOCK_ROUTES.message}
            label="Messenger"
            ActiveIcon={<MessageCircleIcon />}
            InactiveIcon={<MessageCircleOutlineIcon />}
            isActive={currentActive === MOCK_ROUTES.message}
            disabled={disabledHref === MOCK_ROUTES.message}
            className={getItemClass(MOCK_ROUTES.message)}
            onClick={() => handleClick(MOCK_ROUTES.message)}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href={MOCK_ROUTES.search}
            label="Search"
            ActiveIcon={<SearchOutlineIcon />}
            InactiveIcon={<SearchOutlineIcon />}
            isActive={currentActive === MOCK_ROUTES.search}
            disabled={disabledHref === MOCK_ROUTES.search}
            className={getItemClass(MOCK_ROUTES.search)}
            onClick={() => handleClick(MOCK_ROUTES.search)}
          />
        </div>
      </div>
      <div className={s.divider}></div>
      <div className={s.additionalSection}>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href={MOCK_ROUTES.statistics}
            label="Statistics"
            ActiveIcon={<TrendingUpOutlineIcon />}
            InactiveIcon={<TrendingUpOutlineIcon />}
            isActive={currentActive === MOCK_ROUTES.statistics}
            disabled={disabledHref === MOCK_ROUTES.statistics}
            className={getItemClass(MOCK_ROUTES.statistics)}
            onClick={() => handleClick(MOCK_ROUTES.statistics)}
          />
        </div>
        <div className={s.itemWrapper}>
          <SidebarLinkItem
            href={MOCK_ROUTES.favorites}
            label="Favorites"
            ActiveIcon={<BookmarkIcon />}
            InactiveIcon={<BookmarkOutlineIcon />}
            isActive={currentActive === MOCK_ROUTES.favorites}
            disabled={disabledHref === MOCK_ROUTES.favorites}
            className={getItemClass(MOCK_ROUTES.favorites)}
            onClick={() => handleClick(MOCK_ROUTES.favorites)}
          />
        </div>
      </div>
      <div className={s.logoutSection}>
        <button type="button" className={`${s.sidebarItem} ${s.logoutButton}`} onClick={() => {}}>
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
  render: () => <SidebarTemplateUser disabledHref={ROUTES.PUBLIC.HOME} activeHref="" />,
}
export const Hover: Story = { render: () => <SidebarTemplateUser enableHover /> }
export const Tab: Story = { render: () => <SidebarTemplateUser activeHref="" enableHover /> }
