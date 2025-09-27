import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { User } from "../models/user.model.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true,
    secure: true,
};
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // input validation
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    // check is password is morethen 6 characters long
    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }
    // check email is valid with validator

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Enter a valid email");
    }

    // check if user already exists
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
        throw new ApiError(409, "User already exists");
    }
    // create user
    const user = await User.create({ name, email, password });
    // check user is created and removeing some fields
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // input validation
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // check email is valid with validator third party package
    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Enter a valid email");
    }

    // check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // check if password is correct
    const isPasswordMatch = await user.isPasswordMatch(password);
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: null },
        },
        {
            new: true,
        }
    );
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const verifiedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        if (!verifiedToken) {
            throw new ApiError(401, "Refresh token is invalid");
        }
        const user = await User.findById(verifiedToken._id);
        if (!user || user?.refreshToken !== refreshToken) {
            throw new ApiError(401, "Refresh token is invalid");
        }
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", { refreshToken: newRefreshToken }, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, phone, drivingLicense } = req.body;

    // Initialize updates object with only provided fields
    const updates = {};

    if (name) {
        updates.name = name;
    }

    if (email) {
        // Validate email format
        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Please provide a valid email");
        }
        // Check if email already exists for another user
        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user._id },
        });
        if (existingUser) {
            throw new ApiError(409, "Email already in use");
        }
        updates.email = email;
    }

    if (phone !== undefined) {
        // If phone is provided and not empty, validate it
        if (phone && !validator.isMobilePhone(phone)) {
            throw new ApiError(400, "Please provide a valid phone number");
        }
        updates.phone = phone;
    }

    if (drivingLicense !== undefined) {
        if (typeof drivingLicense !== "boolean") {
            throw new ApiError(400, "Driving license must be a boolean value");
        }
        updates.drivingLicense = drivingLicense;
    }

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "Please provide at least one field to update");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updates,
        },
        {
            new: true,
            select: "-password -refreshToken",
        }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User profile updated successfully"
            )
        );
});

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getUserProfile,
    updateUserProfile,
};
