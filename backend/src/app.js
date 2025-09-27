import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"], // Allow frontend origins
        credentials: true, // Allow cookies and authorization headers
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.route.js";
import bikeRouter from "./routes/bike.route.js";
import bookingRouter from "./routes/bookings.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/bikes", bikeRouter);
app.use("/api/v1/bookings", bookingRouter);

export default app;
