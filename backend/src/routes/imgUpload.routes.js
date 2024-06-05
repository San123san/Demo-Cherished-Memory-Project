import { Router } from "express"
import {
    all_imageRetrieve,
    editImage,
    imageDelete,
    imageRetrive,
    imageSubmit,
    notOwnImage
} from "../controllers/imgUpload.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/memoryUpload").post(verifyJWT, upload.fields([
    {
        name: "memoryImage",
        maxCount: 1
    },
]), imageSubmit)
router.route("/yourMemory").post(verifyJWT, imageRetrive)
router.route("/allMemory").post(all_imageRetrieve)
router.route("/memoryEdit/:id").post(verifyJWT, upload.fields([
    {
        name: "memoryImage",
        maxCount: 1
    },
]), editImage)
router.route("/memoryDelete/:id").post(verifyJWT, imageDelete)
router.route("/otherMemory").post(verifyJWT, notOwnImage)


export default router