import React, { FormEvent } from "react"
import { Song } from "@/types/types"

export default function EditSongModal({
  song,
  onUpdateSong,
}: {
  song: Song
  onUpdateSong: (updatedSong: Song) => void
}) {
  const [isPending, startTransition] = React.useTransition()

  const [title, setTitle] = React.useState(song.title)
  const [artist, setArtist] = React.useState(song.artist)
  const [mp3Url, setMp3Url] = React.useState(song.mp3Url)

  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const response = await fetch(
        `https://api.alexmelia.dev/api/songs/${song.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            artist,
            mp3Url,
          }),
        }
      )

      if (!response.ok) {
        setSuccess("")
        setError("Failed to update song")
        throw new Error("Failed to update song.")
      }

      const updatedSong = await response.json()
      setSuccess("Song was successfully updated")
      onUpdateSong(updatedSong)
    })
  }

  return (
    <div className="flex flex-col items-center w-1/3 h-1/2 bg-white dark:bg-neutral-900 z-20 p-12 rounded-2xl shadow-lg">
      <form
        className="flex flex-col items-center justify-between space-y-4 h-full w-[400px]"
        onSubmit={handleSubmit}
      >
        <h3 className="text-5xl font-semibold tracking-tighter">Edit Song</h3>
        <div className="flex flex-col space-y-8 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Title</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Artist</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">MP3 Url</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={mp3Url}
              onChange={(e) => setMp3Url(e.target.value)}
            />
          </div>
        </div>
        {success && <span className="text-green-500">{success}</span>}
        {error && <span className="text-red-500">{error}</span>}
        <button
          disabled={isPending}
          className="text-center mx-auto px-4 py-2 rounded-lg text-xl tracking-tighter bg-neutral-900 text-white dark:bg-white dark:text-black"
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  )
}
