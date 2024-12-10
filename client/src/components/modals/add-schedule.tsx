"use client"

import { Playlist } from "@/types/types"
import React, { FormEvent } from "react"

export default function AddScheduleModal({
  day,
  onAddSchedule,
}: {
  day: Date
  onAddSchedule: () => void
}) {
  const [isPending, startTransition] = React.useTransition()

  const [playlists, setPlaylists] = React.useState<Playlist[]>([])

  const [playlist, setPlaylist] = React.useState("")
  const [time, setTime] = React.useState("")
  const [duration, setDuration] = React.useState("")

  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  React.useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch(`https://api.alexmelia.dev/api/playlists`)

      if (!response.ok) {
        console.error("Failed to fetch schedules")
        return
      }

      const data = await response.json()
      setPlaylists(data)
    }

    fetchPlaylists()
  }, [])

  const constructTimestamp = (day: Date, time: string): string => {
    const parsedHour = parseInt(time, 10) // Parse the hour from input
    if (isNaN(parsedHour) || parsedHour < 0 || parsedHour > 23) {
      throw new Error(
        "Invalid time input. Must be an integer between 0 and 23."
      )
    }

    const timestamp = new Date(day) // Clone the `day` date object
    timestamp.setHours(parsedHour, 0, 0, 0) // Set the hour, minutes, seconds, and milliseconds
    return timestamp.toISOString()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const timestamp = constructTimestamp(day, time)

    startTransition(async () => {
      const response = await fetch(`https://api.alexmelia.dev/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlist,
          startTime: timestamp,
          duration,
        }),
      })

      if (!response.ok) {
        setSuccess("")
        setError("Failed to add schedule")
        throw new Error("Failed to add schedule.")
      }

      setSuccess("Schedule was successfully added")
      onAddSchedule()
    })
  }

  return (
    <div className="flex flex-col items-center w-1/3 h-1/2 bg-white dark:bg-neutral-900 p-12 rounded-2xl shadow-lg">
      <form
        className="flex flex-col items-center justify-between space-y-4 h-full w-[400px]"
        onSubmit={handleSubmit}
      >
        <h3 className="text-5xl font-semibold tracking-tighter">
          Add Schedule
        </h3>
        <div className="flex flex-col space-y-8 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Playlist</label>
            <select
              className="border p-2 rounded-lg"
              value={playlist}
              onChange={(e) => setPlaylist(e.target.value)}
            >
              <option value="">Select a playlist</option>
              {playlists &&
                playlists.map((playlist: Playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Time (0-23)</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Enter hour (0-23)"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-medium">Duration</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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
