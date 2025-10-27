import * as React from 'react'
import clsx from 'clsx'
export type IconProps = { size?: number; color?: string; className?: string } & React.SVGProps<SVGSVGElement>
const ExplorerIcon = ({ size = 24, color, className, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    className={clsx('icon', className)}
    style={{ color }}
    {...rest}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 36 36"
  >
    <path
      fill="#fff"
      d="M34.046 8.067C37.37-.559 30.913.044 30.913.044c-4.143 0-9.321 3.773-9.321 3.773S15.415 2.153 9.237 5.89c-6.732 4.29-6.51 11.91-6.51 11.91C8.202 9.958 15.822 6.776 15.822 6.776v.518C4.577 14.984 1.914 26.233 1.248 28.526s-.222 7.439 4.513 7.439c4.734 0 9.543-3.814 9.543-3.814s1.036.222 3.847.222c11.836 0 14.647-10.431 14.647-10.431H23.293s-.74 3.403-4.512 3.403c-5.179 0-4.883-5.4-4.883-5.4h20.048c.962-13.908-11.17-15.906-11.17-15.906s4.287-3.033 7.99-3.033c5.867 0 3.092 6.874 3.092 6.874zm-19.33 23.93s-7.225 4.385-10.468 1.347c-1.738-3.039 1.086-7.341 1.086-7.341s2.39 4.43 9.383 5.994m8.691-16.785h-9.534s-.121-4.647 4.888-4.647c4.837 0 4.646 4.647 4.646 4.647"
    />
  </svg>
)
export default ExplorerIcon
