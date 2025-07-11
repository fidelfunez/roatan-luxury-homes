import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const shouldShow = window.scrollY > 400;
    if (shouldShow !== showBackToTop) {
      setShowBackToTop(shouldShow);
    }
  }, [showBackToTop]);

  useEffect(() => {
    let ticking = false;
    
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={scrollToTop}
            size="icon"
            className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full"
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;