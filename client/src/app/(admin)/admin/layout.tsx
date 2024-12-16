import React from "react"
import AdminNavbar from "@/components/layout/admin-nav"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.has("token")

  console.log(isAdmin)

  if (!isAdmin) {
    redirect("/login")
  }

  return (
    <main className="container flex flex-col">
      <AdminNavbar />
      {children}
    </main>
  )
}
