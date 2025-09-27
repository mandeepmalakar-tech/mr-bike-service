import { Router } from "express";
import {
    getUserProfile,
    loginUser,
    logOutUser,
    refreshAccessToken,
    registerUser,
    updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// secured routes
router.post("/logout", verifyJWT, logOutUser);
router.post("/refresh-token", verifyJWT, refreshAccessToken);
router.get("/profile", verifyJWT, getUserProfile);
router.patch("/update-profile", verifyJWT, updateUserProfile);

export default router;
