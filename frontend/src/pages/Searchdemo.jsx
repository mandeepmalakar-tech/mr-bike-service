import { useEffect, useState } from "react";
import axios from "axios";
import BikeCardDemo from "../components/BikeCardDemo";

export default function Searchdemo() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/bikes");
        setBikes(res.data?.data?.bikes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bikes");
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  // Filter bikes based on availability
  const filteredBikes = showOnlyAvailable
    ? bikes.filter((bike) => bike.isAvailable && bike.numberOfVehicles > 0)
    : bikes;

  if (loading) return <p className="text-center p-6">Loading bikes...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with Filter Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">
          {showOnlyAvailable ? "Available Bikes" : "All Bikes"}
        </h2>

        {/* Toggle Button */}
        <div className="flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block w-14 h-8 rounded-full transition ${
                  showOnlyAvailable ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                  showOnlyAvailable ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-100">
              {showOnlyAvailable ? "Available Only" : "Show All"}
            </span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-100 mb-4">
        Showing {filteredBikes.length} of {bikes.length} bikes
      </p>

      {/* Bikes Grid */}
      {filteredBikes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {showOnlyAvailable
              ? "No available bikes found. Try showing all bikes."
              : "No bikes found in the database."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBikes.map((bike) => (
            <BikeCardDemo key={bike._id} bike={bike} />
          ))}
        </div>
      )}
    </div>
  );
}
