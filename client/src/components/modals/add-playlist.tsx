import React, { FormEvent } from "react"

export default function AddPlaylistModal({
  onAddPlaylist,
}: {
  onAddPlaylist: () => void
}) {
  const [isPending, startTransition] = React.useTransition()

  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [genre, setGenre] = React.useState("")

  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const response = await fetch(`https://api.alexmelia.dev/api/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          genre,
        }),
      })

      if (!response.ok) {
        setSuccess("")
        setError("Failed to add song")
        throw new Error("Failed to add song.")
      }

      setSuccess("Playlist was successfully added")
      onAddPlaylist()
    })
  }

  return (
    <div className="flex flex-col items-center w-1/3 h-1/2 bg-white dark:bg-neutral-900 p-12 rounded-2xl shadow-lg z-20">
      <form
        className="flex flex-col items-center justify-between space-y-4 h-full w-[400px]"
        onSubmit={handleSubmit}
      >
        <h3 className="text-5xl font-semibold tracking-tighter">
          Add Playlist
        </h3>
        <div className="flex flex-col space-y-8 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Name</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Description</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Genre</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
        </div>
        {success && <span className="text-green-500">{success}</span>}
        {error && <span className="text-red-500">{error}</span>}
        <button
          disabled={isPending}
          className="text-center mx-auto px-4 py-2 rounded-lg text-xl tracking-tighter bg-neutral-900 text-white dark:bg-white dark:text-black"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  )
}
