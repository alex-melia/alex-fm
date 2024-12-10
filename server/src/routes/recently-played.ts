import { Router } from "express"
import { getRecentlyPlayed } from "../controllers/recently-played/read"

const router = Router()

router.get("/", getRecentlyPlayed)

export { router as recentlyPlayedRoutes }
