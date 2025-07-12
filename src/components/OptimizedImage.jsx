import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  webpSrc, 
  alt, 
  className = "", 
  loading = "lazy",
  fetchpriority = "auto",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate WebP version if not provided
  const webpSource = webpSrc || src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Fallback to original if WebP fails
  const handleWebPError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source 
        srcSet={webpSource} 
        type="image/webp" 
        onError={handleWebPError}
      />
      
      {/* Fallback image */}
      <img
        src={hasError ? src : webpSource}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        fetchpriority={fetchpriority}
        onLoad={handleLoad}
        onError={() => setHasError(true)}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage; 