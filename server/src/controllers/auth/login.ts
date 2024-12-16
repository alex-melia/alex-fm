import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const SERVER_PASSWORD = process.env.PASSWORD

export async function loginUser(req: Request, res: Response) {
  const { password } = req.body

  try {
    if (!SERVER_PASSWORD) {
      throw new Error("SERVER_PASSWORD is not set in the environment")
    }

    const passwordMatch = await bcrypt.compare(password, SERVER_PASSWORD)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ id: 1 }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1d",
    })

    return res.status(200).json({ jwt: token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to add playlist" })
  }
}
