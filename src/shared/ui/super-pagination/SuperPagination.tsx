import SuperSelect from '../super-select/SuperSelect'
import Pagination from './Pagination'
import s from './pagination.module.scss'

export type PropsOption = { id: number; value: number }

export type SuperPaginationPropsType = {
  id?: string
  page: number
  count: number
  totalCount: number
  onChange: (page: number, count: number) => void
  options: PropsOption[]
}

const SuperPagination: React.FC<SuperPaginationPropsType> = ({ options, page, count, totalCount, onChange }) => {
  const onChangeHandler = (newPage: number) => {
    onChange(newPage, count)
  }

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCount = Number(event.target.value)
    if (!newCount) return
    const newLastPage = Math.max(1, Math.ceil(totalCount / newCount))
    const newPage = Math.min(page, newLastPage)
    onChange(newPage, newCount)
  }

  return (
    <div className={s.pageContainer}>
      <Pagination
        totalCount={totalCount}
        itemsPerPage={count} //это количество элементов, которые показываются на одной странице.
        currentPage={page}
        onChange={onChangeHandler}
      />
      <div className={s.select}>
        <span>show</span>
        <SuperSelect value={count} options={options} onChange={onChangeSelect} />
        <span>on page</span>
      </div>
    </div>
  )
}

export default SuperPagination
