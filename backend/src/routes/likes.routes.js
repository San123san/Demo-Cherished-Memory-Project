import { Router } from "express"

import {
    toggleLike,
    getImageId,
    statusLikeUnlike,
    totalLikes
} from "../controllers/likes.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/likeAndUnlike/:imgid").post(verifyJWT, toggleLike)
router.route("/getImage").post(verifyJWT, getImageId)
router.route("/getImage/:imgid").post(verifyJWT, statusLikeUnlike)
router.route("/totalLike/:imgid").post(totalLikes)

export default router