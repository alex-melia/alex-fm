"use client"

import React from "react"
import RecentlyPlayedGrid from "@/components/ui/recently-played-grid"
import MoonLoader from "react-spinners/MoonLoader"

export default function RecentlyPlayed() {
  const [recentlyPlayed, setRecentlyPlayed] = React.useState([])
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    async function fetchData() {
      startTransition(async () => {
        try {
          const res = await fetch(
            "https://api.alexmelia.dev/api/recently-played"
          )
          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`)
          }
          const data = await res.json()
          setRecentlyPlayed(data)
        } catch (error) {
          console.error("Failed to fetch recently played data:", error)
          setRecentlyPlayed([])
        }
      })
    }
    fetchData()
  }, [])

  if (!recentlyPlayed) return <div>Loading...</div>

  return (
    <main className="container flex flex-col justify-items-center p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <h3 className="text-3xl font-semibold mb-4">Recently Played</h3>
      {isPending ? (
        <MoonLoader
          className="mx-auto"
          loading={isPending}
          size={64}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <RecentlyPlayedGrid recentlyPlayed={recentlyPlayed} />
      )}
    </main>
  )
}
