import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bike: {
            type: Schema.Types.ObjectId,
            ref: "Bike",
            required: true,
        },
        pickupDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
            required: true,
        },
        totalCost: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["booked", "cancelled", "completed"],
            default: "booked",
        },
    },
    { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
