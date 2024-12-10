import { Request, Response } from "express"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()
import { prisma } from "../../lib/db"

export async function updateSong(req: Request, res: Response) {
  const { id } = req.params
  const { title, artist, mp3Url } = req.body

  try {
    const updateSong = await prisma.song.update({
      where: { id: id },
      data: {
        title: title,
        artist: artist,
        mp3Url: mp3Url,
      },
    })

    if (!updateSong) {
      throw new Error("Failed to update song")
    }

    return res.status(200).json(updateSong)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to update song" })
  }
}
