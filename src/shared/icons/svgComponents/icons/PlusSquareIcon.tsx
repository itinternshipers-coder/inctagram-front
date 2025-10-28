import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const PlusSquareIcon = ({ size = 24, color, className, ...rest }: IconProps) => (
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
    <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3m-3 10h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2" />
  </svg>
)
export default PlusSquareIcon
