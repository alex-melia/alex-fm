import { Request, Response } from "express"
import { prisma } from "../../lib/db"

export async function deleteSong(req: Request, res: Response) {
  const { id } = req.params

  try {
    const deletedSong = await prisma.song.delete({
      where: { id: id },
    })

    if (!deletedSong) {
      throw new Error("Failed to delete song")
    }

    return res.status(200).json(deletedSong)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to delete song" })
  }
}
