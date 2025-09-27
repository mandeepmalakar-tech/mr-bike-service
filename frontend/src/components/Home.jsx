import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import ExploreBikes from "./ExploreBikes";
import BikeCard from "./BikeCard";

const Home = () => {
  const words = ["Book", "Ride", "Explore"];
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative min-h-screen bg-black">
      {/* Dark background with subtle glow */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 min-h-screen justify-center">
          {/* Badge */}
          <motion.div
            data-scroll
            data-scroll-speed="0.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800/50 transition-all duration-300"
            >
              <span className="text-gray-300">Latest offers live now!</span>
              <a
                href="#bikes"
                className="flex items-center gap-1 ml-2 text-white hover:text-orange-400 transition-colors"
              >
                Get started
                <ArrowRightIcon className="size-3" />
              </a>
            </Badge>
          </motion.div>

          {/* Brand Logo  */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="/src/assets/mr_bikes_logo.png"
              alt="Brand Logo"
              className="w-[60%] lg:w-[20%]"
            />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            data-scroll
            data-scroll-speed="0.3"
            className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-center max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready for next ride?
            <br />
            <span className="relative inline-block">
              {words.map((word, idx) => (
                <motion.span
                  key={word}
                  className="text-orange-400 absolute left-0"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{
                    opacity: idx === activeWord ? 1 : 0,
                    y: idx === activeWord ? 0 : 20,
                    scale: idx === activeWord ? 1 : 0.8,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  style={{
                    minWidth: "4.5ch",
                    display: "inline-block",
                    position: idx === activeWord ? "static" : "absolute",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            data-scroll
            data-scroll-speed="0.4"
            className="text-lg sm:text-xl text-gray-300 max-w-3xl text-center leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Book your ride in minutes and experience the freedom of Bike Rentals
            in Vizag
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            data-scroll
            data-scroll-speed="0.6"
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
            >
              Get Started
            </Button>

            <a
              href="https://wa.me/919999999999" // Replace with your WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white hover:bg-[#16a34a] transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="inline-block"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.1 12.045C2.111 6.479 6.58 2.009 12.149 2c2.637.004 5.111 1.027 6.988 2.901A9.822 9.822 0 0122.3 12.04c-.003 5.569-4.473 10.038-9.949 10.038zm8.413-17.453A11.815 11.815 0 0012.153 0C5.453.009.06 5.406.049 12.104c0 2.137.56 4.223 1.623 6.066L.057 24l6.092-1.627a11.88 11.88 0 005.998 1.537h.005c6.698 0 12.092-5.396 12.104-12.097a11.81 11.81 0 00-3.472-8.389z" />
                </svg>
                WhatsApp Now
              </Button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bike Cards Section */}
      <div className="relative z-10 bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BikeCard />
        </div>
      </div>

      <ExploreBikes />

      {/* Additional scrollable content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div
            data-scroll
            data-scroll-speed="0.5"
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Easy Booking
            </h3>
            <p className="text-gray-400 mb-4">
              Book your bike in just a few clicks with our simple and intuitive
              booking system.
            </p>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-orange-500 rounded-full w-3/4"></div>
            </div>
          </motion.div>

          <motion.div
            data-scroll
            data-scroll-speed="0.3"
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Quality Bikes
            </h3>
            <p className="text-gray-400 mb-4">
              Well-maintained bikes for your safety and comfort during your
              ride.
            </p>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-orange-500 rounded-full w-4/5"></div>
            </div>
          </motion.div>

          <motion.div
            data-scroll
            data-scroll-speed="0.7"
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              24/7 Support
            </h3>
            <p className="text-gray-400 mb-4">
              Round-the-clock customer service to help you with any queries or
              issues.
            </p>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-orange-500 rounded-full w-5/6"></div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          data-scroll
          data-scroll-speed="0.4"
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8">
            Why Choose Mr Bike?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-gray-300">Bikes Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                1000+
              </div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                4.9★
              </div>
              <div className="text-gray-300">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                24/7
              </div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          data-scroll
          data-scroll-speed="0.6"
          className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 mb-6">
            Book your bike today and explore Vizag like never before!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
            >
              Book Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 transition-all duration-300"
            >
              View Bikes
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
