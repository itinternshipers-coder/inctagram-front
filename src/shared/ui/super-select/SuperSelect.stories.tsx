import { PropsOption } from '@/shared/ui/super-pagination/SuperPagination'
import SuperSelect from '@/shared/ui/super-select/SuperSelect'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

const meta: Meta<typeof SuperSelect> = {
  title: 'Components/SuperSelect',
  component: SuperSelect,
  tags: ['autodocs'],
  argTypes: {
    onChangeOption: { action: 'option selected' },
  },
}

export default meta
type Story = StoryObj<typeof SuperSelect>

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<PropsOption | null>(null)

    const options = [
      { id: 1, value: 1 },
      { id: 2, value: 2 },
      { id: 3, value: 3 },
    ]

    const handleChange = (option: PropsOption) => {
      setSelected(option)
      args.onChangeOption?.(option)
    }

    return (
      <div style={{ width: '200px', fontFamily: 'sans-serif' }}>
        <SuperSelect {...args} options={options} onChangeOption={handleChange} />
        {selected && (
          <p style={{ marginTop: '10px' }}>
            <strong>Выбрано:</strong> {selected.value}
          </p>
        )}
      </div>
    )
  },
}

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      value: `Элемент ${i + 1}`,
    })),
  },
}
