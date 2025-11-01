'use client'
import Link from 'next/link'
import s from './Sidebar.module.scss'

type SidebarLinkItemProps = {
  href: string
  label: string
  ActiveIcon: React.ReactNode
  InactiveIcon: React.ReactNode
  isActive: boolean
  disabled: boolean
  onClick: () => void
}

const SidebarLinkItem = ({
  href,
  label,
  ActiveIcon,
  InactiveIcon,
  isActive,
  disabled,
  onClick,
}: SidebarLinkItemProps) => {
  //обработчик, который отменяет переход, если disabled = true
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault() //отменяет переход по ссылке
      e.stopPropagation() //блокирует всплытие
      return
    }

    //вызываем функцию клика (ставит disabledLink в Sidebar)
    onClick()
  }

  return (
    <Link
      href={href}
      className={`${s.sidebarItem} ${isActive ? s.active : ''} ${disabled ? s.disabled : ''}`}
      onClick={handleClick}
    >
      <span className={s.iconWrapper}>{isActive ? ActiveIcon : InactiveIcon}</span>
      <span className={`${s.label} ${isActive ? s.active : ''}`}>{label}</span>
    </Link>
  )
}

export default SidebarLinkItem
