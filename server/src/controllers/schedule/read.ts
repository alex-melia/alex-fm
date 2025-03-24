import { Request, Response } from "express"
import { prisma } from "../../lib/db"

export async function getTodaySchedule(req: Request, res: Response) {
  try {
    const { startDate } = req.params

    if (!startDate || typeof startDate !== "string") {
      return res.status(400).json({ message: "Invalid or missing startDate." })
    }

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)

    const schedules = await prisma.schedule.findMany({
      where: {
        startTime: {
          gte: start,
          lt: end,
        },
      },
      include: {
        playlist: true,
      },
      orderBy: {
        startTime: "asc",
      },
    })

    console.log(schedules)

    return res.status(200).json(schedules)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: "Failed to fetch today's schedule." })
  }
}
