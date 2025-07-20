import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard'; // Adjust path if needed
import './../../styles/Carousel.scss'; // For your carousel styles
const Carousel = ({ items }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  return (
    <div className="carousel-container" aria-label={t('featured_products')}>
      <button
        onClick={prevSlide}
        className="carousel-button prev"
        aria-label={t('previous_slide')}
        type="button"
      >
        ‹
      </button>
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div className="carousel-slide" key={item.id}>
            <img
              src={item.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
              alt={item[`name_${lang}`] || item.name_en || 'Product'}
              loading="lazy"
            />
            <p>{item[`name_${lang}`] || item.name_en || 'Product'}</p>
          </div>
        ))}
      </div>
      <button
        onClick={nextSlide}
        className="carousel-button next"
        aria-label={t('next_slide')}
        type="button"
      >
        ›
      </button>
    </div>
  );
};

export default Carousel;