'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export const Portal = ({ children }: { children: ReactNode }) => {
  const [add, setAdd] = useState(false)

  useEffect(() => {
    setAdd(true)
  }, [])

  if (!add) return null

  const container = document.getElementById('portal-root')
  if (!container) return null

  return createPortal(children, container)
}
