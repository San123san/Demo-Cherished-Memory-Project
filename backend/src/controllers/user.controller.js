import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { registration } from "../models/registration.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { imgUpload } from "../models/imgUpload.models.js"
import { comments } from "../models/comments.models.js";
import { likes } from "../models/likes.models.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await registration.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user detail
    //validation -not empty
    //check if user already exist: username, email
    //check for images
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res 

    const { username, email, password } = req.body
    console.log("email:", email);

    if (
        [username, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //check if username and email is not unique
    const existedEamil = await registration.findOne({
        $or: [{ email }]
    })
    const existedUsername = await registration.findOne({
        $or: [{ username }]
    })

    if (existedEamil && existedUsername) {
        throw new ApiError(409, "User with username or email already exists")
    }
    else if (existedUsername) {
        throw new ApiError(409, "User with username already exists")
    }
    else if (existedEamil) {
        throw new ApiError(409, "User with email already exists")
    }


    const user = await registration.create({
        username,
        email,
        password
    })

    const createdUser = await registration.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Register Successfully")
    )

})

//login user
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await registration.findOne({
        $or: [{ email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exits")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "Password is not correct")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await registration.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})


const logoutUser = asyncHandler(async (req, res) => {
    await registration.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await registration.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const registrationRetrieve = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        res.status(200).json(new ApiResponse(true, "Comment deleted Successfully"));
    }
    
    const userRetrieve = {
        username: user.username,
        email: user.email,
    }

    res.status(200).json(new ApiResponse(true, "User Information Retrieve Successfully", {userRetrieve}));

})

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete the user
        await registration.findByIdAndDelete(userId);

        // Delete all comments by the user
        await comments.deleteMany({ users: userId });

        // Delete all image uploads by the user
        await imgUpload.deleteMany({ user: userId });
        
        // Delete all like by the user
        await likes.deleteMany({ user: userId });

        res.status(200).json({ success: true, message: 'User and related data deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user and related data.', error: error.message });
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registrationRetrieve,
    deleteUser
}