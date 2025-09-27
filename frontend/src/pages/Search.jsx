import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useLocation, useNavigate } from "react-router-dom";
import {
  BikeIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon,
  FilterIcon,
  SortAscIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import BikeCard from "../components/BikeCard";
import axiosInstance from "../api/axios";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: "packageCost:asc",
    minPrice: "",
    maxPrice: "",
  });
  const [searchParams, setSearchParams] = useState({});

  // Mock data for development/fallback
  const getMockBikes = () => [
    {
      _id: "1",
      name: "Himalayan BS6",
      packageCost: 1399,
      location: "INA Metro",
      city: "vizag",
      numberOfVehicles: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isAvailable: true,
    },
    {
      _id: "2",
      name: "FZ S V3",
      packageCost: 749,
      location: "INA Metro",
      city: "vizag",
      numberOfVehicles: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isAvailable: true,
    },
    {
      _id: "3",
      name: "Avenger 220 Cruise",
      packageCost: 749,
      location: "INA Metro",
      city: "vizag",
      numberOfVehicles: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isAvailable: true,
    },
    {
      _id: "4",
      name: "Pulsar 150 Bs4",
      packageCost: 699,
      location: "INA Metro",
      city: "vizag",
      numberOfVehicles: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isAvailable: true,
    },
    {
      _id: "5",
      name: "Classic 350 Bs6",
      packageCost: 1149,
      location: "INA Metro",
      city: "vizag",
      numberOfVehicles: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isAvailable: true,
    },
    {
      _id: "6",
      name: "Scram 411",
      packageCost: 1399,
      location: "INA Metro",
      city: "vizag",
      numberOfVehicles: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isAvailable: true,
    },
  ];

  const fetchBikes = useCallback(
    async (params) => {
      setLoading(true);
      try {
        const queryParams = {
          city: params.city || "vizag",
          available: "true",
          sort: filters.sort,
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        };

        // Use axios instance with pre-configured base URL
        const response = await axiosInstance.get("/bikes", {
          params: queryParams,
        });

        if (response.data.success) {
          setSearchResults(response.data.data.bikes);
        } else {
          console.error("API returned error:", response.data.message);
          // Fallback to mock data for development
          setSearchResults(getMockBikes());
        }
      } catch (error) {
        console.error("Error fetching bikes:", error);

        // Handle different types of errors
        if (error.code === "ECONNABORTED") {
          console.error("Request timeout");
        } else if (error.response) {
          // Server responded with error status
          console.error(
            "Server error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // Request was made but no response received
          console.error("Network error:", error.request);
        } else {
          // Something else happened
          console.error("Error:", error.message);
        }

        // Use mock data as fallback for development
        setSearchResults(getMockBikes());
      } finally {
        setLoading(false);
      }
    },
    [filters.sort, filters.minPrice, filters.maxPrice]
  );

  useEffect(() => {
    // Get search parameters from URL or location state
    const params = location.state || {};
    setSearchParams(params);

    // Fetch bikes based on search parameters
    fetchBikes(params);
  }, [location.state, fetchBikes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchBikes(searchParams);
  };

  const handleBookBike = (bookingData) => {
    navigate("/booking", { state: bookingData });
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
    <section className="relative min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header - Matching the reference image */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Pickup Date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 font-medium">
                  {searchParams.pickupDate
                    ? formatDate(searchParams.pickupDate)
                    : "Select Date"}
                  , {searchParams.pickupTime || "00:00"}
                </span>
              </div>
            </div>

            {/* Return Date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date
              </label>
              <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 font-medium">
                  {searchParams.returnDate
                    ? formatDate(searchParams.returnDate)
                    : "Select Date"}
                  , {searchParams.returnTime || "00:00"}
                </span>
              </div>
            </div>

            {/* Duration Display */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="text-lg font-bold text-gray-900">
                {searchParams.days
                  ? `${searchParams.days}day, 23hrs`
                  : "0day, 0hrs"}
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={applyFilters}
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <FilterIcon className="w-5 h-5 text-blue-600" />
              Filters
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              >
                <option value="packageCost:asc">Price: Low to High</option>
                <option value="packageCost:desc">Price: High to Low</option>
                <option value="name:asc">Name: A to Z</option>
                <option value="name:desc">Name: Z to A</option>
              </select>

              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />

              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
            </div>

            <Button
              onClick={applyFilters}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for available bikes...</p>
          </motion.div>
        ) : searchResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchResults.length} Bike{searchResults.length > 1 ? "s" : ""}{" "}
                Found
              </h2>
              <p className="text-gray-600">Choose your perfect ride</p>
            </div>

            {/* Bike Grid - Matching reference image layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              No Bikes Found
            </h3>
            <p className="text-gray-600 mb-6">
              Sorry, no bikes are available for the selected criteria. Try
              adjusting your filters or dates.
            </p>
            <Button
              onClick={() => navigate("/explore")}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              Search Again
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Search;
