import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    defaultMeta: { service: "mr-bike-backend" },
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: consoleFormat,
        }),

        // File transport for all logs
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat,
        }),

        // File transport for error logs only
        new DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            level: "error",
            format: logFormat,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log" }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: "logs/rejections.log" }),
    ],
});

// Add request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get("User-Agent"),
            ip: req.ip || req.connection.remoteAddress,
        };

        if (res.statusCode >= 400) {
            logger.error("HTTP Request Error", logData);
        } else {
            logger.info("HTTP Request", logData);
        }
    });

    next();
};

// Add error logging middleware
export const errorLogger = (err, req, res, next) => {
    logger.error("Unhandled Error", {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
    });

    next(err);
};

export default logger;
