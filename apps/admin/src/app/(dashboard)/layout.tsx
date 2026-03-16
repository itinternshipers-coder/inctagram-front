'use client'

import { AdminLayout } from '@/widgets/layout/AdminLayout'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
