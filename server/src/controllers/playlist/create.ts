import { Request, Response } from "express"
import { prisma } from "../../lib/db"

export async function addPlaylist(req: Request, res: Response) {
  const { name, description, genre } = req.body

  try {
    const addedPlaylist = await prisma.playlist.create({
      data: {
        name: name,
        description: description,
        genre: genre,
      },
    })

    if (!addedPlaylist) {
      throw new Error("Failed to add playlist")
    }

    const addedSchedule = await prisma.schedule.create({
      data: {
        startTime: new Date(),
        duration: 120,
        dayOfWeek: 0,
        playlistId: addedPlaylist.id,
      },
    })

    if (!addedSchedule) {
      throw new Error("Failed to add schedule")
    }

    return res.status(200).json(addedPlaylist)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to add playlist" })
  }
}
