import Link from 'next/link'
import s from './TextPageLayout.module.scss'
import { ArrowBackOutlineIcon } from '@/shared/icons/svgComponents'

type TextPageLayoutProps = {
  title: string
  children: React.ReactNode
  backHref?: string
}

const TextPageLayout = ({ title, children, backHref = '/' }: TextPageLayoutProps) => {
  return (
    <div className={s.container}>
      <div className={s.appBox}>
        {/* Хедер */}
        <header className={s.header}>header</header>

        <div className={s.titleBar}>
          <Link href={backHref} className={s.backLink} aria-label="Назад">
            <ArrowBackOutlineIcon className={s.arrowIcon} />
          </Link>
          <h1 className={s.title}>{title}</h1>
        </div>

        {/* Контейнер для прокручиваемого текста */}
        <div className={s.content}>{children}</div>
      </div>
    </div>
  )
}

export default TextPageLayout
