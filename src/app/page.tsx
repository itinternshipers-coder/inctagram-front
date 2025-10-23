// import { redirect } from 'next/navigation'

export default async function RootPage() {
  return (
    <div>
      <h1>Root page</h1>
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
