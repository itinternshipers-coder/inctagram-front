import React from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './Input'
import '@/app/globals.scss'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Label',
    placeholder: 'Type something...',
  },
}
export default meta

type Story = StoryObj<typeof Input>

// === Default States ===
export const Default: Story = {
  args: {
    label: 'Default input',
    type: 'text',
  },
}

export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'example@mail.com',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
}

export const Search: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
  },
}
