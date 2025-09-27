import { Router } from "express";
import {
    cancelBooking,
    completeBooking,
    createBooking,
    getAllBookings,
    getMyBookings,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/isAdmin.middleware.js";
const router = Router();

router.post("/", verifyJWT, createBooking);
router.get("/", verifyJWT, getMyBookings);
router.delete("/:bookingId/cancel", verifyJWT, cancelBooking);

// Admin routes can be added here later
router.get("/all-bookings", verifyJWT, verifyAdmin, getAllBookings);
router.post("/:bookingId/complete", verifyJWT, verifyAdmin, completeBooking);

export default router;
