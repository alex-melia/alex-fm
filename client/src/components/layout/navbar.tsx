"use client"

import React from "react"
import ThemeSwitcher from "./theme-switcher"
import { GithubIcon, MenuIcon, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utilts"
import Link from "next/link"

export default function Navbar() {
  const [showMobileNav, setShowMobileNav] = React.useState(false)
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path ? "underline decoration-2 underline-offset-8" : ""

  return (
    <>
      {showMobileNav && (
        <div className="fixed w-full md:hidden z-10">
          <div className="absolute p-12 top-0 w-full h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
            <X
              onClick={() => setShowMobileNav(!showMobileNav)}
              size={32}
              className="absolute right-12 top-14"
            />
            <div className="flex flex-col items-center gap-12">
              <Link
                onClick={() => setShowMobileNav(!showMobileNav)}
                className={cn(
                  "text-xl font-medium text-blue-500 tracking-tighter transition ease-in-out hover:-translate-y-1",
                  isActive("/recently-played")
                )}
                href="/recently-played"
              >
                Recently Played
              </Link>
              <Link
                onClick={() => setShowMobileNav(!showMobileNav)}
                className={cn(
                  "text-xl font-medium text-blue-500 tracking-tighter transition ease-in-out hover:-translate-y-1",
                  isActive("/admin")
                )}
                href="/admin"
              >
                Admin
              </Link>
              <a
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="text-blue-500"
                href="#"
              >
                <GithubIcon />
              </a>

              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
      <header className="p-4 sm:p-12 w-full">
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
          <ul className="hidden md:flex items-center gap-12">
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
          <MenuIcon
            onClick={() => setShowMobileNav(!showMobileNav)}
            size={32}
            className="md:hidden cursor-pointer"
          />
        </nav>
      </header>
    </>
  )
}
