import { Request, Response } from "express"
import { prisma } from "../../lib/db"

export async function getRecentlyPlayed(req: Request, res: Response) {
  try {
    const recentlyPlayed = await prisma.recentlyPlayed.findMany({
      include: {
        song: true,
      },
      orderBy: {
        playedAt: "desc",
      },
      take: 49,
    })

    if (!recentlyPlayed) {
      throw new Error("Failed to fetch recently played")
    }

    return res.status(200).json(recentlyPlayed)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: "Failed to fetch recently played songs" })
  }
}
