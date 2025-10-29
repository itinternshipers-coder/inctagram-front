import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const PersonIcon = ({ size = 24, color, className, ...rest }: IconProps) => (
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
    <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
    <path d="M18 21a1 1 0 0 0 1-1 7 7 0 1 0-14 0 1 1 0 0 0 1 1z" />
  </svg>
)
export default PersonIcon
