export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="protected-layout">
      <main className="main-content">{children}</main>
    </div>
  )
}
