import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { CheckBox } from './CheckBox'

const meta: Meta<typeof CheckBox> = {
  title: 'Components/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof CheckBox>

export const CheckedWithName: Story = {
  name: 'Checked With Name',
  args: {
    checked: true,
    name: 'CheckBox',
  },
}

export const UncheckedWithName: Story = {
  name: 'UncheckedWithName',
  args: {
    checked: false,
    name: 'Unchecked checkbox',
  },
}

export const CheckedWithoutName: Story = {
  name: 'Checked Without Name',
  args: {
    checked: true,
    name: '',
  },
}

export const UncheckedWithoutName: Story = {
  name: 'Unchecked Without Name',
  args: {
    checked: false,
    name: '',
  },
}

export const DisabledChecked: Story = {
  name: 'Disabled Checked',
  args: {
    checked: true,
    disabled: true,
    name: 'Disabled checkbox',
  },
}

export const DisabledUnchecked: Story = {
  name: 'Disabled Unchecked',
  args: {
    checked: false,
    disabled: true,
    name: 'Disabled checkbox',
  },
}

export const ControlledCheckboxWithName: Story = {
  name: 'Controlled Checkbox With Name',

  render: () => {
    const [isChecked, setIsChecked] = useState(true)
    return (
      <CheckBox checked={isChecked} onCheckedChange={() => setIsChecked(!isChecked)} name={'Controlled Checkbox'} />
    )
  },
}
