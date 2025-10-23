import { redirect } from 'next/navigation'

export default function ProfileRedirect() {
  // TODO: Получить userId из auth и сделать redirect
  redirect('/profile/123') // Временный редирект
}
