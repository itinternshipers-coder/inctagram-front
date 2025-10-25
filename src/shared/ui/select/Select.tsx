'use client'

import * as React from 'react'
import * as Select from '@radix-ui/react-select'

export default function SelectBox() {
  return (
    <Select.Root defaultValue="ru">
      <Select.Trigger className="inline-flex items-center justify-between w-40 px-3 py-2 border rounded shadow text-sm bg-white text-gray-800">
        <Select.Value placeholder="Выбери язык" />
        <Select.Icon></Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="mt-1 w-40 bg-white border rounded shadow">
          <Select.Viewport className="p-1">
            <SelectItem value="ru">Русский</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pl">Эльфийский</SelectItem>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef<HTMLDivElement, { value: string; children: React.ReactNode }>(
  ({ children, ...props }, ref) => (
    <Select.Item
      ref={ref}
      {...props}
      className="relative flex items-center h-8 px-2 rounded cursor-pointer select-none text-gray-800 data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-5 inline-flex items-center justify-center"></Select.ItemIndicator>
    </Select.Item>
  )
)

SelectItem.displayName = 'SelectItem'
