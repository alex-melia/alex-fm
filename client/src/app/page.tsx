"use client"

import React from "react"
import io from "socket.io-client"
import { RecentlyPlayed, Song } from "@/types/types"
import CustomAudioPlayer from "@/components/ui/audio-player"
import RecentlyPlayedGrid from "@/components/ui/recently-played-grid"

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
        console.error("Failed to fetch recently played")
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

          <RecentlyPlayedGrid recentlyPlayed={recentlyPlayed} />
        </div>
      </div>
    </main>
  )
}
