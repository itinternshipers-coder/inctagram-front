'use client'
import Link from 'next/link'

type SidebarLinkItemProps = {
  href: string
  label: string
  ActiveIcon: React.ReactNode
  InactiveIcon: React.ReactNode
  isActive: boolean
  disabled: boolean
  onClick: () => void
  className?: string
}

const SidebarLinkItem = ({
  href,
  label,
  ActiveIcon,
  InactiveIcon,
  isActive,
  disabled,
  onClick,
  className = '',
}: SidebarLinkItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault() // отменяет переход по ссылке
      e.stopPropagation() // блокирует всплытие
      return
    }
    onClick() // вызывает функцию клика (ставит disabledLink в Sidebar)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        flex items-center p-2 rounded transition-colors duration-200
        ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      <span className="mr-3 flex-shrink-0">{isActive ? ActiveIcon : InactiveIcon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default SidebarLinkItem
