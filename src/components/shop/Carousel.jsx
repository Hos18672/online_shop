import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './../../styles/Carousel.scss';

const Carousel = ({ items, autoPlayInterval = 5000 }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const trackRef = useRef(null);

  // Create multiple copies for smooth infinite scrolling
  const extendedItems = [...items, ...items, ...items];
  const startingIndex = items.length; // Start at the second copy

  useEffect(() => {
    // Initialize position to the middle copy
    if (trackRef.current) {
      const slideWidth = getSlideWidth();
      const initialTranslate = startingIndex * slideWidth;
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(${isRtl ? '' : '-'}${initialTranslate}%)`;
      setCurrentIndex(startingIndex);
      
      // Re-enable transitions after initial positioning
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = 'transform 0.4s ease-in-out';
        }
      }, 50);
    }
  }, [items, isRtl]);

  useEffect(() => {
    if (autoPlayInterval && !isDragging && !isAnimating) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, autoPlayInterval, isDragging, isAnimating]);

  // Clear auto-play when dragging or animating
  useEffect(() => {
    if (isDragging || isAnimating) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }
  }, [isDragging, isAnimating]);

  const slidesToShow = (width) => {
    if (width <= 640) return 1;
    if (width <= 1024) return 3;
    return 5;
  };

  const getSlideWidth = () => {
    const width = carouselRef.current?.offsetWidth || 1024;
    return 100 / slidesToShow(width);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setTranslateX(0);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setTranslateX(0);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    
    // Reset position when reaching the boundaries for infinite effect
    if (currentIndex >= items.length * 2) {
      // Jumped too far forward, reset to middle copy
      const newIndex = currentIndex - items.length;
      setCurrentIndex(newIndex);
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        const slideWidth = getSlideWidth();
        trackRef.current.style.transform = `translateX(${isRtl ? '' : '-'}${newIndex * slideWidth}%)`;
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.4s ease-in-out';
          }
        }, 50);
      }
    } else if (currentIndex < items.length) {
      // Jumped too far backward, reset to middle copy
      const newIndex = currentIndex + items.length;
      setCurrentIndex(newIndex);
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        const slideWidth = getSlideWidth();
        trackRef.current.style.transform = `translateX(${isRtl ? '' : '-'}${newIndex * slideWidth}%)`;
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.4s ease-in-out';
          }
        }, 50);
      }
    }
  };

  const handleTouchStart = (e) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(translateX) > 100) {
      translateX > 0 ? nextSlide() : prevSlide();
    } else {
      setTranslateX(0);
    }
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Map the dot index to the middle copy
    const targetIndex = startingIndex + index;
    setCurrentIndex(targetIndex);
    setTranslateX(0);
  };

  // Get the actual slide index for dot indicator
  const getActualSlideIndex = () => {
    return ((currentIndex - startingIndex) % items.length + items.length) % items.length;
  };

  return (
    <div
      className={`carousel-container ${isRtl ? 'rtl' : 'ltr'}`}
      ref={carouselRef}
      aria-label={t('featured_products')}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <button
        onClick={prevSlide}
        className="carousel-button prev"
        aria-label={t('previous_slide')}
        type="button"
      >
        {isRtl ? '›' : '‹'}
      </button>

      <div className="carousel-track-wrapper">
        <div
          ref={trackRef}
          className="carousel-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${(isRtl ? '' : '-') +
              ((currentIndex * getSlideWidth()) +
                (isRtl ? -translateX : translateX) /
                  (carouselRef.current?.offsetWidth || 1))}%)`,
            transition: isDragging ? 'none' : 'transform 0.4s ease-in-out',
            width: `${extendedItems.length * getSlideWidth()}%`,
          }}
        >
          {extendedItems.map((item, index) => {
            const visibleSlides = slidesToShow(carouselRef.current?.offsetWidth || 1024);
            const centerOffset = Math.floor(visibleSlides / 2);
            const isCentered =
              index === (currentIndex -2 + centerOffset) % extendedItems.length;

            return (
              <div
                key={`${item.id || item.name}-${index}`}
                className={`carousel-slide ${isCentered ? 'centered' : ''}`}
                style={{ width: `${getSlideWidth() + .26}%` }}
              >
                <div className="carousel-product-card">
                  <div className="carousel-image-wrapper">
                    <img
                      src={item.image_url || '/placeholder-image.jpg'}
                      alt={item.name || t('unnamed_product')}
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-product-info">
                    <h3 className="carousel-product-title">
                      {item.name || t('unnamed_product')}
                    </h3>
                    <p className="carousel-product-price">
                      ${item.price || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={nextSlide}
        className="carousel-button next"
        aria-label={t('next_slide')}
        type="button"
      >
        {isRtl ? '‹' : '›'}
      </button>

      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === getActualSlideIndex() ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`${t('go_to_slide')} ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;