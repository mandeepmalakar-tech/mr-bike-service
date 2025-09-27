import mongoose, { Schema } from "mongoose";

const bikeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            toLowercase: true,
            trim: true,
        },
        packageCost: {
            type: Number,
            required: true,
        },
        location: {
            type: String, // Example: "INA Metro, Delhi"
            required: true,
            toLowercase: true,
            trim: true,
        },
        city: {
            type: String, // Example: "Delhi", "Vizag"
            required: true,
            toLowercase: true,
            trim: true,
        },
        numberOfVehicles: {
            type: Number,
            required: true,
            min: 0,
        },
        imageUrl: {
            type: String,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Bike = mongoose.model("Bike", bikeSchema);
