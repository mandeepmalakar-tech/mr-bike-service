import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useLocation, useNavigate } from "react-router-dom";
import { BikeIcon, CalendarIcon, SearchIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import BikeCard from "../components/BikeCard";
import BookingModal from "../components/BookingModal";
import axiosInstance from "../api/axios";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [error, setError] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBikes = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        city: params.city || "vizag",
        available: "true",
        sort: "packageCost:desc",
      };

      console.log("Fetching bikes from backend with params:", queryParams);

      // Use axios instance with pre-configured base URL
      const response = await axiosInstance.get("/bikes", {
        params: queryParams,
      });

      console.log("Backend response:", response.data);

      if (response.data.success && response.data.data) {
        const bikes = response.data.data.bikes || [];
        setSearchResults(bikes);
        console.log(`Successfully fetched ${bikes.length} bikes from database`);
      } else {
        console.error("API returned unexpected format:", response.data);
        setError("Unable to fetch bikes. Please try again later.");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching bikes from backend:", error);

      // Set user-friendly error message
      let errorMessage = "Unable to connect to server. ";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status}. ${
          error.response.data?.message || "Please try again later."
        }`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage =
          "Cannot connect to backend server. Please make sure the backend is running on port 8000.";
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }

      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get search parameters from URL or location state
    const params = location.state || {};
    setSearchParams(params);

    // Fetch bikes based on search parameters
    fetchBikes(params);
  }, [location.state, fetchBikes]);

  const handleSearch = () => {
    fetchBikes(searchParams);
  };

  const handleBookBike = (bookingData) => {
    // Store the bike and search params for booking
    setSelectedBike(bookingData.bike);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBike(null);
  };

  const handleViewBikeDetails = (bike) => {
    // Navigate to bike details page or show modal
    console.log("View bike details:", bike);
    // You can implement bike details modal or page here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Date Display */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {searchParams.pickupDate
                    ? formatDate(searchParams.pickupDate)
                    : "01 Oct 25"}
                  , {searchParams.pickupTime || "22:00"}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                {searchParams.days
                  ? `${searchParams.days}day, 20hrs`
                  : "56day, 20hrs"}
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {searchParams.returnDate
                    ? formatDate(searchParams.returnDate)
                    : "27 Nov 25"}
                  , {searchParams.returnTime || "18:00"}
                </span>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-600">
            Showing {searchResults.length} vehicles
          </h2>
        </div>

        {/* Results */}
        {loading ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              Searching for available bikes from database...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <BikeIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Connection Error
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <div className="space-y-2 text-sm text-left text-gray-700 bg-white p-4 rounded border border-gray-200 mb-4">
                <p className="font-semibold">Troubleshooting steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Make sure the backend server is running on port 8000</li>
                  <li>Check if MongoDB is connected</li>
                  <li>
                    Verify the API endpoint: http://localhost:8000/api/v1/bikes
                  </li>
                  <li>Check browser console for detailed error logs</li>
                </ol>
              </div>
              <Button
                onClick={() => fetchBikes(searchParams)}
                className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : searchResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Bike Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.map((bike) => (
                <BikeCard
                  key={bike._id}
                  bike={bike}
                  searchParams={searchParams}
                  onBook={handleBookBike}
                  onViewDetails={handleViewBikeDetails}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <BikeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Bikes Available
            </h3>
            <p className="text-gray-600 mb-6">
              No bikes are currently available in the database. Please check
              back later or contact support.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              Go Home
            </Button>
          </motion.div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bike={selectedBike}
        searchParams={searchParams}
      />
    </div>
  );
};

export default Search;
