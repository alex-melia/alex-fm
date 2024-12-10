import { Router } from "express"
import { getPlaylists } from "../controllers/playlist/read"
import { updatePositions } from "../controllers/playlist/update"
import { addPlaylist } from "../controllers/playlist/create"

const router = Router()

router.get("/", getPlaylists)
router.post("/", addPlaylist)
router.put("/:id/songs", updatePositions)

export { router as playlistRoutes }
