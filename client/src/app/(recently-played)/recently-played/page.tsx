import { getRelativeTime } from "@/lib/utilts"
import { RecentlyPlayed as RecentlyPlayedType } from "@/types/types"

import React from "react"

export default async function RecentlyPlayed() {
  const response = await fetch("http://5.75.188.62:8001/api/recently-played")

  if (!response.ok) {
    console.log("Error:", response.statusText)
    return
  }

  const recentlyPlayed = await response.json()

  return (
    <main className="container flex flex-col justify-items-center p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <h3 className="text-3xl font-semibold mb-4">Recently Played</h3>

      <div className="grid grid-cols-5 grid-rows-2 gap-12 w-full">
        {recentlyPlayed.length > 0 ? (
          recentlyPlayed.map((entry: RecentlyPlayedType, index: number) => (
            <div key={index} className="text-center">
              <img
                className="mb-2 w-full h-64"
                src={entry.song.image ? entry.song.image : ""}
              />
              <p className="text-lg font-medium">{entry.song.title}</p>
              <p className="text-sm text-gray-500">{entry.song.artist}</p>
              <p className="text-sm text-black dark:text-gray-200 mt-2">
                played {getRelativeTime(entry.playedAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No songs played recently.</p>
        )}
      </div>
    </main>
  )
}
