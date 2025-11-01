import { Meta, StoryObj } from '@storybook/nextjs-vite'
import SidebarLinkItem from './SidebarLinkItem'
import { HomeIcon, HomeOutlineIcon } from '@/shared/icons/svgComponents'

const meta: Meta<typeof SidebarLinkItem> = {
  title: 'Components/Sidebar/SidebarLinkItem',
  component: SidebarLinkItem,
  tags: ['autodocs'],
  argTypes: {
    isActive: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof SidebarLinkItem>

export const Default: Story = {
  args: {
    href: '/feed',
    label: 'Feed',
    ActiveIcon: <HomeIcon />,
    InactiveIcon: <HomeOutlineIcon />,
    isActive: false,
    disabled: false,
  },
}
