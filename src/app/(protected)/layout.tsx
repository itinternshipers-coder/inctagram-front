// import { Header } from '@/widgets/header/Header'
// import { Sidebar } from '@/widgets/sidebar/Sidebar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="protected-layout">
      {/*<Header />*/}
      {/*<Sidebar />*/}
      <main className="main-content">{children}</main>
    </div>
  )
}
