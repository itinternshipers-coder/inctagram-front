import { useDeletePostMutation } from '@/entities/post/api/posts-api'
import { useState } from 'react'

type Props = {
  idPost: string
}

type useDeletePostReturn = {
  postDelete: (idPost: string) => void
  isOpen: boolean
  open: () => void
  close: () => void
  err: string | null
  loading: boolean
}

export const useDeletePost = ({ idPost }: Props): useDeletePostReturn => {
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
      deletePost({ id: idPost }).unwrap()
    } catch (error) {
      if (error instanceof Error) setErr(error.message)
      else setErr('Unknown error')
    } finally {
      setLoading(false)
      close()
    }
  }

  return { postDelete, isOpen, open, close, err, loading }
}
