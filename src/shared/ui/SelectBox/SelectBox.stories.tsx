'use client'

import * as React from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SelectBox, Option } from './SelectBox'
import { FlagRussiaIcon, FlagUnitedKingdomIcon } from '@/shared/icons/svgComponents'

const meta: Meta<typeof SelectBox> = {
  title: 'Components/SelectBox',
  component: SelectBox,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    height: { control: 'text' },
    disabled: { control: 'boolean' },
    options: { control: 'object' },
    onValueChange: { action: 'onValueChange' },
  },
}

export default meta

type Story = StoryObj<typeof SelectBox>

const defaultOptions: Option[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const optionsWithIcons: Option[] = [
  { value: 'russian', label: 'Russian', icon: <FlagRussiaIcon /> },
  { value: 'english', label: 'English', icon: <FlagUnitedKingdomIcon /> },
]

export const Default: Story = {
  args: {
    label: 'Choose an option',
    placeholder: 'Select...',
    options: defaultOptions,
    width: '210px',
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}

export const WithIcons: Story = {
  args: {
    label: 'With icons',
    options: optionsWithIcons,
    placeholder: 'Pick a fruit',
    width: '210px',
  },
}
