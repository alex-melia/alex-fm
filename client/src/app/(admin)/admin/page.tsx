import React from "react"
import PlaylistCard from "@/components/ui/playlist-card"
import { Playlist } from "@/types/types"
import AddPlaylist from "@/components/ui/add-playlist"

export default async function AdminPage() {
  const response = await fetch("https://api.alexmelia.dev/api/playlists")

  if (!response.ok) {
    console.log("Error:", response.statusText)
    return
  }

  const playlists = await response.json()

  return (
    <div className="flex flex-col p-4 sm:grid grid-cols-3 grid-rows-2 gap-12 place-content-center place-items-center my-12">
      {playlists.map((playlist: Playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
      <AddPlaylist />
    </div>
  )
}
