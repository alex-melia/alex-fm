import React from "react"
import AdminNavbar from "@/components/layout/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="container flex flex-col">
      <AdminNavbar />
      {children}
    </main>
  )
}
