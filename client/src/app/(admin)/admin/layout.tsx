import React from "react"
import AdminNavbar from "@/components/layout/admin-nav"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

    if (!decoded) {
      redirect("/login")
    }
  } catch (error) {
    redirect("/login")
  }

  return (
    <main className="container flex flex-col">
      <AdminNavbar />
      {children}
    </main>
  )
}
