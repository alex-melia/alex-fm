import { Router } from "express"
import { getSong } from "../controllers/spotify/read"

const router = Router()

router.get("/", getSong)

export { router as spotifyRouter }
