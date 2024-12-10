import { Request, Response } from "express"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()
import { prisma } from "../../lib/db"

export async function addSong(req: Request, res: Response) {
  const { title, artist, genre, duration, album, playlist, mp3Url } = req.body
  try {
    const lastSong = await prisma.song.findFirst({
      where: { playlistId: playlist },
      orderBy: { position: "desc" },
    })

    const newPosition = lastSong ? lastSong.position + 1 : 1

    const addedSong = await prisma.song.create({
      data: {
        title: title,
        artist: artist,
        genre: genre,
        duration: Number(duration),
        album: album,
        playlistId: playlist,
        mp3Url: mp3Url,
        position: newPosition,
      },
    })

    if (!addedSong) {
      throw new Error("Failed to add song")
    }

    return res.status(200).json(addedSong)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to add song" })
  }
}
