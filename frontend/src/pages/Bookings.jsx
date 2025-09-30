import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Calendar, MapPin, Clock, XCircle, CheckCircle } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/bookings", {
        withCredentials: true,
      });

      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const response = await axios.delete(`/bookings/${bookingId}/cancel`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Update local state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        alert("Booking cancelled successfully!");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to cancel booking");
      }
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      booked: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const icons = {
      booked: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${
          styles[status] || styles.booked
        }`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const calculateDays = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD - pickup);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-xl">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-400">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 px-6 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-400">
            View and manage your bike rental bookings
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
            <p className="text-gray-400 mb-6">
              Start exploring and book your first bike!
            </p>
            <button
              onClick={() => navigate("/search")}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Explore Bikes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700"
              >
                {/* Bike Image and Status */}
                <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800">
                  {booking.bike?.imageUrl ? (
                    <img
                      src={booking.bike.imageUrl}
                      alt={booking.bike.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-orange-500 rounded-full"></div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 capitalize">
                    {booking.bike?.name || "Unknown Bike"}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {/* Location */}
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                      <span className="capitalize">
                        {booking.bike?.location || "Unknown Location"}
                      </span>
                    </div>

                    {/* Pickup Date */}
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-3 text-green-500" />
                      <div>
                        <span className="text-sm text-gray-400 mr-2">
                          Pickup:
                        </span>
                        <span className="font-semibold">
                          {formatDateTime(booking.pickupDate)}
                        </span>
                      </div>
                    </div>

                    {/* Return Date */}
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-400 mr-2">
                          Return:
                        </span>
                        <span className="font-semibold">
                          {formatDateTime(booking.returnDate)}
                        </span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-3 text-purple-500" />
                      <span>
                        {calculateDays(booking.pickupDate, booking.returnDate)}{" "}
                        {calculateDays(
                          booking.pickupDate,
                          booking.returnDate
                        ) === 1
                          ? "day"
                          : "days"}
                      </span>
                    </div>
                  </div>

                  {/* Cost and Actions */}
                  <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Cost</p>
                      <p className="text-3xl font-bold text-orange-500">
                        ₹{booking.totalCost}
                      </p>
                    </div>

                    {booking.status === "booked" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}
                  </div>

                  {/* Booked At */}
                  <div className="mt-4 text-xs text-gray-500">
                    Booked on {formatDate(booking.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

