import { Request, Response } from "express"
import { prisma } from "../../lib/db"

export async function getPlaylists(req: Request, res: Response) {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        songs: true,
        schedules: true,
      },
    })
    return res.status(200).json(playlists)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to fetch playlists" })
  }
}
