import { Router } from "express"

import {
    writeComment,
    commentRetriev,
    editComment,
    deleteComment
} from '../controllers/comments.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/userComment/:imgid").post(verifyJWT, writeComment)
router.route("/userCommentRetrieve/:imgid").post(commentRetriev)
router.route("/userEditComment/:commentid").post(verifyJWT, editComment)
router.route("/userDeleteComment/:commentid").post(verifyJWT, deleteComment)

export default router