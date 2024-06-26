import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))   //data take when fill form in the format of json
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(express.static("dist"))
app.use(cookieParser())



// routes import
import userRouter  from './routes/users.routes.js'
import uploadRouter  from './routes/imgUpload.routes.js';
import likesRouter from './routes/likes.routes.js';
import commentsRouter from './routes/comments.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/upload", uploadRouter)
app.use("/api/v1/likes", likesRouter)
app.use("/api/v1/allComments", commentsRouter)

export {app}