'use client'

import { useDeletePostMutation } from '@/entities/post/api/posts-api'
import { useState } from 'react'

type useDeletePostReturn = {
  postDelete: () => void
  isOpen: boolean
  open: () => void
  close: () => void
  err: string | null
  loading: boolean
}

export const useDeletePost = (idPost: string): useDeletePostReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [deletePost] = useDeletePostMutation()
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const close = () => {
    setIsOpen(false)
  }

  const open = () => {
    setIsOpen(true)
  }

  const postDelete = async () => {
    setLoading(true)
    try {
      await deletePost({ id: idPost }).unwrap()
      close()
    } catch (error) {
      if (error instanceof Error) setErr(error.message)
      else setErr('Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { postDelete, isOpen, open, close, err, loading }
}
