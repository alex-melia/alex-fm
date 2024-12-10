import React from "react"
import RecentlyPlayedGrid from "@/components/ui/recently-played-grid"

export default async function RecentlyPlayed() {
  const response = await fetch("https://api.alexmelia.dev/api/recently-played")

  if (!response.ok) {
    console.log("Error:", response.statusText)
    return
  }

  const recentlyPlayed = await response.json()

  return (
    <main className="container flex flex-col justify-items-center p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <h3 className="text-3xl font-semibold mb-4">Recently Played</h3>
      <RecentlyPlayedGrid recentlyPlayed={recentlyPlayed} />
    </main>
  )
}
