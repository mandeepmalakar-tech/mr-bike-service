import React, { useState, useEffect } from "react";
import {
  scrollToTop,
  addScrollListener,
  getScrollProgress,
} from "../utils/scrollUtils";

/**
 * Scroll to top button component using native scrolling
 * Follows industry best practices for performance and accessibility
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Add scroll listener with throttling for performance
    const cleanup = addScrollListener(() => {
      const progress = getScrollProgress();
      setScrollProgress(progress);
      setIsVisible(progress > 0.1); // Show button after 10% scroll
    });

    return cleanup;
  }, []);

  const handleScrollToTop = () => {
    scrollToTop({ behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>

      {/* Optional: Show scroll progress */}
      <div className="absolute -bottom-1 -left-1 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-600 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </button>
  );
};

export default ScrollToTopButton;
