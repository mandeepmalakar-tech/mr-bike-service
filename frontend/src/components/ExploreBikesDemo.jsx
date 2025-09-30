import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import api from "../api/axios";
import BikeSlider from "./BikeSlider";

const ExploreBikesDemo = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await api.get("/bikes");
        setBikes(response.data.data.bikes);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);
  if (loading) return <p className="text-center p-6">Loading bikes...</p>;
  return (
    <section className="relative bg-gray-800 py-16">
      {/* Background glow effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Explore Our <span className="text-orange-400">Bikes</span>
          </h1>
          {/* bike slider */}
          <BikeSlider key={bikes._id} bikes={bikes} />
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreBikesDemo;
