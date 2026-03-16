import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const ArrowForwardOutlineIcon = ({ size = 24, color, className, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    className={clsx('icon', className)}
    style={{ color }}
    {...rest}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M5 13h11.86l-3.63 4.36a1 1 0 1 0 1.54 1.28l5-6q.051-.072.09-.15c0-.05.05-.08.07-.13A1 1 0 0 0 20 12a1 1 0 0 0-.07-.36c0-.05-.05-.08-.07-.13a1 1 0 0 0-.09-.15l-5-6a1 1 0 0 0-1.41-.13 1 1 0 0 0-.13 1.41L16.86 11H5a1 1 0 0 0 0 2" />
  </svg>
)
export default ArrowForwardOutlineIcon
