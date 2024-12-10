// @ts-nocheck
"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Megaphone,
  MegaphoneOff,
  PlayIcon,
  Square,
  SquareIcon,
} from "lucide-react"
import { Song } from "@/types/types"

export default function CustomAudioPlayer({ song }: { song: Song }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume
    }
  }

  const handleMuteToggle = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume // Restore previous volume
      } else {
        audioRef.current.volume = 0 // Mute the audio
      }
    }
    setMuted(!isMuted)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <audio ref={audioRef}>
        <source src="http://5.75.188.62:8000/stream" />
        Your browser does not support the audio element.
      </audio>

      <motion.div
        onClick={handlePlay}
        className="relative w-64 h-64 rounded-full bg-gray-800 border-4 border-black flex items-center justify-center cursor-pointer overflow-hidden"
        style={{
          backgroundImage: `url('${song?.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        animate={{
          rotate: isPlaying ? 360 : 0,
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 15,
          ease: "linear",
        }}
      >
        <div className="absolute w-6 h-6 bg-black rounded-full"></div>
      </motion.div>

      <div className="mt-4 flex gap-4 items-center">
        <div
          onClick={handlePlay}
          className="text-lg font-semibold hover:cursor-pointer"
        >
          {isPlaying ? <Square /> : <PlayIcon />}
        </div>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-40"
        />
        <div onClick={handleMuteToggle} className="cursor-pointer">
          {isMuted ? <MegaphoneOff /> : <Megaphone />}
        </div>
      </div>
    </div>
  )
}
