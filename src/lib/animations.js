// Ultra-optimized animation variants for maximum performance
export const fadeIn = {
  hidden: { opacity: 0, y: 3 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.12, ease: "easeOut" }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.12, ease: "easeOut" }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.12, ease: "easeOut" }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.12, ease: "easeOut" }
  }
};

// Ultra-fast stagger container variants
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.02
    }
  }
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01,
      delayChildren: 0.01
    }
  }
};

// Minimal page transitions
export const pageTransition = {
  hidden: { opacity: 0, y: 3 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -3,
    transition: { duration: 0.08, ease: "easeIn" }
  }
};

// Lightweight hover animations
export const hoverScale = {
  scale: 1.005,
  transition: { duration: 0.08, ease: "easeOut" }
};

export const hoverLift = {
  y: -1,
  transition: { duration: 0.08, ease: "easeOut" }
};

// Minimal button animations
export const buttonTap = {
  scale: 0.995,
  transition: { duration: 0.05 }
};

// Optimized header animations
export const headerSlideDown = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

// Fast mobile menu animations
export const mobileMenuSlide = {
  hidden: { opacity: 0, y: -3 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -3,
    transition: { duration: 0.08, ease: "easeIn" }
  }
};

// Performance-optimized variants for cards
export const cardHover = {
  y: -2,
  transition: { duration: 0.1, ease: "easeOut" }
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.05 }
};

// Minimal text animations
export const textFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

// Optimized for scroll-triggered animations
export const scrollReveal = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" }
  }
}; 