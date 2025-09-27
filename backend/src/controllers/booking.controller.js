import { Booking } from "../models/booking.model.js";
import { Bike } from "../models/bike.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
    const { bike: bikeId, pickupDate, returnDate } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!bikeId || !pickupDate || !returnDate) {
        throw new ApiError(400, "All fields are required");
    }

    // Validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (pickup >= returnD) {
        throw new ApiError(400, "Return date must be after pickup date");
    }

    // Check bike availability
    const bike = await Bike.findById(bikeId);
    if (!bike || !bike.isAvailable || bike.numberOfVehicles < 1) {
        throw new ApiError(404, "Bike not available for booking");
    }

    // Calculate total cost (simple: packageCost * days)
    const days = Math.ceil(
        (returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalCost = bike.packageCost * days;

    // Create booking
    const booking = await Booking.create({
        user: userId,
        bike: bikeId,
        pickupDate: pickup,
        returnDate: returnD,
        totalCost,
        status: "booked",
    });

    // Decrement bike count
    bike.numberOfVehicles -= 1;
    bike.isAvailable = bike.numberOfVehicles > 0;
    await bike.save();

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "Booking created successfully"));
});

// Get all bookings for current user
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("bike")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "User bookings fetched"));
});

// Cancel a booking
const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user._id,
        status: "booked",
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found or cannot be cancelled");
    }

    booking.status = "cancelled";
    await booking.save();

    // Increment bike count
    const bike = await Bike.findById(booking.bike);
    if (bike) {
        bike.numberOfVehicles += 1;
        bike.isAvailable = true;
        await bike.save();
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

// Admin: get all bookings
const getAllBookings = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const skip = (page - 1) * limit;

    // Get bookings with user + bike info
    const bookings = await Booking.find()
        .populate("user", "name email, phone")
        .populate("bike", "name city packageCost, image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Get total count for pagination
    const total = await Booking.countDocuments();

    if (!bookings || !bookings.length === 0) {
        throw new ApiError(404, "No bookings found");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookings,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1,
                },
            },
            "All bookings fetched successfully"
        )
    );
});

// Mark booking as completed (admin only)
const completeBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== "booked") {
        throw new ApiError(
            404,
            "Booking not found or already completed/cancelled"
        );
    }

    booking.status = "completed";
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking marked as completed"));
});

export { createBooking, getMyBookings, cancelBooking, getAllBookings, completeBooking };
