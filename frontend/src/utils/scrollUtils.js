/**
 * Native smooth scrolling utilities following industry best practices
 * Replaces LocomotiveScroll with native browser APIs
 */

/**
 * Smooth scroll to a specific element
 * @param {string|HTMLElement} target - Element ID or HTMLElement to scroll to
 * @param {Object} options - Scroll options
 * @param {number} options.offset - Offset from top (default: 0)
 * @param {string} options.behavior - Scroll behavior (default: 'smooth')
 */
export const scrollToElement = (target, options = {}) => {
  const { offset = 0, behavior = "smooth" } = options;

  let element;

  if (typeof target === "string") {
    element = document.getElementById(target) || document.querySelector(target);
  } else if (target instanceof HTMLElement) {
    element = target;
  }

  if (!element) {
    console.warn("Scroll target not found:", target);
    return;
  }

  const elementPosition = element.offsetTop - offset;

  window.scrollTo({
    top: elementPosition,
    behavior: behavior,
  });
};

/**
 * Smooth scroll to top of page
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
  const { behavior = "smooth" } = options;

  window.scrollTo({
    top: 0,
    behavior: behavior,
  });
};

/**
 * Smooth scroll to bottom of page
 * @param {Object} options - Scroll options
 */
export const scrollToBottom = (options = {}) => {
  const { behavior = "smooth" } = options;

  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: behavior,
  });
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} - Whether element is in viewport
 */
export const isInViewport = (element, threshold = 0.1) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.top <= windowHeight * (1 - threshold) &&
    rect.bottom >= windowHeight * threshold
  );
};

/**
 * Add scroll event listener with throttling for performance
 * @param {Function} callback - Function to call on scroll
 * @returns {Function} - Cleanup function
 */
export const addScrollListener = (callback) => {
  let ticking = false;

  const throttledCallback = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", throttledCallback, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", throttledCallback);
  };
};

/**
 * Get current scroll position
 * @returns {Object} - Scroll position { x, y }
 */
export const getScrollPosition = () => ({
  x: window.pageXOffset || document.documentElement.scrollLeft,
  y: window.pageYOffset || document.documentElement.scrollTop,
});

/**
 * Get scroll progress (0-1)
 * @returns {number} - Scroll progress from 0 to 1
 */
export const getScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  return docHeight > 0 ? scrollTop / docHeight : 0;
};
