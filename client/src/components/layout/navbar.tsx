"use client"

import React from "react"
import ThemeSwitcher from "./theme-switcher"
import { GithubIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utilts"
import Link from "next/link"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path ? "underline decoration-2 underline-offset-8" : ""

  return (
    <header className="p-12 w-full">
      <nav className="flex items-center justify-between w-full">
        <span className="flex gap-1 items-end">
          <a
            href="/"
            className="text-5xl font-bold tracking-tighter text-blue-500"
          >
            ALEX
          </a>
          <p className="text-red-500 font-bold text-2xl">FM</p>
        </span>
        <ul className="flex items-center gap-12">
          <Link
            className={cn(
              "text-xl font-medium text-blue-500 tracking-tighter transition ease-in-out hover:-translate-y-1",
              isActive("/recently-played")
            )}
            href="/recently-played"
          >
            Recently Played
          </Link>

          <Link
            className={cn(
              "text-xl font-medium text-blue-500 tracking-tighter transition ease-in-out hover:-translate-y-1",
              isActive("/admin")
            )}
            href="/admin"
          >
            Admin
          </Link>

          <a className="text-blue-500" href="#">
            <GithubIcon />
          </a>
          <ThemeSwitcher />
        </ul>
      </nav>
    </header>
  )
}
