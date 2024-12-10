"use client"

import React from "react"
import io from "socket.io-client"
import { RecentlyPlayed, Song } from "@/types/types"
import CustomAudioPlayer from "@/components/ui/audio-player"
import { ArrowRightCircle } from "lucide-react"
import { getRelativeTime } from "@/lib/utilts"

const socket = io(`https://api.alexmelia.dev`, {
  transports: ["websocket"],
})

export default function Home() {
  const [currentSong, setCurrentSong] = React.useState<Song | null>(null)
  const [recentlyPlayed, setRecentlyPlayed] = React.useState<
    RecentlyPlayed[] | null
  >([])

  React.useEffect(() => {
    const metadataListener = async (data: Song) => {
      setCurrentSong(data)

      const response = await fetch(
        `https://api.alexmelia.dev/api/recently-played`
      )

      if (!response.ok) {
        console.log("Failed to fetch recently played")
        return
      }

      const recedata = await response.json()
      setRecentlyPlayed(recedata)
    }

    socket.on("metadataUpdate", metadataListener)

    socket.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    return () => {
      socket.off("metadataUpdate", metadataListener)
    }
  }, [])

  return (
    <main className="container flex flex-col justify-items-center p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col">
        <span className="text-4xl font-semibold">
          {currentSong?.playlist.name}
        </span>
        <span className="text-xl tracking-tighter">
          {currentSong?.playlist.description}
        </span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <CustomAudioPlayer song={currentSong} />
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold">{currentSong?.title}</h2>
          <p className="font-medium text-gray-500">{currentSong?.artist}</p>
        </div>

        <div className="flex flex-col w-full mt-24">
          <h3 className="text-3xl font-semibold mb-12">Recently Played</h3>

          <div className="grid grid-cols-5 grid-rows-2 gap-12 w-full">
            {recentlyPlayed && recentlyPlayed.length > 0 ? (
              recentlyPlayed
                .filter(
                  (entry: RecentlyPlayed) =>
                    entry.song.title !== "Advertisement"
                )
                .slice(0, 9)
                .map((entry: RecentlyPlayed, index: number) => (
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
            <a
              href="/recently-played"
              className="text-blue-500 flex flex-col gap-8 items-center justify-center"
            >
              <span className="text-3xl tracking-tight">See more</span>
              <ArrowRightCircle size={64} />
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
