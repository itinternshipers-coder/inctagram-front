import Link from 'next/link'
import { ArrowBackOutlineIcon } from '@/shared/icons/svgComponents'
import s from './TextPageLayout.module.scss'

type TextPageLayoutProps = {
  title: string
  children: React.ReactNode
  backHref?: string
}

const TextPageLayout = ({ title, children, backHref = '/register' }: TextPageLayoutProps) => {
  return (
    <div className={s.container}>
      <div className={s.backBlock}>
        <Link href={backHref} className={s.backLink} aria-label="Назад">
          <ArrowBackOutlineIcon className={s.arrowIcon} />
          <span> Back to Sign Up</span>
        </Link>
      </div>

      <div className={s.titleBar}>
        <h1 className={s.title}>{title}</h1>
      </div>

      <div className={s.content}>{children}</div>
    </div>
  )
}

export default TextPageLayout
