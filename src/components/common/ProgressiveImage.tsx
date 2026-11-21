import React, { useState, useEffect, useRef } from 'react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "aspect-[16/10]"
  className?: string;
  containerClassName?: string;
  priority?: boolean; // For above-the-fold or critical images
  rootMargin?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-[16/10]',
  className = '',
  containerClassName = '',
  priority = false,
  rootMargin = '300px',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }

    if (!imgRef.current) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority, rootMargin]);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-[#F5F5F3] ${aspectRatio} ${containerClassName}`}
    >
      {/* Subtle Skeleton Placeholder maintaining exact layout dimensions */}
      <div
        className={`absolute inset-0 bg-[#EFEFEF] transition-opacity duration-500 ease-out pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...rest}
        />
      )}
    </div>
  );
};
