import { Request, Response } from "express"
import { prisma } from "../../lib/db"

export async function updatePositions(req: Request, res: Response) {
  const { id } = req.params
  const updatedSongs = req.body
  try {
    for (const song of updatedSongs) {
      await prisma.song.update({
        where: { id: song.id, playlistId: id },
        data: { position: song.position },
      })
    }
    return res.status(200).json({ message: "Positions updated successfully" })
  } catch (error) {
    console.error("Error updating song positions:", error)
    return res.status(500).json({ message: "Failed to update song positions" })
  }
}
