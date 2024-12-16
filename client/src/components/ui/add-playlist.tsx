"use client"

import React from "react"
import { PlusCircleIcon } from "lucide-react"
import AddPlaylistModal from "../modals/add-playlist"
import { cn } from "@/lib/utilts"

export default function AddPlaylist() {
  const [showModal, setShowModal] = React.useState(false)

  const handleAddClick = () => {
    setShowModal(!showModal)
  }

  const handleAddPlaylist = () => {
    setShowModal(!showModal)
    window.location.reload()
  }

  return (
    <>
      <div className="relative flex flex-col items-center shadow-md rounded-md w-full min-h-[280px] h-full p-4">
        <h3 className="text-3xl font-semibold tracking-tight -z-10">
          Add Playlist
        </h3>
        <div
          onClick={handleAddClick}
          className="absolute top-1/2 -translate-y-1/2"
        >
          <PlusCircleIcon size={128} />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            onClick={() => setShowModal(!showModal)}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-10"
          ></div>
          <AddPlaylistModal onAddPlaylist={handleAddPlaylist} />
        </div>
      )}
    </>
  )
}
