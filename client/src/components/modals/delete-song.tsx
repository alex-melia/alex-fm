import React, { FormEvent } from "react"
import { Song } from "@/types/types"

export default function DeleteSongModal({
  song,
  onDeleteSong,
}: {
  song: Song
  onDeleteSong: (deletedSong: Song) => void
}) {
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const response = await fetch(
        `http://localhost:8001/api/songs/${song.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        setError("Failed to delete song")
        throw new Error("Failed to delete song.")
      }

      const deletedSong = await response.json()
      onDeleteSong(deletedSong)
    })
  }

  return (
    <div className="flex flex-col items-center w-1/3 bg-white dark:bg-neutral-900 z-20 p-12 rounded-2xl shadow-lg">
      <form
        className="flex flex-col items-center justify-between space-y-4 h-full w-[600px]"
        onSubmit={handleSubmit}
      >
        <h3 className="text-5xl font-semibold tracking-tighter">Delete Song</h3>
        <span className="text-2xl text-center tracking-tight">
          Are you sure you want to delete {song.title}?
        </span>
        {error && <span className="text-red-500">{error}</span>}
        <button
          disabled={isPending}
          className="text-center mx-auto px-4 py-2 rounded-lg text-xl tracking-tighter bg-red-500 text-white"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </form>
    </div>
  )
}
