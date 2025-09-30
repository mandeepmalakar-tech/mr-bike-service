import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import BookingModal from "./BookingModal";

const BikeSlider = ({ bikes }) => {
  const [selectedBike, setSelectedBike] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = (bike) => {
    setSelectedBike(bike);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBike(null);
  };
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="bike-slider"
      >
        {bikes.map((bike) => (
          <SwiperSlide key={bike._id} className="h-auto">
            <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-200 hover:border-blue-300">
              {/* Bike Image - Fixed Height */}
              <div
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center rounded-t-3xl"
                style={{ height: "200px" }}
              >
                <img
                  src={
                    bike.imageUrl ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={bike.name}
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>

              {/* Bike Info */}
              <div className="px-8 pb-8 text-center flex flex-col justify-between flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pt-4 min-h-[64px] flex items-center justify-center">
                  {bike.name}
                </h3>

                {/* Book Now Button */}
                <button
                  onClick={() => handleBookNow(bike)}
                  className="w-full bg-orange-500 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots - Outside Swiper */}
      <div className="custom-pagination flex justify-center gap-2 mt-8"></div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bike={selectedBike}
      />

      {/* Custom Styles for Pagination Dots */}
      <style jsx>{`
        :global(.custom-pagination) {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        :global(.custom-pagination .swiper-pagination-bullet) {
          width: 12px !important;
          height: 12px !important;
          background: #d1d5db !important;
          opacity: 1 !important;
          border-radius: 50% !important;
          margin: 0 !important;
          transition: all 0.3s ease !important;
          cursor: pointer;
        }
        :global(.custom-pagination .swiper-pagination-bullet-active) {
          background: #fb923c !important;
          width: 36px !important;
          border-radius: 6px !important;
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
        }
      `}</style>
    </div>
  );
};

export default BikeSlider;
