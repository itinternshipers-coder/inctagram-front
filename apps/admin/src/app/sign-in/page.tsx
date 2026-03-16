'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Typography } from '@inctagram/ui'
import { Header } from '@/widgets/header/Header'
import styles from './sign-in.module.css'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminToken', 'admin-token')
      router.push('/')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
      <Card className={styles.form}>
        <Typography variant="h2" className={styles.title}>
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Epam@epam.com"
              error={error && email === '' ? 'Email is required' : undefined}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              error={error && password === '' ? 'Password is required' : undefined}
            />
          </div>

          {error && (
            <Typography variant="regular_text_14" className={styles.error}>
              {error}
            </Typography>
          )}

          <Button type="submit" fullWidth>
            Sign In
          </Button>
        </form>
      </Card>
      </div>
    </>
  )
}
