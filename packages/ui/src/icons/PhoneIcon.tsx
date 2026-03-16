import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const PhoneIcon = ({ size = 33, color, className, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    className={clsx('icon', className)}
    style={{ color }}
    {...rest}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 33"
  >
    <path
      d="M15.75 0H3.75C1.68 0 0 1.68 0 3.75V29.25C0 31.32 1.68 33 3.75 33H15.75C17.82 33 19.5 31.32 19.5 29.25V3.75C19.5 1.68 17.82 0 15.75 0ZM9.75 31.5C8.505 31.5 7.5 30.495 7.5 29.25C7.5 28.005 8.505 27 9.75 27C10.995 27 12 28.005 12 29.25C12 30.495 10.995 31.5 9.75 31.5ZM16.5 25.5H3V4.5H16.5V25.5Z"
      fill="currentColor"
    />
  </svg>
)
export default PhoneIcon
