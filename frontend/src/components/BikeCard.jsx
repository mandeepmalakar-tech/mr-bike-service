import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios.js";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const BikeCard = () => {
  const [bikeData, setBikeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBikeData = async () => {
      try {
        const res = await axiosInstance.get("/bikes");
        // Handle different possible response structures
        if (res.data.data && res.data.data.bikes) {
          setBikeData(res.data.data.bikes);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setBikeData(res.data.data);
        } else if (Array.isArray(res.data)) {
          setBikeData(res.data);
        } else {
          setBikeData([]);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch bike data");
      } finally {
        setLoading(false);
      }
    };
    fetchBikeData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading bikes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (!bikeData || bikeData.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
        No bikes available at the moment.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Available Bikes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bikeData.map((bike) => (
          <div
            key={bike._id || bike.id || Math.random()}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
          >
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
              {bike.imageUrl ? (
                <img
                  src={bike.imageUrl}
                  alt={bike.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#ea580c] rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Availability Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (bike.numberOfVehicles || 0) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {(bike.numberOfVehicles || 0) > 0
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {bike.name || "Unnamed Bike"}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-[#ea580c]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">
                    {bike.location || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-[#ea580c]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">
                    {bike.city || "Not specified"}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-[#ea580c]">
                    ₹{bike.packageCost || "0"}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/day</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bike.numberOfVehicles || 0}
                  </p>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                className="w-full bg-[#ea580c] hover:bg-[#dc2626] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={(bike.numberOfVehicles || 0) === 0}
              >
                {(bike.numberOfVehicles || 0) > 0
                  ? "Book Now"
                  : "Not Available"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BikeCard;
