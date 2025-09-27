import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["email", "whatsapp", "telegram"],
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "failed"],
            default: "sent",
        },
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
