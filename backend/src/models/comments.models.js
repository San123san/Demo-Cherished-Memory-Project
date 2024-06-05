import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    
    imgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'imgUpload',
        required: true
    },

    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registration',
        required: true
    },

    userWriteComment: {
        type: String,
        required: true
    }

}, {timestamps: true})

export const comments = mongoose.model("comments",commentSchema)