import { asyncHandler } from "../utils/asyncHandler.js";
import { likes } from "../models/likes.models.js"
import { registration } from "../models/registration.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import {comments} from '../models/comments.models.js'

const writeComment = asyncHandler(async(req, res) => {
    const { imgid } = req.params;
    const userId = req.user._id;

    const { comment } = req.body;


    try {
        const user = await registration.findById(userId);

        const newComment = new  comments({
            imgId: imgid,
            users: userId,
            username: user.username,
            userWriteComment: comment,
        });

        await newComment.save();

        const commentId = newComment._id;

        // const responseData = {
        //     commentId,
        //     newComment: {
        //         imgId: newComment.imgId,
        //         users: newComment.users,
        //         username: newComment.username, // Include username here
        //         userWriteComment: newComment.userWriteComment,
        //         _id: newComment._id,
        //         createdAt: newComment.createdAt,
        //         updatedAt: newComment.updatedAt,
        //         __v: newComment.__v
        //     }
        // };

        res.status(201).json(new ApiResponse(true, "Comment saved", { commentId, newComment }))
    } catch (error) {

        console.error("Error saving comment:", error);
        res.status(500).json(new ApiResponse(false, "Failed to save comment", null));
    }
})

const commentRetriev = asyncHandler(async (req, res) => {
    const { imgid } = req.params;

    try {

        const commentImage = await comments.find({imgId: imgid, }).populate('users', 'username');
        // const commentImage = await comments.find({imgId: imgid, });
        if (commentImage.length === 0) {
            // No comments found for the provided imgid
            res.status(200).json(new ApiResponse(false, "No comments found for the image ID", null));
        } else {
            // Comments found, return them
            res.status(200).json(new ApiResponse(true, "Image Comments Retrieved", commentImage));
        }

    } catch (error) {

        console.error("Error retrieving comments:", error);
        throw new ApiError(401, "CommentsNotRetrieve")

    }
})

const editComment = asyncHandler(async(req, res) => {
    const { commentid } = req.params;
    const { newcomment } = req.body;
    const userId = req.user._id;


    try {
        const comment = await comments.findOne({ _id: commentid, users: userId });

        if(!comment){
            return res.status(404).json(new ApiResponse(false, "No comment exist"))
        }
        // Update the comment text
        comment.userWriteComment = newcomment;

        // Save the updated comment
        const updatedComment = await comment.save();


        res.status(200).json(new ApiResponse(true, "Comment updated successfully", { updatedComment }));
        
    } catch (error) {
        console.log("editComment :", error)
        throw new ApiError(404, "Unable to save comments")
    }
})

const deleteComment = asyncHandler(async(req, res) => {
    const { commentid } = req.params;
    const userId = req.user._id;

    try {

        const comment = await comments.findByIdAndDelete({ _id: commentid, users: userId });
        res.status(200).json(new ApiResponse(true, "Comment deleted Successfully"));

    } catch (error) {
        console.log("DeleteComment :", error)
        throw new ApiError(404, "Unable to delete")
    }
})

export {
    writeComment,
    commentRetriev,
    editComment,
    deleteComment
}