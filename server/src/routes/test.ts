import { Router } from "express"
import { testRequest } from "../controllers/test/read"

const router = Router()

router.get("/", testRequest)

export { router as testRoutes }
