import { Meta, StoryObj } from '@storybook/nextjs-vite'
import SuperSelect from './SuperSelect'

const meta: Meta<typeof SuperSelect> = {
  title: 'UI/SuperSelect',
  component: SuperSelect,
}

export default meta
type Story = StoryObj<typeof SuperSelect>

const options = [
  { id: 1, value: 1 },
  { id: 5, value: 5 },
  { id: 10, value: 10 },
  { id: 20, value: 20 },
  { id: 30, value: 30 },
  { id: 50, value: 50 },
  { id: 100, value: 100 },
]

export const Default: Story = {
  args: {
    options,
    value: 10,
    onChangeOption: (option) => console.log('Selected:', option),
  },
}
