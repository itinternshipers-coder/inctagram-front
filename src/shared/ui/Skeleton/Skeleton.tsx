import { CSSProperties } from 'react'
import s from './Skeleton.module.scss'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
}

export const Skeleton = ({ width = '100%', height = '100%', borderRadius = '4px', className = '' }: SkeletonProps) => {
  const style: CSSProperties = {
    width,
    height,
    borderRadius,
  }

  return <div className={`${s.skeleton} ${className}`} style={style} />
}
