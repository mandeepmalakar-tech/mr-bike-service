import { useEffect, useRef, useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const LocomotiveScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);
  const [isScrollReady, setIsScrollReady] = useState(false);

  useEffect(() => {
    let scroll;
    let timeoutId;

    const initScroll = () => {
      if (scrollRef.current && !scroll) {
        try {
          scroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            multiplier: 1,
            class: "is-revealed",
            scrollbarContainer: false,
            lerp: 0.1,
            smartphone: {
              smooth: true,
            },
            tablet: {
              smooth: true,
            },
            getDirection: true,
            getSpeed: true,
            reloadOnContextChange: true,
            touchMultiplier: 2,
            firefoxMultiplier: 50,
            passive: false,
          });

          // Wait for scroll to be ready
          scroll.on("ready", () => {
            setIsScrollReady(true);
          });

          // Update scroll on window resize with debounce
          const handleResize = () => {
            if (scroll) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                scroll.update();
              }, 100);
            }
          };

          window.addEventListener("resize", handleResize);

          return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeoutId);
            if (scroll) {
              scroll.destroy();
            }
          };
        } catch (error) {
          console.warn("LocomotiveScroll initialization failed:", error);
          setIsScrollReady(true); // Continue without smooth scroll
        }
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const initTimeout = setTimeout(initScroll, 100);

    return () => {
      clearTimeout(initTimeout);
      if (scroll) {
        scroll.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className={`locomotive-scroll-container ${
        isScrollReady ? "scroll-ready" : "scroll-loading"
      }`}
    >
      {children}
    </div>
  );
};

export default LocomotiveScrollWrapper;
