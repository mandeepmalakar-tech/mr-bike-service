import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { User } from "../models/user.model.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

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

    logger.info("User registration attempt", { email, name });

    // input validation
    if (!name || !email || !password) {
        logger.warn("Registration failed - missing fields", { email });
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
        logger.warn("Registration failed - user already exists", { email });
        throw new ApiError(409, "User already exists");
    }
    // create user
    const user = await User.create({ name, email, password });
    // check user is created and removeing some fields
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        logger.error("User creation failed - user not found after creation", {
            email,
            userId: user._id,
        });
        throw new ApiError(500, "Something went wrong while creating user");
    }

    logger.info("User registered successfully", {
        userId: createdUser._id,
        email: createdUser.email,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    logger.info("User login attempt", { email });

    // input validation
    if (!email || !password) {
        logger.warn("Login failed - missing fields", { email });
        throw new ApiError(400, "All fields are required");
    }

    // check email is valid with validator third party package
    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Enter a valid email");
    }

    // check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        logger.warn("Login failed - user not found", { email });
        throw new ApiError(404, "User not found");
    }

    // check if password is correct
    const isPasswordMatch = await user.isPasswordMatch(password);
    if (!isPasswordMatch) {
        logger.warn("Login failed - invalid password", {
            email,
            userId: user._id,
        });
        throw new ApiError(401, "Invalid email or password");
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    logger.info("User logged in successfully", {
        userId: loggedInUser._id,
        email: loggedInUser.email,
    });

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
    logger.info("User logout", { userId: req.user._id, email: req.user.email });

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
    logger.info("User profile request", { userId: req.user._id });

    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
    if (!user) {
        logger.error("User profile not found", { userId: req.user._id });
        throw new ApiError(404, "User not found");
    }

    logger.info("User profile fetched successfully", {
        userId: user._id,
        email: user.email,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, phone, drivingLicense } = req.body;

    logger.info("User profile update request", {
        userId: req.user._id,
        updates: { name, email, phone, drivingLicense },
    });

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
        logger.error("User profile update failed - user not found", {
            userId: req.user._id,
        });
        throw new ApiError(404, "User not found");
    }

    logger.info("User profile updated successfully", {
        userId: updatedUser._id,
        email: updatedUser.email,
        updatedFields: Object.keys(updates),
    });

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
