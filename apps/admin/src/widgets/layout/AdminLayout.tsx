'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Typography, PersonIcon, TrendingUpOutlineIcon, CreditCardOutlineIcon, ImageOutlineIcon } from '@inctagram/ui'
import { PrivateRoute } from '@/shared/components/PrivateRoute'
import { Header } from '@/widgets/header/Header'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
  { href: '/users', label: 'Users list', icon: PersonIcon },
  { href: '/statistics', label: 'Statistics', icon: TrendingUpOutlineIcon },
  { href: '/payments', label: 'Payments list', icon: CreditCardOutlineIcon },
  { href: '/posts', label: 'Posts list', icon: ImageOutlineIcon },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/sign-in')
  }

  return (
    <PrivateRoute>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.body}>
          <nav className={styles.sidebar}>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${pathname.startsWith(href) ? styles.navLinkActive : ''}`}
              >
                <Icon size={24} />
                <Typography variant="regular_text_14" as="span">
                  {label}
                </Typography>
              </Link>
            ))}

            <button className={styles.logoutButton} onClick={handleLogout}>
              <Typography variant="regular_text_14" as="span">
                Log Out
              </Typography>
            </button>
          </nav>

          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </PrivateRoute>
  )
}
