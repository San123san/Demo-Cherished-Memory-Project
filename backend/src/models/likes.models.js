import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    
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

    // users: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'registration',
    //     required: true
    // }],

    // totalLikes: {
    //     type: Number,
    //     default: 0
    // }

},{timestamps: true})

export const likes = mongoose.model("likes",likesSchema)