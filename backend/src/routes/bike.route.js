import { Router } from "express";
import {
    createBike,
    getAllBikes,
    getBikeById,
    updateBike,
    deleteBike,
    getBikesByCity,
} from "../controllers/bike.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/isAdmin.middleware.js";
const router = Router();

// Public routes
router.get("/", getAllBikes);
router.get("/:bikeId", getBikeById);
router.get("/city/:city", getBikesByCity);

// Protected admin-only routes
router.post("/", verifyJWT, verifyAdmin, createBike);
router.patch("/:bikeId", verifyJWT, verifyAdmin, updateBike);
router.delete("/:bikeId", verifyJWT, verifyAdmin, deleteBike);

export default router;
