"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utilts"

export default function AdminNavbar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path ? "underline decoration-2 underline-offset-8" : ""

  return (
    <div className="flex items-center gap-4 mb-4">
      <a
        className={cn(
          "text-blue-500 text-xl font-medium px-4 py-1 rounded-xl transition ease-in-out hover:-translate-y-1",
          isActive("/admin")
        )}
        href="/admin"
      >
        Playlists
      </a>
      <a
        className={cn(
          "text-blue-500 text-xl font-medium px-4 py-1 rounded-xl transition ease-in-out hover:-translate-y-1",
          isActive("/admin/schedule")
        )}
        href="/admin/schedule"
      >
        Schedule
      </a>
    </div>
  )
}
