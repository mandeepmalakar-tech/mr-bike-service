import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const LocomotiveScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    let scroll;

    if (scrollRef.current) {
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
      });

      // Update scroll on window resize
      const handleResize = () => {
        scroll.update();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        scroll.destroy();
      };
    }
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
};

export default LocomotiveScrollWrapper;
