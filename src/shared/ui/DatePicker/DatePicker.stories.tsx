// DatePicker.stories.tsx
import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/nextjs-vite'
import { DatePicker, Props as DatePickerProps } from './DatePicker'
import { DateRange } from 'react-day-picker'
import { startOfMonth, endOfMonth } from 'date-fns'

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['single', 'range'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
} as Meta<typeof DatePicker>

const Template: StoryFn<DatePickerProps> = (args) => {
  const [value, setValue] = useState<Date | DateRange | undefined>()

  return (
    <div style={{ padding: '2rem', background: '#121212' }}>
      <DatePicker {...args} value={value} onChange={setValue} />
      <div style={{ marginTop: '1rem', color: '#fff' }}>
        Selected:{' '}
        {value
          ? args.mode === 'range' && 'from' in value
            ? `${value.from ? value.from.toLocaleDateString() : ''} - ${value.to ? value.to.toLocaleDateString() : ''}`
            : (value as Date).toLocaleDateString()
          : 'None'}
      </div>
    </div>
  )
}

// Истории
export const Single = Template.bind({})
Single.args = {
  mode: 'single',
  label: 'Date',
  placeholder: 'Pick a date',
}

export const Range = Template.bind({})
Range.args = {
  mode: 'range',
  label: 'Date range',
  placeholder: 'Pick a range',
}

export const Disabled = Template.bind({})
Disabled.args = {
  mode: 'range',
  label: 'Date',
  placeholder: 'Pick a range',
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  mode: 'single',
  label: 'Date',
  placeholder: 'Pick a date',
  error: 'Error, select current month or last month',
}

export const ThisMonthOnly = Template.bind({})
ThisMonthOnly.args = {
  mode: 'single',
  label: 'Date',
  placeholder: 'Только этот месяц',
  minDate: startOfMonth(new Date()),
  maxDate: endOfMonth(new Date()),
}

export const RangeThisMonth = Template.bind({})
RangeThisMonth.args = {
  mode: 'range',
  label: 'Date range',
  placeholder: 'Только этот месяц',
  minDate: startOfMonth(new Date()),
  maxDate: endOfMonth(new Date()),
}
