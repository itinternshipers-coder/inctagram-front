import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const MenuOutlineIcon = ({ size = 24, color, className, ...rest }: IconProps) => (
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
    <path d="M20.05 11H3.95a.95.95 0 0 0-.95.95v.1c0 .525.425.95.95.95h16.1a.95.95 0 0 0 .95-.95v-.1a.95.95 0 0 0-.95-.95" />
    <path d="M20.05 16H3.95a.95.95 0 0 0-.95.95v.1c0 .525.425.95.95.95h16.1a.95.95 0 0 0 .95-.95v-.1a.95.95 0 0 0-.95-.95" />
    <path d="M20.05 6H3.95a.95.95 0 0 0-.95.95v.1c0 .525.425.95.95.95h16.1a.95.95 0 0 0 .95-.95v-.1a.95.95 0 0 0-.95-.95" />
  </svg>
)
export default MenuOutlineIcon
