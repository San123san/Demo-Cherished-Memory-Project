import { asyncHandler } from "../utils/asyncHandler.js";
import { likes } from "../models/likes.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import {imgUpload} from '../models/imgUpload.models.js'

// const toggleLike = asyncHandler(async (req, res) => {
//     const { imgId } = req.params;
//     const userId = req.user._id; // Assuming you have user information in req.user

//     // Find the likes document for the given imgId
//     let likesDoc = await likes.findOne({ imgId });

//     if (!likesDoc) {
//         // If likes document doesn't exist, create a new one with the user's like
//         likesDoc = await likes.create({ imgId, totalLikes: 1, users: [userId] });
//         res.status(200).json(new ApiResponse(true, 'Liked successfully', { imgId, user: userId }));
//         return;
//     }

//     // Check if the user has already liked the image
//     const userIndex = likesDoc.users.indexOf(userId);

//     if (userIndex !== -1) {
//         // If the user has already liked, remove the like
//         likesDoc.users.splice(userIndex, 1);
//         likesDoc.totalLikes--;
//         await likesDoc.save();
//         res.status(200).json(new ApiResponse(true, 'Unliked successfully', null));
//     } else {
//         // If the user has not liked, add the like
//         likesDoc.users.push(userId);
//         likesDoc.totalLikes++;
//         await likesDoc.save();
//         res.status(200).json(new ApiResponse(true, 'Liked successfully', { imgId, user: userId }));
//     }
// });

// const toggleLike = asyncHandler(async (req, res) => {
//     const { imgId } = req.params;
//      const userId = req.user._id; // Assuming you have user information in req.user

//      // Find the likes document for the given imgId
//      let likesDoc = await likes.findOne({ imgId });

//     if (!likesDoc) {
//         // If likes document doesn't exist, create a new one with the user's like
//         likesDoc = await likes.create({ imgId, totalLikes: 0, users: [] });
//     }

//     // Check if the user has already liked the image
//     const userIndex = likesDoc.users.indexOf(userId);

//     if (userIndex !== -1) {
//         // If the user has already liked, remove the like
//         likesDoc.users.splice(userIndex, 1);
//         likesDoc.totalLikes--;
//         await likesDoc.save();
//         res.status(200).json(new ApiResponse(true, 'Unliked successfully', null));
//     } else {
//         // If the user has not liked, add the like
//         likesDoc.users.push(userId);
//         likesDoc.totalLikes++;
//         await likesDoc.save();
//         res.status(200).json(new ApiResponse(true, 'Liked successfully', { imgId, user: userId }));
//     }
// })


const toggleLike = asyncHandler(async (req, res) => {
    const { imgid } = req.params;
    const userId = req.user._id; // Assuming you have user information in req.user

    // Find the likes document for the given imgId
    let likesDoc = await likes.findOne({ imgId: imgid, users: userId });

    if (!likesDoc) {
        // If likes document doesn't exist, create a new one with the user's like
        likesDoc = await likes.create({ imgId: imgid, users: userId });
        res.status(200).json(new ApiResponse(true, 'Liked successfully', { imgId: imgid, users: userId }));
    } else {
        // If likes document exists, delete it to unlike
        await likes.deleteOne({ _id: likesDoc._id });
        res.status(200).json(new ApiResponse(true, 'Unliked successfully', { imgId: imgid, users: userId }));
    }
});

const getImageId = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    // Find all liked documents for the given user
    const likedImages = await likes.find({ users: userId });

    // Array to store imageIds of liked images
    const likedImageIds = likedImages.map(like => like.imgId);

    // Now you can retrieve all image upload information associated with these liked imageIds
    // Assuming you have a model named 'imgUpload' for image uploads
    const likedImageUploads = await imgUpload.find({ _id: { $in: likedImageIds } });

     // Convert image data to Base64 before sending
     const likedImagesWithBase64 = likedImageUploads.map(image => {
        const base64Data = Buffer.from(image.memoryImage.data).toString('base64');
        const contentType = image.memoryImage.contentType;
        return { ...image.toObject(), memoryImage: { data: base64Data, contentType: contentType } };
    });

    res.status(200).json(new ApiResponse(true, 'Liked images retrieved successfully', likedImagesWithBase64));
});

const statusLikeUnlike = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { imgid } = req.params;

    // Find the likes document for the given imgId
    let likesDoc = await likes.findOne({ users: userId, imgId: imgid });

    if (!likesDoc) {
        res.status(200).json(new ApiResponse(false, 'Not Liked',{ imgId: imgid, users: userId }));
    } else {
        res.status(200).json(new ApiResponse(true, 'Liked',{ imgId: imgid, users: userId }));
    }

})

const totalLikes = asyncHandler(async(req, res) => {
    const { imgid } = req.params;

    try {
        const count = await likes.countDocuments({ imgId: imgid });

        res.status(200).json(new ApiResponse(true, 'Total likes retrieved successfully', { imgId: imgid, totalLikes: count }));
    } catch (error) {
        res.status(500).json(new ApiResponse(false, 'Error retrieving total likes'));
    }
})

export { 
    toggleLike, 
    getImageId,
    statusLikeUnlike,
    totalLikes
};