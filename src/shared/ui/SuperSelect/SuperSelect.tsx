import React, { useState, useEffect } from 'react'
import { PropsOption } from '../SuperPagination/SuperPagination'
import s from './SuperSelect.module.scss'
import { ArrowIosDownOutlineIcon, ArrowIosUpIcon } from '@/shared/icons/svgComponents'

type SuperSelectPropsType = {
  options?: PropsOption[]
  value?: number
  onChangeOption?: (option: PropsOption) => void
}

const SuperSelect = ({ options = [], value, onChangeOption }: SuperSelectPropsType) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<PropsOption | null>(null)

  useEffect(() => {
    if (value !== undefined) {
      const option = options.find((o) => o.id === value) || null
      setSelected(option)
    }
  }, [value, options])

  const handleSelect = (option: PropsOption) => {
    setSelected(option)
    onChangeOption?.(option)
    setOpen(false)
  }

  return (
    <div className={s.customSelectWrapper}>
      <div className={s.selected} onClick={() => setOpen((prev) => !prev)}>
        <span>{selected?.value ?? options[0]?.value ?? '—'}</span>
        {/* Стрелка в зависимости от состояния */}
        <span className={s.arrow}>{open ? <ArrowIosUpIcon size={16} /> : <ArrowIosDownOutlineIcon size={16} />}</span>
      </div>

      {open && (
        <ul className={s.options}>
          {options.map((option) => (
            <li key={option.id} onClick={() => handleSelect(option)}>
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SuperSelect
