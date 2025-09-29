import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger, { requestLogger, errorLogger } from "./config/logger.js";

const app = express();

// Add logging middleware
app.use(requestLogger);

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

// Add error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
    logger.error("Global Error Handler", {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
    });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

export default app;
