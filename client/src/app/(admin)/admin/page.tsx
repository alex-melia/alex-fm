import React from "react"
import PlaylistCard from "@/components/ui/playlist-card"
import { Playlist } from "@/types/types"
import AddPlaylist from "@/components/ui/add-playlist"

export default async function AdminPage() {
  const response = await fetch("http://5.75.188.62:8001/api/playlists")

  if (!response.ok) {
    console.log("Error:", response.statusText)
    return
  }

  const playlists = await response.json()

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-12 place-content-center place-items-center my-12">
      {playlists.map((playlist: Playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
      <AddPlaylist />
    </div>
  )
}
