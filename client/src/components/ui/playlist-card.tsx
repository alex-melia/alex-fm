"use client"

import React from "react"
import { Playlist, Song } from "@/types/types"
import { Reorder } from "framer-motion"
import { Pencil, Trash } from "lucide-react"
import EditSongModal from "../modals/edit-song"
import DeleteSongModal from "../modals/delete-song"
import AddSongModal from "../modals/add-song"

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const [items, setItems] = React.useState<Song[]>(
    playlist.songs.sort((a, b) => a.position - b.position)
  )
  const [editSong, setEditSong] = React.useState<Song | null>(null)
  const [deleteSong, setDeleteSong] = React.useState<Song | null>(null)

  const [modalType, setModalType] = React.useState("")
  const [showModal, setShowModal] = React.useState(false)

  const calculateTotalDuration = () => {
    const totalSeconds = items.reduce((acc, song) => acc + song.duration, 0)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    return `${hours} hr ${minutes} min`
  }

  const updatePositions = async (reorderedItems: Song[]) => {
    try {
      const updatedSongs = reorderedItems.map((song, index) => ({
        ...song,
        position: index + 1,
      }))
      setItems(updatedSongs)

      const response = await fetch(
        `http://localhost:8001/api/playlists/${playlist.id}/songs`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSongs),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update song positions on the backend.")
      }

      console.log("Song positions updated successfully!")
    } catch (error) {
      console.error("Error updating song positions:", error)
    }
  }

  const handleAddClick = () => {
    setModalType("add")
    setShowModal(true)
  }

  const handleEditClick = (song: Song) => {
    setEditSong(song)
    setShowModal(true)
  }

  const handleDeleteClick = (song: Song) => {
    setDeleteSong(song)
    setShowModal(true)
  }

  const handleAddSong = (addedSong: Song) => {
    setItems((prevItems) => [...prevItems, addedSong])
  }

  const handleUpdateSong = (updatedSong: Song) => {
    setItems((prevItems) =>
      prevItems.map((song) => (song.id === updatedSong.id ? updatedSong : song))
    )
    setEditSong(null)
  }

  const handleDeleteSong = (deletedSong: Song) => {
    setItems((prevItems) =>
      prevItems.filter((song) => song.id !== deletedSong.id)
    )
    setDeleteSong(null)
  }

  return (
    <>
      <div className="flex flex-col items-center border dark:border-gray-400 shadow-md rounded-md w-full h-full p-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          {playlist.name}
        </h2>
        <div className="grid grid-cols-3 place-items-center gap-2 w-full mt-4">
          <div className="flex flex-col items-center">
            <span className="tracking-tighter font-semibold">
              Total Duration
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {calculateTotalDuration()}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="tracking-tighter font-semibold">Total Songs</span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {playlist.songs.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="tracking-tighter font-semibold">Genre</span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {playlist.genre}
            </span>
          </div>
        </div>
        <div className="my-4 w-full overflow-y-scroll h-[200px]">
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={(reorderedItems) => updatePositions(reorderedItems)}
          >
            {items.map((song) => (
              <Reorder.Item key={song.id} value={song}>
                <div className="grid grid-cols-12 items-center my-2 mx-2">
                  <span className="col-span-3 text-sm text-gray-400 place-items-start">
                    {song.position}
                  </span>
                  <div className="flex flex-col col-span-6 justify-center items-center">
                    <span className="text-lg leading-5 text-center font-semibold">
                      {song.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {song.artist}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 justify-end">
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => handleEditClick(song)}
                      size={16}
                    />
                    <Trash
                      className="cursor-pointer"
                      onClick={() => handleDeleteClick(song)}
                      size={16}
                    />
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <p>{playlist.startDate}</p>
          <button
            onClick={() => handleAddClick()}
            className="px-4 py-1 rounded bg-black text-white dark:bg-neutral-800 tracking-tighter font-semibold"
          >
            Add
          </button>
        </div>
      </div>
      {modalType === "add" && showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            onClick={() => {
              setShowModal(!showModal), setModalType("")
            }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-10"
          ></div>
          <AddSongModal playlist={playlist} onAddSong={handleAddSong} />
        </div>
      )}
      {editSong && showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            onClick={() => {
              setShowModal(!showModal), setEditSong(null)
            }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-10"
          ></div>
          <EditSongModal song={editSong} onUpdateSong={handleUpdateSong} />
        </div>
      )}
      {deleteSong && showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            onClick={() => {
              setShowModal(!showModal), setDeleteSong(null)
            }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-10"
          ></div>
          <DeleteSongModal
            song={deleteSong}
            onDeleteSong={(id) => handleDeleteSong}
          />
        </div>
      )}
    </>
  )
}
