import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Регистрация в Inctagram</h1>
        <div className="auth-links">
          <div>
            Уже есть аккаунт? <Link href="/login">Войти</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
