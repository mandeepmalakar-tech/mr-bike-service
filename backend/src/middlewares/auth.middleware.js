import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            new ApiError(401, "Unauthorized request");
        }

        let verifiedToken;
        try {
            verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw new ApiError(401, "Invalid access token");
        }
        const user = await User.findById(verifiedToken._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid access token");
    }
});
