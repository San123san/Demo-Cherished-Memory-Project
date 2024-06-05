import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { imgUpload } from "../models/imgUpload.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { registration } from "../models/registration.models.js";
import fs from 'fs';

// Controller function for uploading an image with description and topic
const imageSubmit = asyncHandler(async (req, res) => {
    // Extract data from request body
    const { description, topic } = req.body;
    const { memoryImage } = req.files;

    try {
        // Check if memoryImage is provided
        if (!memoryImage) {
            throw new ApiError(400, "Memory image is required");
        }

        // Read the image file and convert it to a Buffer
        const imageBuffer = fs.readFileSync(memoryImage[0].path);

        // Fetch user details from registration model based on user ID
        const user = await registration.findById(req.user._id);

        // Create a new instance of Upload model
        const newUpload = new imgUpload({
            user: req.user._id,
            username: user.username,
            memoryImage: {
                data: imageBuffer,
                contentType: memoryImage[0].mimetype
            },
            description: description,
            topic: topic
        });

        // Save the upload instance to the database
        await newUpload.save();

        // Remove temporary image file
        fs.unlinkSync(memoryImage[0].path);

        // Respond with success message
        res.status(201).json(new ApiResponse(200, newUpload, "Image uploaded successfully"));
    } catch (error) {
        // In case of any error, handle it and respond with an error message
        throw new ApiError(500, error.message || "Failed to upload image");
    }
});

const imageRetrive = asyncHandler(async (req, res) => {
    try {

        //Fetch images belonging to the logged-in user
        const uploads = await imgUpload.find({ user: req.user._id });

        //If no upload found, return a 404 error
        if (!uploads || uploads.length === 0) {
            throw new ApiError(404, "No images found for this user");
        }

        //Contruct response with image details including upload date and time
        const imagesWithUploadTime = uploads.map(upload => ({
            _id: upload._id,
            memoryImage: {
                data: upload.memoryImage.data.toString('base64'),  //Convert Buffer to base64 string
                // data: upload.memoryImage.data,
                contentType: upload.memoryImage.contentType
            },
            description: upload.description,
            topic: upload.topic,
            uploadTime: upload.uploadTime
        }));

        res.status(200).json(new ApiResponse(200, imagesWithUploadTime, "Images retireve")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to retrieve images");
    }
});

const all_imageRetrieve = asyncHandler(async (req, res) => {
    try {
        //Fetch all images from the database
        const allUploads = await imgUpload.find();

        //If no uploads found, return a 404 error
        if (!allUploads || allUploads.length === 0) {
            throw new ApiError(404, "No images found");
        }

        //Construct response
        const allImages = allUploads.map(upload => ({
            user: upload.user,
            username: upload.username,
            memoryImage: {
                data: upload.memoryImage.data.toString('base64'),  //Convert Buffer to base64 string
                // data: upload.memoryImage.data,
                contentType: upload.memoryImage.contentType
            },
            description: upload.description,
            topic: upload.topic,
            uploadTime: upload.uploadTime
        }));

        res.status(200).json(new ApiResponse(200, allImages, "All images retrieved"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to retrieve images");
    }
});


const editImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { description, topic } = req.body;
    const { memoryImage } = req.files;

    try {
        //Find the image by its ID
        let upload = await imgUpload.findById(id);

        //update the image, topic and description
        if (memoryImage) {
            const imageBuffer = fs.readFileSync(memoryImage[0].path);
            upload.memoryImage = {
                data: imageBuffer,
                contentType: memoryImage[0].mimetype
            };
        }

        if (description) {
            upload.description = description;
        }
        if (topic) {
            upload.topic = topic;
        }

        // Save the changes to the database
        await upload.save();
        
        //Update the information
        if (memoryImage) {
            fs.unlinkSync(memoryImage[0].path);
        }

        res.status(200).json(new ApiResponse(200, upload, "Image updated succesfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to update image")
    }
})

const imageDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        //find the image by its id
        // const upload = await imgUpload.findById(id);
        const upload = await imgUpload.findOneAndDelete({ _id: id });

        //delete information from the database
        // await upload.findOneAndDelete();

        res.status(200).json(new ApiResponse(200, null, "Delete successfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to delete information")
    }
})

const notOwnImage = asyncHandler(async (req, res) => {
    try {
        //Fetch all images except thoses uploaded by the current user
        const otherUploads = await imgUpload.find({ user: { $ne: req.user._id } });

        //Construct response
        const otherImages = otherUploads.map(upload => ({
            _id: upload._id,
            user: upload.user,
            username: upload.username,
            memoryImage: {
                data: upload.memoryImage.data.toString('base64'),  //Convert Buffer to base64 string
                // data: upload.memoryImage.data,
                contentType: upload.memoryImage.contentType
            },
            description: upload.description,
            topic: upload.topic,
            uploadTime: upload.uploadTime
        }));

        res.status(200).json(new ApiResponse(200, otherImages, "Images uploaded by other users retrieved"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to retrieve images uploaded by other users");
    }
})

export {
    imageSubmit,
    imageRetrive,
    all_imageRetrieve,
    editImage,
    imageDelete,
    notOwnImage
}