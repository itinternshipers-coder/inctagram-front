import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    disabled: true,
    children: 'Button',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Button',
  },
}

export const TertiaryDisabled: Story = {
  args: {
    variant: 'tertiary',
    disabled: true,
    children: 'Button',
  },
}

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Button',
  },
}

export const Link: Story = {
  args: {
    as: 'a',
    variant: 'link',
    href: '#',
    children: 'Button',
  },
}

export const LinkDisabled: Story = {
  args: {
    as: 'a',
    variant: 'link',
    disabled: true,
    href: '#',
    children: 'Button',
  },
}
