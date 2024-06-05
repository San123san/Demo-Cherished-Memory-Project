import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registration',
        required: true
    },
    username: {
        type: String // Include username field
    },
    memoryImage: {
        data: Buffer, // Change data type to Buffer
        contentType: String // Store content type of the image
    },
    topic:{
        type: String
    },
    description:{
        type: String
    },
    uploadTime: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

export const imgUpload = mongoose.model("imgUpload",uploadSchema)