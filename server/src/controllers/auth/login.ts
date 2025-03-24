import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function loginUser(req: Request, res: Response) {
  const { password } = req.body

  try {
    if (!process.env.PASSWORD) {
      throw new Error("PASSWORD is not set in the environment")
    }

    const passwordMatch = await bcrypt.compare(password, process.env.PASSWORD)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ id: 1 }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1d",
    })

    return res.status(200).json({ jwt: token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to login" })
  }
}
