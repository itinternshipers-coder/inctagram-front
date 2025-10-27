import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const MoreHorizontalOutlineIcon = ({ size = 24, color, className, ...rest }: IconProps) => (
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
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
    <path d="M19 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
    <path d="M5 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
  </svg>
)
export default MoreHorizontalOutlineIcon
