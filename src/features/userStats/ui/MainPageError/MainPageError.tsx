'use client'

import { Button } from '@/shared/ui/Button/Button'
import s from './MainPageError.module.scss'

export const MainPageError = () => {
  return (
    <div className={s.container}>
      <h2 className={s.title}>Сервис временно недоступен</h2>
      <p className={s.description}>
        Не удалось загрузить главную страницу — данные могут быть временно недоступны. Попробуйте обновить страницу
        через несколько секунд.
      </p>
      <Button onClick={() => window.location.reload()}>Обновить</Button>
    </div>
  )
}
