import React from "react";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

const BikeCard = ({ bike, searchParams, onBook, onViewDetails }) => {
  const handleBookClick = () => {
    if (onBook) {
      onBook({
        bike,
        searchParams,
      });
    }
  };

  const handleViewDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(bike);
    }
  };

  return (
    <motion.div
      key={bike._id || bike.id || Math.random()}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {bike.name || "Unnamed Bike"}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">5.00</span>
            <span className="text-gray-500">58 Trips</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Pay at Pickup
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {bike.category || "Street Bike"}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Hotseller
          </span>
        </div>
      </div>

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
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
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
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Trip Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div>Trip limit {bike.tripLimit || "3801km"}</div>
          <div>Security Deposit Rs. {bike.securityDeposit || "3000"}</div>
          <div>Location timings {bike.timings || "10am - 10pm"}</div>
        </div>

        {/* Price and Location */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{bike.packageCost || "0"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <svg
                className="w-3 h-3 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>{bike.location || "INA Metro"}</span>
            <span className="ml-1 text-gray-500">
              ({bike.numberOfVehicles || 0} vehicles)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetailsClick}
            className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors duration-200"
          >
            View Packages
          </button>
          <button
            onClick={handleBookClick}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={(bike.numberOfVehicles || 0) === 0}
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BikeCard;
