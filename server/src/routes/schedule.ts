import { Router } from "express"
import { getTodaySchedule } from "../controllers/schedule/read"
import { createSchedule } from "../controllers/schedule/create"

const router = Router()

router.get("/:startDate", getTodaySchedule)
router.post("/", createSchedule)

export { router as scheduleRoutes }
