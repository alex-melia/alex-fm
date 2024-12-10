import { Request, Response } from "express"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()
import { prisma } from "../../lib/db"

export async function createSchedule(req: Request, res: Response) {
  const { playlist, startTime, duration } = req.body
  try {
    const startDate = new Date(startTime)
    const dayOfWeek = startDate.getUTCDay()

    const addedSchedule = await prisma.schedule.create({
      data: {
        playlistId: playlist,
        startTime: startTime,
        duration: Number(duration),
        dayOfWeek: dayOfWeek,
      },
    })

    return res.status(201).json(addedSchedule)
  } catch (error) {
    console.error("Error creating schedule:", error)
    return res.status(500).json({ message: "Failed to create schedule" })
  }
}
