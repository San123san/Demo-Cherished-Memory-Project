import { Router } from "express"
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    registrationRetrieve,
    deleteUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


router.route("/userRetrieve/:userId").post(verifyJWT, registrationRetrieve)
router.route("/userDelete").post(verifyJWT, deleteUser)



export default router