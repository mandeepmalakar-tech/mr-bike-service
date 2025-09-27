import React, { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BikeIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "./ui/button";

const ExploreBikes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    city: "vizag",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total days for cost estimation
      const pickupDateTime = new Date(
        `${formData.pickupDate}T${formData.pickupTime}`
      );
      const returnDateTime = new Date(
        `${formData.returnDate}T${formData.returnTime}`
      );
      const days = Math.ceil(
        (returnDateTime - pickupDateTime) / (1000 * 60 * 60 * 24)
      );

      if (days <= 0) {
        alert("Return date must be after pickup date");
        setLoading(false);
        return;
      }

      // Navigate to search page with form data
      navigate("/search", {
        state: {
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          returnDate: formData.returnDate,
          returnTime: formData.returnTime,
          city: formData.city,
          location: formData.location,
          days: days,
        },
      });
    } catch (error) {
      console.error("Error processing search:", error);
      alert("Error processing search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-black">
      {/* Background glow effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          data-scroll
          data-scroll-speed="0.5"
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Explore Our <span className="text-orange-400">Bikes</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Find the perfect bike for your journey. Select your dates and
            discover our amazing collection of bikes in Vizag.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          data-scroll
          data-scroll-speed="0.3"
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pickup Date */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-orange-400" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                />
              </div>

              {/* Pickup Time */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-orange-400" />
                  Pickup Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                />
              </div>

              {/* Return Date */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-orange-400" />
                  Return Date
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  min={
                    formData.pickupDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                />
              </div>

              {/* Return Time */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-orange-400" />
                  Return Time
                </label>
                <input
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-white font-medium flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-orange-400" />
                Pickup Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter pickup location (e.g., Railway Station, Beach Road)"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SearchIcon className="w-5 h-5" />
                    Find Available Bikes
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreBikes;
