export default function BikeCardDemo({ bike }) {
  const isAvailable = bike.isAvailable && bike.numberOfVehicles > 0;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={
            bike.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={bike.name}
          className="w-full h-auto object-cover"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {isAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{bike.name}</h3>

        <div className="space-y-1 mb-3">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">City:</span> {bike.city}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Location:</span> {bike.location}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Vehicles:</span>{" "}
            {bike.numberOfVehicles}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-gray-900">
            ₹{bike.packageCost}
            <span className="text-sm text-gray-500 font-normal"> / day</span>
          </p>
        </div>

        {/* Book Button */}
        <button
          disabled={!isAvailable}
          className={`w-full px-4 py-2 rounded-md font-semibold transition-all duration-300
              ${
                isAvailable
                  ? "bg-black text-white hover:bg-gray-800 transform hover:scale-105"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
        >
          {isAvailable ? "Book Now" : "Not Available"}
        </button>

        {/* Additional Info for Unavailable Bikes */}
        {!isAvailable && (
          <p className="text-xs text-red-500 text-center mt-2">
            {bike.numberOfVehicles === 0
              ? "No vehicles in stock"
              : "Currently unavailable"}
          </p>
        )}
      </div>
    </div>
  );
}
