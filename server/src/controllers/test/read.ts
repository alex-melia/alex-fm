import { Request, Response } from "express"

export async function testRequest(req: Request, res: Response) {
  try {
    return res.status(200).json("It works")
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to send request" })
  }
}
