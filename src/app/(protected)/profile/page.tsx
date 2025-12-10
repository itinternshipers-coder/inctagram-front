import { ROUTES } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export default function ProfileRedirect() {
  // TODO: Получить userId из auth и сделать redirect
  redirect(ROUTES.DYNAMIC.PROFILE('1')) // Временный редирект
}
