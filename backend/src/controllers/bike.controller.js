import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { Bike } from "../models/bike.model.js";

const createBike = asyncHandler(async (req, res) => {
    const { name, packageCost, location, city, numberOfVehicles, imageUrl } =
        req.body;

    // Input validation
    if (!name || !packageCost || !location || !city || !numberOfVehicles) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Validate numeric fields
    if (isNaN(packageCost) || packageCost <= 0) {
        throw new ApiError(400, "Package cost must be a positive number");
    }

    if (isNaN(numberOfVehicles) || numberOfVehicles < 0) {
        throw new ApiError(
            400,
            "Number of vehicles must be a non-negative number"
        );
    }

    // Create bike
    const bike = await Bike.create({
        name,
        packageCost,
        location,
        city,
        numberOfVehicles,
        imageUrl: imageUrl || "",
        isAvailable: numberOfVehicles > 0,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, bike, "Bike created successfully"));
});

const getAllBikes = asyncHandler(async (req, res) => {
    const { city, available, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by city if provided
    if (city) {
        query.city = city.toLowerCase();
    }

    // Filter by availability if provided
    if (available === "true") {
        query.isAvailable = true;
        query.numberOfVehicles = { $gt: 0 };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Prepare sort options
    let sortOptions = {};
    if (sort) {
        // Example: sort=packageCost:desc
        const [field, order] = sort.split(":");
        sortOptions[field] = order === "desc" ? -1 : 1;
    }

    const bikes = await Bike.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    const totalBikes = await Bike.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bikes,
                currentPage: page,
                totalPages: Math.ceil(totalBikes / limit),
                totalBikes,
            },
            "Bikes fetched successfully"
        )
    );
});

const getBikeById = asyncHandler(async (req, res) => {
    const { bikeId } = req.params;

    if (!bikeId?.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid bike ID");
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
        throw new ApiError(404, "Bike not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, bike, "Bike fetched successfully"));
});

const updateBike = asyncHandler(async (req, res) => {
    const { bikeId } = req.params;
    const updates = req.body;

    if (!bikeId?.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid bike ID");
    }

    // Validate numeric fields if provided
    if (
        updates.packageCost &&
        (isNaN(updates.packageCost) || updates.packageCost <= 0)
    ) {
        throw new ApiError(400, "Package cost must be a positive number");
    }

    if (
        updates.numberOfVehicles !== undefined &&
        (isNaN(updates.numberOfVehicles) || updates.numberOfVehicles < 0)
    ) {
        throw new ApiError(
            400,
            "Number of vehicles must be a non-negative number"
        );
    }

    // Update isAvailable based on numberOfVehicles if it's being updated
    if (updates.numberOfVehicles !== undefined) {
        updates.isAvailable = updates.numberOfVehicles > 0;
    }

    const updatedBike = await Bike.findByIdAndUpdate(
        bikeId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!updatedBike) {
        throw new ApiError(404, "Bike not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBike, "Bike updated successfully"));
});

const deleteBike = asyncHandler(async (req, res) => {
    const { bikeId } = req.params;

    if (!bikeId?.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid bike ID");
    }

    const deletedBike = await Bike.findByIdAndDelete(bikeId);

    if (!deletedBike) {
        throw new ApiError(404, "Bike not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Bike deleted successfully"));
});

const getBikesByCity = asyncHandler(async (req, res) => {
    const { city } = req.params;

    if (!city) {
        throw new ApiError(400, "City parameter is required");
    }

    const bikes = await Bike.find({
        city: { $regex: new RegExp(`^${city}$`, "i") },
        isAvailable: true,
        numberOfVehicles: { $gt: 0 },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, bikes, "Bikes fetched successfully"));
});

export {
    createBike,
    getAllBikes,
    getBikeById,
    updateBike,
    deleteBike,
    getBikesByCity,
};
