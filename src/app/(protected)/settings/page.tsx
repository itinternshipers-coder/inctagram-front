import { ROUTES } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export default function SettingsRedirect() {
  redirect(`${ROUTES.PROTECTED.SETTINGS}?part=info`)
}
