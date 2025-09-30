import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Clock } from "lucide-react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ isOpen, onClose, bike, searchParams = null }) => {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");
  const [days, setDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Initialize dates from searchParams if available
  useEffect(() => {
    if (searchParams?.pickupDate) {
      setPickupDate(searchParams.pickupDate);
    }
    if (searchParams?.pickupTime) {
      setPickupTime(searchParams.pickupTime);
    }
    if (searchParams?.returnDate) {
      setReturnDate(searchParams.returnDate);
    }
    if (searchParams?.returnTime) {
      setReturnTime(searchParams.returnTime);
    }
  }, [searchParams]);

  // Calculate days and total cost whenever dates change
  useEffect(() => {
    if (pickupDate && returnDate && bike?.packageCost) {
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
      const returnDateTime = new Date(`${returnDate}T${returnTime}`);

      if (returnDateTime > pickupDateTime) {
        const diffTime = Math.abs(returnDateTime - pickupDateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(diffDays);
        setTotalCost(bike.packageCost * diffDays);
      } else {
        setDays(0);
        setTotalCost(0);
      }
    } else {
      setDays(0);
      setTotalCost(0);
    }
  }, [pickupDate, pickupTime, returnDate, returnTime, bike]);

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!pickupDate || !returnDate) {
      setError("Please select both pickup and return dates");
      setLoading(false);
      return;
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const returnDateTime = new Date(`${returnDate}T${returnTime}`);

    if (returnDateTime <= pickupDateTime) {
      setError("Return date and time must be after pickup date and time");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/bookings",
        {
          bike: bike._id,
          pickupDate: pickupDateTime.toISOString(),
          returnDate: returnDateTime.toISOString(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          navigate("/bookings");
        }, 2000);
      }
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response?.status === 401) {
        setError("Please login to book a bike");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <h2 className="text-2xl font-bold text-gray-900">Book Your Bike</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Booking created successfully! Redirecting to your bookings...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Bike Details */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
              {bike?.imageUrl ? (
                <img
                  src={bike.imageUrl}
                  alt={bike.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                {bike?.name}
              </h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="capitalize">
                  {bike?.location || "Unknown Location"}
                </span>
              </p>
              <p className="text-lg font-semibold text-orange-600 mt-1">
                ₹{bike?.packageCost}/day
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {bike?.numberOfVehicles} vehicles available
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Date */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Pickup Time
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Return Time */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Return Time
              </label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Rental Summary */}
          {days > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Rental Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {days} {days === 1 ? "day" : "days"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rate per day</span>
                  <span className="font-semibold text-gray-900">
                    ₹{bike?.packageCost}
                  </span>
                </div>
                <div className="border-t border-orange-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Cost
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{totalCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Important Notes:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Valid driving license required at pickup</li>
              <li>• Security deposit will be collected at pickup</li>
              <li>• Helmet and basic insurance included</li>
              <li>• Fuel charges are extra</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading || days === 0}
            >
              {loading ? "Processing..." : `Confirm Booking - ₹${totalCost}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
