import React, { ChangeEvent, DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import { PropsOption } from '../super-pagination/SuperPagination'
import s from './superSelect.module.scss'

type DefaultSelectPropsType = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

type SuperSelectPropsType = DefaultSelectPropsType & {
  options?: PropsOption[]
  onChangeOption?: (option: PropsOption) => void
}

const SuperSelect: React.FC<SuperSelectPropsType> = ({ options, onChange, onChangeOption, ...restProps }) => {
  const onChangeCallback = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e)
    const selectedOption = options?.find((o) => o.id === Number(e.target.value))
    if (selectedOption) {
      onChangeOption?.(selectedOption)
    }
  }

  return (
    <div className={s.selectWrapper}>
      <select className={s.select} onChange={onChangeCallback} {...restProps}>
        {options?.map((o) => (
          <option key={o.id} value={o.id} className={s.optionItem}>
            {o.value}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SuperSelect
