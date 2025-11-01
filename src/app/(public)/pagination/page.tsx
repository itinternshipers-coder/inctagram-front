'use client'

import SuperPagination from '@/shared/ui/SuperPagination/SuperPagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const PaginationPage = () => {
  const options = [
    { id: 1, value: 1 },
    { id: 5, value: 5 },
    { id: 10, value: 10 },
    { id: 20, value: 20 },
    { id: 30, value: 30 },
    { id: 50, value: 50 },
    { id: 100, value: 100 },
  ]

  const router = useRouter()
  const searchParams = useSearchParams()

  const [page, setPage] = useState(1)
  const [count, setCount] = useState(4)

  // Имитация 50 постов
  const dummyPosts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    user: `User ${i + 1}`,
    content: `Это контент поста номер ${i + 1}`,
  }))

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    if (params.page) setPage(Number(params.page))
    if (params.count) setCount(Number(params.count))
  }, [searchParams])

  const onChangePagination = (newPage: number, newCount: number) => {
    setPage(newPage)
    setCount(newCount)

    const query = new URLSearchParams({
      page: String(newPage),
      count: String(newCount),
    }).toString()

    router.push(`?${query}`)
  }

  return (
    <div>
      {dummyPosts.slice((page - 1) * count, page * count).map((post) => (
        <div key={post.id}>
          <strong>{post.user}</strong>
          <p>{post.content}</p>
        </div>
      ))}

      <SuperPagination
        page={page}
        count={count}
        totalCount={dummyPosts.length}
        onChange={onChangePagination}
        options={options}
      />
    </div>
  )
}

export default PaginationPage
