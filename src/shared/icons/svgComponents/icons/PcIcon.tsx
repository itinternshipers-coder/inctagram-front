import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const PcIcon = ({ size = 33, color, className, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    className={clsx('icon', className)}
    style={{ color }}
    {...rest}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 33 30"
  >
    <path
      d="M30 0H3C1.35 0 0 1.35 0 3V21C0 22.65 1.35 24 3 24H13.5L10.5 28.5V30H22.5V28.5L19.5 24H30C31.65 24 33 22.65 33 21V3C33 1.35 31.65 0 30 0ZM30 18H3V3H30V18Z"
      fill="currentColor"
    />
  </svg>
)
export default PcIcon
