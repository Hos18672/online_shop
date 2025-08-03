import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './../../styles/Carousel.scss';

const Carousel = ({ items, autoPlayInterval = 5000 }) => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'en') === 'fa';
  const lang = i18n.language || 'en';
  const [currentIndex, setCurrentIndex] = useState(items.length);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Determine how many slides to show based on container width
  const slidesToShow = () => {
    const w = carouselRef.current?.offsetWidth || window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return 3;
    return 3;
  };

  const slideWidth = () => (100 / slidesToShow());
  const centerOffset = () => Math.floor(slidesToShow() / 2);

  // Initialize position to center of the middle copy
  useEffect(() => {
    const idx = items.length;
    setCurrentIndex(idx);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(${-(idx - centerOffset()) * slideWidth()}%)`;
      setTimeout(() => {
        trackRef.current.style.transition = 'transform 0.4s ease';
      }, 50);
    }
  }, [items]);

  // Auto-play
  useEffect(() => {
    if (autoPlayInterval && !isDragging) {
      autoPlayRef.current = setInterval(() => goTo(currentIndex + 1), autoPlayInterval);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [currentIndex, isDragging]);

  // Navigate to a specific slide index
  const goTo = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setDragOffset(0);
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // After transition, reset position for infinite scroll
  const handleTransitionEnd = () => {
    setIsAnimating(false);
    const len = items.length;
    let idx = currentIndex;
    if (idx >= len * 2) idx -= len;
    if (idx < len) idx += len;
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(${-(idx - centerOffset()) * slideWidth()}%)`;
      setTimeout(() => {
        trackRef.current.style.transition = 'transform 0.4s ease';
      }, 50);
    }
  };

  // Drag / touch handlers
  const onDragStart = (e) => {
    clearInterval(autoPlayRef.current);
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    setDragOffset(startX - x);
  };

  const onDragEnd = () => {
    setIsDragging(false);
    const threshold = (carouselRef.current.offsetWidth || window.innerWidth) / 4;
    if (Math.abs(dragOffset) > threshold) {
      dragOffset > 0 ? next() : prev();
    } else {
      setDragOffset(0);
    }
  };

  // Calculate the actual index for dots
  const actualIndex = ((currentIndex - items.length) % items.length + items.length) % items.length;

  return (
    <div
      className={`carousel-container ${isRtl ? 'rtl' : 'ltr'}`}
      ref={carouselRef}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      onMouseMove={onDragMove}
      onTouchMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchEnd={onDragEnd}
    >
      <button className="carousel-button prev" onClick={prev} aria-label={t('previous_slide')}>‹</button>

      <div className="carousel-track-wrapper">
        <div
          ref={trackRef}
          className="carousel-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${-(currentIndex - centerOffset()) * slideWidth() + (-dragOffset / (carouselRef.current?.offsetWidth || window.innerWidth) * 100)}%)`,
          }}
        >
          {[...items, ...items, ...items].map((item, idx) => {
            const isCenter = idx === currentIndex;
            return (
              <div
                key={`${item.id || item.name}-${idx}`}
                className={`carousel-slide ${isCenter ? 'centered' : ''}`}
                style={{ flex: `0 0 ${slideWidth()}%` }}
              >
                <div className="carousel-product-card">
                  <div className="carousel-image-wrapper">
                    <img
                      src={item.image_url || '/placeholder-image.jpg'}
                      alt={item.name_en || t('unnamed_product')}
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-product-info">
                    <h3 className="carousel-product-title">
                      {item[`name_${lang}`] || t('unnamed_product')}
                    </h3>
                    <p className="carousel-product-price">
                      €{item.price || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button className="carousel-button next" onClick={next} aria-label={t('next_slide')}>›</button>
      <div className="carousel-dots">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot ${idx === actualIndex ? 'active' : ''}`}
            onClick={() => goTo(items.length + idx)}
            aria-label={`${t('go_to_slide')} ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;