// import { redirect } from 'next/navigation'

import { Typography } from '@/shared/ui/Typography/Typography'
import { Header } from '@/widgets/header/Header'

export default async function RootPage() {
  return (
    <div>
      <Typography as={'h1'} variant={'large'}>
        Root page
      </Typography>
    </div>
  )
  // const session = false //
  //
  // if (session) {
  //   // Авторизован - редирект на защищённую главную
  //   redirect('/profile')
  // } else {
  //   // Не авторизован - редирект на публичную страницу (логин)
  //   redirect('/login')
  // }
}
