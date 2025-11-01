import SuperSelect from '../SuperSelect/SuperSelect'
import Pagination from './Pagination'
import s from './Pagination.module.scss'

export type PropsOption = { id: number; value: number }

export type SuperPaginationPropsType = {
  id?: string
  page: number
  count: number
  totalCount: number
  onChange: (page: number, count: number) => void
  options: PropsOption[]
}

const SuperPagination = ({ options, page, count, totalCount, onChange }: SuperPaginationPropsType) => {
  const onChangeHandler = (newPage: number) => {
    onChange(newPage, count)
  }

  // Обработка выбора нового количества элементов на странице
  const onChangeSelect = (option: PropsOption) => {
    const newCount = option.value
    const newLastPage = Math.max(1, Math.ceil(totalCount / newCount))
    const newPage = Math.min(page, newLastPage)
    onChange(newPage, newCount)
  }

  return (
    <div className={s.pageContainer}>
      <Pagination
        totalCount={totalCount}
        itemsPerPage={count} // количество элементов на странице
        currentPage={page}
        onChange={onChangeHandler}
      />
      <div className={s.select}>
        <span>Show</span>
        <SuperSelect value={count} options={options} onChangeOption={onChangeSelect} />
        <span>on page</span>
      </div>
    </div>
  )
}

export default SuperPagination
