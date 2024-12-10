import { Router } from "express"
import { updateSong } from "../controllers/song/update"
import { deleteSong } from "../controllers/song/delete"
import { addSong } from "../controllers/song/create"

const router = Router()

router.post("/", addSong)
router.put("/:id", updateSong)
router.delete("/:id", deleteSong)

export { router as songRoutes }
